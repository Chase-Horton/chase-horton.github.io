import path from "node:path";
import fs from "node:fs";

interface PostMeta {
    slug: string;
    title: string;
    description: string;
    date: string;
    tag: string;
    isPublished: boolean;
    md_content: string;
}

export async function getPosts(): Promise<PostMeta[]> {
    const files = fs.readdirSync(path.join("content", "posts"));
    
    const posts = await Promise.all(
        files
            .filter((filename) => filename.endsWith(".mdx"))
            .map(async (filename) => {
                const slug = filename.replace(".mdx", "");
                const filePath = path.join(process.cwd(), "content", "posts", filename);
                const rawContent = fs.readFileSync(filePath, "utf-8");
                // Remove frontmatter (--- ... ---) from the top
                const mdContent = rawContent.replace(/^---[\s\S]*?---\s*/, "");
                const { frontmatter } = await import(`@/content/posts/${slug}.mdx`);
                return {
                    slug,
                    title: frontmatter.title,
                    description: frontmatter.description,
                    date: frontmatter.date,
                    tag: frontmatter.tag,
                    isPublished: frontmatter.isPublished ?? true,
                    md_content: mdContent,
                };
            })
    );

    return posts
        .filter((post) => post.isPublished)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}