import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: (props) => (
      <h1 className="mb-12 text-5xl font-bold leading-tight tracking-tight text-balance lg:text-6xl" {...props} />
    ),
    pre: (props) => <pre className="rounded-lg overflow-hidden mb-6" {...props} />,
    code: (props) => <code className="rounded bg-muted px-1.5 py-0.5" {...props} />,
    h2: (props) => <h2 className="mb-8 mt-14 text-4xl font-bold tracking-tight scroll-mt-24" {...props} />,
    h3: (props) => <h3 className="mb-6 mt-6 text-2xl font-bold tracking-tight scroll-mt-24" {...props} />,
    p: (props) => { return (
      <p className="mb-6 text-lg leading-relaxed text-muted-foreground" {...props} />
    ); },
    strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
    em: (props) => <em className="italic text-foreground" {...props} />,
    li: (props) => <li className="text-lg leading-relaxed text-muted-foreground" {...props} />,
    ul: (props) => <ul className="mb-6 ml-6 space-y-3 list-disc marker:text-[#00D9FF]" {...props} />,
    a: (props) => <a className="text-[#00D9FF] font-medium hover:underline" {...props} />,
  };
}
