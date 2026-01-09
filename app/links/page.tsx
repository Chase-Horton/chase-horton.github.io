import type { Metadata } from "next";
import { TitlePage } from "@/components/title-page";
import { sections } from "./links";
import { SectionComponent } from "./section-component";

export const metadata: Metadata = {
    title: "Links",
    description: "A collection of cool links",
};

export default function LinksPage() {
    let globalIndex = 0;
    return (
        <TitlePage
            title="links"
            description="a curated collection of useful information and tools."
        >
            {sections.map((section) => {
                return (
                    <SectionComponent
                        key={section.title}
                        section={section}
                        globalIndex={globalIndex++}
                    />
                );
            })}
        </TitlePage>
    );
}
