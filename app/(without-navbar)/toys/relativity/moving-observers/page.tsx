import type { Metadata } from "next";
import { TrainScene, WhoIsMoving } from "../_components/ch3";
import { ALICE, BOB } from "../_components/palette";
import { ChapterHeader, H2, KeyPoint, M, Prose, Aside } from "../_components/prose";

export const metadata: Metadata = {
    title: "moving observers",
    description: "What a spacetime diagram looks like from a moving train, and why 'at rest' is relative.",
};

export default function MovingObserversPage() {
    return (
        <>
            <ChapterHeader
                n={3}
                title="moving observers"
                lede="Now Bob boards a train. Alice stays on the platform. Each of them is entitled to say they are the one standing still."
            />
            <Prose>
                <p>
                    The train glides along the track at a steady velocity <M>v</M>. No jolts, no braking: if Bob closes the blinds,
                    he can pour a coffee, play catch, or balance a pencil, and everything behaves exactly as it does at home. From
                    his point of view, <em>he</em> is at rest and the platform is sliding backward past the window.
                </p>
                <p>
                    How does that look on a spacetime diagram? Bob&apos;s worldline in Alice&apos;s coordinates is <M>x = vt</M>: a
                    straight line leaning over by an amount set by his speed. Bob draws his own diagram with himself at the
                    origin, so in <em>his</em> coordinates, his worldline is the vertical axis.
                </p>
            </Prose>

            <TrainScene />

            <KeyPoint n={1} title="Every observer is at rest in their own coordinates">
                Your own worldline is always your own time axis. For <M c={BOB}>Bob</M>, &ldquo;staying in the same place&rdquo; means
                staying in the same seat on the train, so his lines of constant <M>x′</M> run parallel to his tilted worldline in
                Alice&apos;s picture.
            </KeyPoint>

            <KeyPoint n={2} title="Velocities are relative">
                Alice says Bob moves at <M>+v</M>. Bob says Alice moves at <M>−v</M>. Both statements describe the same worldlines;
                they just pick different lines to call vertical.
            </KeyPoint>

            <H2>so who is really moving?</H2>
            <Prose>
                <p>
                    It&apos;s tempting to say the train is &ldquo;really&rdquo; moving because the ground is big and the train is
                    small. But the ground is moving around the Sun, which moves around the galaxy, which drifts through the cosmos.
                    Strip away the scenery, and the question gets sharper.
                </p>
            </Prose>

            <WhoIsMoving />

            <KeyPoint n={3} title="The principle of relativity">
                The laws of physics are the same for every observer moving at constant velocity. No experiment, done entirely
                inside your own frame, can reveal your &ldquo;absolute&rdquo; velocity. There is no preferred frame and no
                universal &ldquo;at rest&rdquo;. (This is Galileo&apos;s idea, centuries before Einstein. Einstein kept it, and it was
                something <em>else</em> he had to give up.)
            </KeyPoint>

            <Aside>
                Galileo described sealing yourself below deck on a smoothly sailing ship with butterflies, fish in a bowl, and
                dripping water. Everything behaves identically whether the ship is moored or moving. He wrote that in 1632.
            </Aside>

            <Prose>
                <p>
                    We&apos;ve seen that switching from <M c={ALICE}>Alice</M> to <M c={BOB}>Bob</M> tilts the vertical lines while
                    the horizontal lines stay put. In the next chapter we&apos;ll write that down as an equation, the Galilean
                    transformation, and find out exactly what it preserves.
                </p>
            </Prose>
        </>
    );
}
