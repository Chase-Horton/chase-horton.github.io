export const BASE = "/toys/relativity";

export const chapters = [
    {
        slug: "position-time",
        title: "position–time graphs",
        blurb: "turning motion into a picture: events, worldlines, and what slope really means.",
    },
    {
        slug: "stationary-observers",
        title: "stationary observers",
        blurb: "two people, one line, different labels. coordinates are choices; events are real.",
    },
    {
        slug: "moving-observers",
        title: "moving observers",
        blurb: "ride the train. who is really at rest? (nobody gets to decide.)",
    },
    {
        slug: "galilean",
        title: "the galilean transformation",
        blurb: "the common-sense rule for switching frames is a shear, and it keeps time absolute.",
    },
    {
        slug: "constant-c",
        title: "c is constant",
        blurb: "light refuses to shear. to see why that matters, we first have to fix our units.",
    },
] as const;

export type Chapter = (typeof chapters)[number];

export function chapterHref(c: Chapter) {
    return `${BASE}/${c.slug}`;
}
