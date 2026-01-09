"use client"
import { cn } from "@/lib/utils";
import { useEffect, useState, useCallback } from "react";
import CalendarComponent from "./calendar-dropdown";
import { GridSection } from "./grid-section";
import { StatsSection } from "./stats-section";
export default function TikTokPage() {
    const [birthdate, setBirthdate] = useState<Date | undefined>(undefined);
    const [view, setView] = useState<"grid" | "remaining">("remaining")
    const [now, setNow] = useState(Date.now())

    const handleCalendarUpdate = useCallback((date: Date | undefined) => {
        setBirthdate(date);
    }, []);


    const weeksLived = birthdate ? Math.floor((now - birthdate.getTime()) / (7 * 24 * 60 * 60 * 1000)) : 0

    useEffect(() => {
        if (view !== "remaining" || !birthdate) return;

        const interval = setInterval(() => {
            setNow(Date.now())
        }, 33)

        return () => clearInterval(interval)
    }, [view, birthdate]);

    const calculateRemainingTime = () => {
        if (!birthdate) return null

        const lifeExpectancy = 90 * 365.25 * 24 * 60 * 60 * 1000 // 90 years in ms
        const lived = now - birthdate.getTime()
        const remaining = Math.max(0, lifeExpectancy - lived)

        const years = Math.floor(remaining / (365.25 * 24 * 60 * 60 * 1000))
        const months = Math.floor(remaining / (30.44 * 24 * 60 * 60 * 1000))
        const weeks = Math.floor(remaining / (7 * 24 * 60 * 60 * 1000))
        const days = Math.floor(remaining / (24 * 60 * 60 * 1000))
        const hours = Math.floor(remaining / (60 * 60 * 1000))
        const minutes = Math.floor(remaining / (60 * 1000))
        const seconds = Math.floor(remaining / 1000)
        const milliseconds = Math.floor(remaining)

        const percentageLived = (lived / lifeExpectancy) * 100

        return { years, months, weeks, days, hours, minutes, seconds, milliseconds, remaining, percentageLived }
    }

    const timeRemaining = calculateRemainingTime()

    return (<div className="font-mono min-h-screen relative">
        <div className="mx-auto max-w-7xl px-6 pt-16">
            <div className="flex flex-col items-center gap-2">

                {/* title */}
                <p className="text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: "500ms", animationDuration: "700ms", animationFillMode: "backwards" }}
                >tick_tock</p>

                <div className="flex flex-col pt-5 items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: "700ms", animationDuration: "700ms", animationFillMode: "backwards" }}
                >

                    {/* date picker  */}
                    <CalendarComponent setBirthdate={handleCalendarUpdate} birthdate={birthdate} />

                    {/* weeks lived */}
                    {birthdate && (
                        <div className="flex flex-col items-center">
                            <span className="text-sm text-muted-foreground mb-4">
                                {weeksLived.toLocaleString()} week{weeksLived !== 1 ? "s" : ""} gone.
                            </span>
                        </div>
                    )}
                </div>
            </div>



            {birthdate && (<div className="mt-9 flex flex-col items-center">
                {/* view toggles */}
                <div className="flex items-center gap-4 text-sm mb-8">
                    <button
                        onClick={() => setView("remaining")}
                        className={cn(
                            "transition-colors hover:text-foreground",
                            view === "remaining"
                                ? "text-foreground underline underline-offset-4"
                                : "text-muted-foreground"
                        )}
                    >
                        remaining
                    </button>
                    <span className="text-muted-foreground/30">/</span>
                    <button
                        onClick={() => setView("grid")}
                        className={cn(
                            "transition-colors hover:text-foreground",
                            view === "grid"
                                ? "text-foreground underline underline-offset-4"
                                : "text-muted-foreground"
                        )}
                    >
                        grid
                    </button>
                </div>
                {view == "grid" ? (
                    <GridSection weeksLived={weeksLived} />
                ) : (
                    <StatsSection birthdate={birthdate || null} timeRemaining={timeRemaining!} />
                )}
            </div>)}
            {birthdate && (
                <footer
                    key={`footer-${view}`}
                    className={`text-center text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-500 ${
                        view === "remaining" ? "absolute bottom-10 left-0 w-full" : "mt-6 mb-6"
                    }`}
                    style={{
                        animationDelay: "900ms",
                        animationDuration: "700ms",
                        animationFillMode: "backwards",
                    }}
                >
                    Inspired by <a href="https://waitbutwhy.com/2014/05/life-weeks.html" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-blue-400 underline">Tim Urban's Post</a> — Your Life in Weeks.
                </footer>
            )}
        </div>
    </div>
    )
}