"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribeReduced(cb: () => void) {
    const mq = window.matchMedia(REDUCED);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
}

export function usePrefersReducedMotion(): boolean {
    return useSyncExternalStore(
        subscribeReduced,
        () => window.matchMedia(REDUCED).matches,
        () => false,
    );
}

const easeInOutCubic = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

/** Smoothly animates toward `target` whenever it changes. Instant under reduced motion. */
export function useTween(target: number, duration = 700): number {
    const reduced = usePrefersReducedMotion();
    const [value, setValue] = useState(target);
    const current = useRef(target);

    useEffect(() => {
        if (reduced) return;
        const from = current.current;
        if (from === target) return;
        const start = performance.now();
        let raf = 0;
        const step = (now: number) => {
            const k = Math.min(1, (now - start) / duration);
            const v = from + (target - from) * easeInOutCubic(k);
            current.current = v;
            setValue(v);
            if (k < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [target, duration, reduced]);

    return reduced ? target : value;
}

/** True while the element is on screen; used to pause animation clocks off-screen. */
export function useInView(ref: RefObject<Element | null>): boolean {
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
        io.observe(el);
        return () => io.disconnect();
    }, [ref]);
    return inView;
}

/**
 * A looping play/pause clock running from 0 to `duration` (diagram time units per second × speed).
 * Under reduced motion it starts paused until the user presses play.
 */
export function useClock({ duration, speed = 1, active = true, initial = 0 }: {
    duration: number;
    speed?: number;
    active?: boolean;
    initial?: number;
}) {
    const reduced = usePrefersReducedMotion();
    const [t, setT] = useState(initial);
    const [wantsPlay, setWantsPlay] = useState(true);
    const [userTouched, setUserTouched] = useState(false);
    const playing = wantsPlay && (!reduced || userTouched);
    const running = playing && active;

    useEffect(() => {
        if (!running) return;
        let last = performance.now();
        let raf = 0;
        const step = (now: number) => {
            const dt = Math.min(0.1, (now - last) / 1000);
            last = now;
            setT((prev) => {
                const next = prev + dt * speed;
                return next > duration ? 0 : next;
            });
            raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [running, duration, speed]);

    const toggle = useCallback(() => {
        setUserTouched(true);
        setWantsPlay(!playing);
    }, [playing]);
    const scrub = useCallback((v: number) => {
        setUserTouched(true);
        setWantsPlay(false);
        setT(v);
    }, []);
    const restart = useCallback(() => setT(0), []);

    return { t, scrub, playing, toggle, restart, duration };
}
export type Clock = ReturnType<typeof useClock>;
