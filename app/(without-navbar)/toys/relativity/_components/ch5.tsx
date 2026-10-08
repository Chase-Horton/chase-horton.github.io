"use client";

import { useRef, useState } from "react";
import { apply, fmt, galilean, IDENTITY, lerpAffine, rotation, scale, type Vec } from "./affine";
import { useClock, useInView, useTween } from "./hooks";
import { ALICE, BAD, BALL, BOB, EVENT, GOOD, LIGHT } from "./palette";
import { Arrow, SpacetimeDiagram, Track } from "./spacetime-diagram";
import { ClockControls, CompareTable, Figure, FrameSwitch, Readout, Segmented, Slider, Verdict, type Viewer } from "./ui";

const forever = (f: (t: number) => number): Vec[] => [-40, 40].map((t) => [f(t), t] as Vec);

/** 5.1 — under a galilean shear, light's worldline tips away from 45°. Experiment says it must not. */
export function LightShear() {
    const ref = useRef<HTMLElement>(null);
    const inView = useInView(ref);
    const clock = useClock({ duration: 6, active: inView });
    const [v, setV] = useState(0.5);
    const [viewer, setViewer] = useState<Viewer>("bob");
    const p = useTween(viewer === "bob" ? 1 : 0, 900);
    const T = galilean(v);
    const view = lerpAffine(IDENTITY, T, p);
    const t = clock.t;
    const disp = (x: number) => apply(view, x, t)[0];
    const broken = Math.abs(v) > 1e-6;

    return (
        <Figure
            ref={ref}
            n="5.1"
            title="light refuses to shear"
            onReset={() => {
                setV(0.5);
                setViewer("bob");
                clock.restart();
            }}
            caption={
                <>
                    A flash goes off at the origin and two pulses of light race apart at speed c (here c = 1, so in Alice&apos;s
                    diagram they run at 45°). Apply the Galilean shear and the pulses tilt: Bob should measure c − v one way and
                    c + v the other. The dashed white lines are what Bob <em>actually</em> measures when you do the experiment:
                    45°, both ways, for every v. The shear is wrong.
                </>
            }
            controls={
                <>
                    <FrameSwitch value={viewer} onChange={setViewer} />
                    <Slider label="bob's velocity v (as a fraction of c)" value={v} min={-0.9} max={0.9} step={0.05} onChange={setV} color={BOB} />
                    <ClockControls clock={clock} />
                    <Readout
                        title="speed of light, measured by bob"
                        rows={[
                            ["galileo predicts →", fmt(1 - v), broken ? BAD : GOOD],
                            ["galileo predicts ←", fmt(1 + v), broken ? BAD : GOOD],
                            ["experiment says →", "1.00", GOOD],
                            ["experiment says ←", "1.00", GOOD],
                        ]}
                    />
                    <Verdict ok={!broken}>{broken ? "contradiction: the galilean shear can't be right." : "v = 0: no disagreement yet."}</Verdict>
                </>
            }
        >
            <Track
                xRange={[-6, 6]}
                caption="a flash at the origin"
                objects={[
                    { id: "a", x: disp(0), color: ALICE, label: "alice" },
                    { id: "b", x: disp(v * t), color: BOB, label: "bob" },
                    { id: "r", x: disp(t), color: LIGHT, kind: "pulse" },
                    { id: "l", x: disp(-t), color: LIGHT, kind: "pulse" },
                ]}
            />
            <SpacetimeDiagram
                view={view}
                xRange={[-6, 6]}
                tRange={[0, 6]}
                nowT={t}
                grids={[
                    { transform: IDENTITY, color: ALICE, axisLabels: ["x", "t"], opacity: 1 - 0.6 * p },
                    { transform: T, color: BOB, axisLabels: ["x′", "t′"], opacity: 0.4 + 0.6 * p },
                ]}
                lines={[
                    { points: forever(() => 0), color: ALICE, width: 2 },
                    { points: forever((s) => v * s), color: BOB, width: 2 },
                    { points: [[0, 0], [40, 40]], color: LIGHT, glow: true, width: 3 },
                    { points: [[0, 0], [-40, 40]], color: LIGHT, glow: true, width: 3 },
                ]}
            >
                {(api) => {
                    const o = api.dpx(0, 0);
                    const r = api.dpx(6, 6);
                    const l = api.dpx(-6, 6);
                    return (
                        <g opacity={p} stroke="#ffffff" strokeDasharray="6 6" strokeWidth={1.5}>
                            <line x1={o[0]} y1={o[1]} x2={r[0]} y2={r[1]} />
                            <line x1={o[0]} y1={o[1]} x2={l[0]} y2={l[1]} />
                            <text x={r[0] - 8} y={r[1] + 22} fill="#ffffff" stroke="none" fontSize={11} textAnchor="end" className="font-mono">
                                measured: 45°
                            </text>
                        </g>
                    );
                }}
            </SpacetimeDiagram>
        </Figure>
    );
}

