"use client"

import { Animation } from "@/content/animations"

interface AnimationCardProps {
  animation: Animation
  index: number
}

export function AnimationCard({ animation, index }: AnimationCardProps) {
  return (
    <div
      className="animate-blur-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <video
        className="w-full rounded-lg"
        controls
        preload="none"
        poster=""
      >
        <source src={animation.video} type="video/mp4" />
      </video>
      <h2 className="text-lg font-mono text-foreground mt-3">
        {animation.title}
      </h2>
      <p className="text-muted-foreground text-sm mt-1">
        {animation.blurb}
      </p>
      <details className="mt-2">
        <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
          show math
        </summary>
        <pre className="mt-2 p-3 bg-white/5 rounded text-sm font-mono text-muted-foreground overflow-x-auto">
          {animation.latex}
        </pre>
      </details>
    </div>
  )
}
