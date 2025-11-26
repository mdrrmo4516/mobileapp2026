import { useLocation } from "wouter";
import { ArrowLeft, Flashlight, Volume2, Compass, Siren, AlertOctagon } from "lucide-react";
import { useState } from "react";

export default function EmergencyTools() {
  const [, setLocation] = useLocation();
  const [isFlashlightOn, setFlashlightOn] = useState(false);
  const [isSirenOn, setSirenOn] = useState(false);

  return (
    <div className={`min-h-screen flex flex-col max-w-md mx-auto shadow-2xl relative transition-colors duration-500 ${isFlashlightOn ? 'bg-white' : 'bg-slate-900'}`}>
      <header className="bg-brand-blue text-white p-4 sticky top-0 z-20 shadow-md flex items-center gap-3">
        <button onClick={() => setLocation("/")} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-display font-bold text-xl tracking-wide uppercase">Emergency Tools</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6 grid grid-cols-2 gap-4 content-start">
        
        {/* Flashlight */}
        <button 
          onClick={() => setFlashlightOn(!isFlashlightOn)}
          className={`col-span-2 aspect-video rounded-2xl border-4 flex flex-col items-center justify-center gap-3 transition-all shadow-lg
            ${isFlashlightOn 
              ? 'bg-yellow-100 border-yellow-400 text-yellow-700 shadow-yellow-200' 
              : 'bg-slate-800 border-slate-700 text-slate-400'}`}
        >
          <Flashlight size={48} className={isFlashlightOn ? 'fill-current' : ''} />
          <span className="font-bold text-xl uppercase tracking-widest">{isFlashlightOn ? 'ON' : 'OFF'}</span>
        </button>

        {/* Siren */}
        <button 
          onClick={() => setSirenOn(!isSirenOn)}
          className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all shadow-md
            ${isSirenOn 
              ? 'bg-red-600 border-red-500 text-white animate-pulse' 
              : 'bg-slate-800 border-slate-700 text-slate-400'}`}
        >
          <Siren size={32} className={isSirenOn ? 'animate-bounce' : ''} />
          <span className="font-bold text-sm">SIREN</span>
        </button>

        {/* Compass Placeholder */}
        <button className="aspect-square rounded-2xl border-2 border-slate-700 bg-slate-800 text-slate-400 flex flex-col items-center justify-center gap-2 shadow-md">
          <Compass size={32} />
          <span className="font-bold text-sm">COMPASS</span>
        </button>

        {/* SOS */}
        <button className="col-span-2 bg-red-600 text-white rounded-2xl p-4 font-bold text-xl tracking-widest border-2 border-red-400 shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-3">
          <AlertOctagon /> SEND S.O.S. SIGNAL
        </button>

      </main>
      
      {/* Overlay for flashlight effect */}
      {isFlashlightOn && (
        <div className="absolute inset-0 pointer-events-none bg-white opacity-10 z-0"></div>
      )}
    </div>
  );
}