const MILE = 1609.344;
type Units = "mixed" | "meters";

/** 5.2 — the parable of the surveyors (after Taylor & Wheeler, Spacetime Physics). */
export function Surveyors() {
    const [deg, setDeg] = useState(18);
    const [units, setUnits] = useState<Units>("mixed");
    const [viewer, setViewer] = useState<"night" | "day">("night");
    const [A, setA] = useState<Vec>([-900, -600]);
    const [B, setB] = useState<Vec>([800, 900]);
    const theta = (deg * Math.PI) / 180;
    const p = useTween(viewer === "day" ? 1 : 0, 900);
    const view = rotation(theta * p);
    const day = rotation(theta);

    const north = (n: number) => (units === "mixed" ? n / MILE : n);
    const nUnit = units === "mixed" ? "mi" : "m";
    const measure = (m: typeof IDENTITY) => {
        const a = apply(m, ...A), b = apply(m, ...B);
        const de = b[0] - a[0], dn = north(b[1] - a[1]);
        return { de, dn, naive: Math.hypot(de, dn), fixed: Math.hypot(de, units === "mixed" ? dn * MILE : dn) };
    };
    const night = measure(IDENTITY);
    const dayM = measure(day);
    const agree = Math.abs(night.naive - dayM.naive) < 0.01;
    const nf = (x: number) => (units === "mixed" ? fmt(x, 3) : fmt(x, 0));

    return (
        <Figure
            n="5.2"
            title="the parable of the surveyors"
            onReset={() => {
                setDeg(18);
                setUnits("mixed");
                setViewer("night");
                setA([-900, -600]);
                setB([800, 900]);
            }}
            caption={
                <>
                    Two teams survey the same town. The <span style={{ color: ALICE }}>night surveyors</span> take north from the
                    North Star; the <span style={{ color: BOB }}>day surveyors</span> take it from a magnetic compass, a few degrees
                    off. Both, by old custom, measure east–west in meters and north–south in miles. Drag the landmarks: the two
                    teams&apos; &ldquo;distances&rdquo; disagree. Then put north in meters too. Suddenly √(Δeast² + Δnorth²) is the
                    same for both teams, at any angle. The magic number 1609.344 m/mile was hiding the invariant all along.
                </>
            }
            controls={
                <>
                    <Segmented
                        label="look through whose grid?"
                        value={viewer}
                        onChange={setViewer}
                        options={[
                            { value: "night", label: "night (★ north)", color: ALICE },
                            { value: "day", label: "day (compass)", color: BOB },
                        ]}
                    />
                    <Slider label="compass is off by" value={deg} min={-40} max={40} step={1} onChange={setDeg} color={BOB} format={(d) => `${fmt(d, 0)}°`} />
                    <Segmented
                        label="north–south measured in"
                        value={units}
                        onChange={setUnits}
                        options={[
                            { value: "mixed", label: "miles", color: BAD },
                            { value: "meters", label: "meters", color: GOOD },
                        ]}
                    />
                </>
            }
        >
            <SpacetimeDiagram
                view={view}
                xRange={[-2000, 2000]}
                tRange={[-2000, 2000]}
                snap={10}
                showTicks={false}
                tickStep={500}
                grids={[
                    { transform: IDENTITY, color: ALICE, step: 500, extent: 6000, axisLabels: ["east", "north ★"] },
                    { transform: day, color: BOB, step: 500, extent: 6000, axisLabels: ["east′", "north′ (compass)"] },
                ]}
                lines={[{ points: [A, B], color: EVENT, dash: "5 5", width: 1.5, opacity: 0.6 }]}
                points={[
                    { id: "A", x: A[0], t: A[1], color: EVENT, draggable: p === 0 || p === 1, label: "town hall" },
                    { id: "B", x: B[0], t: B[1], color: EVENT, draggable: p === 0 || p === 1, label: "windmill" },
                ]}
                onDrag={(id, x, t) => (id === "A" ? setA([x, t]) : setB([x, t]))}
                ariaLabel="map of the town with two survey grids"
            />
            <CompareTable
                headers={["night ★", "day (compass)"]}
                rows={[
                    { label: "Δeast (m)", a: fmt(night.de, 0), b: fmt(dayM.de, 0) },
                    { label: `Δnorth (${nUnit})`, a: nf(night.dn), b: nf(dayM.dn) },
                    { label: "√(Δe² + Δn²), as written", a: fmt(night.naive, 1), b: fmt(dayM.naive, 1), same: agree },
                    ...(units === "mixed"
                        ? [{ label: "…after converting miles → m", a: fmt(night.fixed, 1), b: fmt(dayM.fixed, 1), same: Math.abs(night.fixed - dayM.fixed) < 0.01 }]
                        : []),
                ]}
            />
        </Figure>
    );
}

