import type { Profile } from "../types/content";

/**
 * Who I am. Sources: Shivam_Gupta_7060525681.pdf (Full Stack & React Native)
 * and Shivam_Gupta_Erlang_7060525681.pdf (Erlang/OTP Backend).
 */
export const profile = {
  name: "Shivam Gupta",
  initials: "SG",
  role: "Software Engineer",
  location: "Bareilly, Uttar Pradesh, India",
  email: "guptashivamsg02@gmail.com",
  showPhone: false,
  socials: [
    { label: "GitHub", href: "https://github.com/ShivamGupta322" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/shivam-gupta-sg322/" },
    { label: "LeetCode", href: "https://leetcode.com/u/Shivam_Gupta322/" },
    { label: "GeeksforGeeks", href: "https://www.geeksforgeeks.org/user/guptashivamsg02/" },
  ],
  // Google Drive direct-download links (the files are shared "Anyone with the link").
  // To update a resume, replace the file in Drive (Manage versions keeps the same link).
  resume: {
    product: {
      label: "Full Stack & Mobile",
      href: "https://drive.google.com/uc?export=download&id=1toWqeI_IPJXPAlX1IvRsqirqvt3tALQv",
    },
    systems: {
      label: "Erlang/OTP Backend",
      href: "https://drive.google.com/uc?export=download&id=1tiNz9BFvQ8TbtaP9W54Z2MW9wYcFT28_",
    },
  },
  lens: {
    product: {
      label: "Product",
      headline: "Full-stack & mobile engineer",
      tagline:
        "Full-stack & mobile engineer shipping apps to Play Store and App Store, and the backends they talk to.",
      summary:
        "Software engineer with nearly 2 years of experience building web and mobile apps with React, React Native, Next.js, Vue.js, Node.js and TypeScript. I built a video-conferencing platform's backend from scratch and deployed it on AWS, and shipped React Native apps with real-time chat, push notifications and deep linking.",
      roles: ["React Native", "Next.js", "Node.js", "Vue.js"],
      stats: [
        { value: "~2 yrs", label: "building web & mobile apps" },
        { value: "10K+", label: "downloads on FitExGo" },
        { value: "3", label: "apps shipped to app stores" },
        { value: "400+", label: "DSA problems solved" },
      ],
      chips: [
        { value: "5", label: "products live right now" },
        { value: "Full-stack", label: "React, Next.js, React Native, Node.js" },
      ],
    },
    systems: {
      label: "Systems",
      headline: "Erlang/OTP backend engineer",
      tagline:
        "Backend engineer building concurrent, fault-tolerant, real-time systems in Erlang/OTP.",
      summary:
        "Backend engineer with 1+ year of Erlang/OTP: a Kafka-based order processing system with at-least-once delivery, idempotent processing, retries, dead-letter queues and OTP supervision trees, plus XMPP messaging on MongooseIM and a Kazoo/FreeSWITCH VoIP platform.",
      roles: ["Erlang/OTP", "Apache Kafka", "XMPP", "FreeSWITCH"],
      stats: [
        { value: "~110/s", label: "orders processed end to end" },
        { value: "84%", label: "test coverage" },
        { value: "0", label: "Dialyzer warnings" },
        { value: "400+", label: "DSA problems solved" },
      ],
      chips: [
        { value: "OTP", label: "supervision trees that restart on crash" },
        { value: "Kafka", label: "at-least-once delivery, retries, DLQ" },
      ],
    },
  },
} as const satisfies Profile;
