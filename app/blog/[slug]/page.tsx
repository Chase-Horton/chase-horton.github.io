import path from "node:path";
import fs from "node:fs";
import type { Metadata } from "next";



export default async function BlogPage({
    params,
    }: {
    params: Promise<{ slug: string }> }
) {

    const { slug } = await params;
    const { default: Post } = await import(`@/content/posts/${slug}.mdx`)

    return <Post />
}

// Generate static paths for all slugs based on MDX files in the posts directory
export async function generateStaticParams() {
    const files = fs.readdirSync(path.join("content", "posts"));
    const params = files
        .filter((filename) => filename.endsWith(".mdx")) // Only process MDX files
        .map((filename) => ({
            slug: filename.replace(".mdx", ""),
        }));

    return params;
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    console.log("Generating metadata for slug:", slug);
    try {
        const {frontmatter} = await import(`@/content/posts/${slug}.mdx`);
        //console.log(postModule)
        return {
            title: frontmatter.title,
            description: frontmatter.description,
        };
    } catch (error) {
        return {
            title: "Post Not Found",
            description: "",
        };
    }
}
export const dynamicParams = false;   