"use client";

import { useRef, useState } from "react";
import { apply, fmt, galilean, IDENTITY, invert, lerpAffine, type Vec } from "./affine";
import { useClock, useInView, useTween } from "./hooks";
import { ALICE, BALL, BOB, EVENT, SCENERY } from "./palette";
import { SpacetimeDiagram, Track, type DiagramApi } from "./spacetime-diagram";
import { Button, ClockControls, CompareTable, Figure, FrameSwitch, Readout, Slider, Verdict, type Viewer } from "./ui";

const XR: [number, number] = [-5, 7];
const TR: [number, number] = [-1, 7];
const close = (a: number, b: number) => Math.abs(a - b) < 1e-6;
const forever = (f: (t: number) => number): Vec[] => [-40, 40].map((t) => [f(t), t] as Vec);

function UnitCell({ api, v, color, observer }: { api: DiagramApi; v: number; color: string; observer: "alice" | "bob" }) {
    const T = observer === "alice" ? IDENTITY : galilean(v);
    const inv = invert(T)!;
    const corners: Vec[] = [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
    ];
    const pts = corners.map(([a, b]) => api.px(...apply(inv, a, b)).join(",")).join(" ");
    return <polygon points={pts} fill={color} fillOpacity={0.14} stroke={color} strokeOpacity={0.6} strokeWidth={1} />;
}

/** 4.1 — the galilean transformation is a shear of the spacetime grid. */
export function ShearGrid() {
    const [v, setV] = useState(0.5);
    const [viewer, setViewer] = useState<Viewer>("alice");
    const [P, setP] = useState<Vec>([1, 2]);
    const [Q, setQ] = useState<Vec>([3, 5]);
    const p = useTween(viewer === "bob" ? 1 : 0, 900);
    const T = galilean(v);
    const view = lerpAffine(IDENTITY, T, p);
    const Pb = apply(T, ...P);
    const Qb = apply(T, ...Q);

    return (
        <Figure
            n="4.1"
            title="the shear"
            onReset={() => {
                setV(0.5);
                setViewer("alice");
                setP([1, 2]);
                setQ([3, 5]);
            }}
            caption={
                <>
                    Sweep <em>v</em> and watch Bob&apos;s grid. The lines of constant x′ tilt to follow his worldline, but the
                    lines of constant t′ never move: they stay exactly on top of Alice&apos;s. That is a <strong>shear</strong>. The
                    shaded squares are one unit of space × one unit of time for each observer: Bob&apos;s is slanted, yet it has
                    the same area. The dashed line through P marks every event simultaneous with P, and it is the same line for
                    both of them.
                </>
            }
            controls={
                <>
                    <FrameSwitch value={viewer} onChange={setViewer} />
                    <Slider label="bob's velocity v" value={v} min={-1.5} max={1.5} step={0.05} onChange={setV} color={BOB} />
                    <div className="rounded-lg border border-border bg-black/30 p-3 font-mono text-xs leading-6">
                        <div className="mb-1 text-muted-foreground">the transformation</div>
                        <div className="flex items-center justify-center gap-2 text-sm">
                            <span style={{ color: BOB }}>[x′ t′]</span>
                            <span>=</span>
                            <span className="inline-grid grid-cols-2 gap-x-3 border-x border-foreground/40 px-2 text-center tabular-nums">
                                <span>1</span>
                                <span style={{ color: BOB }}>{fmt(-v)}</span>
                                <span>0</span>
                                <span>1</span>
                            </span>
                            <span style={{ color: ALICE }}>[x t]</span>
                        </div>
                    </div>
                    <Readout
                        rows={[
                            ["P  alice", `(${fmt(P[0])}, ${fmt(P[1])})`, ALICE],
                            ["P  bob", `(${fmt(Pb[0])}, ${fmt(Pb[1])})`, BOB],
                            ["Q  alice", `(${fmt(Q[0])}, ${fmt(Q[1])})`, ALICE],
                            ["Q  bob", `(${fmt(Qb[0])}, ${fmt(Qb[1])})`, BOB],
                        ]}
                    />
                </>
            }
        >
            <SpacetimeDiagram
                view={view}
                xRange={XR}
                tRange={TR}
                snap={0.25}
                nowT={P[1]}
                grids={[
                    { transform: IDENTITY, color: ALICE, axisLabels: ["x", "t"] },
                    { transform: T, color: BOB, axisLabels: ["x′", "t′"] },
                ]}
                lines={[
                    { points: forever(() => 0), color: ALICE, glow: true, width: 2 },
                    { points: forever((s) => v * s), color: BOB, glow: true, width: 2 },
                ]}
                points={[
                    { id: "P", x: P[0], t: P[1], color: EVENT, draggable: p === 0 || p === 1, label: "P" },
                    { id: "Q", x: Q[0], t: Q[1], color: EVENT, draggable: p === 0 || p === 1, label: "Q" },
                ]}
                onDrag={(id, x, t) => (id === "P" ? setP([x, t]) : setQ([x, t]))}
            >
                {(api) => (
                    <>
                        <UnitCell api={api} v={v} color={ALICE} observer="alice" />
                        <UnitCell api={api} v={v} color={BOB} observer="bob" />
                    </>
                )}
            </SpacetimeDiagram>
        </Figure>
    );
}

