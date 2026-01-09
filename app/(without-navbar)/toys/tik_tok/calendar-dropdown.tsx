import { Calendar } from "@/components/ui/calendar";
import { useState, memo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function CalendarComponent( { birthdate, setBirthdate }: { birthdate: Date | undefined, setBirthdate: (date: Date | undefined) => void }) {
    const [calendarOpen, setCalendarOpen] = useState(false);
return (
                        <div className="relative">
                            <Popover open={calendarOpen} onOpenChange={setCalendarOpen} modal={true}>
                                <PopoverTrigger asChild>
                                    <button
                                        className={cn(
                                            "flex items-center gap-2 text-xl font-medium transition-colors",
                                            "decoration-muted-foreground/30 underline underline-offset-8", // The minimal link look
                                            "hover:text-foreground hover:decoration-foreground",
                                            !birthdate ? "text-muted-foreground" : "text-foreground"
                                        )}
                                    >
                                        {birthdate ? birthdate.toLocaleDateString() : "select your birthday"}
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="center">
                                    <Calendar
                                        mode="single"
                                        selected={birthdate}
                                        onSelect={(date) => {setBirthdate(date); setCalendarOpen(false);}}
                                        captionLayout="dropdown"
                                        required
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
)
}
export default memo(CalendarComponent)