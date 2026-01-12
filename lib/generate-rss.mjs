import fs from "fs";
import path from "path";
import { Feed } from "feed";
import matter from "gray-matter";
import { parseHTML } from "linkedom";

function getPosts() {
  const files = fs.readdirSync(path.join("content", "posts"));

  return files
    .filter((f) => f.endsWith(".mdx"))
    .map((filename) => {
      const slug = filename.replace(".mdx", "");
      const raw = fs.readFileSync(path.join("content", "posts", filename), "utf-8");
      const { data } = matter(raw);

      return {
        slug,
        title: data.title,
        description: data.description,
        date: data.date,
        isPublished: data.isPublished ?? true,
      };
    })
    .filter((post) => post.isPublished)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

const posts = getPosts();

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

for (const post of posts) {
  const html = fs.readFileSync(`./dist/blog/${post.slug}.html`, "utf-8");
  const { document } = parseHTML(html);
  const content = document.querySelector("main")?.innerHTML;

  feed.addItem({
    title: post.title,
    description: post.description,
    content,
    date: new Date(post.date),
    link: `https://chase-horton.com/blog/${post.slug}`,
    id: `https://chase-horton.com/blog/${post.slug}`,
  });
}

fs.writeFileSync("./dist/rss.xml", feed.rss2());
console.log("RSS generated");