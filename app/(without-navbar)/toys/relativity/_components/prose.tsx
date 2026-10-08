import type { ReactNode } from "react";

export function ChapterHeader({ n, title, lede }: { n: number; title: string; lede: ReactNode }) {
    return (
        <header className="pt-16 pb-6">
            <p className="font-mono text-sm text-[#00D9FF] animate-blur-in">chapter {n}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl animate-blur-in" style={{ animationDelay: "120ms" }}>
                {title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground animate-blur-in" style={{ animationDelay: "240ms" }}>
                {lede}
            </p>
        </header>
    );
}

export function Prose({ children }: { children: ReactNode }) {
    return <div className="max-w-2xl space-y-5 text-[16px] leading-7 text-foreground/90 [&_em]:text-foreground [&_strong]:text-foreground">{children}</div>;
}

export function H2({ children }: { children: ReactNode }) {
    return <h2 className="pt-10 text-2xl font-semibold tracking-tight text-foreground">{children}</h2>;
}

/** A numbered key idea. These are the takeaways of each chapter. */
export function KeyPoint({ n, title, children }: { n: number; title: ReactNode; children: ReactNode }) {
    return (
        <div className="relative my-8 max-w-2xl rounded-xl border border-[#00D9FF]/20 bg-[#00D9FF]/[0.04] py-4 pl-14 pr-5">
            <span className="absolute left-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-[#00D9FF]/50 font-mono text-xs text-[#00D9FF]">
                {n}
            </span>
            <div className="font-medium text-foreground">{title}</div>
            <div className="mt-1.5 text-[15px] leading-7 text-muted-foreground">{children}</div>
        </div>
    );
}

/** Display equation. */
export function Eq({ children }: { children: ReactNode }) {
    return (
        <div className="my-6 max-w-2xl overflow-x-auto rounded-lg border border-border bg-black/30 px-5 py-4 text-center font-mono text-lg tracking-wide text-foreground">
            {children}
        </div>
    );
}

/** Inline math. */
export function M({ children, c }: { children: ReactNode; c?: string }) {
    return (
        <span className="whitespace-nowrap font-mono text-[0.92em]" style={{ color: c }}>
            {children}
        </span>
    );
}

export function Aside({ children }: { children: ReactNode }) {
    return <div className="my-6 max-w-2xl border-l-2 border-[#ad9407] pl-4 text-[15px] italic leading-7 text-muted-foreground">{children}</div>;
}
