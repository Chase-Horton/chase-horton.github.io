interface TimeRemaining {
    years: number;
    months: number;
    weeks: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
    remaining: number;
    percentageLived: number;
}
export function StatsSection({ birthdate, timeRemaining }: { birthdate: Date | null, timeRemaining: TimeRemaining }) {
    if (!birthdate || !timeRemaining) {
        return null;
    }
    const statsItems = [
        { label: "years", value: timeRemaining.years, colSpan: '' },
        { label: "months", value: timeRemaining.months, colSpan: '' },
        { label: "weeks", value: timeRemaining.weeks, colSpan: '' },
        { label: "days", value: timeRemaining.days, colSpan: '' },
        { label: "hours", value: timeRemaining.hours, colSpan: 'md:col-span-2' },
        { label: "min", value: timeRemaining.minutes, colSpan: 'md:col-span-2' },
        { label: "sec", value: timeRemaining.seconds, colSpan: 'md:col-span-2' },
        { label: "ms", value: timeRemaining.milliseconds, colSpan: 'md:col-span-2' },
        { label: "life", value: timeRemaining.percentageLived.toFixed(6), colSpan: 'md:col-span-2' },
    ]
    return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {birthdate && timeRemaining && (
                            <div className="w-full max-w-4xl mx-auto space-y-24 font-mono">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-12 gap-y-16">
                                    {statsItems.map((item, index) => {
                                        return (
                                            <div
                                                key={item.label}
                                                className={`flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards ${item.colSpan}`}
                                                style={{
                                                    animationDelay: `${index * 100}ms`,
                                                    animationDuration: "700ms"
                                                }}
                                            >
                                                <span className="text-xs text-muted-foreground/40 lowercase tracking-widest">
                                                    {item.label}{item.label === 'life' ? '_lived' : '_rem'}
                                                </span>
                                                <span className="text-4xl md:text-5xl font-light tracking-tighter text-foreground">
                                                    {item.value.toLocaleString()}
                                                    {item.label === 'life' ? '%' : ''}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
    )
}