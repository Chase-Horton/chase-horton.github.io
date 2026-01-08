export function Header({ title, description }: { title: string, description: string }) {

    return (
        <div className="mb-12 animate-blur-in mt-12" style={{ animationDelay: "0ms" }}>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                <span className="font-mono">{title}</span><span className="text-blue-400">.</span>
            </h1>
            <p className="text-xl italic text-muted-foreground leading-relaxed text-balance">
                {description}
            </p>
        </div>
    )
}
