import type { Metadata } from "next";
import { ChapterChrome } from "./_components/chapter-chrome";

export const metadata: Metadata = {
    title: {
        default: "relativity interactive",
        template: "%s · relativity interactive",
    },
    description: "An interactive walkthrough of spacetime diagrams, frames of reference, and why the speed of light changes everything.",
};

export default function RelativityLayout({ children }: { children: React.ReactNode }) {
    return <ChapterChrome>{children}</ChapterChrome>;
}
