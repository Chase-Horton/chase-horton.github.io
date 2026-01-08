
import Link from "next/link";
import Image from "next/image";

interface ProjectCardProps {
	project: {
		slug: string;
		title: string;
		description: string;
		tags: string[];
		image?: string;
	};
	animationDelay?: number;
}

export function ProjectCard({ project, animationDelay = 0 }: ProjectCardProps) {
	return (
		<Link
			href={`/projects/${project.slug}`}
			className="block group animate-blur-in border border-transparent hover:border-blue-400/30 rounded-lg overflow-hidden transition-colors bg-white/5 hover:bg-white/10 shadow-sm"
			style={{ animationDelay: `${animationDelay}ms` }}
		>
			{project.image && (
				<div className="relative w-full h-40 md:h-48 bg-gray-900">
					<Image
						src={project.image}
						alt={project.title}
						fill
						className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
						sizes="(max-width: 768px) 100vw, 50vw"
						priority={animationDelay === 0}
					/>
				</div>
			)}
			<div className="p-4">
				<div className="flex flex-wrap gap-2 mb-2">
					{project.tags.map((tag) => (
						<span
							key={tag}
							className="text-xs font-mono px-2 py-1 rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/20"
						>
							{tag}
						</span>
					))}
				</div>
				<h2 className="text-lg font-semibold text-foreground group-hover:text-blue-400 transition-colors mb-1">
					{project.title}
				</h2>
				<p className="text-muted-foreground text-sm line-clamp-3">{project.description}</p>
			</div>
		</Link>
	);
}
