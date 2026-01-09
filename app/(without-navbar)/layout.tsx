export default function WithoutNavbarLayout({
  children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
        <main className="flex-1 flex flex-col">
            {children}
        </main>
        </>
    );
}