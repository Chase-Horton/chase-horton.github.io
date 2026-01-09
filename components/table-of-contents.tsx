"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // find all headings with ids in the article
    const elements = document.querySelectorAll("h1[id], h2[id], h3[id]");
    const items: TOCItem[] = Array.from(elements).map((element) => ({
      id: element.id,
      text: element.textContent || "",
      level: parseInt(element.tagName[1]),
    }));
    setHeadings(items);

    // set up intersection observer for active heading tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
        On this page
      </h4>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}
          >
            <a
              href={`#${heading.id}`}
              className={cn(
                "block py-1 text-muted-foreground transition-colors hover:text-foreground",
                activeId === heading.id && "text-[#00D9FF] font-medium"
              )}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
