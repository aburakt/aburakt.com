// Ahmet Burak Tekin CV kaynağı (ATS uyumlu: tek sütun, tablo/ikon yok, standart başlıklar).
// Derleme: bkz. cv/README.md. Uzun tire (U+2014) kullanılmaz; tarih aralığında kısa tire (U+2013).

#let version = "2026-11" // PDF adıyla aynı tutulur
#let keywords = (
  "Full-stack Developer", "Front-end Developer", "React", "TypeScript", "Node.js", "Go",
  "Astro", "PocketBase", "PostgreSQL", "REST API", "CI/CD", "GitHub Actions", "Cloudflare",
  "Team Lead", "Accessibility", "Performance", "Docker", "AWS", "Agile", "Scrum",
)

#set document(
  title: "Ahmet Burak Tekin - Full-stack Developer - CV",
  author: "Ahmet Burak Tekin",
  keywords: keywords,
)
#set page(paper: "a4", margin: (x: 1.5cm, y: 1.3cm))
#set text(font: "Libertinus Serif", size: 10pt, lang: "en", hyphenate: false)
#set par(justify: false, leading: 0.5em, spacing: 0.6em)
#set list(indent: 0.6em, body-indent: 0.4em, spacing: 0.42em)
#show link: it => it

#let section(title) = block(sticky: true, above: 1em, below: 0.5em)[
  #text(size: 11.5pt, weight: "bold", upper(title))
  #v(-0.6em)
  #line(length: 100%, stroke: 0.5pt)
]

#let entry(title, org, place, dates) = block(sticky: true, above: 0.7em, below: 0.45em)[
  *#title*, #org#if place != "" [, #place] #h(1fr) #dates
]

#align(center)[
  #text(size: 18pt, weight: "bold")[Ahmet Burak Tekin] \
  #v(-0.2em)
  #text(size: 11.5pt)[Full-stack Developer | React, TypeScript, Node.js, Go] \
  #v(-0.1em)
  Ankara, Türkiye | #link("mailto:info@aburakt.com")[info\@aburakt.com] | +90 537 813 06 42 |
  #link("https://aburakt.com")[aburakt.com] |
  #link("https://linkedin.com/in/aburakt")[linkedin.com/in/aburakt] |
  #link("https://github.com/aburakt")[github.com/aburakt]
]

#section("Summary")
Full-stack developer with 6+ years of professional experience building enterprise web applications, public
websites and self-hosted platforms. Lead a team of 4 front-end developers at the Ministry of
Interior (Türkiye), where I designed the front-end architecture of a nationwide authorization
management system and built internal products used across all 81 provinces. As a freelance
full-stack developer, I build and operate 17 client websites (11 in production) on a shared
Astro + PocketBase platform with CI/CD, automated accessibility, performance and security checks,
and error monitoring, and delivered a Ministry of Health approved tele-dermatology platform and a
Go-based youth leadership platform with online payments and e-invoicing. Strong in React and
TypeScript, with back-end experience in Node.js, Go, PostgreSQL and REST APIs.

#section("Experience")

#entry("Software Developer (Front-end Team Lead)", "Ministry of Interior (Türkiye)", "Ankara", "Dec 2022 – Present")
- Lead a team of 4 front-end developers: project planning, code review, technical decisions and mentoring across multiple enterprise applications.
- Designed and built the complete React front-end architecture of the Ministry's authorization management system (Java Spring Boot back-end), which handles permission requests, approvals, statistics and reporting for administrative offices nationwide; contributed to back-end development and API integration.
- Cut CI/CD pipeline build times by 75% by moving builds to Vite; led the migration from JavaScript to TypeScript across multiple projects.
- Maintain the centralized authentication service (JWT, OAuth 2.0) that issues tokens for all applications in the organization.
- Maintain a nationwide analytics platform used by government agencies in all 81 provinces, focusing on reliability and performance.
- Built a schema-driven data querying application from scratch (React 19, TypeScript, TanStack Router/Query/Table): entity and field definitions generate forms automatically, enabling relational analysis, filterable reports and charts on nationwide administrative data.
- Built an enterprise video-conferencing solution on Jitsi Meet with LDAP login, scheduled meetings, RFC 5545 ICS email invitations, multi-channel reminders (email, push, in-app) and Turkish localization.
- Delivered a self-hosted generative AI chat platform by extending Open WebUI (SvelteKit) with role-based access control (RBAC), retrieval-augmented generation (RAG) and on-premise LLM integration.
- Built personnel attendance/timesheet and shift-roster scheduling applications (React 19, TypeScript, TanStack, Tailwind CSS, shadcn/ui) with advanced data tables, reporting and multi-sheet PDF export (jsPDF).
- Built an audio transcription and translation tool for archival recordings with waveform segment editing, voice activity detection, multi-user soft locking and JSONL/CSV/Hugging Face export (Zustand, TanStack Query).
- Contributed the Turkish localization of Apache Answer (open source) and deployed it as the organization's internal knowledge base; built a photo upload and processing application.
- Directed or mentored 4 more internal applications: visitor management, hotel management, internal audit and procurement.
- Standardized front-end components to institutional UI/UX guidelines and introduced structured code review and documentation practices.

