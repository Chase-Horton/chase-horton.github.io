import { Link, LinksComponent } from "./link-component";

export interface Section {
    title: string;
    links: Link[];
}
export function SectionComponent({ section, globalIndex }: { section: Section, globalIndex: number }) {

    const headerDelay = globalIndex * 100;
    const listStartDelay = headerDelay + 50;

    return (
        <section key={section.title} className="mb-12">
            <h2
                className="text-s w-fit font-mono pb-2 text-blue-400 animate-blur-in opacity-0"
                style={{
                    animationDelay: `${headerDelay}ms`,
                }}
            >
                {section.title}
            </h2>
            <ul className="space-y-2">
                <LinksComponent links={section.links} baseDelay={listStartDelay} />
            </ul>
        </section>
    );
}