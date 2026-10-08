// A 2D affine map between coordinate systems, written for spacetime (x, t):
//   x' = a·x + b·t + e
//   t' = c·x + d·t + f
// Stored as [a, b, c, d, e, f].
export type Affine = readonly [number, number, number, number, number, number];
export type Vec = [number, number];

export const IDENTITY: Affine = [1, 0, 0, 1, 0, 0];

export function apply(m: Affine, x: number, t: number): Vec {
    return [m[0] * x + m[1] * t + m[4], m[2] * x + m[3] * t + m[5]];
}

export function invert(m: Affine): Affine | null {
    const [a, b, c, d, e, f] = m;
    const det = a * d - b * c;
    if (Math.abs(det) < 1e-9) return null;
    const ia = d / det, ib = -b / det, ic = -c / det, id = a / det;
    return [ia, ib, ic, id, -(ia * e + ib * f), -(ic * e + id * f)];
}

export function lerpAffine(m1: Affine, m2: Affine, p: number): Affine {
    return m1.map((v, i) => v + (m2[i] - v) * p) as unknown as Affine;
}

/** A stationary observer whose origin sits at x = d, whose clock reads 0 at t = t0, and whose x points in direction s (±1). */
export function shift(d: number, t0: number, s: 1 | -1 = 1): Affine {
    return [s, 0, 0, 1, -s * d, -t0];
}

/** Galilean boost: an observer moving at velocity v who passes x = x0 at t = 0. */
export function galilean(v: number, x0 = 0): Affine {
    return [1, -v, 0, 1, -x0, 0];
}

/** Rotate the coordinate axes by theta (radians, counter-clockwise). */
export function rotation(theta: number): Affine {
    const c = Math.cos(theta), s = Math.sin(theta);
    return [c, s, -s, c, 0, 0];
}

export function scale(sx: number, st: number): Affine {
    return [sx, 0, 0, st, 0, 0];
}

/** Format a number for readouts: fixed digits, real minus sign, no "-0". */
export function fmt(n: number, digits = 2): string {
    if (!Number.isFinite(n)) return n > 0 ? "∞" : "−∞";
    const s = n.toFixed(digits);
    if (Number(s) === 0) return (0).toFixed(digits);
    return s.startsWith("-") ? "−" + s.slice(1) : s;
}

export function sample(f: (t: number) => number, t0: number, t1: number, n = 160): Vec[] {
    const out: Vec[] = [];
    for (let i = 0; i <= n; i++) {
        const t = t0 + ((t1 - t0) * i) / n;
        out.push([f(t), t]);
    }
    return out;
}
