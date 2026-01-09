import { NavBar } from "@/components/nav-bar";

export default function WithNavbarLayout({
  children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <NavBar />
            <main className="flex-1 flex flex-col">
                {children}
            </main>
        </>
    );
}