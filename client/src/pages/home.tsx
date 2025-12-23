import { Header } from "@/components/Header";
import { DashboardGrid } from "@/components/DashboardGrid";
import { BottomNav } from "@/components/BottomNav";

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-blue flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative">
  {/* Fixed texture overlay */}
  <div 
    className="absolute inset-0 bg-[url('/as2.webp')] bg-cover bg-center bg-no-repeat mix-blend-overlay opacity-30 z-0"
  ></div>
  
  {/* Content wrapper for better stacking */}
  <div className="relative z-10 flex flex-col min-h-screen">
    <Header />
    <main className="flex-1 flex flex-col">
      <DashboardGrid />
    </main>
    <BottomNav />
  </div>
</div>
  );
}
