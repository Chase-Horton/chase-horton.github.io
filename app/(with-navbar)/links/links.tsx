import { Section } from "./section-component";
const sections: Section[] = [
    {
        title: "free books",
        links: [
            {
                title: "Digital Computer Electronics",
                url: "https://ia800809.us.archive.org/34/items/367026792DigitalComputerElectronicsAlbertPaulMalvinoAndJeraldABrownPdf1/367026792-Digital-Computer-Electronics-Albert-Paul-Malvino-and-Jerald-A-Brown-pdf%20%281%29.pdf",
                description: "One of my favorite books. Covers the fundamentals of digital logic design and computer architecture."
            },
            {
                title: "Structure and Interpretation of Computer Programs",
                url: "https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/6515/sicp.zip/index.html",
                description: "The classic computer science book from MIT."
            },
            //{
            //title: "Feynman Lectures on Physics",
            //url: "https://www.feynmanlectures.caltech.edu/",
            //description: "An interesting collection of lectures by Richard Feynman that cover a wide range of physics topics."
            //}
        ],
    },
    //{
    //title: "paid Books",
    //links: [
    //{
    //title: "The Mythical Man Month",
    //url: "https://www.amazon.com/Mythical-Man-Month-Software-Engineering-Anniversary/dp/0201835959",
    //}
    //]
    //},
    {
        title: "fonts",
        links: [
            { title: "Monocraft", url: "https://github.com/IdreesInc/Monocraft" },
            { title: "Berkeley Mono", url: "https://berkeleygraphics.com/typefaces/berkeley-mono/" },
            { title: "JetBrains Mono", url: "https://www.jetbrains.com/lp/mono/" },
            { title: "Inter", url: "https://rsms.me/inter/" },
        ],
    },
    {
        title: "reference",
        links: [
            {
                title: "Refactoring Guru - Software Design Patterns",
                url: "https://refactoring.guru/",
                description: "A comprehensive resource for learning about design patterns and best practices in software development."
            },
            {
                title: "Time Complexity Cheat Sheet",
                url: "https://www.bigocheatsheet.com/",
                description: "A handy reference for the time and space complexity of common algorithms and data structures."
            },
            {
                title: "Google Style Guides",
                url: "https://google.github.io/styleguide/",
                description: "A collection of style guides for various programming languages used at Google."
            },
            {
                title: "Unix Philosophy",
                url: "https://cscie2x.dce.harvard.edu/hw/ch01s06.html",
                description: "A basic set of principles for designing simple, modular, and maintainable software systems."
            },
            {
                title: "Real Math™",
                url: "https://en.wikipedia.org/wiki/IEEE_754",
                description: "The IEEE 754 standard for representing Real Math™,  including fantastic numbers such as +0, -0, and NaN (Not a Number). Where 0.1 + 0.2 ≠ 0.3."
            }
            //{
            //title: "Regex101",
            //url: "https://regex101.com/",
            //description: "An online regex tester and debugger for multiple programming languages."
            //}
        ],
    },
    //{
    //title: "Interesting Websites",
    //links: [
    //{ 
    //title: "Hacker News",
    //url: "https://news.ycombinator.com/",
    //description: "A social network link-sharing website focusing on computer science and entrepreneurship."
    //},
    //],
    //},
    {
        title: "articles",
        links: [
            {
                title: "Reflections on Trusting Trust",
                url: "https://www.cs.cmu.edu/~rdriley/487/papers/Thompson_1984_ReflectionsonTrustingTrust.pdf",
                description: "A surprising paper by Ken Thompson on the nature of trust in software systems.",
            },
            {
                title: "The Bitter Lesson",
                url: "http://www.incompleteideas.net/IncIdeas/BitterLesson.html",
                description: "An interesting realization on the long term trends of fine tuning algorithms vs. brute force.",
            },
            {
                title: "Sigbovik",
                url: "https://sigbovik.org/",
                description: "A site that publishes yearly journals of humurous, usually interesting programming research papers.",
            },
            {
                title: "Dan Luu's Blog",
                url: "https://danluu.com/",
                description: "An interesing blog covering commonly overlooked topics in computer science and programming.",
            },
            {
                title: "Hacker News",
                url: "https://news.ycombinator.com/",
                description: "A social network link-sharing website focusing on computer science and entrepreneurship."
            },
        ],
    },
    {
        title: "fun",
        links: [
            {
                title: "Radio Garden",
                url: "http://radio.garden/",
                description: "Listen to live radio stations around the world by rotating a 3D globe.",
            },
            //{
            //title: "Wikipedia",
            //url: "http://listen.hatnote.com/",
            //description: "An ambient visualization that generates music based on real-time edits to Wikipedia."
            //},
            {
                title: "Pool Suite",
                url: "https://poolsuite.net/",
                description: "A collection of chill music mixes and ambient sounds to relax or focus to.",
            },
            {
                title: "Zoo.js",
                url: "https://zoo.js.org/",
                description: "A collection of JavaScript engine benchmarks."
            },
            {
                title: "Project Euler",
                url: "https://projecteuler.net/",
                description: "A collection of challenging mathematical programming problems to practice.",
            },
            {
                title: "Advent of Code",
                url: "https://adventofcode.com/",
                description: "An annual set of Christmas-themed programming challenges to enjoy during the holiday season.",
            }
            //{
            //title: "KiwiSDR",
            //url: "http://kiwisdr.com/.public/",
            //description: "Listen to shortwave radio from around the world via the browser.",
            //},
        ],
    },
    {
        title: "tools",
        links: [
            {
                title: "Carbon",
                url: "https://carbon.now.sh/",
                description: "A tool for creating and sharing beautiful images of your source code.",
            },
            {
                title: "Everything",
                url: "https://www.voidtools.com/",
                description: "A fast file search tool to find your lost files in Windows.",
            },
            {
                title: "LazyDocker",
                url: "https://github.com/jesseduffield/lazydocker",
                description: "A simple terminal UI for managing your Docker containers.",
            },
            {
                title: "nvim",
                url: "https://neovim.io/",
                description: 'A "modern" fork of vim, the classic terminal-based text editor.',
            },
            {
                title: "Postman",
                url: "https://www.postman.com/",
                description: "A nice tool for testing and debugging APIs.",
            },
            {
                title: "Obsidian",
                url: "https://obsidian.md/",
                description: "An open source note-taking app based on markdown files with a powerful plugin ecosystem.",
            },
            {
                title: "Visual Studio Code",
                url: "https://code.visualstudio.com/",
                description: "A popular open source code editor with a rich ecosystem of extensions.",
            },
            {
                title: "WinDirStat",
                url: "https://windirstat.net/",
                description: "A tool for visualizing disk usage and finding large files taking up space on your computer.",
            },
            {
                title: "WakaTime",
                url: "https://wakatime.com/",
                description: "A time-tracking tool for programmers that integrates with your code editor to show you how much time you spend on each project.",
            },
            //{
            //title: "WhatPulse",
            //url: "https://whatpulse.org/",
            //description: "A tool that tracks your keyboard and mouse usage to help you understand your computing habits.",
            //},
            {
                title: "Zotero",
                url: "https://www.zotero.org/",
                description: "An open source reference manager to help you save and collect papers or websites for reference later.",
            }
        ],
    }
];
for (const section of sections) {
    section.links.sort((a, b) => a.title.localeCompare(b.title));
}
export { sections };