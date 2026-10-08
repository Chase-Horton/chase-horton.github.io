"use client";

import { useState } from "react";
import { apply, fmt, IDENTITY, lerpAffine, shift, type Vec } from "./affine";
import { useTween } from "./hooks";
import { ALICE, BOB, EVENT } from "./palette";
import { SpacetimeDiagram, Track } from "./spacetime-diagram";
import { Button, CompareTable, Figure, FrameSwitch, Readout, Slider, type Viewer } from "./ui";

const XR: [number, number] = [-6, 6];
const TR: [number, number] = [-3, 7];
const close = (a: number, b: number) => Math.abs(a - b) < 1e-6;

function useBob(initial = { d: 3, t0: 1, flip: false }) {
    const [d, setD] = useState(initial.d);
    const [t0, setT0] = useState(initial.t0);
    const [flip, setFlip] = useState(initial.flip);
    const T = shift(d, t0, flip ? -1 : 1);
    const reset = () => {
        setD(initial.d);
        setT0(initial.t0);
        setFlip(initial.flip);
    };
    const controls = (
        <>
            <Slider label="bob stands at x =" value={d} min={-4} max={4} step={0.25} onChange={setD} color={BOB} />
            <Slider label="bob's clock reads 0 when t =" value={t0} min={-2} max={4} step={0.25} onChange={setT0} color={BOB} />
            <Button onClick={() => setFlip((f) => !f)} active={flip}>
                {flip ? "⇄ bob faces left" : "→ bob faces right"}
            </Button>
        </>
    );
    return { d, t0, flip, T, reset, controls };
}

/** 2.1 — one event, two sets of labels. Morph the whole diagram into bob's coordinates. */
export function TwoObservers() {
    const bob = useBob();
    const [viewer, setViewer] = useState<Viewer>("alice");
    const [ev, setEv] = useState<Vec>([-1, 4]);
    const p = useTween(viewer === "bob" ? 1 : 0, 900);
    const view = lerpAffine(IDENTITY, bob.T, p);
    const [xb, tb] = apply(bob.T, ev[0], ev[1]);
    const s = bob.flip ? "−" : "";

    return (
        <Figure
            n="2.1"
            title="one event, two labels"
            onReset={() => {
                bob.reset();
                setViewer("alice");
                setEv([-1, 4]);
            }}
            caption={
                <>
                    Alice (cyan) and Bob (amber) both stand still, at different places, with clocks started at different moments.
                    Drag the white event, then switch to Bob&apos;s view. The whole picture slides (and, if Bob faces the other way,
                    flips), but the event stays exactly where it is <em>relative to everything else</em>. Only its labels change.
                </>
            }
            controls={
                <>
                    <FrameSwitch value={viewer} onChange={setViewer} />
                    {bob.controls}
                    <Readout
                        title="the white event"
                        rows={[
                            ["alice says (x, t)", `(${fmt(ev[0])}, ${fmt(ev[1])})`, ALICE],
                            ["bob says (x′, t′)", `(${fmt(xb)}, ${fmt(tb)})`, BOB],
                            [`x′ = ${s}(x − ${fmt(bob.d, 1)})`, fmt(xb), BOB],
                            [`t′ = t − ${fmt(bob.t0, 1)}`, fmt(tb), BOB],
                        ]}
                    />
                </>
            }
        >
            <Track
                xRange={XR}
                caption={viewer === "alice" ? "the line, measured from alice" : "the line, measured from bob"}
                objects={[
                    { id: "a", x: apply(view, 0, 0)[0], color: ALICE, label: "alice" },
                    { id: "b", x: apply(view, bob.d, 0)[0], color: BOB, label: "bob" },
                    { id: "e", x: apply(view, ev[0], ev[1])[0], color: EVENT, kind: "pulse" },
                ]}
            />
            <SpacetimeDiagram
                view={view}
                xRange={XR}
                tRange={TR}
                snap={0.25}
                grids={[
                    { transform: IDENTITY, color: ALICE, axisLabels: ["x", "t"] },
                    { transform: bob.T, color: BOB, axisLabels: ["x′", "t′"] },
                ]}
                lines={[
                    { points: [[0, -40], [0, 40]], color: ALICE, glow: true, width: 2 },
                    { points: [[bob.d, -40], [bob.d, 40]], color: BOB, glow: true, width: 2 },
                ]}
                points={[{ id: "e", x: ev[0], t: ev[1], color: EVENT, draggable: p === 0 || p === 1, label: "event" }]}
                onDrag={(_, x, t) => setEv([x, t])}
            />
        </Figure>
    );
}

