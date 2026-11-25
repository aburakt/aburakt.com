import type { APIRoute } from "astro";
import { PROJECTS, type Project } from "@/data/portfolio";
import { projectMarkdown } from "@/lib/portfolio";

export function getStaticPaths() {
  return PROJECTS.map((project) => ({ params: { slug: project.slug }, props: { project } }));
}

export const GET: APIRoute = ({ props }) =>
  new Response(projectMarkdown((props as { project: Project }).project, "en"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
