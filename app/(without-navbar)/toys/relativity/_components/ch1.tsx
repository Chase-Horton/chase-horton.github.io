"use client";

import { useRef, useState } from "react";
import { fmt, sample, type Vec } from "./affine";
import { useClock, useInView } from "./hooks";
import { ALICE, BAD, BOB, EVENT, GOOD } from "./palette";
import { SpacetimeDiagram, Track, type Line } from "./spacetime-diagram";
import { Button, ClockControls, Figure, Readout, Segmented } from "./ui";

const PRESETS = {
    rest: { label: "at rest", f: () => 3 },
    slow: { label: "slow", f: (t: number) => 1 + 0.5 * t },
    fast: { label: "fast", f: (t: number) => 1 + 1.6 * t },
    left: { label: "leftward", f: (t: number) => 9 - 0.8 * t },
    turn: { label: "turn around", f: (t: number) => 1 + 2.4 * t - 0.24 * t * t },
    accel: { label: "speeding up", f: (t: number) => 0.5 + 0.09 * t * t },
} as const;
type PresetKey = keyof typeof PRESETS;

const R1: [number, number] = [0, 10];

/** 1.1 — a dot moving on a track, and the worldline it traces on an x–t diagram. */
export function WorldlineScrubber() {
    const ref = useRef<HTMLElement>(null);
    const inView = useInView(ref);
    const clock = useClock({ duration: 10, active: inView });
    const [preset, setPreset] = useState<PresetKey>("slow");
    const [strobe, setStrobe] = useState(true);

    const f = PRESETS[preset].f;
    const t = clock.t;
    const x = f(t);
    const v = (f(t + 1e-3) - f(t - 1e-3)) / 2e-3;
    const flashes = strobe ? Array.from({ length: Math.floor(t) + 1 }, (_, k) => k) : [];

    // traced so far (bright) and the full history (faint)
    const lines: Line[] = [
        { points: sample(f, 0, 10), color: ALICE, opacity: 0.18, width: 2 },
        { points: sample(f, 0, Math.max(t, 0.001), 120), color: ALICE, glow: true },
    ];

    return (
        <Figure
            ref={ref}
            n="1.1"
            title="from motion to a worldline"
            onReset={() => {
                setPreset("slow");
                clock.restart();
            }}
            caption={
                <>
                    The strip on top is the world: a single dot sliding along a line. The diagram underneath stacks every
                    instant of that strip on top of the last, time running upward. Each flash on the strip becomes a dot on the
                    diagram, and joining the dots gives the object&apos;s <em>worldline</em>.
                </>
            }
            controls={
                <>
                    <Segmented
                        label="motion"
                        value={preset}
                        onChange={(p) => {
                            setPreset(p);
                            clock.restart();
                        }}
                        options={(Object.keys(PRESETS) as PresetKey[]).map((k) => ({ value: k, label: PRESETS[k].label, color: ALICE }))}
                    />
                    <ClockControls clock={clock} />
                    <Button onClick={() => setStrobe((s) => !s)} active={strobe}>
                        {strobe ? "◉" : "○"} strobe every second
                    </Button>
                    <Readout
                        rows={[
                            ["t", fmt(t)],
                            ["x", fmt(x), ALICE],
                            ["velocity  dx/dt", fmt(v), ALICE],
                            ["graph slope  dt/dx", Math.abs(v) < 1e-6 ? "∞ (vertical)" : fmt(1 / v)],
                        ]}
                    />
                </>
            }
        >
            <Track
                xRange={R1}
                caption="the world (x only)"
                objects={[
                    ...flashes.map((k) => ({ id: "f" + k, x: f(k), color: ALICE, opacity: 0.18 })),
                    { id: "dot", x, color: ALICE },
                ]}
            />
            <SpacetimeDiagram
                xRange={R1}
                tRange={R1}
                grids={[{ transform: [1, 0, 0, 1, 0, 0], color: "#a1a1aa", axisLabels: ["x", "t"] }]}
                lines={lines}
                nowT={t}
                points={[
                    ...flashes.map((k) => ({ id: "s" + k, x: f(k), t: k, color: ALICE, r: 3.5, opacity: 0.7 })),
                    { id: "now", x, t, color: EVENT, r: 6 },
                ]}
            >
                {(api) => {
                    const h = 1.4 / Math.sqrt(1 + v * v);
                    const [x1, y1] = api.px(x - v * h, t - h);
                    const [x2, y2] = api.px(x + v * h, t + h);
                    const [bx, by] = api.px(x, 0);
                    const [ex, ey] = api.px(x, t);
                    return (
                        <g>
                            <line x1={ex} y1={ey} x2={bx} y2={by} stroke={ALICE} strokeOpacity={0.35} strokeDasharray="2 4" />
                            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={BOB} strokeWidth={2} strokeLinecap="round" opacity={0.9} />
                            <text x={x2 + 6} y={y2} fill={BOB} fontSize={11} className="font-mono">
                                tangent
                            </text>
                        </g>
                    );
                }}
            </SpacetimeDiagram>
        </Figure>
    );
}

const INITIAL_PTS: Vec[] = [
    [1, 0.5],
    [3, 3],
    [3, 5.5],
    [8, 8.5],
];

