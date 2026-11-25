export interface FreelanceProject {
  name: string;
  desc: string;
  url?: string;
  stack: string;
}

/** Serbest çalışma işleri: ana sayfadaki ~/freelance/ listesi (TR ve EN aynı veri). */
export const FREELANCE: FreelanceProject[] = [
  {
    name: "astro-pb-platform",
    desc: "Shared website platform behind every client site: versioned core, weekly sync PRs, a11y/performance/CSP gates, auto-rollback deploys",
    stack: "Astro · PocketBase · Bun · GitHub Actions",
  },
  {
    name: "rla-act",
    desc: "Youth leadership platform: tasks, mentor reviews, certificates, QNB 3D Secure payments and e-Archive invoicing",
    stack: "Go · PocketBase · React",
  },
  {
    name: "kacadolar",
    desc: "EV catalog and charging cost calculator for Türkiye with daily tariff tracking",
    url: "https://kacadolar.com",
    stack: "Next.js · Cloudflare Workers",
  },
  {
    name: "ebsbilgisayar",
    desc: "Logo software partner site with hourly campaign sync and digital business cards",
    url: "https://www.ebsbilgisayar.com",
    stack: "Astro · PocketBase",
  },
  {
    name: "arolatmotors",
    desc: "CFMOTO dealer: models, service and quote forms",
    url: "https://www.arolatmotors.com",
    stack: "Astro · PocketBase",
  },
  {
    name: "yucelplast",
    desc: "Manufacturer catalog with product groups and quote form",
    url: "https://www.yucelplast.com",
    stack: "Astro · PocketBase",
  },
  {
    name: "mervekaderli",
    desc: "Ceramics studio site with online shop",
    url: "https://www.mervekaderli.com",
    stack: "Astro · PocketBase · Shopier",
  },
  {
    name: "fibroteknoloji",
    desc: "Corporate site with product pages and forms",
    url: "https://www.fibroteknoloji.com",
    stack: "Astro · PocketBase",
  },
  {
    name: "astop",
    desc: "Ankara Civil Society Organizations Platform: news and member organizations",
    url: "https://www.astop.org.tr",
    stack: "Astro · PocketBase",
  },
  {
    name: "jciankara",
    desc: "JCI Ankara: events, board and summit pages",
    url: "https://jciankara.com",
    stack: "Astro · PocketBase",
  },
  {
    name: "expertup",
    desc: "Bilingual agency website with contact pipeline",
    url: "https://expertup.com.tr",
    stack: "Astro · PocketBase",
  },
  {
    name: "dfcturkiye",
    desc: "Design for Change Türkiye program website",
    url: "https://dfcturkiye.org",
    stack: "Astro · PocketBase",
  },
  {
    name: "yibder",
    desc: "Yarın İçin Bugün Derneği (YİBDER) website",
    url: "https://yibder.org",
    stack: "Astro · PocketBase",
  },
  {
    name: "rlaglobal",
    desc: "Rising Leaders Academy website",
    url: "https://rlaglobal.com.tr",
    stack: "Astro · PocketBase",
  },
];