const PRESETS = {
    meters: { label: "m", ex: 1, ey: 1 },
    feet: { label: "ft", ex: 0.3048, ey: 0.3048 },
    yards: { label: "yd", ex: 0.9144, ey: 0.9144 },
    mixed: { label: "yd × ft", ex: 0.9144, ey: 0.3048 },
} as const;
type PresetKey = keyof typeof PRESETS;
const V: Vec = [3, 2];

/** 5.3 — components vary *contra* to the basis: double the ruler, halve the number. */
export function Contravariance() {
    const [ex, setEx] = useState(1);
    const [ey, setEy] = useState(1);
    const cx = V[0] / ex, cy = V[1] / ey;
    const preset = (Object.keys(PRESETS) as PresetKey[]).find((k) => Math.abs(PRESETS[k].ex - ex) < 1e-6 && Math.abs(PRESETS[k].ey - ey) < 1e-6);

    return (
        <Figure
            n="5.3"
            title="contravariance"
            onReset={() => {
                setEx(1);
                setEy(1);
            }}
            caption={
                <>
                    The cyan arrow is a real displacement: 3 m east, 2 m north. It never moves. What changes is the ruler: the
                    basis vectors <span style={{ color: BOB }}>e₁, e₂</span>. Stretch a basis vector and its component shrinks by
                    exactly the same factor, because <em>V = V¹e₁ + V²e₂</em> must stay the same arrow. Components that vary
                    opposite to the basis are called <strong>contravariant</strong>, which is why we write them with an upper
                    index: V¹, V². Coordinates x, t are contravariant too, and every conversion factor (1609 m/mile, c) lives
                    inside the basis.
                </>
            }
            controls={
                <>
                    <Segmented
                        label="units"
                        value={preset ?? ("" as PresetKey)}
                        onChange={(k) => {
                            setEx(PRESETS[k].ex);
                            setEy(PRESETS[k].ey);
                        }}
                        options={(Object.keys(PRESETS) as PresetKey[]).map((k) => ({ value: k, label: PRESETS[k].label, color: BOB }))}
                    />
                    <Slider label="|e₁| (meters)" value={ex} min={0.25} max={3} step={0.05} onChange={setEx} color={BOB} format={(v) => fmt(v, 3)} />
                    <Slider label="|e₂| (meters)" value={ey} min={0.25} max={3} step={0.05} onChange={setEy} color={BOB} format={(v) => fmt(v, 3)} />
                    <Readout
                        rows={[
                            ["component V¹", fmt(cx, 2), ALICE],
                            ["|e₁| × V¹", `${fmt(ex * cx, 2)} m`, GOOD],
                            ["component V²", fmt(cy, 2), ALICE],
                            ["|e₂| × V²", `${fmt(ey * cy, 2)} m`, GOOD],
                        ]}
                    />
                </>
            }
        >
            <SpacetimeDiagram
                xRange={[-1, 5]}
                tRange={[-1, 3.5]}
                showTicks={false}
                grids={[
                    { transform: IDENTITY, color: "#52525b", step: 1, opacity: 0.6 },
                    { transform: scale(1 / ex, 1 / ey), color: BOB, step: 1, opacity: 0.9 },
                ]}
                ariaLabel="a fixed vector drawn over a grid whose spacing follows the basis vectors"
            >
                {(api) => {
                    const [px0, py0] = api.px(V[0], 0);
                    const [px1, py1] = api.px(V[0], V[1]);
                    const [qx0, qy0] = api.px(0, V[1]);
                    return (
                        <>
                            <g stroke={ALICE} strokeOpacity={0.4} strokeDasharray="3 4">
                                <line x1={px0} y1={py0} x2={px1} y2={py1} />
                                <line x1={qx0} y1={qy0} x2={px1} y2={py1} />
                            </g>
                            <Arrow api={api} from={[0, 0]} to={[ex, 0]} color={BOB} width={3.5} label="e₁" />
                            <Arrow api={api} from={[0, 0]} to={[0, ey]} color={BOB} width={3.5} label="e₂" />
                            <Arrow api={api} from={[0, 0]} to={V} color={ALICE} width={3} label={`V = ${fmt(cx, 1)} e₁ + ${fmt(cy, 1)} e₂`} head={12} />
                        </>
                    );
                }}
            </SpacetimeDiagram>
        </Figure>
    );
}

