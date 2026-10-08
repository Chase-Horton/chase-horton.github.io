import type { Metadata } from "next";
import { TwoEventRuler, TwoObservers } from "../_components/ch2";
import { ALICE, BOB } from "../_components/palette";
import { ChapterHeader, Eq, H2, KeyPoint, M, Prose } from "../_components/prose";

export const metadata: Metadata = {
    title: "stationary observers",
    description: "Converting coordinates between observers who stand at different places with different clocks.",
};

export default function StationaryObserversPage() {
    return (
        <>
            <ChapterHeader
                n={2}
                title="stationary observers"
                lede="Coordinates aren't written on the universe. Somebody has to choose where zero is, which way is positive, and when to start the clock."
            />
            <Prose>
                <p>
                    Meet <M c={ALICE}>Alice</M> and <M c={BOB}>Bob</M>. Both stand perfectly still on our one-dimensional world, but
                    not in the same place. Each measures positions from where they stand, and each started their stopwatch at a
                    different moment. Bob might even be facing the other way, so his &ldquo;positive&rdquo; is Alice&apos;s
                    &ldquo;negative&rdquo;.
                </p>
                <p>
                    A firecracker goes off. Both of them write down where and when. They write down <em>different numbers</em>. Who is
                    right?
                </p>
            </Prose>

            <KeyPoint n={1} title="Events are real; coordinates are labels">
                The firecracker exploded once, at one point in spacetime. Alice&apos;s <M>(x, t)</M> and Bob&apos;s{" "}
                <M>(x′, t′)</M> are two names for the same point, like a street address versus GPS coordinates. Neither is
                &ldquo;more right&rdquo;.
            </KeyPoint>

            <TwoObservers />

            <H2>the conversion</H2>
            <Prose>
                <p>
                    Because both labels name the same event, there must be a rule turning one into the other. If Bob stands at{" "}
                    <M>x = d</M> and started his clock at <M>t = t₀</M>, then:
                </p>
            </Prose>
            <Eq>
                <span style={{ color: BOB }}>x′</span> = ±(x − d)&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ color: BOB }}>t′</span> = t − t₀
            </Eq>
            <Prose>
                <p>
                    with the minus sign if he faces the other way. Notice what switching to Bob&apos;s view did to the diagram: it
                    slid (and maybe mirrored), but it didn&apos;t bend, stretch, or tilt anything. Vertical lines stayed vertical:
                    whoever was at rest for Alice is still at rest for Bob.
                </p>
            </Prose>

            <KeyPoint n={2} title="Shifting the origin is a translation">
                <M>x − d</M> slides every point left by <M>d</M>. <M>t − t₀</M> slides every point down by <M>t₀</M>. A flip
                mirrors left↔right. That&apos;s the complete list of differences between two stationary observers.
            </KeyPoint>

            <H2>what survives the conversion?</H2>
            <Prose>
                <p>
                    The individual numbers change. But physics shouldn&apos;t depend on where someone happened to stand. So look at
                    <em> relationships</em> between events instead: how far apart they are, how long between them.
                </p>
            </Prose>

            <TwoEventRuler />

            <KeyPoint n={3} title="Differences are invariant">
                Subtracting two events cancels the offsets: <M>Δx′ = ±Δx</M>, <M>Δt′ = Δt</M>. Distances and durations are the
                same for every stationary observer. Those are the facts about the world; the coordinates are just our
                bookkeeping.
            </KeyPoint>

            <Prose>
                <p>
                    This chapter was almost too easy, and that&apos;s the point: it sets the pattern. Every chapter from here asks
                    the same two questions. <em>What is the rule for converting labels? And what quantity does that rule leave
                    alone?</em> Next, Bob gets on a train.
                </p>
            </Prose>
        </>
    );
}
