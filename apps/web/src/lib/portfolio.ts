import { KIND_LABEL, type Locale, PROJECTS, type Project, projectPath } from "@/data/portfolio";

const SITE = "https://aburakt.com";

export const UI = {
  tr: {
    title: "Portfolyo",
    description:
      "Ahmet Burak Tekin’in serbest çalışma projeleri: Astro + PocketBase müşteri siteleri, RLA Act platformu ve kacadolar.com. Ekran görüntüleri ve geliştirme detaylarıyla.",
    intro:
      "2025’ten beri serbest çalışan full-stack geliştirici olarak kurduğum ve işlettiğim projeler. Müşteri sitelerinin hepsi aynı ortak platformda; her biri erişilebilirlik, performans ve güvenlik kontrollerinden geçmeden yayına çıkmıyor.",
    stats: (live: number, total: number) => `${total} proje · ${live} canlı adres`,
    open: "detaylar",
    client: "Müşteri",
    year: "Yıl",
    type: "Tür",
    stack: "Teknolojiler",
    live: "Canlı site",
    challenge: "İhtiyaç",
    build: "Nasıl geliştirildi",
    features: "Öne çıkanlar",
    platformNote:
      "Bu site ortak Astro + PocketBase platformu üzerinde çalışıyor: Türkçe panel, haftalık çekirdek güncellemesi, erişilebilirlik ve performans kontrolleri, geri alınabilen dağıtım.",
    platformLink: "Platformun detayları",
    desktop: "masaüstü görünümü",
    mobile: "telefon görünümü",
    diagram: "mimari özeti",
    prev: "Önceki",
    next: "Sonraki",
    back: "Bütün projeler",
    home: "Ana Sayfa",
    ministryNote: "İçişleri Bakanlığı’ndaki kurumsal projeler ana sayfadaki proje listesinde.",
  },
  en: {
    title: "Portfolio",
    description:
      "Freelance projects by Ahmet Burak Tekin: Astro + PocketBase client sites, the RLA Act platform and kacadolar.com, with screenshots and development notes.",
    intro:
      "Projects I have built and run as a freelance full-stack developer since 2025. All client sites share one platform, and none goes live without passing accessibility, performance and security checks.",
    stats: (live: number, total: number) => `${total} projects · ${live} live sites`,
    open: "details",
    client: "Client",
    year: "Year",
    type: "Type",
    stack: "Stack",
    live: "Live site",
    challenge: "The need",
    build: "How it was built",
    features: "Highlights",
    platformNote:
      "This site runs on the shared Astro + PocketBase platform: Turkish admin panel, weekly core updates, accessibility and performance checks, deploys that roll back on failure.",
    platformLink: "Platform details",
    desktop: "desktop view",
    mobile: "phone view",
    diagram: "architecture summary",
    prev: "Previous",
    next: "Next",
    back: "All projects",
    home: "Home",
    ministryNote: "Enterprise projects at the Ministry of Interior are listed on the home page.",
  },
} as const;

/** Inline `code` in the data is plain text on the page; strip the backticks. */
export const plain = (s: string) => s.replace(/`/g, "");

export const imageUrl = (p: Project, mobile = false) => `/images/portfolio/${p.image}${mobile ? "-m" : ""}.webp`;

export const liveCount = PROJECTS.filter((p) => p.url).length;

export function neighbours(slug: string) {
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? PROJECTS[i - 1] : undefined,
    next: i < PROJECTS.length - 1 ? PROJECTS[i + 1] : undefined,
  };
}

export function indexJsonLd(locale: Locale) {
  const ui = UI[locale];
  const url = SITE + projectPath(locale);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#page`,
    url,
    name: ui.title,
    description: ui.description,
    inLanguage: locale === "en" ? "en-US" : "tr-TR",
    author: { "@id": `${SITE}/#person` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: PROJECTS.length,
      itemListElement: PROJECTS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: SITE + projectPath(locale, p.slug),
        name: p.name,
      })),
    },
  };
}

export function projectJsonLd(p: Project, locale: Locale) {
  const ui = UI[locale];
  const url = SITE + projectPath(locale, p.slug);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        url,
        name: p.name,
        headline: `${p.name}: ${p[locale].summary}`,
        description: p[locale].summary,
        image: SITE + imageUrl(p),
        dateCreated: p.year,
        inLanguage: locale === "en" ? "en-US" : "tr-TR",
        genre: KIND_LABEL[locale][p.kind],
        keywords: p.stack.join(", "),
        creator: { "@type": "Person", "@id": `${SITE}/#person`, name: "Ahmet Burak Tekin", url: `${SITE}/` },
        ...(p.kind === "client"
          ? { sourceOrganization: { "@type": "Organization", name: p.client, ...(p.url ? { url: p.url } : {}) } }
          : {}),
        ...(p.url ? { sameAs: p.url } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: ui.home, item: SITE + (locale === "en" ? "/en/" : "/") },
          { "@type": "ListItem", position: 2, name: ui.title, item: SITE + projectPath(locale) },
          { "@type": "ListItem", position: 3, name: p.name, item: url },
        ],
      },
    ],
  };
}

/** Markdown twin of a project page (for llms-full.txt and /portfolio/<slug>.md). */
export function projectMarkdown(p: Project, locale: Locale): string {
  const ui = UI[locale];
  const t = p[locale];
  const lines = [
    `# ${p.name}`,
    "",
    `> ${t.summary}`,
    "",
    `- ${ui.client}: ${p.client}`,
    `- ${ui.year}: ${p.year}`,
    `- ${ui.type}: ${KIND_LABEL[locale][p.kind]}`,
    `- ${ui.stack}: ${p.stack.join(", ")}`,
    ...(p.url ? [`- ${ui.live}: ${p.url}`] : []),
    `- URL: ${SITE}${projectPath(locale, p.slug)}`,
    "",
    `## ${ui.challenge}`,
    "",
    t.challenge,
    "",
    `## ${ui.build}`,
    "",
    ...t.build.map((b) => `- ${b}`),
    "",
    `## ${ui.features}`,
    "",
    ...t.features.map((f) => `- ${f}`),
    "",
  ];
  if (p.platform) lines.push(ui.platformNote, "");
  return lines.join("\n");
}
