"use client";
import { Header } from "./header";

export function TitlePage({ title, description, children }: { title: string, description: string, children: React.ReactNode }) {
    return (
        <>
    <div className="min-h-screen relative pt-16">
      <div className="mx-auto max-w-3xl px-6 py-16">
            <Header title={title} description={description} />
                    {children}
                </div>
            </div>
        </>
    )
}