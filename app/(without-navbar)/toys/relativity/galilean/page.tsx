import type { Metadata } from "next";
import { InvariantChecker, ShearGrid, VelocityAddition } from "../_components/ch4";
import { BOB } from "../_components/palette";
import { ChapterHeader, Eq, H2, KeyPoint, M, Prose } from "../_components/prose";

export const metadata: Metadata = {
    title: "the galilean transformation",
    description: "The common-sense rule for converting between moving frames, seen as a shear of spacetime.",
};

export default function GalileanPage() {
    return (
        <>
            <ChapterHeader
                n={4}
                title="the galilean transformation"
                lede="The rule everyone uses without thinking: if the train moves at v, subtract vt. It's a shear, and it hides a very strong assumption about time."
            />
            <Prose>
                <p>
                    An event happens at position <M>x</M> on Alice&apos;s ruler at time <M>t</M>. By that moment, Bob&apos;s train has
                    travelled a distance <M>vt</M> down the track, so Bob measures the event as <M>vt</M> closer than Alice does.
                    And the time? Obviously everyone&apos;s watches agree. Time is time.
                </p>
            </Prose>
            <Eq>
                <span style={{ color: BOB }}>x′</span> = x − v·t&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ color: BOB }}>t′</span> = t
            </Eq>
            <Prose>
                <p>
                    That pair of equations is the <strong>Galilean transformation</strong>. It&apos;s linear, so it&apos;s a matrix,
                    and that matrix has a shape you can see.
                </p>
            </Prose>

            <ShearGrid />

            <KeyPoint n={1} title="It's a shear">
                Points slide horizontally by an amount proportional to their height (their time). Vertical lines tip over; horizontal
                lines slide along themselves and stay horizontal. Areas are preserved, and nothing rotates or stretches.
            </KeyPoint>

            <KeyPoint n={2} title="Time is absolute">
                <M>t′ = t</M>. Every observer agrees when things happen, and in particular agrees on which events are{" "}
                <em>simultaneous</em>: the horizontal &ldquo;now&rdquo; lines are the same lines for everyone. This is the
                hidden assumption, and it&apos;s the one that will crack.
            </KeyPoint>

            <H2>velocities add</H2>
            <Prose>
                <p>
                    Divide the transformation by time and you get the rule for velocities. Something moving at <M>u′</M> on the
                    train moves at <M>u = u′ + v</M> relative to the ground. Run forward on a moving walkway and you arrive early.
                    That feels too obvious to question.
                </p>
            </Prose>

            <VelocityAddition />

            <KeyPoint n={3} title="Velocity addition: u = u′ + v">
                In the diagram this is just the shear acting on the ball&apos;s worldline: lean everything by <M>v</M> and every
                velocity shifts by <M>v</M>. No speed is special. Anything can be made to look stationary by riding alongside it.
            </KeyPoint>

            <H2>what galilean observers agree on</H2>
            <Prose>
                <p>
                    Back to our two questions. We have the rule. What does it leave alone?
                </p>
            </Prose>

            <InvariantChecker />

            <KeyPoint n={4} title="The Galilean invariants">
                <M>Δt</M> (durations) and the distance between <em>simultaneous</em> events (lengths). In Galilean physics space
                and time are separate things: a universal clock, and at each instant a universal ruler. The geometry of the world
                is a stack of independent &ldquo;nows&rdquo;.
            </KeyPoint>

            <Prose>
                <p>
                    This picture is consistent, intuitive, and it worked perfectly for two hundred years. Then people started
                    measuring the speed of light very, very carefully.
                </p>
            </Prose>
        </>
    );
}
