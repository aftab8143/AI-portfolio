// Blog posts that ship with the site (no database needed).
// Each post is plain HTML so it renders with the article styles in design.css.
// `_id` doubles as the URL slug: /blogs/<_id>
//
// Images: wrap wide screenshots in <figure>; wrap phone screenshots in
// <figure class="phone"> so they sit side by side at phone size.

export const posts = [
  {
    _id: "mcp-server-in-three-steps",
    slug: "mcp-server-in-three-steps",
    title: "Letting users plug their own MCP server into an AI agent — in three steps",
    summary:
      "The protocol was the easy part. What I learned building a 'bring your own MCP server' flow for an agent builder — background registration, tool caching, naming collisions, keys, and why more tools can make an agent worse.",
    date: "12 Oct 2026",
    tags: ["AI", "MCP", "Agents"],
    cover: "/projects/screenshots/koodums-chat/2.png",
    coverAlt: "The agent admin screen, with the MCP Client tab where users connect their own servers",
    content: `
<p>When we started adding MCP support to the agent builder at Koodums, the brief fit in one sentence: <em>let users connect their own MCP server, and let their agent use its tools in chat.</em></p>

<p>If you haven't used it yet, MCP — the Model Context Protocol — is a standard way for an AI model to talk to external tools. An MCP server says "here are the things I can do" (search a CRM, look up an order, fetch a place on a map), and a client can call those things on the model's behalf. Once your agent speaks MCP, it can, in theory, use any tool from anyone who has written an MCP server.</p>

<p>In theory. Because the people using an agent builder are not the people who enjoy reading protocol specs. Our users wanted to connect a server and get back to building their bot. So the real brief became: <strong>make it feel like three clicks for someone who has never heard the words "JSON-RPC".</strong></p>

<p>This post is how that went — what I built first, what broke, and the design we ended up shipping.</p>

<h2>The flow we were aiming for</h2>

<p>We settled on three steps from the user's side:</p>

<ol>
  <li><strong>Choose the MCP server</strong> you want to connect.</li>
  <li><strong>Paste the authorization key</strong> for that server.</li>
  <li><strong>That's it.</strong> Registration happens in the background, and every tool the server exposes becomes available to the agent in chat.</li>
</ol>

<p>Everything a developer would normally do by hand — the handshake, asking the server for its tools, storing credentials safely, wiring those tools into each model call, routing the results back — had to disappear behind step 3.</p>

<p>Written down, it looks simple. Most of the work was in making step 3 behave well when things weren't simple.</p>

<h2>Version one: do everything in one request</h2>

<p>My first version did what most of us would do on a first pass. The user clicks <strong>Connect</strong>, the browser sends one request, and the backend, inside that request:</p>

<ol>
  <li>opens a connection to the MCP server with the key,</li>
  <li>asks it for its list of tools,</li>
  <li>saves the server and its tools,</li>
  <li>responds with "connected".</li>
</ol>

<p>It worked perfectly with my test server running on my own machine, which answered in a few milliseconds. Then we tried it against real servers.</p>

<p>Real servers are slow sometimes. Some need a few seconds to wake up. Some take a while to list their tools. Sometimes the key is wrong, and the server takes its time telling you. And while all that happened, the user stared at a spinner, the request hit a timeout, and they had no idea whether anything had been saved. A few people clicked Connect again — and now we had duplicates.</p>

<p>The problem wasn't any single step. It was that I'd treated something with several moving parts as if it were a single, instant action.</p>

<h2>Lesson 1: registration is a pipeline, not a request</h2>

<p>The fix was to stop pretending. Registration became a small pipeline with states the UI can show:</p>

<pre><code class="language-text">pending → connecting → listing tools → ready
                ↘ failed (with a human-readable reason)</code></pre>

<p>Clicking <strong>Connect</strong> now just saves the server as <code>pending</code> and returns immediately. The actual work runs in the background, moving the record from state to state. The UI reads the state and shows it — "Connecting…", "Found 12 tools", "Ready".</p>

<p>Two things made this feel solid rather than just slower:</p>

<ul>
  <li><strong>Failures explain themselves.</strong> Instead of a generic error, the state carries a reason a normal person can act on: "The authorization key was rejected", "The server didn't respond", "The server responded but has no tools". Most support questions disappeared once people could read what went wrong.</li>
  <li><strong>Retrying is safe.</strong> Because there's one record per server with a state, clicking retry moves that same record back to <code>pending</code>. No duplicates, no half-saved servers.</li>
</ul>

<h2>Lesson 2: cache the tool list — don't ask every turn</h2>

<p>An MCP server tells you what it can do through a <code>tools/list</code> call: tool names, descriptions, and a schema for the inputs each tool takes. That list is what the model needs to decide which tool to call.</p>

<p>My first instinct was to fetch it fresh at the start of every chat turn, so the agent always had the latest tools. It sounds responsible. In practice, it meant:</p>

<ul>
  <li>every message waited on every connected server before the model could even start,</li>
  <li>one slow server made the whole chat slow,</li>
  <li>one offline server could break a conversation that didn't even need its tools.</li>
</ul>

<p>Tool lists don't change often. So now the tools are listed once, during registration, and stored with the server. Chat turns read from that stored copy. The list gets refreshed when:</p>

<ul>
  <li>the user presses <strong>Refresh tools</strong> on the server, or</li>
  <li>a tool call comes back saying that tool no longer exists — a good sign the server has changed.</li>
</ul>

<p>Chat got noticeably faster, and a misbehaving server only affects the moment you actually call one of its tools.</p>

<h2>Lesson 3: namespace your tool names</h2>

<p>This one took exactly one week of real usage to appear. Two different servers both exposed a tool called <code>search</code>. The model saw two tools with the same name and different descriptions, and picked one — not always the right one. Reading the logs afterwards, I couldn't tell which server had been called either.</p>

<p>The fix is boring and it works: every tool the model sees is prefixed with the server it came from.</p>

<pre><code class="language-js">// The name the model sees
const toolName = serverSlug + "__" + tool.name; // "crm__search", "docs__search"

// When the model calls a tool, split it back apart to route the call
const [slug, originalName] = calledName.split("__");
const server = connectedServers.find((s) => s.slug === slug);</code></pre>

<p>The model now has two clearly different tools, the descriptions make sense side by side, and every call in the logs says exactly which server handled it.</p>

<h2>Lesson 4: the key is the most sensitive thing you store</h2>

<p>When a user pastes an authorization key, they're handing you access to <em>their</em> system — their CRM, their database, their documents. I treated it accordingly:</p>

<ul>
  <li><strong>Encrypted at rest.</strong> Keys are never stored in plain text.</li>
  <li><strong>Write-only from the browser's point of view.</strong> After saving, the key is never sent back to the frontend. The UI only shows the last few characters so people can tell keys apart.</li>
  <li><strong>Decrypted only when needed</strong>, on the server, at the moment a tool is actually called.</li>
  <li><strong>Gone when the server is.</strong> Removing a server removes its key and its tools. No orphaned secrets.</li>
</ul>

<p>None of this is visible to users, and that's the point. The three-step flow only feels trustworthy if what happens behind it actually is.</p>

<h2>Lesson 5: more tools can make the agent worse</h2>

<p>This was the surprise. Once connecting servers was easy, people connected a lot of them. An agent could easily end up with dozens of tools — and it got <em>worse</em>, not better.</p>

<p>Every tool's name, description and schema is sent to the model with each request. That costs context, and past a certain point the model starts picking tools that are only vaguely related to the question, or calls three tools where one would do.</p>

<p>Two changes helped the most:</p>

<ul>
  <li><strong>Tools belong to agents, not accounts.</strong> A server can be connected to your account but only enabled for the agents that need it. The support bot doesn't need the analytics tools.</li>
  <li><strong>Keep the conversation lean.</strong> Long chats were eating the same context the tools needed. Keeping only the recent turns of the conversation in each request left room for the tools — and kept the model focused on what the user just asked.</li>
</ul>

<h2>What the user actually sees</h2>

<figure>
  <img src="/projects/screenshots/koodums-chat/1.png" alt="Raw response from an MCP tool call" />
  <figcaption>What a tool call returns under the hood — the user only ever sees the agent's answer built from it.</figcaption>
</figure>

<p>From the user's side, after all of this: pick a server, paste a key, watch it go from "Connecting" to "Ready", and start chatting. The agent can now answer questions using their own systems. They never see a tool schema, a protocol message, or a raw response like the one above — just an agent that suddenly knows more.</p>

<h2>What I'd do differently</h2>

<ul>
  <li><strong>Design the failure states first.</strong> I designed the happy path and added failures as they came up. Starting from "what can go wrong, and what will the user see?" would have saved a rewrite.</li>
  <li><strong>Add a "test this tool" button earlier.</strong> Being able to call one tool by hand, outside of chat, is the fastest way for a user to check their server is behaving. We added it late; it should have been there from day one.</li>
  <li><strong>Log tool calls from the start.</strong> Which tool, which server, how long it took, whether it failed. Every debugging session got easier the day we had that.</li>
</ul>

<div class="callout">
  <p class="callout-title">Key takeaways</p>
  <ul>
    <li>Treat registration as a background pipeline with visible states — not a single request.</li>
    <li>List tools once and cache them; refresh on demand or when a call says a tool is gone.</li>
    <li>Prefix tool names with their server to avoid collisions and make logs readable.</li>
    <li>Encrypt keys, never send them back to the browser, delete them with the server.</li>
    <li>Fewer, relevant tools per agent beat every tool everywhere.</li>
  </ul>
</div>

<p>Hide the protocol, show the state. Users don't care that it's MCP under the hood. They care that they picked a server, pasted a key, and their agent can suddenly look things up in their own system. Every decision that kept those three steps honest was worth making.</p>
`,
  },
  {
    _id: "audit-log-for-appointments",
    slug: "audit-log-for-appointments",
    title: "Building an audit log that actually answers “who changed this appointment?”",
    summary:
      "Payments, refunds, date changes, run changes. How I built an appointment history in PetLinx that support could finally trust — and the four design rules that made the difference.",
    date: "28 Sep 2026",
    tags: ["Full Stack", "PostgreSQL", "Next.js"],
    cover: "/projects/screenshots/petlinx/1.png",
    coverAlt: "PetLinx — grooming management software",
    content: `
<p>Every business app eventually gets asked the same question. It usually arrives as a support message, slightly urgent, often from someone who is on the phone with an annoyed customer: <em>"Who changed this, and when?"</em></p>

<p>At PetLinx — grooming management software for pet businesses — that question was almost always about an appointment. And for a while, the honest answer was: <em>we're not completely sure.</em></p>

<p>This is the story of building the appointment log that fixed that, and the design rules I'd now apply to any audit log.</p>

<h2>Why appointments are messier than they look</h2>

<p>On paper, an appointment is a time, a pet, a client and a service. In real life it's a living thing. In one week, a single appointment might be:</p>

<ul>
  <li>booked online by the client,</li>
  <li>moved to a different day by the front desk,</li>
  <li>moved to a different run (the grooming station or kennel the pet is assigned to),</li>
  <li>paid for — maybe partly up front, the rest at pickup,</li>
  <li>partly refunded because an add-on service didn't happen,</li>
  <li>moved again.</li>
</ul>

<p>Every one of those changes is made by a different person, at a different time, often for a reason that only made sense in the moment. When a client later says "I never agreed to Thursday" or "why was I charged twice?", support needs to rebuild that week, step by step.</p>

<p>Without a proper history, they were reconstructing it from memory, payment provider dashboards, and asking engineers to look at the database. That's slow, it's error-prone, and it doesn't scale past a handful of customers.</p>

<h2>What the log needed to answer</h2>

<p>Before writing any code, I wrote down the questions the log had to answer, because they decide the design:</p>

<ul>
  <li><strong>What changed?</strong> Which field, what it was before, what it is now.</li>
  <li><strong>Who changed it?</strong> A staff member, the client, or the system itself (for example, an automatic reminder or a payment webhook).</li>
  <li><strong>When?</strong> Exact time, in a format support can read.</li>
  <li><strong>Why?</strong> When there's a reason — a refund note, a reschedule comment — it should travel with the change.</li>
</ul>

<p>We needed this for every meaningful change: <strong>payments, refunds, date updates and run modifications</strong> at minimum. With those four questions written down, four design decisions mostly made themselves.</p>

<h2>Decision 1: append-only, always</h2>

<p>The log lives in its own table, and that table only ever gets <strong>inserts</strong>. Nothing in the app updates a log row. Nothing deletes one.</p>

<p>That sounds like a small rule. It's actually the whole point. The moment history can be edited, it stops being history — it becomes another field that might be wrong. If a change was a mistake, the fix is a <em>new</em> event that changes it back, and the log shows both. That's exactly what support wants to see anyway.</p>

<pre><code class="language-sql">CREATE TABLE appointment_events (
  id             BIGSERIAL PRIMARY KEY,
  appointment_id BIGINT      NOT NULL REFERENCES appointments(id),
  event_type     TEXT        NOT NULL,  -- 'created', 'date_change', 'run_change', 'payment', 'refund', ...
  changes        JSONB       NOT NULL,  -- { "field": { "from": ..., "to": ... } }
  actor_type     TEXT        NOT NULL,  -- 'staff', 'client', 'system'
  actor_id       BIGINT,                -- null when the system did it
  note           TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON appointment_events (appointment_id, created_at);</code></pre>

<p>The index matters more than it looks: almost every read is "all events for this appointment, in order", and that's exactly what it serves.</p>

<h2>Decision 2: same transaction, or it didn't happen</h2>

<p>Here's the mistake that makes most audit logs quietly unreliable. The code updates the appointment, and then — as a separate step — writes the log entry. Most days that's fine. Then one day the second step fails: a timeout, a deploy at the wrong moment, an unexpected error. The appointment changed, but the history doesn't know.</p>

<p>Nobody notices until the day someone needs that exact entry.</p>

<p>So the change and its event are written in the <strong>same database transaction</strong>. Either both are saved, or neither is.</p>

<pre><code class="language-js">await db.transaction(async (tx) => {
  const before = await tx.appointments.findById(id);
  const after = await tx.appointments.update(id, { date: newDate });

  await tx.appointmentEvents.insert({
    appointmentId: id,
    eventType: "date_change",
    changes: { date: { from: before.date, to: after.date } },
    actorType: "staff",
    actorId: currentUser.id,
    note: reason,
  });
});</code></pre>

<p>To make this hard to forget, appointment changes go through a small set of service functions that always write the event. There's no "update the appointment directly" path left in the app for someone to accidentally use.</p>

<h2>Decision 3: store the diff, not a snapshot</h2>

<p>The simplest way to log changes is to save a full copy of the appointment every time anything changes. It's easy to write. It's miserable to read: to find out what actually changed, you're comparing two big blobs of data in your head.</p>

<p>Instead, each event stores only what changed, as <code>from</code> / <code>to</code> pairs. That one choice is what lets the history read like plain sentences:</p>

<blockquote>Date changed from 14 Mar, 10:00 to 15 Mar, 11:30 by front desk — "client asked for a later slot"</blockquote>

<p>It also keeps the table small, and makes it easy to answer questions like "show me every run change this week" without digging through full copies.</p>

<h2>Decision 4: money gets first-class events</h2>

<p>Payments and refunds were the source of the most stressful support conversations, so they got their own event types instead of being a generic "field changed". A payment event records the amount and the method. A refund event records the amount, what it was for, and the note left with it.</p>

<p>Now when a client says "I was charged twice", support opens the appointment and sees, in order: the deposit, the payment at pickup, and the partial refund for the add-on that didn't happen — each with who did it and when. A conversation that used to take a day of back-and-forth takes a minute.</p>

<figure>
  <img src="/projects/screenshots/petlinx/2.png" alt="PetLinx dashboard" />
  <figcaption>PetLinx — appointments are at the centre of everything a grooming business does.</figcaption>
</figure>

<h2>The part people forget: reading it</h2>

<p>A perfect audit table that nobody can read is still useless. The log is only valuable if the people who need it — support and the business owners — can use it without asking an engineer.</p>

<p>On the appointment screen, the history shows as a simple timeline:</p>

<ul>
  <li><strong>Newest first</strong>, because the latest change is usually the one being asked about.</li>
  <li><strong>Plain-language lines</strong> built from the diff — "Run changed from Table 2 to Table 4" — not field names.</li>
  <li><strong>The actor's name</strong>, or "System" for automatic changes, so nobody wonders whether a person did it.</li>
  <li><strong>Notes shown inline</strong>, because the reason is often the most useful part.</li>
</ul>

<p>The best sign it worked: support stopped asking engineers to check the database.</p>

<h2>A few things I'd watch out for</h2>

<ul>
  <li><strong>Time zones.</strong> Store everything in UTC, show it in the business's local time. Mixing these up makes a perfectly correct log look wrong.</li>
  <li><strong>System changes need an actor too.</strong> "Changed by: nobody" is confusing. Label automatic changes clearly — "System (payment webhook)".</li>
  <li><strong>Don't log noise.</strong> Not every field deserves an event. Log the changes someone will one day need to explain.</li>
  <li><strong>Plan for growth.</strong> An append-only table only grows. Index it for the way you read it, and you'll be fine for a long time.</li>
</ul>

<div class="callout">
  <p class="callout-title">Key takeaways</p>
  <ul>
    <li>Make the log append-only — corrections are new events, never edits.</li>
    <li>Write the change and its event in the same transaction.</li>
    <li>Store diffs as from / to pairs so history reads like sentences.</li>
    <li>Give money its own event types with amounts and notes.</li>
    <li>Design the reading experience from day one — that's where the value is.</li>
  </ul>
</div>

<p>The table itself took an afternoon. Getting people to trust it took all four rules — and a screen they could actually read.</p>
`,
  },
  {
    _id: "react-native-in-app-purchases",
    slug: "react-native-in-app-purchases",
    title: "In-app purchases in React Native: the things the docs don't warn you about",
    summary:
      "Notes from shipping in-app purchases on iOS and Android for Kiddie Kredit — empty product lists, sandbox testers, restores, Android acknowledgements, and why the server must always have the final word.",
    date: "14 Sep 2026",
    tags: ["Mobile", "React Native", "iOS", "Android"],
    content: `
<figure class="phone">
  <img src="/projects/screenshots/kk/6.png" alt="Kiddie Kredit quest screen" />
  <img src="/projects/screenshots/kk/5.png" alt="Kiddie Kredit missions screen" />
  <figcaption>Kiddie Kredit — kids earn a "credit score" by finishing chores and missions.</figcaption>
</figure>

<p>Kiddie Kredit is a React Native app that teaches kids how credit scores work — by doing chores. Kids complete tasks and missions, guardians approve them, and the child's "score" goes up. There are separate experiences for kids, guardians and admins, all in one app on iOS and Android.</p>

<p>At some point the app needed in-app purchases on both platforms. I'd read the docs. I'd watched a couple of talks. I thought I was ready.</p>

<p>I wasn't, quite. Not because the code is hard — the code is the easy part — but because in-app purchases sit at the meeting point of your app, two app stores, and your backend, and each of them has opinions. These are the things I wish someone had told me before I started.</p>

<h2>1. Your products won't load until the stores say so</h2>

<p>The first day went like this: write the code to fetch products, run the app, get back an empty list. No error. Just nothing.</p>

<p>Most of the time, an empty product list isn't a code problem. It's a store setup problem:</p>

<ul>
  <li><strong>On iOS</strong>, products must be fully set up in App Store Connect, and the account's agreements, tax and banking details need to be complete. If the paid apps agreement isn't active, products quietly don't load.</li>
  <li><strong>On Android</strong>, the app generally needs to be uploaded to a testing track in Play Console before the billing library will return your products — even for testing on your own phone.</li>
  <li><strong>Product IDs must match exactly.</strong> A typo between what's in the store and what's in your code gives you the same empty list.</li>
</ul>

<p>My rule now: if the product list is empty, check the store dashboards before touching the code.</p>

<h2>2. Test on real devices with real test accounts — from week one</h2>

<p>Simulators and emulators will only take you so far with purchases. The real behaviour — the native payment sheet, cancelling halfway, subscription renewals — only shows up on real devices signed in with test accounts:</p>

<ul>
  <li><strong>iOS:</strong> create sandbox testers in App Store Connect and sign in with them on the device.</li>
  <li><strong>Android:</strong> add license testers in Play Console so test purchases don't charge real money.</li>
</ul>

<p>The behaviour you see there is what your users will see. You want to find the surprises in week one, not the week before release.</p>

<h2>3. "Restore purchases" is not optional</h2>

<p>If someone pays for something, then deletes the app or switches to a new phone, they expect it to still be theirs. Apple expects that too, and an app without a clear way to restore purchases is a common reason for review trouble.</p>

<p>The lesson: design the <strong>Restore purchases</strong> button and flow at the same time as the buy button. It's much easier to build both together than to bolt a restore flow on after a rejection email.</p>

<h2>4. On Android, you must acknowledge the purchase</h2>

<p>This is the one that catches people. With Google Play Billing, after a purchase succeeds, your app has to <strong>acknowledge</strong> it. If a purchase isn't acknowledged within a few days, Google automatically refunds it and takes the item back.</p>

<p>It's easy to miss because everything looks fine in testing: the purchase goes through, the feature unlocks, you move on. Then, days later, refunds start appearing and you can't work out why.</p>

<p>Acknowledging belongs in the same flow that grants the purchase — right after your server has confirmed it (more on that next).</p>

<h2>5. The server has the final word</h2>

<p>This is the biggest lesson, and the one I'd apply to any app that sells anything.</p>

<p>It's tempting to unlock the feature the moment the app's purchase library says "success". But the app is the one place you can't fully trust — it runs on the user's device. So the app never decides on its own. Instead:</p>

<pre><code class="language-text">1. App: the user completes the purchase in the native sheet
2. App → API: send the receipt (iOS) or purchase token (Android)
3. API → Apple / Google: verify it's real and not already used
4. API: record the entitlement on the user's account
5. App: acknowledge / finish the transaction
6. App: refresh the user's access from the API</code></pre>

<p>In code, the app side ends up small, because the server does the important part:</p>

<pre><code class="language-js">async function onPurchaseUpdated(purchase) {
  // 1. Let the server verify and record it
  const result = await api.post("/purchases/verify", {
    platform: Platform.OS,
    productId: purchase.productId,
    receipt: purchase.transactionReceipt, // iOS receipt / Android token
  });

  if (!result.ok) {
    showMessage("We couldn't confirm that purchase. You haven't been charged twice — try again shortly.");
    return;
  }

  // 2. Only now finish / acknowledge with the store
  await finishTransaction({ purchase });

  // 3. Access comes from the server, not from the purchase event
  await refreshEntitlements();
}</code></pre>

<p>This design solved a problem I didn't even see coming. In Kiddie Kredit, kids and guardians are often on <em>different phones</em>. If the purchase lived on the device, the guardian might pay and the child's phone wouldn't know. Because the server owns the entitlement and it's attached to the account, both sides see the same thing — on any device.</p>

<h2>6. Plan for every state, not just "success"</h2>

<p>The happy path is one of many. In real usage you'll see:</p>

<ul>
  <li><strong>Cancelled</strong> — the user closed the payment sheet. Not an error; don't show one.</li>
  <li><strong>Pending</strong> — some payment methods take time to complete. Tell the user it's on its way instead of leaving them guessing.</li>
  <li><strong>Interrupted</strong> — the app was killed or lost network halfway through. The purchase may have gone through anyway.</li>
  <li><strong>Already owned</strong> — they bought it before. Offer a restore instead of another charge.</li>
</ul>

<p>The interrupted case is the important one. The app must pick up unfinished transactions the next time it launches and run them through the same verify-then-finish flow. Otherwise, someone pays and gets nothing — which is the fastest way to get a one-star review.</p>

<figure class="phone">
  <img src="/projects/screenshots/kk/2.png" alt="Kiddie Kredit screen" />
  <img src="/projects/screenshots/kk/4.png" alt="Kiddie Kredit screen" />
  <figcaption>Guardians and kids use the app on different devices — so purchases belong to the account, not the phone.</figcaption>
</figure>

<h2>7. Purchases in a kids' app need extra care</h2>

<p>Kiddie Kredit is used by children, which changes things. Purchases need to sit behind the guardian side of the app, and parental controls matter as much as the payment itself. Both stores have specific rules for apps aimed at kids, and it's worth reading them before you design the purchase flow — not after.</p>

<h2>What I'd tell myself on day one</h2>

<ul>
  <li><strong>Set up both stores first.</strong> Agreements, products, test accounts, testing track. Then write code.</li>
  <li><strong>Build the server verification before the UI.</strong> It's the part everything else depends on.</li>
  <li><strong>Make one flow handle new, restored and interrupted purchases.</strong> Three paths into the same verify-then-finish logic means fewer bugs.</li>
  <li><strong>Log every purchase event on the server.</strong> When someone says "I paid and didn't get it", you want an answer in a minute, not a day.</li>
</ul>

<div class="callout">
  <p class="callout-title">Key takeaways</p>
  <ul>
    <li>An empty product list is usually store setup, not code.</li>
    <li>Test on real devices with sandbox and license testers from the start.</li>
    <li>Ship "Restore purchases" together with "Buy".</li>
    <li>Acknowledge Android purchases — or Google refunds them.</li>
    <li>Verify on the server, store entitlements on the account, then finish the transaction.</li>
  </ul>
</div>

<p>In-app purchases are less about the payment sheet and more about everything around it: store setup, test accounts, restores, and a backend that decides who owns what. Get those right, and the code inside the app really is the easy part.</p>
`,
  },
];

export const getPost = (id) => posts.find((p) => p._id === id || p.slug === id);
