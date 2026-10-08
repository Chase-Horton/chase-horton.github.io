"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BASE, chapterHref, chapters } from "./chapters";

function useChapterIndex() {
    const path = (usePathname() ?? "").replace(/\/$/, "");
    return chapters.findIndex((c) => path === chapterHref(c));
}

export function ChapterChrome({ children }: { children: ReactNode }) {
    const idx = useChapterIndex();
    const prev = idx > 0 ? chapters[idx - 1] : null;
    const next = idx >= 0 && idx < chapters.length - 1 ? chapters[idx + 1] : null;

    return (
        <div className="relative min-h-screen font-sans">
            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 -z-10 opacity-60"
                style={{
                    background:
                        "radial-gradient(900px 500px at 15% -10%, rgba(0,217,255,0.08), transparent 60%), radial-gradient(700px 500px at 100% 0%, rgba(245,185,66,0.05), transparent 60%)",
                }}
            />
            <nav className="sticky top-0 z-20 border-b border-border bg-background/70 backdrop-blur-md">
                <div className="mx-auto flex h-12 max-w-5xl items-center justify-between gap-4 px-4 md:px-6">
                    <div className="flex items-center gap-3 font-mono text-sm">
                        <Link href="/toys" className="text-muted-foreground transition-colors hover:text-foreground">
                            ← toys
                        </Link>
                        <span className="hidden text-border sm:inline">/</span>
                        <Link href={BASE} className={cn("hidden transition-colors hover:text-foreground sm:inline", idx === -1 ? "text-foreground" : "text-muted-foreground")}>
                            relativity_interactive
                        </Link>
                    </div>
                    <ol className="flex items-center gap-1.5">
                        {chapters.map((c, i) => (
                            <li key={c.slug}>
                                <Link
                                    href={chapterHref(c)}
                                    title={`${i + 1}. ${c.title}`}
                                    aria-current={i === idx ? "page" : undefined}
                                    className={cn(
                                        "flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[11px] transition-all",
                                        i === idx
                                            ? "border-[#00D9FF] bg-[#00D9FF]/15 text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.5)]"
                                            : i < idx
                                              ? "border-[#00D9FF]/40 text-[#00D9FF]/70 hover:border-[#00D9FF]"
                                              : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                                    )}
                                >
                                    {i + 1}
                                </Link>
                            </li>
                        ))}
                    </ol>
                </div>
            </nav>

            <main className="mx-auto max-w-5xl px-4 pb-24 md:px-6">{children}</main>

            {idx >= 0 && (
                <footer className="mx-auto grid max-w-5xl gap-4 px-4 pb-20 md:grid-cols-2 md:px-6">
                    {prev ? (
                        <Link href={chapterHref(prev)} className="group rounded-xl border border-border p-5 transition-colors hover:border-foreground/30">
                            <div className="font-mono text-xs text-muted-foreground">← chapter {idx}</div>
                            <div className="mt-1 text-foreground group-hover:text-[#00D9FF]">{prev.title}</div>
                        </Link>
                    ) : (
                        <Link href={BASE} className="group rounded-xl border border-border p-5 transition-colors hover:border-foreground/30">
                            <div className="font-mono text-xs text-muted-foreground">← overview</div>
                            <div className="mt-1 text-foreground group-hover:text-[#00D9FF]">all chapters</div>
                        </Link>
                    )}
                    {next ? (
                        <Link href={chapterHref(next)} className="group rounded-xl border border-[#00D9FF]/30 bg-[#00D9FF]/[0.04] p-5 text-right transition-colors hover:border-[#00D9FF]/70">
                            <div className="font-mono text-xs text-[#00D9FF]/80">chapter {idx + 2} →</div>
                            <div className="mt-1 text-foreground group-hover:text-[#00D9FF]">{next.title}</div>
                        </Link>
                    ) : (
                        <div className="rounded-xl border border-dashed border-border p-5 text-right">
                            <div className="font-mono text-xs text-muted-foreground">chapter 6</div>
                            <div className="mt-1 text-muted-foreground">the lorentz transformation, coming soon</div>
                        </div>
                    )}
                </footer>
            )}
        </div>
    );
}
