import { getCollection } from "astro:content";
import { GROUP_LABEL, GROUPS, PROJECTS, projectPath } from "@/data/portfolio";
import en from "@/i18n/en.json";
import { articleSlug } from "@/lib/articles";
import { projectMarkdown } from "@/lib/portfolio";

const SITE = "https://aburakt.com";
const CV = `${SITE}/cv/Ahmet_Burak_Tekin_CV.v2026-11.pdf`;

const header = [
  "# Ahmet Burak Tekin",
  "",
  "> Full-stack developer in Ankara, Türkiye. Software Developer (Front-end Team Lead) at the Ministry of Interior since Dec 2022, leading a team of 4 front-end developers. Freelance full-stack developer since 2025: web applications (the RLA Act youth leadership platform on Go + PocketBase + React, the DermaCep telemedicine platform, kacadolar.com), a shared Astro + PocketBase platform behind 17 client websites (11 in production), and open-source tools (redline, gobag.nvim). Main stack: React, TypeScript, Node.js, Go, PostgreSQL, PocketBase, Astro.",
  "",
  "The site is bilingual: Turkish pages have no prefix, English pages live under /en/. Contact: info@aburakt.com, https://www.linkedin.com/in/aburakt, https://github.com/aburakt.",
  "",
];

async function articleLines() {
  const articles = (await getCollection("articles")).sort((a, b) => b.data.date.localeCompare(a.data.date));
  return articles.map((a) => `- [${a.data.title}](${SITE}/en/articles/${articleSlug(a.id)}/): ${a.data.description}`);
}

export async function llmsTxt(): Promise<string> {
  return [
    ...header,
    "## Pages",
    "",
    `- [Home](${SITE}/en/): profile, Ministry projects, experience, skills`,
    `- [About](${SITE}/en/about/): background and focus`,
    `- [Portfolio](${SITE}/en/portfolio/): freelance projects with screenshots and development notes`,
    `- [CV (PDF)](${CV}): ATS-friendly CV`,
    `- [Full text for LLMs](${SITE}/llms-full.txt): about text and every portfolio project in one file`,
    "",
    "## Portfolio",
    "",
    ...GROUPS.flatMap((g) => [
      `### ${GROUP_LABEL.en[g]}`,
      "",
      ...PROJECTS.filter((p) => p.group === g).map(
        (p) => `- [${p.name}](${SITE}${projectPath("en", p.slug).replace(/\/$/, "")}.md): ${p.en.summary}`,
      ),
      "",
    ]),
    "## Articles",
    "",
    ...(await articleLines()),
    "",
  ].join("\n");
}

export async function llmsFullTxt(): Promise<string> {
  const a = en.about;
  return [
    ...header,
    "## About",
    "",
    a.title,
    "",
    a.p1,
    "",
    a.p2,
    "",
    a.p3,
    "",
    a.p4,
    "",
    a.p5,
    "",
    `CV: ${CV}`,
    "",
    "## Portfolio",
    "",
    ...PROJECTS.map((p) => projectMarkdown(p, "en").replace(/^# /, "### ").replace(/^## /gm, "#### ")),
    "## Articles",
    "",
    ...(await articleLines()),
    "",
  ].join("\n");
}