#entry("Freelance Full-stack Developer", "Self-employed (aburakt.com)", "Ankara", "2025 – Present")
- Built a reusable website platform (Astro, PocketBase, TypeScript, Bun) and used it to deliver 17 client websites, 11 in production: ebsbilgisayar.com, jciankara.com, expertup.com.tr, yucelplast.com, astop.org.tr, arolatmotors.com, mervekaderli.com, fibroteknoloji.com, dfcturkiye.org, yibder.org, rlaglobal.com.tr.
- Shared core is versioned with a SHA-256 lock file; a weekly GitHub Actions job opens update pull requests in every client repository.
- Automated quality gates on every build: accessibility (WCAG basics: lang, alt text, heading order, labels), performance budget of 150 KB gzip per page, strict Content Security Policy (no inline script or style), SEO and JSON-LD structured data, responsive layout tests at many widths.
- CI/CD with GitHub Actions and Cloudflare Pages; back-end deploys over SSH with backup, health check and automatic rollback. Self-hosted on Hetzner VPS (Linux, Caddy, systemd) with nightly offsite backups and monthly restore tests.
- Error tracking and uptime monitoring with GlitchTip (Sentry compatible); alerts flow through n8n to an AI agent that opens fix pull requests automatically.
- E-commerce modules with iyzico and Shopier payments (server-side price and stock checks, signature verification), multilingual sites (i18n, hreflang), KVKK compliant forms and a Turkish, role-restricted admin panel for clients.

#entry("Web Developer", "EBS Computer Systems & IT", "Ankara", "Mar 2019 – Jan 2022")
- Built responsive websites with HTML, CSS and JavaScript; developed and maintained PHP and WordPress sites.
- Managed SQL databases and wrote reporting queries and rules for accounting software (Logo) workflows.

#entry("Intern", "EGO General Directorate; PRO-DAY Software & IT; Halkbank", "Ankara", "2013 – 2016")
- Software development and ERP internships: web development with HTML, CSS, JavaScript and Git in a 25-person software company; ERP rollout in the public sector.

#section("Projects")

#entry("RLA Act: Youth Leadership Platform", "Rising Leaders Academy (freelance)", "", "2026 – Present")
- Full-stack platform where students complete tasks and upload evidence, mentors review, and points, hours, certificates and grant applications are managed (roles: child, parent, mentor, admin).
- Migrated production from Supabase to Go with embedded PocketBase and a React SPA; integrated QNB virtual POS (3D Secure), Uyumsoft e-Archive invoicing (SOAP), asynchronous PDF certificate generation and Resend email.

#entry("DermaCep: Tele-dermatology Platform", "Freelance", "", "2025 – Present")
- Cross-platform app (iOS/Android with Expo and React Native, web with React) for remote patient and dermatologist consultations: Jitsi video calls, photo uploads, real-time messaging (Supabase), Face ID/Touch ID, payments and scheduling.
- Back-end with Fastify, Prisma and PostgreSQL using tRPC end-to-end type safety, e-prescription (ICD-10) support and KVKK compliant audit logging.
- Prepared the compliance package (USBS, KVKK), obtained Ministry of Health approval and passed ISO/IEC 27001 and SPICE (ISO/IEC 15504) Level 2 audits.

#entry("kacadolar.com: EV Charging Cost Comparison", "Personal product", "", "2026 – Present")
- Catalog and charging cost calculator for every electric car sold in Türkiye: Next.js static export on Cloudflare Workers, data pipelines in GitHub Actions (daily tariff tracking, weekly EPDK station sync), Telegram bot for review moderation, WebMCP tools for AI agents.

#section("Skills")
*Languages:* TypeScript, JavaScript, Go, SQL, HTML, CSS, PHP, Python \
*Front-end and Mobile:* React (React 19), Next.js, Astro, Vue.js, Svelte / SvelteKit, React Native, Expo, Electron \
*State, Data and Forms:* TanStack (Query, Router, Table, Form), Redux, Zustand, Recoil, tRPC, Zod, React Hook Form \
*UI and Styling:* Tailwind CSS, shadcn/ui, Radix UI, Material UI, PrimeReact, Bootstrap, Styled Components, Figma \
*Back-end and Databases:* Node.js, Fastify, Express.js, Go, PocketBase, REST APIs, Java Spring Boot (API integration), PostgreSQL, Prisma, Supabase, SQLite \
*Security and Auth:* JWT, OAuth 2.0, LDAP, RBAC, Content Security Policy, KVKK, ISO/IEC 27001 \
*DevOps and Cloud:* Git, GitHub Actions, CI/CD, Docker, AWS, Cloudflare (Pages, Workers), Linux, Caddy, systemd, Hetzner, Vite, Bun \
*Testing and Quality:* Jest, Vitest, Bun test, MSW, accessibility audits, performance budgets, Biome, oxlint \
*Practices:* Agile / Scrum, code review, mentoring, technical documentation \
*AI:* RAG, on-premise LLM integration, Open WebUI, AI-assisted development (Claude Code), n8n automation

#section("Education")
#entry("BS, Management Information Systems", "Anadolu University", "", "Sep 2018 – Aug 2026")
#entry("Associate Degree, Computer Programming", "Ankara University", "", "Sep 2014 – May 2016")

#section("Certifications")
- Data Analysis School (Veri Analizi Okulu), Council of Higher Education (YÖK), Oct 2025 – Jun 2026
- Cisco: CyberOps Associate (Feb 2022), CCNA: Introduction to Networks (Jan 2022), Introduction to Cybersecurity (Dec 2021)
- Web Design and Coding Certificate Program, Anadolu University (May 2021); Git Training, Akdeniz University (Apr 2021)
- Akbank: Metaverse 101, Innovation and Entrepreneurship 101, Analytics 101 (Mar 2021)

#section("Languages")
Turkish (native), English (professional working proficiency)

#section("Volunteer Experience")
#entry("Secretary General; Board Member (Digital Platforms, Growth and Development)", "JCI Ankara", "", "2022 – 2025")
#entry("Development Council Officer (Outreach and Engagement; Impact and Promotion)", "JCI Europe", "", "2024 – 2025")
#entry("Youth Ambassador", "İYADER", "", "2021")
