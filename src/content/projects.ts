import type { ArchiveProject, Project } from "../types/content";

/**
 * Every project shown on the site. Order here = default grid order.
 * Media paths are filled in as screenshots arrive (public/projects/<slug>/);
 * until then the UI renders branded placeholders.
 */
export const projects = [
  {
    slug: "fitizen",
    title: "Fitizen",
    tagline: "Fitness social app and website: real-time chat, deep links and a faster reels feed.",
    summary:
      "A fitness social network on Android, iOS and the web. I redesigned the app, built its Vue.js website with full feature parity, and owned the real-time chat, deep linking and feed performance work.",
    kind: "hybrid",
    lens: ["product", "systems"],
    status: "live",
    company: "scramble-apps",
    period: { start: "2025-06", end: null },
    role: "Software Engineer · Mobile & Web",
    stack: ["React Native", "Vue.js", "WebSockets", "SQLite", "FCM", "PHP", "Meta Ads SDK"],
    highlights: [
      {
        title: "Redesigned app + Vue.js website",
        body: "Redesigned the entire app UI and built the Fitizen website in Vue.js with the same features as the mobile app.",
      },
      {
        title: "Real-time chat that works offline",
        body: "Chat over WebSockets with offline SQLite message storage and FCM push notifications for new messages.",
      },
      {
        title: "Deep links with rich previews",
        body: "Shared videos and profiles open directly in the app on Android and iOS, with crawler-friendly Open Graph pages for rich previews on WhatsApp and Google.",
      },
      {
        title: "Faster reels feed",
        body: "Optimised the reels feed and video playback APIs to cut lag, load time and errors, and added video compression for faster uploads.",
      },
      {
        title: "Ad attribution",
        body: "Integrated the Meta Ads SDK to track and attribute sign-ups coming from Meta ad campaigns.",
      },
    ],
    links: {
      live: "https://fitnation.com",
      playStore: "https://play.google.com/store/apps/details?id=com.FitNation",
      appStore: "https://apps.apple.com/in/app/fitizen-your-fitness-profile/id6449091598",
    },
    media: {},
    architecture: "fitizen-chat",
    featured: { product: 1 },
  },
  {
    slug: "vela-meet",
    title: "Vela Meet",
    tagline: "Video conferencing and scheduling, with a backend I designed and built from scratch.",
    summary:
      "A video-conferencing and scheduling platform. I designed and built the complete backend (auth, invites, scheduling, calendar sync, enterprise sign-in), the admin panel, the Jitsi integration and the AWS deployment.",
    kind: "hybrid",
    lens: ["product", "systems"],
    status: "live",
    company: "scramble-apps",
    period: { start: "2025-06", end: null },
    role: "Software Engineer · Backend & Platform",
    stack: [
      "React",
      "Node.js",
      "PostgreSQL",
      "Redis",
      "Jitsi Meet",
      "AWS",
      "Nginx",
      "PM2",
      "SendGrid",
      "Google Calendar API",
      "Outlook Calendar",
      "Active Directory",
      "2FA",
    ],
    highlights: [
      {
        title: "Backend from scratch",
        body: "Authentication, invites, scheduling and calendars, with Redis caching for scheduled and updated meeting notifications.",
      },
      {
        title: "Secure admin panel",
        body: "Authorization-protected routes for managing users and meetings.",
      },
      {
        title: "In-app video with Jitsi",
        body: "Integrated and customised Jitsi Meet so users can meet without leaving the platform.",
      },
      {
        title: "Calendar sync everywhere",
        body: "Google Calendar and Outlook sync plus SendGrid email invites, so meeting changes reach every platform and attendee.",
      },
      {
        title: "Enterprise sign-in",
        body: "Active Directory integration for enterprise sign-in and two-factor authentication for account security.",
      },
      {
        title: "Shipped on AWS",
        body: "Deployed frontend, backend and self-hosted Jitsi on AWS EC2 (Ubuntu) with Nginx, PM2, SSL and domain routing.",
      },
    ],
    links: { live: "https://velaconference.com" },
    media: {},
    architecture: "vela-meet",
    featured: { product: 2, systems: 2 },
  },
  {
    slug: "wingtrill",
    title: "Wingtrill",
    tagline: "Personal and workspace chat on mobile, web and desktop, on an Erlang/XMPP backbone.",
    summary:
      "A messaging platform where users buy virtual phone numbers and create Slack-style workspaces. I built the product website and the mobile/web auth flows, and worked on XMPP messaging on MongooseIM.",
    kind: "hybrid",
    lens: ["product", "systems"],
    status: "live",
    company: "scramble-apps",
    period: { start: "2025-06", end: null },
    role: "Software Engineer · Web, Mobile & Messaging",
    stack: [
      "React Native",
      "Next.js",
      "Electron",
      "Firebase",
      "Crashlytics",
      "Erlang",
      "XMPP",
      "MongooseIM",
    ],
    highlights: [
      {
        title: "Website and auth flows",
        body: "Designed and developed the complete Wingtrill website and built the login and sign-up flows for mobile and web.",
      },
      {
        title: "XMPP messaging on MongooseIM",
        body: "Worked on the Erlang-based messaging layer powering one-to-one and workspace conversations.",
      },
      {
        title: "Workspaces and virtual numbers",
        body: "Contributed to a platform where users buy virtual phone numbers and create Slack-style workspaces.",
      },
      {
        title: "Production crash reporting",
        body: "Integrated Firebase Crashlytics for real-time crash reporting to catch and fix production issues faster.",
      },
    ],
    links: { live: "https://wingtrill.com" },
    media: {},
    architecture: "wingtrill",
    featured: { product: 3, systems: 3 },
  },
  {
    slug: "fitexgo",
    title: "FitExGo",
    tagline: "Fitness and nutrition app with 10K+ downloads on Android and iOS.",
    summary:
      "A fitness and nutrition tracker. I built its Meal Log module end to end, created the interactive onboarding, and redesigned the home dashboard and explore screens.",
    kind: "mobile",
    lens: ["product"],
    status: "shipped",
    company: "shivsys",
    period: { start: "2025-01", end: "2025-06" },
    role: "Trainee Software Engineer",
    stack: ["React Native", "Node.js"],
    highlights: [
      {
        title: "Meal Log, end to end",
        body: "Calorie, water and nutrition tracking: one of the app's most-used features.",
        screen: 0,
      },
      {
        title: "Guided onboarding",
        body: "Interactive in-app tutorials with react-native-copilot that walk new users through key features.",
        screen: 1,
      },
      {
        title: "Redesigned home and explore",
        body: "Restructured the Home Dashboard and Explore screens for smoother navigation.",
        screen: 2,
      },
    ],
    metrics: [{ value: "10K+", label: "downloads" }],
    links: {
      playStore: "https://play.google.com/store/apps/details?id=com.fitexgo",
      appStore: "https://apps.apple.com/in/app/fitexgo-fitness-lifestyle/id6446050793",
    },
    media: {},
    featured: { product: 4 },
  },
  {
    slug: "order-processing-system",
    title: "Fault-Tolerant Order Processing",
    tagline:
      "Event-driven Erlang/OTP + Kafka backend: at-least-once delivery, idempotent payments, ~110 orders/s.",
    summary:
      "An event-driven order processing backend in Erlang/OTP and Apache Kafka, built so no order is ever lost or charged twice, even when workers crash mid-flight: idempotent payments, non-blocking retries with backoff, a dead-letter topic, and OTP supervision trees with graceful shutdown.",
    kind: "backend",
    lens: ["systems"],
    status: "shipped",
    company: "scramble-apps",
    period: { start: "2025-06", end: null },
    role: "Software Engineer · Erlang/OTP",
    stack: [
      "Erlang",
      "OTP",
      "Apache Kafka",
      "PostgreSQL",
      "Mnesia",
      "Docker",
      "Prometheus",
      "GitHub Actions",
      "EUnit",
      "PropEr",
      "Common Test",
      "Pact",
      "Dialyzer",
    ],
    highlights: [
      {
        title: "At-least-once, never double-charged",
        body: "At-least-once delivery with manual offset commits and idempotent payment handling, so redelivered orders are never charged twice; failures retry with 1 s / 5 s / 30 s backoff before a dead-letter topic.",
      },
      {
        title: "Let it crash, safely",
        body: "OTP supervision trees with graceful shutdown and pluggable PostgreSQL/Mnesia storage.",
      },
      {
        title: "Observable and load-tested",
        body: "Prometheus metrics and structured JSON logs; load-tested at about 110 orders/s end to end.",
      },
      {
        title: "Tested from every angle",
        body: "84% coverage across EUnit, PropEr property tests, Common Test, end-to-end and Pact contract tests, with zero Dialyzer warnings; shipped with Docker and GitHub Actions CI.",
      },
    ],
    metrics: [
      { value: "~110/s", label: "orders end to end" },
      { value: "84%", label: "test coverage" },
      { value: "0", label: "Dialyzer warnings" },
    ],
    links: { github: "https://github.com/ShivamGupta322/Order-Management" },
    media: {},
    architecture: "order-processing",
    featured: { systems: 1 },
  },
  {
    slug: "voip-telephony",
    title: "VoIP & Telephony Platform",
    tagline: "Call-flow and routing logic on a distributed Kazoo/FreeSWITCH VoIP platform.",
    summary:
      "A distributed VoIP platform built on Kazoo and FreeSWITCH. I worked on SIP signaling, call processing and routing, extending the Erlang call-flow logic for automated agent flows.",
    kind: "backend",
    lens: ["systems"],
    status: "internal",
    company: "scramble-apps",
    period: { start: "2025-06", end: null },
    role: "Software Engineer · Erlang/VoIP",
    stack: ["Erlang", "Kazoo", "FreeSWITCH", "SIP"],
    highlights: [
      {
        title: "Call processing and routing",
        body: "SIP signaling, call processing and routing on a distributed Kazoo + FreeSWITCH platform.",
      },
      {
        title: "Agent call flows",
        body: "Extended Erlang call-flow and routing logic for agent flows such as sales demo booking and receptionist support-ticket creation.",
      },
      {
        title: "Production debugging",
        body: "Helped debug production SIP and call-flow issues across Kazoo's service architecture and configuration.",
      },
    ],
    links: {},
    media: {},
    architecture: "voip-telephony",
    featured: { systems: 4 },
  },
  {
    slug: "nearby",
    title: "Nearby",
    tagline: "Location-based group chat that never stores your coordinates.",
    summary:
      "A chat app that drops you into a live room for your area. Your location becomes a geohash cell in the browser and raw coordinates never leave the device. Built on a self-hosted MongooseIM XMPP stack.",
    kind: "backend",
    lens: ["systems", "product"],
    status: "in-progress",
    company: "personal",
    role: "Personal project",
    stack: ["React", "TypeScript", "XMPP", "MongooseIM", "PostgreSQL", "MongoDB", "Docker"],
    highlights: [
      {
        title: "Privacy by design",
        body: "Location is turned into a geohash cell in the browser; raw coordinates are never sent or stored.",
      },
      {
        title: "Self-hosted XMPP stack",
        body: "MongooseIM with PostgreSQL and MongoDB in Docker Compose, using multi-user chat rooms and message archive (MAM).",
      },
      {
        title: "Resilient typed client",
        body: "Typed XMPP-over-WebSocket client with auto-reconnect, exponential backoff, keepalive, history catch-up and paginated loading.",
      },
      {
        title: "Fixed an upstream archive bug",
        body: "Worked around a MongooseIM MUC archive timestamp bug and made archive writes synchronous for consistent history.",
      },
    ],
    links: {},
    media: {},
    architecture: "nearby",
    featured: { systems: 5 },
  },
  {
    slug: "molbhaav",
    title: "MolBhaav",
    tagline: "Offline price ↔ weight calculator, localised into Indian languages.",
    summary:
      "A published offline Android app for everyday market maths: convert rate and budget to weight (and back), track expenses and count notes, in Hindi, Punjabi, Tamil and English.",
    kind: "mobile",
    lens: ["product"],
    status: "live",
    company: "personal",
    role: "Personal project",
    stack: ["React Native", "i18n"],
    highlights: [
      {
        title: "Rate ↔ weight, offline",
        body: "Converts rate and budget to weight and back with no network needed.",
        screen: 0,
      },
      {
        title: "Expense tracker and note counter",
        body: "Everyday tools for small shopkeepers and buyers in one app.",
        screen: 1,
      },
      {
        title: "Made for India",
        body: "Localised into Hindi, Punjabi, Tamil and English.",
        screen: 2,
      },
    ],
    links: {
      playStore: "https://play.google.com/store/apps/details?id=com.molbhaav",
      // github: repo is private; add https://github.com/ShivamGupta322/MolBhaav once it's public
    },
    media: {},
  },
  {
    slug: "social-media-post-scheduler",
    title: "Social Media Post Scheduler",
    tagline: "Write once, publish everywhere at a set time via Zapier webhooks.",
    summary:
      "A scheduler that publishes a post to every connected social platform at a chosen time through Zapier webhooks. Frontend on Vercel, API on Netlify.",
    kind: "web",
    lens: ["product"],
    status: "live",
    company: "personal",
    role: "Personal project",
    stack: ["React", "Vite", "Node.js", "Express.js", "MongoDB", "Zapier", "Vercel", "Netlify"],
    highlights: [
      {
        title: "One post, every platform",
        body: "Publishes to all connected social platforms at a set time via Zapier webhooks.",
      },
      {
        title: "Full-stack MERN",
        body: "React (Vite) frontend with a Node.js/Express API and MongoDB, hosted on Vercel and Netlify.",
      },
    ],
    links: {
      live: "https://social-media-post-scheduler-eta.vercel.app/",
      // github: repo is private; add https://github.com/ShivamGupta322/social-media-post-scheduler once it's public
    },
    media: {},
  },
  {
    slug: "groceries",
    title: "Groceries",
    tagline: "MERN grocery delivery app with Razorpay checkout, cart and an admin panel.",
    summary:
      "A grocery delivery web app built during my internship at Tachvision Technology, on the MERN stack: shoppers browse and fill a cart, then pay through Razorpay; staff manage products, stock and orders from a separate admin panel.",
    kind: "web",
    lens: ["product"],
    status: "internal",
    company: "tachvision",
    period: { start: "2024-06", end: "2024-09" },
    role: "Full Stack Developer Intern",
    stack: ["React", "Node.js", "Express.js", "MongoDB", "Razorpay"],
    highlights: [
      {
        title: "Razorpay checkout",
        body: "Integrated Razorpay so customers can pay for their orders securely at checkout.",
      },
      {
        title: "Cart management",
        body: "Add, update and remove items with a cart that stays in sync through to checkout.",
      },
      {
        title: "Admin panel",
        body: "A dedicated admin panel for managing the grocery catalogue and incoming orders.",
      },
    ],
    links: {},
    media: {},
  },
] as const satisfies readonly Project[];

