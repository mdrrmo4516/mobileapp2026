import { useLocation } from "wouter";
import { ArrowLeft, PlayCircle, BookOpen, ChevronRight } from "lucide-react";

export default function LearningMaterials() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl relative">
      <header className="bg-brand-blue text-white p-4 sticky top-0 z-20 shadow-md flex items-center gap-3">
        <button onClick={() => setLocation("/")} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-display font-bold text-xl tracking-wide uppercase">Learning Materials</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24 space-y-6">
        
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-bold text-brand-blue text-lg">Video Tutorials</h2>
            <button className="text-xs font-bold text-brand-blue/70">View All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {[1, 2, 3].map((i) => (
              <div key={i} className="snap-center shrink-0 w-64 bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm group cursor-pointer">
                <div className="aspect-video bg-slate-800 relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/30"></div>
                  <PlayCircle className="text-white opacity-80 group-hover:opacity-100 transform group-hover:scale-110 transition-all" size={48} />
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-brand-blue text-sm">Basic First Aid Training {i}</h3>
                  <p className="text-xs text-slate-500 mt-1">10:45 mins • Education</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-bold text-brand-blue text-lg mb-3 px-1">Guides & Articles</h2>
          <div className="space-y-3">
            {[
              "Understanding Earthquake Magnitudes", 
              "How to perform CPR correctly", 
              "Water Sanitation Methods",
              "Emergency Signals and Codes"
            ].map((title, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors">
                 <div className="bg-brand-yellow/20 text-brand-blue p-3 rounded-lg">
                   <BookOpen size={20} />
                 </div>
                 <div className="flex-1">
                   <h3 className="font-bold text-brand-blue text-sm">{title}</h3>
                   <p className="text-xs text-slate-400 mt-1">Read Article</p>
                 </div>
                 <ChevronRight size={16} className="text-slate-300" />
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
