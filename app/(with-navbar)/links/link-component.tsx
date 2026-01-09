export interface Link {
    title: string;
    url: string;
    description?: string;
    subtitle?: string;
}
export function LinksComponent({ links, baseDelay }: { links: Link[], baseDelay: number }) {
    return (
        <ul className="space-y-4">
            {links.map((link, index) => {
                const itemDelay = baseDelay + index * 50; // 50ms delay between each item
                return (
                    <li
                        key={link.url}
                        className="font-mono text-muted-foreground text-sm relative hover:z-20 animate-blur-in opacity-0"
                        style={{
                            animationDelay: `${itemDelay}ms`,
                        }}
                    >
                        <div className="group relative w-fit">
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground hover:text-[#00D9FF] transition-colors"
                            >
                                {link.title}
                            </a>
                            {link.subtitle && (
                                <span className="ml-2 text-xs font-medium uppercase tracking-wide text-[#00D9FF]/80 bg-[#00D9FF]/10 px-2 py-0.5 rounded-full">
                                    {link.subtitle}
                                </span>
                            )}
                            {link.description && (
                                <div className="
                absolute left-0 top-full pt-2 z-50
                opacity-0 pointer-events-none -translate-y-2 
                group-hover:opacity-100 group-hover:translate-y-0 
                transition-all duration-300 ease-out w-156">
                                    <div className="bg-secondary px-3 py-2 rounded-lg shadow-lg border border-white/10">
                                        <p className="text-neutral-300 text-sm">
                                            {link.description}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}