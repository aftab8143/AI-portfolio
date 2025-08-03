"use strict";

import OpenAI from "openai";

// Initialize OpenAI client using OpenRouter
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

// Structured data about Aftab, his portfolio, and personal details
const contentMap = {
  Aftab: {
    name: "Aftab Alam",
    title: "Full-Stack Developer",
    contact: {
      email: "aftab8143@gmail.com",
      phone: "+919955327833",
      linkedin: "https://www.linkedin.com/in/aftab8143/",
      github: "https://github.com/aftab8143",
    },
    summary:
      "Dedicated full-stack web and mobile application developer with hands-on experience in building scalable, high-quality solutions for Android and iOS platforms. Passionate about modern full-stack technologies, mobile development, and delivering user-centric applications.",
    education: [
      {
        degree: "Bachelor of Science in Information Technology",
        institution: "Ranchi University",
        period: "2013–2016",
      },
    ],
    skills: {
      languages: ["TypeScript", "JavaScript",],
      frameworks: [
        "React Native",
        "React",
        "Next.js",
      ],
      backend: [
        "Node.js",
        "Express.js",
        "GraphQL",
        "WebRTC",
      ],
      databases: ["MySQL", "MongoDB"],
      devops: ["AWS", "Git", "Postman", "Jest"],
      tools: ["GitHub", "Cypress", "Firebase"],
    },
    experience: [
      {
        role: "Test Automation Engineer",
        company: "Jai Infoway Pvt. Ltd.",
        duration: "May 2021 – Nov 22",
        responsibilities: [
          "Developed and maintained automated test scripts using Cypress for end-to-end testing.",
        "Integrated Cypress tests into CI/CD pipelines for faster release cycles.",
        "Identified and reported bugs to improve application stability and performance."
        ],
      },
      {
        role: "Mobile App Developer",
        company: "Jai Infoway Pvt. Ltd.",
        duration: "Nov 2022 – Nov 2024",
        responsibilities: [
          "Developed and enhanced Android & iOS mobile applications.",
          "Contributed to full web app lifecycle.",
          "Optimized performance and ensured responsive UIs.",
        ],
      },
      {
        role: "Full Stack Developer (Current)",
        company: "Jai Infoway Pvt. Ltd.",
        duration: "Nov 2024 – Present",
        responsibilities: [
          "Built and deployed web & mobile apps for clients worldwide.",
          "Full-stack development using modern frameworks.",
          "Tailored scalable solutions per client requirements.",
        ],
      },
    ],
    projects: [
      {
        name: "SWFI Markets",
        type: "Web",
        link: "https://www.xinervatech.com/",
        techStack: ["Cypress", "JavaScript", "Chrome DevTools", "Postman", "JIRA"],
        contributions: [
           "Created and executed test cases to validate core trading features and user workflows.",
        "Automated end-to-end tests using Cypress to ensure consistent performance across releases.",
        "Performed regression and integration testing to identify and log defects early in the development cycle."
        ],
      },
      {
        name: "Kiddie Kredit App (Mobile)",
        link: "https://www.kiddiekredit.com/",
        techStack: ["React Native", "Node.js", "MongoDB", "AWS"],
        contributions: [
           "End-to-end development.",
        "Task assignment, reward systems, credit simulation.",
        "Braze & Mixpanel integration for campaign management.",
        "Push notifications and parental control.",
        "In-App purchase integration for Android and IOS"
        ],
      },
      {
        name: "Intellibooks(Waiter App)",
        link : "https://intellibooks.io/",
        type: "Mobile",
        techStack: ["React Native", "Node.js"],
        contributions: [
          "Revamped the entire UI to enhance user experience and make the app more intuitive.",
        "Implemented table selection using long press and single tap for multiple use cases, improving order flow efficiency.",
        "Simplified the order-to-billing process by streamlining steps, reducing waiter effort and improving speed."
        ],
      },
      {
        name: "gopher(Request App)",
        type: "Mobile",
        link: "https://gophergo.io/",
        techStack: ["React Native", "React Navigation", "Google Maps API", "Firebase Dynamic Links"],
        contributions: [
           "Implemented dynamic linking to allow users to open a specific product directly via a shared link.",
        "Integrated Google Maps API to visually represent distance between requester and receiver in real-time.",
        "Enhanced user experience by enabling seamless navigation and accurate location-based tracking."
        ],
      },
      {
        name: "PetLinx",
        link: "https://petlinx.com/",
        type : "web",
        techStack: ["Next.js", "Node.js", "PostgreSQL", "Firebase", "Google Auth", "AWS S3"],
        contributions: [
           "Implemented a comprehensive appointment log system to track every change including payments, refunds, date updates, and run modifications.",
        "Developed Google authentication and email verification during user signup for secure access.",
        "Built profile upload features for clients and pets, including image cropping and storage in AWS S3 buckets.",
        "Added employee onboarding flow with invite-based signup and password reset functionality.",
        "Resolved various UI and backend bugs to improve overall stability and user experience."
        ],
      },
    ],
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

  // personal: {
  //   girlfriend: "Ballu",
  //   nicknames: {
  //     toHer: ["duldul", "albalahi", "lelhi", "paglu"],
  //     fromHer: ["soni", "loli-poli"],
  //   },
  //   favorites: {
  //     hers: ["sushi", "momo", "dhuska", "kosa-chicken"],
  //     hobbies: ["bars", "pubs", "restaurants"],
  //   },
  //   notes:
  //     "Ballu is lovingly called a 'kumbhkaran' because she's too lazy even to order from Blinkit.",
  // },
};

// Helper: Build system instruction guiding assistant tone & content
function buildSystemInstruction(includePersonal = false) {
  let base =
    `You are Aftab Alam's personal assistant, EVA (Aftab's Intelligent Virtual Assistant). ` +
    `You have access to JSON data blocks labeled 'Aftab', 'website', and 'personal'. ` +
    `When answering, decide which block(s) are relevant to the user's question and use only that information. ` +
    `Do not mention irrelevant data. Respond naturally as if you know him.`;
  // if (includePersonal) {
  //   base += `\nThe user is Ballu, so you may include affectionate personal details.`;
  // }
  return base;
}

// API handler
export async function POST(req) {
  try {
    const { question } = await req.json();
    // const isBallu = question.includes("Hi,EVA I am Ballu");

    // Always provide all data blocks; let the model pick
    const dataPayload = { ...contentMap };

    // const systemMessage = {
    //   role: "system",
    //   content: buildSystemInstruction(isBallu),
    // };

    const userMessage = {
      role: "user",
      content: `Here are all data blocks:\n---\n${JSON.stringify(
        dataPayload,
        null,
        2
      )}\n---\nQ: ${question}`,
    };

    // Stream from OpenAI
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
      messages: [ userMessage],
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
    return new Response("Internal Server Error", { status: 500 });
  }
}