/** 1.2 — drag the corners of a worldline; read off the velocity of each leg. */
export function DrawWorldline() {
    const [pts, setPts] = useState<Vec[]>(INITIAL_PTS);

    const segs = pts.slice(1).map((p, i) => {
        const a = pts[i];
        const dx = p[0] - a[0], dt = p[1] - a[1];
        const status = dt > 1e-9 ? "ok" : dt < -1e-9 ? "backward" : "instant";
        return { a, b: p, dx, dt, v: dx / dt, status };
    });

    return (
        <Figure
            n="1.2"
            title="draw your own worldline"
            onReset={() => setPts(INITIAL_PTS)}
            caption={
                <>
                    Drag the four events. Each straight leg is a stretch of constant velocity, <em>v = Δx / Δt</em>. A vertical leg is
                    standing still; a leg that tips toward horizontal is fast. A leg that points <em>downward</em> would be travelling
                    into the past, which no object does.
                </>
            }
            controls={
                <Readout
                    title="legs"
                    rows={segs.map((s, i) => [
                        `leg ${i + 1}`,
                        s.status === "ok" ? `v = ${fmt(s.v)}` : s.status === "instant" ? "infinite speed ✗" : "into the past ✗",
                        s.status === "ok" ? (Math.abs(s.v) < 1e-9 ? GOOD : ALICE) : BAD,
                    ])}
                />
            }
        >
            <SpacetimeDiagram
                xRange={R1}
                tRange={R1}
                snap={0.25}
                grids={[{ transform: [1, 0, 0, 1, 0, 0], color: "#a1a1aa", axisLabels: ["x", "t"] }]}
                lines={segs.map((s) => ({
                    points: [s.a, s.b],
                    color: s.status === "ok" ? ALICE : BAD,
                    dash: s.status === "ok" ? undefined : "6 6",
                    glow: s.status === "ok",
                }))}
                points={pts.map((p, i) => ({ id: String(i), x: p[0], t: p[1], color: EVENT, draggable: true, label: `E${i + 1}` }))}
                onDrag={(id, x, t) => setPts((prev) => prev.map((p, i) => (String(i) === id ? [x, t] : p)))}
            >
                {(api) =>
                    segs.map((s, i) => {
                        const [mx, my] = api.px((s.a[0] + s.b[0]) / 2, (s.a[1] + s.b[1]) / 2);
                        const label = s.status === "ok" ? `v=${fmt(s.v, 1)}` : "✗";
                        return (
                            <text key={i} x={mx + 10} y={my + 4} fontSize={11} fill={s.status === "ok" ? ALICE : BAD} className="font-mono" opacity={0.85}>
                                {label}
                            </text>
                        );
                    })
                }
            </SpacetimeDiagram>
        </Figure>
    );
}

type Quiz = {
    q: string;
    a: (t: number) => number;
    b: (t: number) => number;
    bStart?: number;
    answer: "A" | "B" | "same";
    explain: string;
    marker?: number;
};

const QUIZ: Quiz[] = [
    {
        q: "who is moving faster?",
        a: (t) => 1 + 0.35 * t,
        b: (t) => 1 + 1.1 * t,
        answer: "B",
        explain: "B's line leans further from vertical: more x per unit t. The steeper line (A) is the slower one.",
    },
    {
        q: "who is standing still?",
        a: () => 6,
        b: (t) => 8 - 0.5 * t,
        answer: "A",
        explain: "A's worldline is vertical: time passes, x never changes. That's what 'at rest' looks like.",
    },
    {
        q: "who reaches x = 8 first?",
        a: (t) => 1 + 0.8 * t,
        b: (t) => 1.6 * (t - 2),
        bStart: 2,
        answer: "B",
        marker: 8,
        explain: "B leaves later (starts at t = 2) but is faster, so it hits the x = 8 line lower on the diagram, i.e. earlier.",
    },
];

/** 1.3 — three quick reading-the-graph questions. */
export function GraphQuiz() {
    const [answers, setAnswers] = useState<(string | null)[]>(QUIZ.map(() => null));
    return (
        <Figure n="1.3" title="read the graph" onReset={() => setAnswers(QUIZ.map(() => null))}>
            <div className="grid gap-5 sm:grid-cols-3">
                {QUIZ.map((qz, i) => {
                    const picked = answers[i];
                    const correct = picked === qz.answer;
                    return (
                        <div key={i} className="space-y-3">
                            <div className="font-mono text-xs text-muted-foreground">
                                {i + 1}. {qz.q}
                            </div>
                            <SpacetimeDiagram
                                xRange={R1}
                                tRange={R1}
                                width={300}
                                showTicks={false}
                                grids={[{ transform: [1, 0, 0, 1, 0, 0], color: "#a1a1aa" }]}
                                lines={[
                                    ...(qz.marker !== undefined
                                        ? [{ points: [[qz.marker, 0], [qz.marker, 10]] as Vec[], color: "#a1a1aa", dash: "3 5", width: 1.2 }]
                                        : []),
                                    { points: sample(qz.a, 0, 10), color: ALICE, glow: true, label: "A" },
                                    { points: sample(qz.b, qz.bStart ?? 0, 10), color: BOB, glow: true, label: "B" },
                                ]}
                            />
                            <div className="flex gap-1.5">
                                {(["A", "B", "same"] as const).map((opt) => (
                                    <Button
                                        key={opt}
                                        active={picked === opt}
                                        onClick={() => setAnswers((prev) => prev.map((p, j) => (j === i ? opt : p)))}
                                        className="flex-1"
                                    >
                                        {opt}
                                    </Button>
                                ))}
                            </div>
                            {picked && (
                                <p className="text-xs leading-5 animate-in fade-in" style={{ color: correct ? GOOD : BAD }}>
                                    {correct ? "✓ " : "✗ not quite. "}
                                    <span className="text-muted-foreground">{qz.explain}</span>
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </Figure>
    );
}
