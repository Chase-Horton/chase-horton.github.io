"use client";

import { useRef, useState } from "react";
import { apply, fmt, galilean, IDENTITY, lerpAffine, type Affine, type Vec } from "./affine";
import { useClock, useInView, useTween } from "./hooks";
import { ALICE, BOB, GOOD, SCENERY } from "./palette";
import { SpacetimeDiagram, Track, type TrackObject } from "./spacetime-diagram";
import { Button, ClockControls, Figure, FrameSwitch, Readout, Segmented, Slider, type Viewer } from "./ui";

const XR: [number, number] = [-6, 6];
const TR: [number, number] = [0, 8];
const POSTS = [-10, -8, -6, -4, -2, 2, 4, 6, 8, 10];
const forever = (f: (t: number) => number): Vec[] => [-40, 40].map((t) => [f(t), t] as Vec);

/** 3.1 — a train passing a platform, seen from the platform and from the train. */
export function TrainScene() {
    const ref = useRef<HTMLElement>(null);
    const inView = useInView(ref);
    const clock = useClock({ duration: 8, active: inView });
    const [v, setV] = useState(0.6);
    const [viewer, setViewer] = useState<Viewer>("alice");
    const p = useTween(viewer === "bob" ? 1 : 0, 1000);

    const T = galilean(v);
    const view = lerpAffine(IDENTITY, T, p);
    const t = clock.t;
    const disp = (x: number) => apply(view, x, t)[0];

    const track: TrackObject[] = [
        ...POSTS.map((x) => ({ id: "p" + x, x: disp(x), color: SCENERY, kind: "post" as const })),
        { id: "train", x: disp(v * t), color: BOB, kind: "train", size: 2.2 },
        { id: "alice", x: disp(0), color: ALICE, label: "alice" },
        { id: "bob", x: disp(v * t), color: BOB, label: "bob", labelBelow: true },
    ];

    return (
        <Figure
            ref={ref}
            n="3.1"
            title="the train"
            onReset={() => {
                setV(0.6);
                setViewer("alice");
                clock.restart();
            }}
            caption={
                <>
                    Alice stands on the platform; Bob sits on a train moving at <em>v</em>. In Alice&apos;s diagram Bob&apos;s worldline
                    leans over. Now switch to Bob&apos;s view: <em>his</em> worldline stands up straight, and it is Alice, the
                    lamp posts, and the whole platform that lean the other way. Bob&apos;s grid lines (amber) are always parallel
                    to his own worldline: &ldquo;same place&rdquo; for Bob means &ldquo;moving along with the train&rdquo;.
                </>
            }
            controls={
                <>
                    <FrameSwitch value={viewer} onChange={setViewer} />
                    <Slider label="train velocity v" value={v} min={-1.5} max={1.5} step={0.05} onChange={setV} color={BOB} />
                    <ClockControls clock={clock} />
                    <Readout
                        title="who is moving?"
                        rows={[
                            ["according to alice", ""],
                            ["  alice", "0", ALICE],
                            ["  bob", fmt(v), BOB],
                            ["according to bob", ""],
                            ["  alice", fmt(-v), ALICE],
                            ["  bob", "0", BOB],
                        ]}
                    />
                </>
            }
        >
            <Track xRange={XR} objects={track} caption={viewer === "alice" ? "the platform's point of view" : "the train's point of view"} />
            <SpacetimeDiagram
                view={view}
                xRange={XR}
                tRange={TR}
                nowT={t}
                grids={[
                    { transform: IDENTITY, color: ALICE, axisLabels: ["x", "t"] },
                    { transform: T, color: BOB, axisLabels: ["x′", "t′"] },
                ]}
                lines={[
                    ...POSTS.map((x) => ({ points: forever(() => x), color: SCENERY, width: 1, opacity: 0.4 })),
                    { points: forever(() => 0), color: ALICE, glow: true, label: "alice" },
                    { points: forever((s) => v * s), color: BOB, glow: true, label: "bob" },
                ]}
                points={[
                    { id: "a", x: 0, t, color: ALICE },
                    { id: "b", x: v * t, t, color: BOB },
                ]}
            />
        </Figure>
    );
}

