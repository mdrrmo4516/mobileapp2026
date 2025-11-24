import { useLocation } from "wouter";
import { ArrowLeft, FileText, Download, Search } from "lucide-react";

export default function PublicDocuments() {
  const [, setLocation] = useLocation();

  const docs = [
    { title: "MDRRMO Annual Budget 2025", size: "2.4 MB", date: "Nov 20, 2024" },
    { title: "Disaster Risk Reduction Plan", size: "5.1 MB", date: "Oct 15, 2024" },
    { title: "Evacuation Center Guidelines", size: "1.2 MB", date: "Sep 01, 2024" },
    { title: "Executive Order No. 24-05", size: "800 KB", date: "Aug 12, 2024" },
    { title: "Community Drill Report", size: "3.5 MB", date: "Jul 20, 2024" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl relative">
      <header className="bg-brand-blue text-white p-4 sticky top-0 z-20 shadow-md flex items-center gap-3">
        <button onClick={() => setLocation("/")} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-display font-bold text-xl tracking-wide uppercase">Public Documents</h1>
      </header>

      <div className="p-4 bg-white shadow-sm sticky top-[72px] z-10">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search documents..." 
            className="w-full bg-slate-100 border-none rounded-xl py-3 pl-10 pr-4 text-slate-700 focus:ring-2 focus:ring-brand-blue/20"
          />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 pb-24 space-y-3">
        {docs.map((doc, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-brand-blue/50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="bg-red-50 p-2 rounded-lg text-red-600 mt-1">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-bold text-brand-blue text-sm line-clamp-2">{doc.title}</h3>
                <div className="flex gap-2 text-xs text-slate-400 mt-1">
                  <span>{doc.size}</span>
                  <span>•</span>
                  <span>{doc.date}</span>
                </div>
              </div>
            </div>
            <button className="p-2 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-full transition-colors">
              <Download size={20} />
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}
