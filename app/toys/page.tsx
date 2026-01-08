import { ComingSoon } from "@/components/coming-soon";
import { TitlePage } from "@/components/title-page";

export default function ToysPage() {
    return (
        <TitlePage title="toys" description="A collection of fun and experimental projects.">
            <ComingSoon />
        </TitlePage>
    )
}