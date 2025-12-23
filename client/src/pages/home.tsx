import { Header } from "@/components/Header";
import { DashboardGrid } from "@/components/DashboardGrid";
import { BottomNav } from "@/components/BottomNav";

export default function Home() {
  return (
<div className="min-h-screen bg-brand-blue flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative">
  {/* Background Image Container */}
  <div 
    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 z-0"
    style={{ backgroundImage: "url('/as2.webp')" }}
  ></div>
  
  {/* Optional overlay for better readability */}
  <div className="absolute inset-0 bg-brand-blue/30 z-0"></div>
  
  {/* Content */}
  <div className="relative z-10">
    <Header />
    
    <main className="flex-1 overflow-hidden flex flex-col">
      <DashboardGrid />
    </main>

    <BottomNav />
  </div>
</div>
  );
}
