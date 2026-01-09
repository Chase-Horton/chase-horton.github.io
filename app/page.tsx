import { HomeContent } from "@/components/home-content";
import { NavBar } from "@/components/nav-bar";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex-1 flex flex-col">
        <HomeContent />
      </main>
    </>
  );
}
