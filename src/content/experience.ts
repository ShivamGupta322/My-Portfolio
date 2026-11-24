import type { Company } from "../types/content";

/** Newest first. productSlugs must match projects.ts. */
export const experience = [
  {
    id: "scramble-apps",
    name: "Scramble Apps Pvt. Ltd.",
    location: "India",
    roles: [
      {
        title: "Software Engineer",
        period: { start: "2025-06", end: null },
        summary:
          "Building mobile, web and backend products end to end: a fitness social app, a video-conferencing platform's backend, a chat platform on Erlang/MongooseIM, and a fault-tolerant Kafka order system in Erlang/OTP.",
        productSlugs: [
          "fitizen",
          "vela-meet",
          "wingtrill",
          "order-processing-system",
          "voip-telephony",
        ],
      },
    ],
  },
  {
    id: "shivsys",
    name: "Shivsys Software Pvt. Ltd.",
    location: "India",
    roles: [
      {
        title: "Trainee Software Engineer",
        period: { start: "2025-01", end: "2025-06" },
        summary:
          "Worked on FitExGo, a React Native fitness & nutrition app with 10K+ downloads: built the Meal Log module and the in-app onboarding, and redesigned the home dashboard.",
        productSlugs: ["fitexgo"],
      },
    ],
  },
  {
    id: "techvision",
    name: "Techvision Technology",
    location: "Bareilly, Uttar Pradesh",
    roles: [
      {
        title: "Full Stack Developer Intern",
        period: { start: "2024-06", end: "2024-09" },
        summary:
          "Built Groceries, a MERN grocery delivery web app: Razorpay checkout, cart management, and an admin panel for managing the grocery catalogue and orders.",
        productSlugs: ["groceries"],
      },
    ],
  },
] as const satisfies readonly Company[];