const C = 299_792_458;
type TimeUnit = "s" | "m";

/** 5.4 — measure time in meters and light snaps to 45°. c is a unit conversion. */
export function TimeUnits() {
    const [unit, setUnit] = useState<TimeUnit>("s");
    const p = useTween(unit === "m" ? 1 : 0, 1800);
    const s = Math.exp(p * Math.log(C)); // display time = s · (time in seconds)
    const view = scale(1, s);
    const top = 10 / s; // lab time (s) at the top of the diagram

    // clip endpoints to keep svg coordinates sane
    const mover = (x0: number, u: number): Vec[] => {
        const tEnd = Math.min(top, 60 / Math.abs(u));
        return [
            [x0, 0],
            [x0 + u * tEnd, tEnd],
        ];
    };
    const angle = (u: number) => (Math.atan2(s, Math.abs(u)) * 180) / Math.PI;

    return (
        <Figure
            n="5.4"
            title="time, measured in meters"
            onReset={() => setUnit("s")}
            caption={
                <>
                    With time in seconds and space in meters, light&apos;s worldline is pressed flat against the x axis: it
                    covers 300 million meters per second. That&apos;s not physics, that&apos;s bookkeeping, exactly like the
                    surveyors&apos; miles. Measure time in <em>meters of light-travel</em> (ct) and light runs at exactly 45°,
                    while everything at human speeds stands bolt upright. In these units c is just 1, a conversion factor
                    between two ways of measuring the same thing.
                </>
            }
            controls={
                <>
                    <Segmented
                        label="measure time in"
                        value={unit}
                        onChange={setUnit}
                        options={[
                            { value: "s", label: "seconds", color: BAD },
                            { value: "m", label: "meters (ct)", color: GOOD },
                        ]}
                    />
                    <Readout
                        title="angle above the x axis"
                        rows={[
                            ["light", `${fmt(angle(C), 1)}°`, LIGHT],
                            ["car, 25 m/s", `${fmt(angle(25), 1)}°`, BALL],
                            ["walker, 1.2 m/s", `${fmt(angle(1.2), 1)}°`, ALICE],
                        ]}
                    />
                    <Readout rows={[["c", unit === "s" ? "299 792 458 m/s" : "1 (m per m)", LIGHT]]} />
                </>
            }
        >
            <SpacetimeDiagram
                view={view}
                xRange={[-5, 5]}
                tRange={[-0.8, 10]}
                width={560}
                formatTick={(v) => String(v)}
                grids={[{ transform: view, color: "#a1a1aa", axisLabels: ["x (m)", p < 0.5 ? "t (s)" : "ct (m)"] }]}
                lines={[
                    { points: mover(-4, 1.2), color: ALICE, glow: true, label: "walker" },
                    { points: mover(-3, 25), color: BALL, glow: true, label: "car" },
                    { points: mover(0, C), color: LIGHT, glow: true, width: 3, label: "light" },
                    { points: mover(0, -C), color: LIGHT, glow: true, width: 3 },
                ]}
                points={[{ id: "flash", x: 0, t: 0, color: LIGHT, r: 5 }]}
            />
        </Figure>
    );
}
