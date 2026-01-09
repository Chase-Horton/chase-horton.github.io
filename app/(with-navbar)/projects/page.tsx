import { ComingSoon } from "@/components/coming-soon"
import { TitlePage } from "@/components/title-page"
import { Metadata } from "next"
interface Project {
  slug: string
  title: string
  description: string
  tags: string[]
  image?: string
}
export const metadata:Metadata= {
  title: "projects",
  description: "a collection of things I've built.",
}
const projects: Project[] = [
  {
    slug: "example-project",
    title: "Example Project",
    description:
      "A cool project showcasing modern web development with Next.js, TypeScript, and innovative UI patterns.",
    tags: ["Next.js", "TypeScript", "React"],
    image: "/modern-web-dashboard-interface.jpg",
  },
  // Add more projects here
]

export default function ProjectsPage() {
  return (
    <TitlePage title="projects" description="a collection of things I've built.">
        {/*<div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} animationDelay={index * 100} />
          ))
        </div>*/}
        <ComingSoon />
    </TitlePage>
  )
}
