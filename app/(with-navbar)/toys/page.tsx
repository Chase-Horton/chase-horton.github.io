import { TitlePage } from "@/components/title-page";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "toys",
    description: "A collection of fun and experimental projects.",
};

export default function ToysPage() {
    const toys = [
        {
            title: "tik_tok",
            description: "visualization of remaining life", //"how will you live?",
            href: "/toys/tik_tok", 
        },
        {
          title: "special relativity",
          description: "animated slides used for a special relativity presentation.",
          href: "/manim",
        }
    ];

    return (
        <TitlePage title="toys" description="a collection of fun and experimental projects.">
            <div className="space-y-8">
        {toys.map((toy) => (
          <div key={toy.href} className="animate-blur-in" style={{animationDelay:"200ms"}}>
            <Link href={toy.href} className="text-blue-400 hover:underline text-base font-mono">
              {toy.title}
            </Link>
            <p className="text-foreground font-mono mt-1">{toy.description}</p>
          </div>
        ))}
      </div>
        </TitlePage>
    )
}