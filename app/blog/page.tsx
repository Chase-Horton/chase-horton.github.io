import type { Metadata } from "next";
import Link from "next/link"
import { TitlePage } from "../../components/title-page"
import { getPosts } from "@/lib/server";

export const metadata: Metadata = {
    title: "Blog",
    description: "Thoughts on programming, technology, and more.",
};

export default async function BlogPage() {
    const posts = await getPosts();

    return (
    <TitlePage title="blog" description="thoughts on programming, and technology.">
      <div className="space-y-6 max-w-3xl">
        {posts.map((post, index) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block group animate-blur-in"
            style={{ animationDelay: `${100 + index * 100}ms` }}
          >
            <article className="p-4 -mx-4 rounded-lg transition-colors hover:bg-white/5 border border-transparent hover:border-blue-400/30">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/20">
                  {post.tag}
                </span>
                <span className="text-muted-foreground text-sm">
                  {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <h2 className="text-lg font-medium text-foreground group-hover:text-blue-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">{post.description}</p>
            </article>
          </Link>
        ))}
      </div>
    </TitlePage>
    );
}