/** 2.2 — two events. Their separation does not care whose origin you use. */
export function TwoEventRuler() {
    const bob = useBob({ d: -2, t0: 2, flip: false });
    const [A, setA] = useState<Vec>([-3, 1]);
    const [B, setB] = useState<Vec>([2, 4.5]);
    const a = apply(bob.T, ...A);
    const b = apply(bob.T, ...B);
    const dx = B[0] - A[0], dt = B[1] - A[1];
    const dxb = b[0] - a[0], dtb = b[1] - a[1];

    return (
        <Figure
            n="2.2"
            title="differences survive"
            onReset={() => {
                bob.reset();
                setA([-3, 1]);
                setB([2, 4.5]);
            }}
            caption={
                <>
                    Drag either event, or move Bob. The individual coordinates disagree (red), but the <em>gaps</em> between
                    events do not (green). Flip Bob around and Δx changes sign, yet the distance |Δx| stays put. Quantities that
                    every observer agrees on are called <strong>invariants</strong>, and hunting for them is the whole game.
                </>
            }
            controls={bob.controls}
        >
            <SpacetimeDiagram
                xRange={XR}
                tRange={TR}
                snap={0.25}
                grids={[
                    { transform: IDENTITY, color: ALICE, axisLabels: ["x", "t"] },
                    { transform: bob.T, color: BOB, axisLabels: ["x′", "t′"] },
                ]}
                points={[
                    { id: "A", x: A[0], t: A[1], color: EVENT, draggable: true, label: "A" },
                    { id: "B", x: B[0], t: B[1], color: EVENT, draggable: true, label: "B" },
                ]}
                onDrag={(id, x, t) => (id === "A" ? setA([x, t]) : setB([x, t]))}
            >
                {(api) => {
                    const [ax, ay] = api.px(...A);
                    const [bx, by] = api.px(...B);
                    const [cx, cy] = api.px(B[0], A[1]);
                    return (
                        <g strokeDasharray="3 4" strokeWidth={1.5}>
                            <line x1={ax} y1={ay} x2={cx} y2={cy} stroke="#e4e4e7" opacity={0.6} />
                            <line x1={cx} y1={cy} x2={bx} y2={by} stroke="#e4e4e7" opacity={0.6} />
                            <text x={(ax + cx) / 2} y={ay + 16} fill="#e4e4e7" fontSize={11} textAnchor="middle" className="font-mono">
                                Δx
                            </text>
                            <text x={cx + 8} y={(cy + by) / 2} fill="#e4e4e7" fontSize={11} className="font-mono">
                                Δt
                            </text>
                        </g>
                    );
                }}
            </SpacetimeDiagram>
            <CompareTable
                rows={[
                    { label: "x of A", a: fmt(A[0]), b: fmt(a[0]), same: close(A[0], a[0]) },
                    { label: "t of A", a: fmt(A[1]), b: fmt(a[1]), same: close(A[1], a[1]) },
                    { label: "Δx", a: fmt(dx), b: fmt(dxb), same: close(dx, dxb) },
                    { label: "|Δx|  (distance)", a: fmt(Math.abs(dx)), b: fmt(Math.abs(dxb)), same: close(Math.abs(dx), Math.abs(dxb)) },
                    { label: "Δt  (duration)", a: fmt(dt), b: fmt(dtb), same: close(dt, dtb) },
                ]}
            />
        </Figure>
    );
}
