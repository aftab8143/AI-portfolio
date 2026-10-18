"use strict";

import OpenAI from "openai";
import { projects } from "../../../../data";
import { rateLimit, clientIp, MINUTE, DAY } from "@/lib/rateLimit";

// Initialized lazily inside the handler so a missing key doesn't break
// module load (and `next build`'s page-data collection) when unset.
function getClient() {
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPEN_ROUTER_API_KEY,
  });
}

// Structured data about Aftab, his portfolio, and personal details
const contentMap = {
  Aftab: {
    name: "Aftab Alam",
    title: "Software Engineer · Full Stack, Mobile & AI",
    location: "Ranchi, Jharkhand, India",
    contact: {
      email: "aftab8143@gmail.com",
      phone: "+919955327833",
      linkedin: "https://www.linkedin.com/in/aftab8143/",
      github: "https://github.com/aftab8143",
    },
    summary:
      "Software engineer with 4+ years of experience shipping web, mobile and AI products end to end — from QA automation to React Native apps live on the App Store and Google Play, full stack Next.js platforms, and AI agents connected to real business tools over MCP and controlled from Slack, Teams and WhatsApp. Currently building the JIADA Unified IT System at Jharkhand Space Applications Centre.",
    education: [
      {
        degree: "Bachelor of Science in Information Technology",
        institution: "Ranchi University",
        period: "2013–2016",
        score: "75%",
      },
    ],
    skills: {
      ai: ["Python", "LangChain", "MCP (Model Context Protocol)", "AI agents", "RAG", "Prompt & context engineering"],
      frontend: ["React", "Next.js", "React Native", "Redux", "Tailwind CSS", "HTML", "CSS"],
      backend: ["Node.js", "Express", "REST APIs", "GraphQL", "WebRTC", "Microservice-style APIs"],
      databases: ["PostgreSQL", "MongoDB", "MySQL", "Firebase"],
      cloudDevops: ["AWS (S3)", "GCP", "GitHub Actions", "CI/CD", "App Store & Play Store releases"],
      testingTools: ["Cypress", "Jest", "Postman", "Git", "JIRA", "Mixpanel", "Braze", "Google Maps API", "Firebase Dynamic Links"],
      languages: ["JavaScript", "TypeScript", "Python"],
    },
    // Newest first; keep in sync with components/home/Experience.jsx and the résumé
    experience: [
      {
        role: "Software Engineer (Current)",
        company: "Jharkhand Space Applications Centre (JSAC)",
        duration: "Jun 2026 – Present",
        responsibilities: [
          "Working on the JIADA Unified IT System for the Jharkhand Industrial Area Development Authority — one portal for investors to search plots, apply for land allotment and approvals, and track applications across 160 industrial areas.",
          "Applicant dashboard with region-wise plot availability and an interactive land availability map.",
          "Own end-to-end delivery of the platform — from development through production deployment and maintenance across a multi-server setup (application, document management and database servers) on a restricted government network.",
          "Next: a land survey mobile app for field teams.",
        ],
      },
      {
        role: "Full Stack & AI Engineer",
        company: "Jai Infoway Pvt. Ltd.",
        duration: "Feb 2025 – Apr 2026",
        responsibilities: [
          "Built seven business AI agents for Intellibooks Studio and the layer that lets users control them from Slack, Telegram, WhatsApp, Discord and Microsoft Teams.",
          "Built Koodums' bring-your-own MCP server flow and MCP servers for Google Maps and YouTube tools.",
          "PetLinx (Next.js, PostgreSQL): appointment audit log, Google auth, S3 profile uploads and invite-based onboarding.",
        ],
      },
      {
        role: "Mobile App Developer",
        company: "Jai Infoway Pvt. Ltd.",
        duration: "Jan 2023 – Feb 2025",
        responsibilities: [
          "Developed Kiddie Kredit end to end, including in-app purchases on iOS and Android, Braze and Mixpanel.",
          "Reduced the Kiddie Kredit crash rate by 40% and improved app speed by 60%.",
          "Gopher maps and deep linking, the Intellibooks Waiter App UI, and a WebRTC doctor–patient calling platform.",
        ],
      },
      {
        role: "Test Automation Engineer",
        company: "Jai Infoway Pvt. Ltd.",
        duration: "May 2022 – Jan 2023",
        responsibilities: [
          "Built Cypress test suites integrated into CI/CD.",
          "Acted as QA lead on staging for finance and trading features.",
        ],
      },
    ],
    // Same list as the Projects page
    projects: projects.map((p) => ({
      name: p.title,
      link: p.link,
      description: p.description,
      techStack: p.tags,
      contributions: p.contributions,
      ...(p.sections ? { details: p.sections } : {}),
    })),
  },

  website: {
    name: "Aftab's Portfolio Website",
    description:
      "A personal portfolio website for Aftab Alam, showcasing his projects, experience, and skills as a full-stack developer.",
    techStack: ["Next.js", "React", "Tailwind CSS", "Node.js", "MongoDB"],
    features: [
      "Project gallery with details, links, and screenshots",
      "Interactive resume and experience section",
      "Blog section",
      "Responsive design",
      "Downloadable resume",
    ],

    pages: {
      home: "The homepage features a hero section, skills, about, and contact sections.",
      blogs: "A blog section where Aftab shares articles and insights.",
      projects: "A gallery of Aftab's projects with details and links.",
      demo: "UI demos showcasing artistic designs and layouts.",
    },
  },

};