const POSTS = [-8, -6, -4, -2, 0, 2, 4, 6, 8, 10];

/** 4.2 — a ball thrown on the train. Velocities add. */
export function VelocityAddition() {
    const ref = useRef<HTMLElement>(null);
    const inView = useInView(ref);
    const clock = useClock({ duration: 6, active: inView });
    const [v, setV] = useState(0.5);
    const [u, setU] = useState(0.8); // ball velocity relative to bob
    const [viewer, setViewer] = useState<Viewer>("alice");
    const p = useTween(viewer === "bob" ? 1 : 0, 900);
    const T = galilean(v);
    const view = lerpAffine(IDENTITY, T, p);

    const throwT = 1;
    const ball = (t: number) => (t < throwT ? v * t : v * throwT + (v + u) * (t - throwT));
    const t = clock.t;
    const disp = (x: number) => apply(view, x, t)[0];

    return (
        <Figure
            ref={ref}
            n="4.2"
            title="throwing a ball on the train"
            onReset={() => {
                setV(0.5);
                setU(0.8);
                setViewer("alice");
                clock.restart();
            }}
            caption={
                <>
                    At t = 1 Bob throws a ball forward at <em>u′</em> (relative to him). From the platform, Alice sees the
                    ball move at <em>u = u′ + v</em>. Galilean velocities simply add. Keep this in mind: it is exactly the rule
                    that light is about to break.
                </>
            }
            controls={
                <>
                    <FrameSwitch value={viewer} onChange={setViewer} />
                    <Slider label="train velocity v" value={v} min={-1} max={1} step={0.05} onChange={setV} color={BOB} />
                    <Slider label="throw speed u′ (relative to bob)" value={u} min={-1.5} max={1.5} step={0.05} onChange={setU} color={BALL} />
                    <ClockControls clock={clock} />
                    <Readout
                        rows={[
                            ["ball, per bob  u′", fmt(u), BALL],
                            ["train, per alice  v", fmt(v), BOB],
                            ["ball, per alice  u = u′ + v", fmt(u + v), BALL],
                        ]}
                    />
                </>
            }
        >
            <Track
                xRange={[-3, 9]}
                objects={[
                    ...POSTS.map((x) => ({ id: "p" + x, x: disp(x), color: SCENERY, kind: "post" as const })),
                    { id: "train", x: disp(v * t), color: BOB, kind: "train", size: 2 },
                    { id: "alice", x: disp(0), color: ALICE, label: "alice" },
                    { id: "bob", x: disp(v * t), color: BOB, label: "bob", labelBelow: true },
                    ...(t >= throwT ? [{ id: "ball", x: disp(ball(t)), color: BALL, kind: "pulse" as const }] : []),
                ]}
            />
            <SpacetimeDiagram
                view={view}
                xRange={[-3, 9]}
                tRange={[0, 6]}
                nowT={t}
                grids={[
                    { transform: IDENTITY, color: ALICE, axisLabels: ["x", "t"] },
                    { transform: T, color: BOB, axisLabels: ["x′", "t′"] },
                ]}
                lines={[
                    { points: forever(() => 0), color: ALICE, glow: true, width: 2 },
                    { points: forever((s) => v * s), color: BOB, glow: true, width: 2, label: "bob" },
                    { points: [[v * throwT, throwT], [ball(40), 40]], color: BALL, glow: true, label: "ball" },
                ]}
                points={[
                    { id: "throw", x: v * throwT, t: throwT, color: BALL, r: 4, label: "throw" },
                    { id: "a", x: 0, t, color: ALICE, r: 5 },
                    { id: "b", x: v * t, t, color: BOB, r: 5 },
                ]}
            />
        </Figure>
    );
}

