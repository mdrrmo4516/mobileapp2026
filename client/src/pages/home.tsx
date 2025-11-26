import { Header } from "@/components/Header";
import { DashboardGrid } from "@/components/DashboardGrid";
import { BottomNav } from "@/components/BottomNav";

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-blue flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {/* Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] mix-blend-overlay z-0"></div>
      
      <Header />
      
      <main className="flex-1 relative z-10 overflow-hidden flex flex-col">
        <DashboardGrid />
      </main>

      <BottomNav />
    </div>
  );
}
