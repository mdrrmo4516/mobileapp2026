import { useLocation } from "wouter";
import { ArrowLeft, CloudRain, CloudSun, Wind, Droplets, ThermometerSun } from "lucide-react";

export default function WeatherOutlook() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-brand-blue flex flex-col max-w-md mx-auto shadow-2xl relative text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <div className="absolute top-10 left-10 w-64 h-64 bg-brand-yellow rounded-full blur-[100px]"></div>
         <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-400 rounded-full blur-[80px]"></div>
      </div>

      <header className="p-4 sticky top-0 z-20 flex items-center gap-3">
        <button onClick={() => setLocation("/")} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-display font-bold text-xl tracking-wide uppercase">Weather Outlook</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-8 relative z-10">
        {/* Main Weather */}
        <div className="text-center py-8">
          <CloudSun size={120} className="mx-auto text-brand-yellow mb-4 animate-pulse" strokeWidth={1} />
          <h1 className="text-6xl font-bold font-display tracking-tighter">28°</h1>
          <p className="text-xl font-medium mt-2 text-blue-100">Partly Cloudy</p>
          <p className="text-sm text-blue-300 mt-1">Pio Duran, Albay</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center gap-2 border border-white/10">
            <Wind size={24} className="text-brand-yellow" />
            <span className="text-lg font-bold">12</span>
            <span className="text-xs text-blue-200">km/h</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center gap-2 border border-white/10">
            <Droplets size={24} className="text-blue-300" />
            <span className="text-lg font-bold">78%</span>
            <span className="text-xs text-blue-200">Humidity</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center gap-2 border border-white/10">
            <ThermometerSun size={24} className="text-orange-400" />
            <span className="text-lg font-bold">32°</span>
            <span className="text-xs text-blue-200">Feels Like</span>
          </div>
        </div>

        {/* Forecast */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
          <h3 className="font-bold mb-4 text-blue-100 uppercase text-sm tracking-wider">3-Day Forecast</h3>
          <div className="space-y-4">
             <div className="flex items-center justify-between">
               <span className="font-medium w-16">Today</span>
               <CloudSun size={24} className="text-brand-yellow" />
               <div className="flex gap-3 text-sm font-bold">
                 <span className="opacity-100">29°</span>
                 <span className="opacity-50">24°</span>
               </div>
             </div>
             <div className="flex items-center justify-between">
               <span className="font-medium w-16">Tue</span>
               <CloudRain size={24} className="text-blue-300" />
               <div className="flex gap-3 text-sm font-bold">
                 <span className="opacity-100">26°</span>
                 <span className="opacity-50">23°</span>
               </div>
             </div>
             <div className="flex items-center justify-between">
               <span className="font-medium w-16">Wed</span>
               <CloudSun size={24} className="text-brand-yellow" />
               <div className="flex gap-3 text-sm font-bold">
                 <span className="opacity-100">30°</span>
                 <span className="opacity-50">25°</span>
               </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
