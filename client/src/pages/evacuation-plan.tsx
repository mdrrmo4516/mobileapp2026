import { useLocation } from "wouter";
import { ArrowLeft, MapPin, Navigation, Users, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function EvacuationPlan() {
  const [, setLocation] = useLocation();

  const centers = [
    { name: "Pio Duran Central School", distance: "0.5 km", capacity: "500 pax", status: "Open" },
    { name: "Municipal Gymnasium", distance: "1.2 km", capacity: "1000 pax", status: "Open" },
    { name: "Barangay Hall Shelter", distance: "2.5 km", capacity: "200 pax", status: "Full" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl relative">
      <header className="bg-brand-blue text-white p-4 sticky top-0 z-20 shadow-md flex items-center gap-3">
        <button onClick={() => setLocation("/")} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-display font-bold text-xl tracking-wide uppercase">Evacuation Plan</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24 space-y-6">
        {/* Map Section */}
        <div className="relative h-64 bg-slate-200 rounded-xl overflow-hidden shadow-inner border border-slate-300">
           <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Pio_Duran_Albay.png/640px-Pio_Duran_Albay.png')] bg-cover bg-center opacity-60 grayscale"></div>
           <div className="absolute inset-0 flex items-center justify-center">
             <span className="bg-white/80 px-3 py-1 rounded text-xs font-bold text-slate-600 backdrop-blur-sm">Interactive Map Preview</span>
           </div>
           {/* Mock Pins */}
           <div className="absolute top-1/3 left-1/4 text-brand-red animate-bounce"><MapPin fill="currentColor" /></div>
           <div className="absolute bottom-1/3 right-1/3 text-green-600"><MapPin fill="currentColor" /></div>
        </div>

        {/* Nearest Centers */}
        <section>
          <h2 className="text-brand-blue font-bold text-lg mb-3 flex items-center gap-2">
            <Navigation size={20} /> Nearest Evacuation Centers
          </h2>
          <div className="space-y-3">
            {centers.map((center, idx) => (
              <Card key={idx} className="border-l-4 border-l-brand-yellow overflow-hidden">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-brand-blue">{center.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                      <span className="flex items-center gap-1"><Navigation size={12} /> {center.distance}</span>
                      <span className="flex items-center gap-1"><Users size={12} /> {center.capacity}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${center.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {center.status}
                    </span>
                    <Button size="sm" className="h-8 bg-brand-blue text-white hover:bg-brand-blue/90">
                      Navigate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
          <Info className="text-blue-600 shrink-0" />
          <div>
            <h4 className="font-bold text-blue-800 text-sm">Evacuation Guidelines</h4>
            <p className="text-xs text-blue-700 mt-1">Always bring your Go Bag. secure your home before leaving. Follow the instructions of local officials.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
