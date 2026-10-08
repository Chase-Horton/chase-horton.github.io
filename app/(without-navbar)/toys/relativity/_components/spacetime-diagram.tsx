"use client";

import { useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { apply, IDENTITY, invert, type Affine, type Vec } from "./affine";

export type Grid = {
    /** Map from lab coordinates to this observer's coordinates. Grid lines are where those coordinates are multiples of `step`. */
    transform: Affine;
    color: string;
    step?: number;
    extent?: number;
    opacity?: number;
    axisLabels?: [string, string];
};

export type Line = {
    points: Vec[];
    color: string;
    width?: number;
    dash?: string;
    glow?: boolean;
    opacity?: number;
    label?: string;
};

export type Point = {
    id: string;
    x: number;
    t: number;
    color: string;
    label?: string;
    draggable?: boolean;
    r?: number;
    opacity?: number;
};

export type DiagramApi = {
    /** lab coordinates → svg pixels (through the current view) */
    px: (x: number, t: number) => Vec;
    /** displayed coordinates → svg pixels (ignores the view) */
    dpx: (xd: number, td: number) => Vec;
    width: number;
    height: number;
};

type Props = {
    /** Map from lab coordinates to the coordinates being displayed. Tween this to switch frames. */
    view?: Affine;
    xRange: [number, number];
    tRange: [number, number];
    width?: number;
    height?: number;
    grids?: Grid[];
    lines?: Line[];
    points?: Point[];
    onDrag?: (id: string, x: number, t: number) => void;
    snap?: number;
    nowT?: number | null;
    nowColor?: string;
    tickStep?: number;
    showTicks?: boolean;
    formatTick?: (v: number) => string;
    children?: (api: DiagramApi) => ReactNode;
    ariaLabel?: string;
};

const toPath = (pts: Vec[]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");

const defaultTick = (v: number) => String(Math.round(v * 100) / 100).replace("-", "−");

export function SpacetimeDiagram({
    view = IDENTITY,
    xRange,
    tRange,
    width = 560,
    height,
    grids = [],
    lines = [],
    points = [],
    onDrag,
    snap = 0,
    nowT = null,
    nowColor = "#ffffff",
    tickStep = 1,
    showTicks = true,
    formatTick = defaultTick,
    children,
    ariaLabel = "spacetime diagram",
}: Props) {
    const uid = useId().replace(/:/g, "");
    const svgRef = useRef<SVGSVGElement>(null);
    const [drag, setDrag] = useState<string | null>(null);

    const W = width;
    const H = height ?? Math.round((width * (tRange[1] - tRange[0])) / (xRange[1] - xRange[0]));
    const sx = W / (xRange[1] - xRange[0]);
    const st = H / (tRange[1] - tRange[0]);
    const dpx = (xd: number, td: number): Vec => [(xd - xRange[0]) * sx, H - (td - tRange[0]) * st];
    const px = (x: number, t: number): Vec => {
        const [xd, td] = apply(view, x, t);
        return dpx(xd, td);
    };
    const api: DiagramApi = { px, dpx, width: W, height: H };
    const inv = invert(view);
    const span = Math.max(Math.abs(xRange[0]), Math.abs(xRange[1]), Math.abs(tRange[0]), Math.abs(tRange[1]));

    function toLab(clientX: number, clientY: number): Vec | null {
        const svg = svgRef.current;
        const ctm = svg?.getScreenCTM();
        if (!svg || !ctm || !inv) return null;
        const p = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
        const xd = Math.min(xRange[1], Math.max(xRange[0], p.x / sx + xRange[0]));
        const td = Math.min(tRange[1], Math.max(tRange[0], (H - p.y) / st + tRange[0]));
        let [x, t] = apply(inv, xd, td);
        if (snap) {
            x = Math.round(x / snap) * snap;
            t = Math.round(t / snap) * snap;
        }
        return [x, t];
    }

    function onPointerMove(e: PointerEvent<SVGSVGElement>) {
        if (!drag || !onDrag) return;
        const lab = toLab(e.clientX, e.clientY);
        if (lab) onDrag(drag, lab[0], lab[1]);
    }

    function onKey(e: KeyboardEvent, p: Point) {
        if (!onDrag) return;
        const s = snap || 0.25;
        const moves: Record<string, Vec> = { ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, s], ArrowDown: [0, -s] };
        const m = moves[e.key];
        if (!m) return;
        e.preventDefault();
        onDrag(p.id, p.x + m[0], p.t + m[1]);
    }

    function renderGrid(g: Grid, gi: number) {
        const ginv = invert(g.transform);
        if (!ginv) return null;
        const step = g.step ?? tickStep;
        const E = g.extent ?? Math.ceil((span * 4) / step) * step;
        const n = Math.round(E / step);
        const minor: string[] = [];
        const axes: string[] = [];
        for (let k = -n; k <= n; k++) {
            const v = k * step;
            const vertical = toPath([px(...apply(ginv, v, -E)), px(...apply(ginv, v, E))]);
            const horizontal = toPath([px(...apply(ginv, -E, v)), px(...apply(ginv, E, v))]);
            (k === 0 ? axes : minor).push(vertical, horizontal);
        }

        // Put axis labels at the far end of each axis that is still on screen.
        const inside = ([x, y]: Vec) => x > 22 && x < W - 22 && y > 16 && y < H - 16;
        const findEnd = (along: (s: number) => Vec): Vec | null => {
            for (let i = 0; i <= 400; i++) {
                const p = px(...along(E - (2 * E * i) / 400));
                if (inside(p)) return p;
            }
            return null;
        };
        const tAxisEnd = g.axisLabels ? findEnd((s) => apply(ginv, 0, s)) : null;
        const xAxisEnd = g.axisLabels ? findEnd((s) => apply(ginv, s, 0)) : null;

        return (
            <g key={gi} opacity={g.opacity ?? 1}>
                <path d={minor.join("")} stroke={g.color} strokeOpacity={0.16} strokeWidth={1} fill="none" />
                <path d={axes.join("")} stroke={g.color} strokeOpacity={0.85} strokeWidth={1.6} fill="none" />
                {g.axisLabels && tAxisEnd && (
                    <text x={tAxisEnd[0] + 8} y={tAxisEnd[1] + 4 + gi * 16} fill={g.color} fontSize={13} className="font-mono">
                        {g.axisLabels[1]}
                    </text>
                )}
                {g.axisLabels && xAxisEnd && (
                    <text x={xAxisEnd[0] - 4 - gi * 22} y={xAxisEnd[1] - 8} fill={g.color} fontSize={13} textAnchor="end" className="font-mono">
                        {g.axisLabels[0]}
                    </text>
                )}
            </g>
        );
    }

    const ticks: ReactNode[] = [];
    if (showTicks) {
        const n0 = Math.ceil(xRange[0] / tickStep), n1 = Math.floor(xRange[1] / tickStep);
        for (let k = n0; k <= n1; k++) {
            const [x] = dpx(k * tickStep, 0);
            if (x < 10 || x > W - 10) continue;
            ticks.push(
                <text key={"tx" + k} x={x} y={H - 6} fontSize={10} textAnchor="middle" fill="currentColor" opacity={0.35} className="font-mono">
                    {formatTick(k * tickStep)}
                </text>,
            );
        }
        const m0 = Math.ceil(tRange[0] / tickStep), m1 = Math.floor(tRange[1] / tickStep);
        for (let k = m0; k <= m1; k++) {
            const [, y] = dpx(0, k * tickStep);
            if (y < 10 || y > H - 18) continue;
            ticks.push(
                <text key={"tt" + k} x={6} y={y + 3} fontSize={10} fill="currentColor" opacity={0.35} className="font-mono">
                    {formatTick(k * tickStep)}
                </text>,
            );
        }
    }

    return (
        <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto select-none text-foreground"
            role="img"
            aria-label={ariaLabel}
            onPointerMove={onPointerMove}
            onPointerUp={() => setDrag(null)}
            onPointerCancel={() => setDrag(null)}
        >
            <defs>
                <clipPath id={`${uid}-clip`}>
                    <rect x={0} y={0} width={W} height={H} rx={10} />
                </clipPath>
                <filter id={`${uid}-glow`} filterUnits="userSpaceOnUse" x={-W} y={-H} width={3 * W} height={3 * H}>
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <radialGradient id={`${uid}-vignette`} cx="50%" cy="50%" r="75%">
                    <stop offset="60%" stopColor="#000" stopOpacity="0" />
                    <stop offset="100%" stopColor="#000" stopOpacity="0.45" />
                </radialGradient>
            </defs>

            <g clipPath={`url(#${uid}-clip)`}>
                <rect x={0} y={0} width={W} height={H} fill="#0b0b0d" />
                {grids.map(renderGrid)}

                {nowT !== null && (
                    <path
                        d={toPath([px(-span * 6, nowT), px(span * 6, nowT)])}
                        stroke={nowColor}
                        strokeOpacity={0.5}
                        strokeDasharray="4 5"
                        strokeWidth={1.2}
                    />
                )}

                {lines.map((l, i) => {
                    const pts = l.points.map(([x, t]) => px(x, t));
                    const last = pts[pts.length - 1];
                    return (
                        <g key={i} opacity={l.opacity ?? 1}>
                            <path
                                d={toPath(pts)}
                                stroke={l.color}
                                strokeWidth={l.width ?? 2.5}
                                strokeDasharray={l.dash}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                                filter={l.glow ? `url(#${uid}-glow)` : undefined}
                            />
                            {l.label && last && (
                                <text x={last[0] + 6} y={last[1] + 14} fill={l.color} fontSize={12} className="font-mono">
                                    {l.label}
                                </text>
                            )}
                        </g>
                    );
                })}

                {children?.(api)}

                {points.map((p) => {
                    const [x, y] = px(p.x, p.t);
                    const r = p.r ?? 6;
                    const interactive = !!(p.draggable && onDrag);
                    return (
                        <g
                            key={p.id}
                            opacity={p.opacity ?? 1}
                            tabIndex={interactive ? 0 : undefined}
                            role={interactive ? "slider" : undefined}
                            aria-label={interactive ? `${p.label ?? p.id}: drag or use arrow keys` : undefined}
                            aria-valuetext={interactive ? `x ${p.x.toFixed(2)}, t ${p.t.toFixed(2)}` : undefined}
                            onKeyDown={interactive ? (e) => onKey(e, p) : undefined}
                            onPointerDown={
                                interactive
                                    ? (e) => {
                                          e.preventDefault();
                                          svgRef.current?.setPointerCapture(e.pointerId);
                                          setDrag(p.id);
                                      }
                                    : undefined
                            }
                            style={interactive ? { cursor: drag === p.id ? "grabbing" : "grab", touchAction: "none", outline: "none" } : undefined}
                            className={interactive ? "group" : undefined}
                        >
                            {interactive && (
                                <>
                                    <circle cx={x} cy={y} r={18} fill="transparent" />
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r={r + 6}
                                        fill="none"
                                        stroke={p.color}
                                        strokeOpacity={drag === p.id ? 0.8 : 0.35}
                                        className="group-focus-visible:[stroke-width:3]"
                                    >
                                        {drag !== p.id && (
                                            <animate attributeName="r" values={`${r + 4};${r + 8};${r + 4}`} dur="2.4s" repeatCount="indefinite" />
                                        )}
                                    </circle>
                                </>
                            )}
                            <circle cx={x} cy={y} r={r} fill={p.color} stroke="#0b0b0d" strokeWidth={2} filter={`url(#${uid}-glow)`} />
                            {p.label && (
                                <text x={x + r + 6} y={y - r - 4} fill={p.color} fontSize={12} className="font-mono">
                                    {p.label}
                                </text>
                            )}
                        </g>
                    );
                })}

                {ticks}
                <rect x={0} y={0} width={W} height={H} fill={`url(#${uid}-vignette)`} pointerEvents="none" />
            </g>
            <rect x={0.5} y={0.5} width={W - 1} height={H - 1} rx={10} fill="none" stroke="currentColor" strokeOpacity={0.1} />
        </svg>
    );
}

export function Arrow({ from, to, color, width = 2.5, api, label, head = 10 }: {
    from: Vec;
    to: Vec;
    color: string;
    width?: number;
    api: DiagramApi;
    label?: string;
    head?: number;
}) {
    const [x1, y1] = api.px(...from);
    const [x2, y2] = api.px(...to);
    const len = Math.hypot(x2 - x1, y2 - y1);
    if (len < 1) return null;
    const ux = (x2 - x1) / len, uy = (y2 - y1) / len;
    const h = Math.min(head, len * 0.6);
    const bx = x2 - ux * h, by = y2 - uy * h;
    const wing = h * 0.55;
    return (
        <g>
            <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={width} strokeLinecap="round" />
            <polygon points={`${x2},${y2} ${bx - uy * wing},${by + ux * wing} ${bx + uy * wing},${by - ux * wing}`} fill={color} />
            {label && (
                <text x={(x1 + x2) / 2 + uy * 16} y={(y1 + y2) / 2 - ux * 16 + 4} fill={color} fontSize={13} textAnchor="middle" className="font-mono">
                    {label}
                </text>
            )}
        </g>
    );
}

export type TrackObject = {
    id: string;
    x: number;
    color: string;
    label?: string;
    kind?: "dot" | "train" | "post" | "pulse";
    /** train length, in x units */
    size?: number;
    opacity?: number;
    labelBelow?: boolean;
};

/** A one-dimensional "real world" strip that sits above a diagram and shares its x scale. */
export function Track({ xRange, objects, width = 560, height = 76, caption }: {
    xRange: [number, number];
    objects: TrackObject[];
    width?: number;
    height?: number;
    caption?: string;
}) {
    const uid = useId().replace(/:/g, "");
    const sx = width / (xRange[1] - xRange[0]);
    const X = (x: number) => (x - xRange[0]) * sx;
    const y = height - 22;
    const ticks: number[] = [];
    for (let v = Math.ceil(xRange[0]); v <= xRange[1]; v++) ticks.push(v);

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none text-foreground" aria-hidden>
            <defs>
                <clipPath id={`${uid}-clip`}>
                    <rect x={0} y={0} width={width} height={height} rx={10} />
                </clipPath>
                <filter id={`${uid}-glow`} filterUnits="userSpaceOnUse" x={-width} y={-height} width={3 * width} height={3 * height}>
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <g clipPath={`url(#${uid}-clip)`}>
                <rect x={0} y={0} width={width} height={height} fill="#0b0b0d" />
                <line x1={0} x2={width} y1={y} y2={y} stroke="currentColor" strokeOpacity={0.25} />
                {ticks.map((v) => (
                    <line key={v} x1={X(v)} x2={X(v)} y1={y} y2={y + 4} stroke="currentColor" strokeOpacity={0.25} />
                ))}
                {objects.map((o) => {
                    const cx = X(o.x);
                    const op = o.opacity ?? 1;
                    if (o.kind === "post") {
                        return <line key={o.id} x1={cx} x2={cx} y1={y - 30} y2={y} stroke={o.color} strokeWidth={2} opacity={op * 0.6} />;
                    }
                    if (o.kind === "train") {
                        const w = (o.size ?? 2) * sx;
                        return (
                            <g key={o.id} opacity={op}>
                                <rect x={cx - w / 2} y={y - 26} width={w} height={22} rx={6} fill={o.color} fillOpacity={0.12} stroke={o.color} strokeOpacity={0.7} />
                                {[-0.32, 0.32].map((k) => (
                                    <circle key={k} cx={cx + k * w} cy={y - 2} r={3} fill={o.color} fillOpacity={0.7} />
                                ))}
                            </g>
                        );
                    }
                    if (o.kind === "pulse") {
                        return (
                            <g key={o.id} opacity={op} filter={`url(#${uid}-glow)`}>
                                <circle cx={cx} cy={y - 14} r={4} fill={o.color} />
                            </g>
                        );
                    }
                    return (
                        <g key={o.id} opacity={op}>
                            <circle cx={cx} cy={y - 14} r={6.5} fill={o.color} filter={`url(#${uid}-glow)`} />
                            {o.label && (
                                <text x={cx} y={o.labelBelow ? y + 16 : y - 28} fill={o.color} fontSize={11} textAnchor="middle" className="font-mono">
                                    {o.label}
                                </text>
                            )}
                        </g>
                    );
                })}
                {caption && (
                    <text x={10} y={16} fontSize={10} fill="currentColor" opacity={0.4} className="font-mono">
                        {caption}
                    </text>
                )}
            </g>
            <rect x={0.5} y={0.5} width={width - 1} height={height - 1} rx={10} fill="none" stroke="currentColor" strokeOpacity={0.1} />
        </svg>
    );
}
