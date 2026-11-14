// Content-collection ids keep the file extension ("foo.md"); URLs and labels must not.
export const articleSlug = (id: string) => id.replace(/\.mdx?$/, "");
