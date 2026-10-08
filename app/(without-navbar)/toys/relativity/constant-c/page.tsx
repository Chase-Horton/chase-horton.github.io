import type { Metadata } from "next";
import { Contravariance, LightShear, Surveyors, TimeUnits } from "../_components/ch5";
import { ALICE, BOB } from "../_components/palette";
import { Aside, ChapterHeader, Eq, H2, KeyPoint, M, Prose } from "../_components/prose";

export const metadata: Metadata = {
    title: "c is constant",
    description: "Why the constancy of light breaks Galilean relativity, and why we have to fix our units before we can find what's invariant.",
};

export default function ConstantCPage() {
    return (
        <>
            <ChapterHeader
                n={5}
                title="c is constant"
                lede="Every observer, however they're moving, measures the same speed for light. Galileo's shear says that's impossible. One of them has to go."
            />
            <Prose>
                <p>
                    In the 1860s Maxwell&apos;s equations predicted waves of electricity and magnetism travelling at a definite speed,{" "}
                    <M>c ≈ 299 792 458 m/s</M>. That&apos;s light. But a speed relative to <em>what</em>? Galileo says any speed can
                    be changed by moving alongside it. So physicists assumed light moved at <M>c</M> relative to some invisible
                    medium (the aether) and set out to measure Earth&apos;s motion through it.
                </p>
                <p>
                    In 1887 Michelson and Morley compared light sent along and across Earth&apos;s orbital motion, sensitive enough to
                    detect a tiny fraction of that speed. They found nothing. Every later experiment agreed: light moves at{" "}
                    <M>c</M> relative to <em>every</em> observer.
                </p>
            </Prose>

            <LightShear />

            <KeyPoint n={1} title="Light breaks the shear">
                Under the Galilean transformation a light pulse would move at <M>c − v</M> for Bob. Experiment says <M>c</M>. A speed
                that every observer agrees on is a new invariant, and the Galilean rule doesn&apos;t preserve it. The conversion
                rule between moving frames must be something else.
            </KeyPoint>

            <Prose>
                <p>
                    Before we can find the right rule, there&apos;s a problem hiding in plain sight. Our diagrams have one axis in
                    meters and the other in seconds. What would it even mean to &ldquo;rotate&rdquo; or &ldquo;mix&rdquo; them? You
                    can&apos;t add meters to seconds. To see why this matters, take a detour through a town with a surveying
                    problem.
                </p>
            </Prose>

            <H2>the parable of the surveyors</H2>
            <Prose>
                <p>
                    This story is from Taylor and Wheeler&apos;s <em>Spacetime Physics</em>. A town has two surveying offices. The{" "}
                    <M c={ALICE}>night surveyors</M> define north by the North Star. The <M c={BOB}>day surveyors</M> use a magnetic
                    compass, which points a few degrees off. Tradition says east–west distances are recorded in meters, while
                    north–south distances, for sacred historical reasons, are in miles.
                </p>
                <p>
                    The two offices&apos; maps never agree. Different northings, different eastings, even different
                    &ldquo;distances&rdquo; between the same two landmarks. Then a student proposes something radical: measure{" "}
                    <em>north in meters too</em>.
                </p>
            </Prose>

            <Surveyors />

            <KeyPoint n={2} title="No invariant until the units match">
                With north in miles, <M>√(Δeast² + Δnorth²)</M> is meaningless: you&apos;re adding apples to oranges, and different
                observers get different answers. Convert with <M>1 mile = 1609.344 m</M>, and the distance becomes the same for
                everyone. The conversion factor wasn&apos;t a law of nature. It was a historical accident hiding a symmetry.
            </KeyPoint>

            <Eq>
                Δe′² + Δn′² = Δe² + Δn²
                <div className="mt-1 text-xs text-muted-foreground">only when e and n are measured in the same units</div>
            </Eq>

            <Prose>
                <p>
                    Once both axes are in meters, changing between surveyors is a <em>rotation</em>, and the numbers each surveyor
                    writes down transform in a very particular way. They change opposite to the measuring sticks.
                </p>
            </Prose>

            <Contravariance />

            <KeyPoint n={3} title="Coordinates are contravariant">
                A displacement is a geometric arrow, the same for everyone. Its <em>components</em> depend on the basis: make the
                unit vectors bigger and the numbers get smaller, in exact proportion. That&apos;s what the upper index in{" "}
                <M>xⁱ</M> means. Mixing up units is just secretly using basis vectors of wildly different lengths.
            </KeyPoint>

            <H2>time in meters</H2>
            <Prose>
                <p>
                    Spacetime has the same surveying problem. We measure <M>x</M> in meters and <M>t</M> in seconds, with a huge
                    conversion factor between them. Its name is <M>c</M>. Measure time by how far light travels in that time
                    (one meter of time ≈ 3.3 nanoseconds) and the factor disappears.
                </p>
            </Prose>

            <TimeUnits />

            <KeyPoint n={4} title="c is a conversion factor">
                In matched units, <M>c = 1</M> and light runs at 45° on every diagram, for every observer. The constancy of the speed
                of light becomes a statement about geometry: whatever the correct transformation between frames is, it must keep
                those 45° lines where they are.
            </KeyPoint>

            <Aside>
                The surveyors&apos; invariant was <M>Δe² + Δn²</M>. Spacetime&apos;s is almost the same, with one crucial minus sign:{" "}
                <M>(cΔt)² − Δx²</M>. That sign turns rotations into something stranger, and it&apos;s where the next chapter begins.
            </Aside>

            <div className="my-16 max-w-2xl rounded-2xl border border-dashed border-[#00D9FF]/40 bg-[#00D9FF]/[0.03] p-6">
                <div className="font-mono text-xs text-[#00D9FF]">coming next: chapter 6</div>
                <div className="mt-2 text-xl font-medium">the lorentz transformation</div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    A transformation that tilts <em>both</em> axes toward the light line, keeping light at 45° and the interval{" "}
                    <M>(ct)² − x²</M> invariant. Simultaneity becomes relative, moving clocks run slow, and moving rulers shrink, all
                    from one picture.
                </p>
            </div>
        </>
    );
}
