"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Github } from "lucide-react"

export default function ExampleProjectPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen relative pt-16">
      <div className="mx-auto max-w-3xl px-6 py-16">
        {mounted && (
          <>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-blue-400 transition-colors mb-8 animate-blur-in"
              style={{ animationDelay: "100ms" }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-mono text-sm">Back to projects</span>
            </Link>

            <div className="mb-8 animate-blur-in" style={{ animationDelay: "200ms" }}>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                This Site<span className="text-blue-400">.</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-6 text-balance">
                A modern web application showcasing interesting technologies.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Next.js", "TypeScript", "React", "Tailwind CSS"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-3 py-1 rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-400 text-background font-medium hover:bg-blue-500 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-foreground font-medium hover:border-blue-400/50 hover:text-blue-400 transition-all"
                >
                  <Github className="w-4 h-4" />
                  View Source
                </a>
              </div>
            </div>

            <div className="space-y-8 animate-blur-in" style={{ animationDelay: "300ms" }}>
              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  Overview<span className="text-blue-400">.</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This project demonstrates a comprehensive approach to building modern web applications. It features a
                  clean, responsive design with smooth animations and an intuitive user experience.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Built with performance and accessibility in mind, the application leverages the latest web
                  technologies to deliver a fast, reliable experience across all devices.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  Screenshots<span className="text-blue-400">.</span>
                </h2>
                <div className="space-y-6">
                  <div className="border border-white/10 rounded-lg overflow-hidden bg-muted">
                    <img src="/modern-dashboard-with-dark-theme-and-charts.jpg" alt="Dashboard view" className="w-full" />
                    <div className="p-4 bg-card border-t border-white/10">
                      <p className="text-sm text-muted-foreground font-mono">Dashboard with real-time analytics</p>
                    </div>
                  </div>

                  <div className="border border-white/10 rounded-lg overflow-hidden bg-muted">
                    <img src="/clean-settings-interface-with-toggle-switches.jpg" alt="Settings view" className="w-full" />
                    <div className="p-4 bg-card border-t border-white/10">
                      <p className="text-sm text-muted-foreground font-mono">Intuitive settings panel</p>
                    </div>
                  </div>

                  <div className="border border-white/10 rounded-lg overflow-hidden bg-muted">
                    <img src="/mobile-responsive-design-on-phone.jpg" alt="Mobile view" className="w-full" />
                    <div className="p-4 bg-card border-t border-white/10">
                      <p className="text-sm text-muted-foreground font-mono">Fully responsive mobile experience</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  Key Features<span className="text-blue-400">.</span>
                </h2>
                <ul className="space-y-3">
                  {[
                    "Server-side rendering for optimal performance",
                    "Type-safe development with TypeScript",
                    "Responsive design that works on all screen sizes",
                    "Dark mode with smooth theme transitions",
                    "Accessible components following WCAG guidelines",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-blue-400 mt-1">▸</span>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  Technical Details<span className="text-blue-400">.</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The project uses Next.js 15 with the App Router for efficient routing and rendering. Styling is
                  handled by Tailwind CSS v4, providing a utility-first approach with excellent developer experience.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  State management is kept simple with React hooks and server components where appropriate, reducing
                  client-side JavaScript and improving initial load times.
                </p>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
