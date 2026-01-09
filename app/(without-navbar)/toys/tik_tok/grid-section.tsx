import { cn } from "@/lib/utils"

export function GridSection({ weeksLived }: { weeksLived: number }) {
    return (
        <>
            <div className="block sm:hidden text-center py-12">
                <p className="text-muted-foreground mb-4">Grid view can't display on small screens.</p>
                <p>Try viewing on a larger device.</p>
            </div>

            {/* desktop: show the full grid */}
            <div className="hidden sm:flex overflow-x-auto pb-4 justify-center">
                <div className="inline-flex flex-col gap-1 items-center">
                    {Array.from({ length: 90 }, (_, rowIndex) => {
                        const yearNum = rowIndex + 1;
                        const showLabel = yearNum % 5 === 0;

                        return (
                        <div key={rowIndex} className="flex gap-1">
                            {/* year label */}
                            <div className="w-8 text-right pr-3 text-[10px] text-muted-foreground/60 font-mono tabular-nums select-none">
                                {showLabel ? yearNum : ""}
                            </div>
                            {Array.from({ length: 52 }, (_, colIndex) => {
                                const weekNumber = rowIndex * 52 + colIndex
                                const isLived = weekNumber < weeksLived
                                // week square
                                return (
                                    <div
                                        key={colIndex}
                                        className={cn(
                                            "size-3 rounded-xs border transition-colors",
                                            isLived
                                                ? "bg-green-500 border-green-600 dark:bg-green-600 dark:border-green-700"
                                                : "bg-muted border-border",
                                        )}
                                        title={`Week ${weekNumber + 1} (Year ${Math.floor(weekNumber / 52) + 1}, Week ${(weekNumber % 52) + 1})`}
                                    />
                                )
                            })}
                        </div>
                    )
                    })}


                    {/* legend */}
                    <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <div className="size-3 rounded-xs bg-green-500 border-green-600 dark:bg-green-600 dark:border-green-700" />
                            <span>Weeks lived</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="size-3 rounded-xs bg-muted border-border" />
                            <span>Weeks remaining</span>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}