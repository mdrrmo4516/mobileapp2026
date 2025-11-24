import { useLocation } from "wouter";
import { ArrowLeft, Waves, Wind, Flame, ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function DisasterPlan() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl relative">
      <header className="bg-brand-blue text-white p-4 sticky top-0 z-20 shadow-md flex items-center gap-3">
        <button onClick={() => setLocation("/")} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-display font-bold text-xl tracking-wide uppercase">Disaster Plan</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
        <div className="bg-yellow-50 border border-brand-yellow/50 rounded-xl p-4 text-yellow-800 text-sm mb-4">
          <strong>Be Prepared!</strong> Knowing what to do before, during, and after a disaster can save lives.
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          
          <AccordionItem value="typhoon" className="bg-white border border-slate-200 rounded-xl px-4 shadow-sm data-[state=open]:border-brand-blue data-[state=open]:ring-1 data-[state=open]:ring-brand-blue/20">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Wind size={20} /></div>
                <span className="font-bold text-brand-blue text-lg">Typhoon</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 space-y-3 pb-4">
              <div className="space-y-1">
                <h4 className="font-bold text-brand-blue">Before</h4>
                <p>Monitor weather updates. Inspect your house and repair weak parts. Prepare your Go Bag.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-brand-blue">During</h4>
                <p>Stay indoors. Keep calm. Turn off main power switch if water enters the house.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-brand-blue">After</h4>
                <p>Check for damages. Watch out for live wires. Do not wade in floodwaters.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="flood" className="bg-white border border-slate-200 rounded-xl px-4 shadow-sm data-[state=open]:border-brand-blue data-[state=open]:ring-1 data-[state=open]:ring-brand-blue/20">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="bg-cyan-100 p-2 rounded-lg text-cyan-600"><Waves size={20} /></div>
                <span className="font-bold text-brand-blue text-lg">Flood</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 space-y-3 pb-4">
              <p>Move to higher ground immediately. Avoid walking or driving through floodwaters. 6 inches of moving water can knock you down.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="fire" className="bg-white border border-slate-200 rounded-xl px-4 shadow-sm data-[state=open]:border-brand-blue data-[state=open]:ring-1 data-[state=open]:ring-brand-blue/20">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg text-red-600"><Flame size={20} /></div>
                <span className="font-bold text-brand-blue text-lg">Fire</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 space-y-3 pb-4">
              <p>Stop, Drop, and Roll if clothes catch fire. Crawl low under smoke. Call the BFP hotline immediately.</p>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </main>
    </div>
  );
}
