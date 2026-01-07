import type { Metadata } from "next";
import { BlogContent } from "@/components/blog-content";
import { getPosts } from "@/lib/server";

export const metadata: Metadata = {
    title: "Blog",
    description: "Thoughts on programming, technology, and more.",
};



export default async function BlogPage() {
    const posts = await getPosts();

    return (
        <div className="min-h-screen">
            <BlogContent posts={posts} />
        </div>
    );
}
