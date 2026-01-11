import type { MDXComponents } from "mdx/types";
import { ReactNode } from "react";
//import {Note} from "@/components/mdx/note";

function slugify(text: ReactNode): string {
  if (typeof text !== "string") {
    if (Array.isArray(text)) {
      return text.map(slugify).join("");
    }
    if (text && typeof text === "object" && "props" in text) {
      return slugify((text as { props: { children: ReactNode } }).props.children);
    }
    return String(text || "");
  }
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: (props) => {
      const id = slugify(props.children);
      return <h1 id={id} className="mb-12 text-5xl font-bold leading-tight tracking-tight text-balance lg:text-6xl" {...props} />;
    },
    pre: (props) => <pre className="rounded-lg overflow-hidden mb-6" {...props} />,
    code: (props) => <code className="rounded bg-muted px-1.5 py-0.5" {...props} />,
    h2: (props) => {
      const id = slugify(props.children);
      return <h2 id={id} className="mb-8 mt-14 text-4xl font-bold tracking-tight scroll-mt-24" {...props} />;
    },
    h3: (props) => {
      const id = slugify(props.children);
      return <h3 id={id} className="mb-6 mt-6 text-2xl font-bold tracking-tight scroll-mt-24" {...props} />;
    },
    h4: (props) => {
      const id = slugify(props.children);
      return <h4 id={id} className="mb-3 mt-6 text-2xl font-bold tracking-tight scroll-mt-24 text-muted-foreground" {...props} />;
    },
    p: (props) => { return (
      <p className="mb-6 text-lg leading-relaxed text-muted-foreground" {...props} />
    ); },
    strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
    em: (props) => <em className="text-muted-foreground" {...props} />,
    li: (props) => <li className="text-lg leading-relaxed text-muted-foreground [&>ul]:mt-2 [&>ul]:mb-0 [&>ol]:mt-2 [&>ol]:mb-0" {...props} />,
    ul: (props) => <ul className="mb-6 ml-6 space-y-2 list-disc marker:text-[#00D9FF] [&_ul]:list-[circle] [&_ul_ul]:list-[square]" {...props} />,
    ol: (props) => <ol className="mb-6 ml-6 space-y-2 list-decimal marker:text-[#00D9FF]" {...props} />,
    a: (props) => <a className="text-[#00D9FF] font-medium hover:underline" {...props} />,
    img: (props) => <img className="rounded-lg mb-6 w-full" {...props} />,
    blockquote: (props) => (
      <blockquote className="italic text-muted-foreground border-l-4 border-[#ad9407] pl-4 " {...props} />
    ),
    //Note,
  };
}