/** College-era projects (from the previous portfolio), shown in the compact archive list. */
export const archive = [
  {
    slug: "grocery-delivery",
    title: "Grocery Delivery App",
    description: "Full-stack grocery delivery with user authentication and payment integration.",
    stack: ["React", "Node.js", "Express.js", "MongoDB"],
    href: "https://github.com/ShivamGupta322/Grocery-FullStack",
    image: "/archive/grocery-delivery.png",
  },
  {
    slug: "text-to-speech",
    title: "Text to Speech Converter",
    description: "Turns written text into natural-sounding speech.",
    stack: ["JavaScript", "HTML5", "CSS3"],
    href: "https://github.com/ShivamGupta322",
    image: "/archive/text-to-speech.png",
  },
  {
    slug: "weather-app",
    title: "Weather App",
    description: "Real-time weather updates and forecasts in a clean interface.",
    stack: ["TypeScript", "REST APIs", "CSS3"],
    href: "https://github.com/ShivamGupta322/Weather-App-open-metro-API",
    image: "/archive/weather-app.png",
  },
  {
    slug: "fanta-reimagined",
    title: "Fanta Reimagined",
    description: "A creative, animation-led reimagining of a brand website.",
    stack: ["HTML5", "CSS3", "JavaScript"],
    href: "https://github.com/ShivamGupta322",
    image: "/archive/fanta-reimagined.png",
  },
  {
    slug: "agency-ui-clone",
    title: "Obys Agency UI Clone",
    description:
      "Pixel-faithful recreation of an award-winning agency site, built to study its motion.",
    stack: ["HTML5", "CSS3", "JavaScript"],
    href: "https://github.com/ShivamGupta322/Obys-Agency-clone",
    image: "/archive/agency-ui-clone.png",
  },
  {
    slug: "tic-tac-toe",
    title: "Tic Tac Toe",
    description: "Two-player Tic Tac Toe with a responsive layout.",
    stack: ["JavaScript", "HTML5", "CSS3"],
    href: "https://github.com/ShivamGupta322/Tic-Tac-Toe",
    image: "/archive/tic-tac-toe.png",
  },
] as const satisfies readonly ArchiveProject[];