/** 4.3 — what do alice and bob agree on? */
export function InvariantChecker() {
    const [v, setV] = useState(0.5);
    const [A, setA] = useState<Vec>([0, 1]);
    const [B, setB] = useState<Vec>([3, 4]);
    const T = galilean(v);
    const a = apply(T, ...A);
    const b = apply(T, ...B);
    const dx = B[0] - A[0], dt = B[1] - A[1];
    const dxb = b[0] - a[0], dtb = b[1] - a[1];
    const simultaneous = Math.abs(dt) < 1e-9;

    return (
        <Figure
            n="4.3"
            title="the invariant hunt"
            onReset={() => {
                setV(0.5);
                setA([0, 1]);
                setB([3, 4]);
            }}
            caption={
                <>
                    Galilean observers always agree on <strong>Δt</strong>: time is absolute, a universal clock ticking the
                    same for everyone. They disagree on Δx in general. Bob, riding along, thinks the two events happened closer
                    together (or further apart). But if the events are <em>simultaneous</em>, Δx is agreed on too: that is
                    the length of a ruler, measured by marking both ends at the same instant.
                </>
            }
            controls={
                <>
                    <Slider label="bob's velocity v" value={v} min={-1.5} max={1.5} step={0.05} onChange={setV} color={BOB} />
                    <Button onClick={() => setB([B[0], A[1]])}>make B simultaneous with A</Button>
                    <Verdict ok={simultaneous || close(v, 0)}>
                        {simultaneous
                            ? "simultaneous: everyone agrees on the distance."
                            : close(v, 0)
                              ? "v = 0: bob is just alice with a different origin."
                              : `bob measures Δx′ = Δx − vΔt = ${fmt(dxb)}, not ${fmt(dx)}.`}
                    </Verdict>
                </>
            }
        >
            <SpacetimeDiagram
                xRange={XR}
                tRange={TR}
                snap={0.25}
                grids={[
                    { transform: IDENTITY, color: ALICE, axisLabels: ["x", "t"] },
                    { transform: T, color: BOB, axisLabels: ["x′", "t′"] },
                ]}
                lines={[{ points: [A, B], color: EVENT, dash: "4 4", width: 1.5, opacity: 0.6 }]}
                points={[
                    { id: "A", x: A[0], t: A[1], color: EVENT, draggable: true, label: "A" },
                    { id: "B", x: B[0], t: B[1], color: EVENT, draggable: true, label: "B" },
                ]}
                onDrag={(id, x, t) => (id === "A" ? setA([x, t]) : setB([x, t]))}
            />
            <CompareTable
                rows={[
                    { label: "x of A", a: fmt(A[0]), b: fmt(a[0]), same: close(A[0], a[0]) },
                    { label: "t of A", a: fmt(A[1]), b: fmt(a[1]), same: close(A[1], a[1]) },
                    { label: "Δt", a: fmt(dt), b: fmt(dtb), same: close(dt, dtb) },
                    { label: "Δx", a: fmt(dx), b: fmt(dxb), same: close(dx, dxb) },
                    {
                        label: "distance at equal times",
                        a: simultaneous ? fmt(Math.abs(dx)) : "—",
                        b: simultaneous ? fmt(Math.abs(dxb)) : "—",
                        same: simultaneous ? close(dx, dxb) : null,
                    },
                ]}
            />
        </Figure>
    );
}
