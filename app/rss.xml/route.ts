export const dynamic = "force-static";
export const revalidate = 1;

import { Feed } from "feed";
import { getPosts } from "@/lib/server";

const feed = new Feed({
    title: "Chase Horton's Blog",
    description: "Writing about programming, tools, and things I find interesting.",
    id: "https://chase-horton.com/",
    link: "https://chase-horton.com/",
    language: "en-US",
    copyright: `All rights reserved ${new Date().getFullYear()}, Chase Horton`,

    updated: new Date(),
    author: {
        name: "Chase Horton",
        email: "chasehortonj@gmail.com",
        link: "https://chase-horton.com/",
    },
});


export async function GET() {
    let headers = {
        "Content-Type": "application/xml; charset=utf-8",
    };
    const posts = await getPosts();
    console.log(`Generating RSS feed with ${posts.length} posts.`);
    posts.forEach((post) => {
        const postUrl = `https://chase-horton.com/blog/${post.slug}`;
        feed.addItem({
            title: post.title,
            id: postUrl,
            link: postUrl,
            description: post.description,
            content: post.md_content,
            date: new Date(post.date + "T00:00:00"),
        });
    });
    console.log("RSS feed generated.");
    console.log(feed);
    return new Response(feed.rss2(), {
        headers,
    });
}