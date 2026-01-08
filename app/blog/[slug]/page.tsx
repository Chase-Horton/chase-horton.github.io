import path from "node:path";
import fs from "node:fs";
import type { Metadata } from "next";
import "highlight.js/styles/github-dark.css";
import { TableOfContents } from "@/components/table-of-contents";

export default async function BlogPage({
    params,
    }: {
    params: Promise<{ slug: string }> }
) {

    const { slug } = await params;
    const postModule = await import(`@/content/posts/${slug}.mdx`);
    const { default: Post, frontmatter } = postModule;

    return (
    <div className="min-h-screen relative pt-16">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-6">
          <span className="text-[#00D9FF] text-sm font-medium uppercase tracking-wider">{frontmatter.tag}</span>
        </div>
        <Post />
      </div>
      
      {/* Right sidebar - Table of Contents */}
      <aside className="hidden lg:block fixed top-24 right-8 w-64">
        <TableOfContents />
      </aside>
    </div>
    );
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