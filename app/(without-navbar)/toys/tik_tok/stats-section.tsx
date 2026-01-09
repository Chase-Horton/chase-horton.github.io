"use client"
import { useEffect, useRef, useState } from "react";

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
    const [isDebug, setIsDebug] = useState(false)

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = new Audio("/audio/tik-tok-2.mp3");

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === ".") {
                e.preventDefault()
                setIsDebug((prev) => !prev);
            }
        }
        window.addEventListener("keydown", handleKeyDown)

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioContext.createMediaElementSource(audio);
        const gainNode = audioContext.createGain();

        source.connect(gainNode);
        gainNode.connect(audioContext.destination);

        audio.loop = true;
        gainNode.gain.value = 0; // start silent for fade-in

        audioRef.current = audio;

        (audio as any)._audioContext = audioContext;
        (audio as any)._gainNode = gainNode;

        return () => {
            audio.pause()
            source.disconnect();
            gainNode.disconnect();
            audioContext.close();
            audio.src = "";
            window.removeEventListener("keydown", handleKeyDown)
        };
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!isDebug) return;
        if (!audio || !birthdate) return;

        const audioContext = (audio as any)._audioContext;

        const waitForSecondFlip = () => {
            const now = Date.now();
            const msUntilNextSecond = 1000 - (now % 1000);

            if (msUntilNextSecond < 20) {
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }

                audio.play().then(() => {
                    fadeAudio(audio, true);
                }).catch(e => console.log("Autoplay prevented:", e));
            } else {
                requestAnimationFrame(waitForSecondFlip);
            }
        };

        waitForSecondFlip();
    }, [isDebug]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (!isDebug) {
            fadeAudio(audio, false);
        } 
    }, [isDebug]);

const fadeAudio = (
    audio: HTMLAudioElement, 
    fadeIn: boolean, 
    targetVolume: number = 0.3, 
    fadeDuration: number = 2000
) => {
    const gainNode = (audio as any)._gainNode;
    if (!gainNode) return;
    
    const startVolume = fadeIn ? 0 : gainNode.gain.value;
    const endVolume = fadeIn ? targetVolume : 0;
    const startTime = Date.now();
    
    const tick = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed < fadeDuration) {
            const progress = elapsed / fadeDuration;
            gainNode.gain.value = startVolume + (endVolume - startVolume) * progress;
            requestAnimationFrame(tick);
        } else {
            gainNode.gain.value = endVolume;
            if (!fadeIn) audio.pause();
        }
    };
    tick();
};

    const statsItems = [
        { label: "years", value: timeRemaining.years, colSpan: '' },
        { label: "months", value: timeRemaining.months, colSpan: '' },
        { label: "weeks", value: timeRemaining.weeks, colSpan: '' },
        { label: "days", value: timeRemaining.days, colSpan: '' },
        { label: "hours", value: timeRemaining.hours, colSpan: 'md:col-span-2' },
        { label: "min", value: timeRemaining.minutes, colSpan: 'md:col-span-2' },
        { label: "sec", value: timeRemaining.seconds, colSpan: 'md:col-span-2' },
        { label: "ms", value: timeRemaining.milliseconds, colSpan: 'md:col-span-2' },
        { label: "life", value: timeRemaining.percentageLived.toFixed(7), colSpan: 'md:col-span-2' },
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