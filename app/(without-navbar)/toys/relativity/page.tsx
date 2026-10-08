import Link from "next/link";
import { chapterHref, chapters } from "./_components/chapters";

export default function RelativityHub() {
    return (
        <div className="pt-20">
            <p className="font-mono text-sm text-[#00D9FF] animate-blur-in">an interactive walkthrough</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight md:text-6xl animate-blur-in" style={{ animationDelay: "120ms" }}>
                relativity, <span className="text-muted-foreground">from the ground up</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground animate-blur-in" style={{ animationDelay: "240ms" }}>
                Special relativity has a reputation for paradoxes. Most of them dissolve once you can <em className="text-foreground">see</em>{" "}
                spacetime: one picture of where and when everything happens, and a precise rule for how different observers
                label it. These chapters build that picture one idea at a time. Every diagram is live: drag it, slide it, and
                switch whose eyes you&apos;re looking through.
            </p>

            <ol className="mt-14 grid gap-4 md:grid-cols-2">
                {chapters.map((c, i) => (
                    <li key={c.slug} className="animate-blur-in" style={{ animationDelay: `${360 + i * 90}ms` }}>
                        <Link
                            href={chapterHref(c)}
                            className="group flex h-full gap-5 rounded-2xl border border-border bg-white/[0.015] p-6 transition-all hover:-translate-y-0.5 hover:border-[#00D9FF]/50 hover:shadow-[0_0_40px_-20px_rgba(0,217,255,0.6)]"
                        >
                            <span className="font-mono text-3xl text-[#00D9FF]/50 transition-colors group-hover:text-[#00D9FF]">{i + 1}</span>
                            <span>
                                <span className="block text-lg font-medium text-foreground">{c.title}</span>
                                <span className="mt-1 block text-sm leading-6 text-muted-foreground">{c.blurb}</span>
                            </span>
                        </Link>
                    </li>
                ))}
                <li className="animate-blur-in" style={{ animationDelay: `${360 + chapters.length * 90}ms` }}>
                    <div className="flex h-full gap-5 rounded-2xl border border-dashed border-border p-6 opacity-60">
                        <span className="font-mono text-3xl text-muted-foreground">6</span>
                        <span>
                            <span className="block text-lg font-medium">the lorentz transformation</span>
                            <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                                coming soon: rotations in spacetime, the invariant interval, and the end of absolute time.
                            </span>
                        </span>
                    </div>
                </li>
            </ol>

            <p className="mt-14 max-w-2xl font-mono text-xs leading-6 text-muted-foreground">
                prefer a lecture? the{" "}
                <Link href="/manim" className="text-blue-400 hover:underline">
                    animated slides
                </Link>{" "}
                cover the same ground at presentation speed.
            </p>
        </div>
    );
}
