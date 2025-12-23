import { Home, Mail, User } from "lucide-react";

export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Navigation Bar */}
      <div className="bg-brand-yellow h-17 flex items-end justify-around pb-4 pt-8 px-6 rounded-t-3xl shadow-[0_-4px_10px_rgba(0,0,0,0.2)]">
        <button className="flex flex-col items-center gap-1 text-brand-blue hover:text-white transition-colors">
          <div className="bg-white p-2 rounded-full shadow-sm">
            <Home size={24} className="text-brand-blue" />
          </div>
        </button>

        <button className="flex flex-col items-center gap-1 text-brand-blue hover:text-white transition-colors">
          <div className="bg-brand-blue p-2 rounded-full shadow-sm">
            <Mail size={24} className="text-white" />
          </div>
        </button>

        <button className="flex flex-col items-center gap-1 text-brand-blue hover:text-white transition-colors">
          <div className="bg-white p-2 rounded-full shadow-sm">
            <User size={24} className="text-brand-blue" />
          </div>
        </button>
      </div>
    </div>
  );
}
