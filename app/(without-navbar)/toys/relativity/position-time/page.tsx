import type { Metadata } from "next";
import { DrawWorldline, GraphQuiz, WorldlineScrubber } from "../_components/ch1";
import { ChapterHeader, H2, KeyPoint, M, Prose } from "../_components/prose";

export const metadata: Metadata = {
    title: "position–time graphs",
    description: "Events, worldlines, and how to read velocity off a spacetime diagram.",
};

export default function PositionTimePage() {
    return (
        <>
            <ChapterHeader
                n={1}
                title="position–time graphs"
                lede="Before we can talk about how different observers see the world, we need one picture that holds all of it: every place, at every moment."
            />
            <Prose>
                <p>
                    Imagine the world is a single straight line, like a railway track or a very long hallway. Anything that exists is a
                    dot somewhere on it, and over time the dots slide around. A photograph of this world is boring: just a few dots
                    on a line. The interesting part is how they <em>move</em>.
                </p>
                <p>
                    So take a photograph every instant, and stack the photos on top of each other, with later moments higher up.
                    You get a two-dimensional picture where the horizontal direction is position <M>x</M> and the vertical direction is
                    time <M>t</M>. That&apos;s a <strong>spacetime diagram</strong>. (Physicists put time on the vertical axis, the
                    opposite of what you might expect from a school distance–time graph. Stick with it; it pays off later.)
                </p>
            </Prose>

            <KeyPoint n={1} title="An event is a point">
                A single thing happening at a single place at a single moment (a firecracker going off, a clock ticking) is an{" "}
                <em>event</em>. It is one point <M>(x, t)</M> on the diagram.
            </KeyPoint>

            <WorldlineScrubber />

            <KeyPoint n={2} title="An object's history is a line">
                An object is not one event but a continuous string of them, one at every moment it exists. That string is its{" "}
                <strong>worldline</strong>. The whole life of the object, past and future, is the line.
            </KeyPoint>

            <KeyPoint n={3} title="Vertical means at rest">
                If the object doesn&apos;t move, <M>x</M> stays fixed while <M>t</M> grows, which is a vertical line. You never stand
                still in spacetime: even a parked car is travelling up the time axis at one second per second.
            </KeyPoint>

            <KeyPoint n={4} title="Lean means speed: the flatter, the faster">
                Velocity is <M>v = Δx / Δt</M>: how far you go across per unit you go up. Because time is vertical, the <em>slope</em>{" "}
                of the line on the page is <M>Δt / Δx = 1/v</M>. A fast object&apos;s worldline leans far over; a slow one is nearly
                upright. Curved worldlines mean the velocity is changing, i.e. acceleration.
            </KeyPoint>

            <H2>try it yourself</H2>
            <Prose>
                <p>
                    Straight worldlines are the simplest kind of motion: constant velocity, no forces, the motion Newton&apos;s first
                    law says happens when you leave things alone. Build a journey out of straight legs and see what the diagram
                    allows.
                </p>
            </Prose>

            <DrawWorldline />

            <KeyPoint n={5} title="A horizontal line is 'now'">
                Every event on a horizontal line happens at the same <M>t</M>. The dashed line sweeping up the first diagram is the
                present moment, sliding through the static picture. In the whole picture, nothing actually moves; motion is just
                the shape of the lines.
            </KeyPoint>

            <Prose>
                <p>
                    Check that the picture has sunk in: three diagrams, three questions. Remember that a steeper line on the page is
                    the <em>slower</em> one. That trips almost everyone up the first time.
                </p>
            </Prose>

            <GraphQuiz />

            <Prose>
                <p>
                    So far there has been one set of axes, drawn by one observer. Next we&apos;ll add a second person with their own
                    ruler and their own clock, and ask the question this whole series is built on:{" "}
                    <em>if we disagree about the labels, what do we still agree on?</em>
                </p>
            </Prose>
        </>
    );
}