type Frame = "A" | "B" | "mid";
const SHIP_A = (t: number) => -3 + 0.75 * t;
const SHIP_B = (t: number) => 3 - 0.75 * t;
const FRAMES: Record<Frame, Affine> = {
    A: galilean(0.75, -3),
    B: galilean(-0.75, 3),
    mid: IDENTITY,
};

/** 3.2 — two ships in empty space. Which one is moving? */
export function WhoIsMoving() {
    const ref = useRef<HTMLElement>(null);
    const inView = useInView(ref);
    const clock = useClock({ duration: 8, active: inView });
    const [guess, setGuess] = useState<string | null>(null);
    const [frame, setFrame] = useState<Frame>("A");

    // tween between frames by tweening a blend weight towards each target matrix
    const pA = useTween(frame === "A" ? 1 : 0, 900);
    const pB = useTween(frame === "B" ? 1 : 0, 900);
    const view = FRAMES.A.map((_, i) => FRAMES.mid[i] + (FRAMES.A[i] - FRAMES.mid[i]) * pA + (FRAMES.B[i] - FRAMES.mid[i]) * pB) as unknown as Affine;
    const t = clock.t;

    return (
        <Figure
            ref={ref}
            n="3.2"
            title="who is moving?"
            onReset={() => {
                setGuess(null);
                setFrame("A");
                clock.restart();
            }}
            caption={
                <>
                    Two ships drift in empty space: no stars, no platform, nothing to measure against. You only ever see the
                    ships relative to each other. Galileo&apos;s point: <em>uniform motion can only be detected relative to
                    something else</em>. There is no experiment you can do inside a smoothly moving ship to tell that it is
                    &ldquo;really&rdquo; moving.
                </>
            }
            controls={
                <>
                    <div className="space-y-2">
                        <div className="font-mono text-xs text-muted-foreground">your call:</div>
                        <div className="flex flex-col gap-1.5">
                            {[
                                ["A", "A is still, B is moving"],
                                ["B", "B is still, A is moving"],
                                ["?", "there's no way to tell"],
                            ].map(([k, label]) => (
                                <Button key={k} active={guess === k} onClick={() => setGuess(k)} className="text-left">
                                    {label}
                                </Button>
                            ))}
                        </div>
                    </div>
                    {guess && (
                        <p className="text-xs leading-5 text-muted-foreground animate-in fade-in">
                            <span style={{ color: GOOD }}>{guess === "?" ? "✓ exactly. " : "that's a valid description, "}</span>
                            {guess === "?"
                                ? "every one of these is an equally good frame. flip through them:"
                                : "but so is the opposite one. neither is more true. flip through the frames:"}
                        </p>
                    )}
                    {guess && (
                        <Segmented
                            label="ride along with…"
                            value={frame}
                            onChange={setFrame}
                            options={[
                                { value: "A", label: "ship A", color: ALICE },
                                { value: "B", label: "ship B", color: BOB },
                                { value: "mid", label: "halfway", color: "#e4e4e7" },
                            ]}
                        />
                    )}
                    <ClockControls clock={clock} />
                </>
            }
        >
            <Track
                xRange={XR}
                caption="deep space"
                objects={[
                    { id: "A", x: apply(view, SHIP_A(t), t)[0], color: ALICE, label: "A" },
                    { id: "B", x: apply(view, SHIP_B(t), t)[0], color: BOB, label: "B" },
                ]}
            />
            <div className={guess ? "animate-in fade-in duration-700" : "pointer-events-none opacity-25 blur-[3px] transition-all"}>
                <SpacetimeDiagram
                    view={view}
                    xRange={XR}
                    tRange={[0, 8]}
                    nowT={t}
                    grids={[{ transform: view, color: "#a1a1aa", axisLabels: ["x", "t"] }]}
                    lines={[
                        { points: forever(SHIP_A), color: ALICE, glow: true, label: "A" },
                        { points: forever(SHIP_B), color: BOB, glow: true, label: "B" },
                    ]}
                    points={[
                        { id: "a", x: SHIP_A(t), t, color: ALICE },
                        { id: "b", x: SHIP_B(t), t, color: BOB },
                    ]}
                />
            </div>
        </Figure>
    );
}