// Override the first choice with OPENROUTER_MODEL; the rest are fallbacks.
const MODELS = [
  process.env.OPENROUTER_MODEL,
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "google/gemma-4-26b-a4b-it:free",
].filter(Boolean);

const SYSTEM_MESSAGE = {
  role: "system",
  content:
    "You are EVA, the assistant on Aftab Alam's portfolio website. Answer visitors' questions about Aftab using only the data blocks provided. Be friendly and concise (2-4 sentences unless asked for more). If something isn't in the data, say you don't know and suggest contacting Aftab at aftab8143@gmail.com.",
};

// Only well-formed recent turns are passed on; anything else is dropped
function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
}

// API handler
export async function POST(req) {
  // Per visitor: 20 questions per 10 minutes, 100 per day (protects the AI quota)
  const limited = rateLimit(`ask:${clientIp(req)}`, [
    { limit: 20, windowMs: 10 * MINUTE },
    { limit: 100, windowMs: DAY },
  ]);
  if (!limited.ok) {
    return Response.json(
      { error: "You've asked a lot of questions! Please try again in a little while." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
    );
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }
    const question = typeof body.question === "string" ? body.question.trim().slice(0, 500) : "";
    if (!question) return Response.json({ error: "Please type a question." }, { status: 400 });

    const openai = getClient();

    // Profile data goes in the system message, then the conversation so far,
    // then the new question — so follow-ups ("which of those used AI?") work.
    const systemMessage = {
      role: "system",
      content: `${SYSTEM_MESSAGE.content}\n\nData about Aftab:\n${JSON.stringify(contentMap, null, 2)}`,
    };
    const messages = [systemMessage, ...cleanHistory(body.history), { role: "user", content: question }];

    // Stream from OpenRouter. Free models get retired without notice, so pass
    // fallbacks: OpenRouter tries each in order until one is available.
    const completion = await openai.chat.completions.create({
      model: MODELS[0],
      models: MODELS,
      messages,
      stream: true,
    });

    // Return streamed response
    const encoder = new TextEncoder();
    return new Response(
      new ReadableStream({
        async start(controller) {
          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content || "";
            controller.enqueue(encoder.encode(text));
          }
          controller.close();
        },
      }),
      { headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  } catch (error) {
    console.error("Handler error:", error);
    return Response.json(
      { error: "EVA is having trouble answering right now. Please try again in a moment." },
      { status: 500 }
    );
  }
}
