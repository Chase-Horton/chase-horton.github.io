import { TitlePage } from "@/components/title-page";
import Link from "next/link";
import { ArrowRight, Hourglass } from "lucide-react";

export default function ToysPage() {
    const toys = [
        {
            title: "tik_tok",
            description: "how will you live?",
            href: "/toys/life", 
            icon: Hourglass,
        },
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