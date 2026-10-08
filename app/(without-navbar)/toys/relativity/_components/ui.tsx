"use client";

import { cn } from "@/lib/utils";
import { useId, type ReactNode, type Ref } from "react";
import { fmt } from "./affine";
import type { Clock } from "./hooks";
import { ALICE, BAD, BOB, GOOD } from "./palette";

export function Figure({ ref, n, title, caption, controls, children, onReset }: {
    ref?: Ref<HTMLElement>;
    n?: string;
    title: string;
    caption?: ReactNode;
    controls?: ReactNode;
    children: ReactNode;
    onReset?: () => void;
}) {
    return (
        <figure
            ref={ref}
            className="my-12 rounded-2xl border border-border bg-white/[0.015] p-4 md:p-6 shadow-[0_0_80px_-40px_rgba(0,217,255,0.25)]"
        >
            <div className="mb-4 flex items-baseline justify-between gap-4">
                <div className="font-mono text-sm">
                    {n && <span className="mr-2 text-[#00D9FF]">{n}</span>}
                    <span className="text-foreground">{title}</span>
                </div>
                {onReset && (
                    <button
                        onClick={onReset}
                        className="rounded px-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#00D9FF]"
                    >
                        ↺ reset
                    </button>
                )}
            </div>
            <div className={cn("grid gap-6", controls && "md:grid-cols-[minmax(0,1fr)_250px]")}>
                <div className="min-w-0 space-y-3">{children}</div>
                {controls && <div className="space-y-5 text-sm">{controls}</div>}
            </div>
            {caption && <figcaption className="mt-4 text-sm leading-6 text-muted-foreground">{caption}</figcaption>}
        </figure>
    );
}

export function Slider({ label, value, min, max, step = 0.01, onChange, format = (v: number) => fmt(v), color = ALICE }: {
    label: ReactNode;
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (v: number) => void;
    format?: (v: number) => string;
    color?: string;
}) {
    const id = useId();
    return (
        <div className="space-y-2">
            <div className="flex items-baseline justify-between font-mono text-xs">
                <label htmlFor={id} className="text-muted-foreground">
                    {label}
                </label>
                <span className="tabular-nums" style={{ color }}>
                    {format(value)}
                </span>
            </div>
            <input
                id={id}
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full cursor-pointer"
                style={{ accentColor: color }}
            />
        </div>
    );
}

export function Segmented<T extends string>({ label, options, value, onChange }: {
    label?: ReactNode;
    options: { value: T; label: ReactNode; color?: string }[];
    value: T;
    onChange: (v: T) => void;
}) {
    return (
        <div className="space-y-2">
            {label && <div className="font-mono text-xs text-muted-foreground">{label}</div>}
            <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-black/30 p-1" role="radiogroup">
                {options.map((o) => {
                    const active = o.value === value;
                    return (
                        <button
                            key={o.value}
                            role="radio"
                            aria-checked={active}
                            onClick={() => onChange(o.value)}
                            className={cn(
                                "flex-1 whitespace-nowrap rounded-md px-2.5 py-1.5 font-mono text-xs transition-all focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#00D9FF]",
                                active ? "bg-white/10 shadow-inner" : "text-muted-foreground hover:text-foreground",
                            )}
                            style={active ? { color: o.color ?? "inherit" } : undefined}
                        >
                            {o.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export type Viewer = "alice" | "bob";

export function FrameSwitch({ value, onChange, labels = ["alice's view", "bob's view"] }: {
    value: Viewer;
    onChange: (v: Viewer) => void;
    labels?: [string, string];
}) {
    return (
        <Segmented
            label="whose coordinates?"
            value={value}
            onChange={onChange}
            options={[
                { value: "alice", label: labels[0], color: ALICE },
                { value: "bob", label: labels[1], color: BOB },
            ]}
        />
    );
}

export function Button({ children, onClick, active, className }: {
    children: ReactNode;
    onClick: () => void;
    active?: boolean;
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "rounded-lg border border-border px-3 py-1.5 font-mono text-xs transition-all hover:bg-white/5 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#00D9FF]",
                active && "border-[#00D9FF]/50 bg-[#00D9FF]/10 text-[#00D9FF]",
                className,
            )}
        >
            {children}
        </button>
    );
}

export function ClockControls({ clock, label = "t" }: { clock: Clock; label?: string }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Button onClick={clock.toggle} className="w-24">
                    {clock.playing ? "❚❚ pause" : "▶ play"}
                </Button>
                <Button onClick={clock.restart} className="px-2.5">
                    ⏮
                </Button>
            </div>
            <Slider label={`scrub ${label}`} value={clock.t} min={0} max={clock.duration} onChange={clock.scrub} color="#e4e4e7" />
        </div>
    );
}

export type ReadoutRow = [label: ReactNode, value: ReactNode, color?: string];

export function Readout({ rows, title }: { rows: ReadoutRow[]; title?: ReactNode }) {
    return (
        <div className="rounded-lg border border-border bg-black/30 p-3 font-mono text-xs">
            {title && <div className="mb-2 text-muted-foreground">{title}</div>}
            <dl className="space-y-1.5">
                {rows.map(([k, v, c], i) => (
                    <div key={i} className="flex items-baseline justify-between gap-3">
                        <dt className="text-muted-foreground">{k}</dt>
                        <dd className="text-right tabular-nums" style={{ color: c }}>
                            {v}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}

export type CompareRow = { label: ReactNode; a: ReactNode; b: ReactNode; same?: boolean | null };

/** Two-column comparison table (alice vs bob) with an invariance verdict per row. */
export function CompareTable({ rows, headers = ["alice", "bob"], colors = [ALICE, BOB] }: {
    rows: CompareRow[];
    headers?: [ReactNode, ReactNode];
    colors?: [string, string];
}) {
    return (
        <div className="overflow-hidden rounded-lg border border-border font-mono text-xs">
            <table className="w-full">
                <thead className="bg-white/[0.03] text-muted-foreground">
                    <tr>
                        <th className="px-3 py-2 text-left font-normal" />
                        <th className="px-3 py-2 text-right font-normal" style={{ color: colors[0] }}>
                            {headers[0]}
                        </th>
                        <th className="px-3 py-2 text-right font-normal" style={{ color: colors[1] }}>
                            {headers[1]}
                        </th>
                        <th className="w-8 px-2 py-2" />
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr
                            key={i}
                            className="border-t border-border transition-colors"
                            style={{ background: r.same == null ? undefined : r.same ? "rgba(74,222,128,0.07)" : "rgba(248,113,113,0.07)" }}
                        >
                            <td className="px-3 py-1.5 text-muted-foreground">{r.label}</td>
                            <td className="px-3 py-1.5 text-right tabular-nums">{r.a}</td>
                            <td className="px-3 py-1.5 text-right tabular-nums">{r.b}</td>
                            <td className="px-2 py-1.5 text-center" style={{ color: r.same ? GOOD : BAD }}>
                                {r.same == null ? "" : r.same ? "=" : "≠"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function Verdict({ ok, children }: { ok: boolean; children: ReactNode }) {
    const c = ok ? GOOD : BAD;
    return (
        <div className="rounded-lg border px-3 py-2 font-mono text-xs leading-5 transition-colors" style={{ borderColor: c + "55", color: c, background: c + "10" }}>
            {children}
        </div>
    );
}
