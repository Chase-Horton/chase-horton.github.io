import Link from "next/link";

export function ComingSoon() {
  return (
    <div className="flex flex-col min-h-[400px] gap-6">
          <div className="pt-10 text-muted-foreground text-3xl font-mono animate-blur-in italic mt-8 md:mt-0" style={{animationDelay: "200ms"}}>
            coming soon!
          </div>
          <div className="text-muted-foreground text-3xl font-mono animate-blur-in italic mt-8 md:mt-0" style={{animationDelay: "200ms"}}>
            for now check out my <Link href="https://github.com/chase-horton" className="text-green-400 animate-pulse hover:text-blue-400">github</Link>
          </div>
    </div>
  )
}