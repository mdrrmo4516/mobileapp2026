import { useLocation } from "wouter";
import { 
  Megaphone, 
  CloudSun, 
  Map, 
  ShieldAlert, 
  Backpack, 
  Wrench, 
  FileText, 
  GraduationCap 
} from "lucide-react";

interface DashboardButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

function DashboardButton({ icon, label, onClick }: DashboardButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center bg-white rounded-xl p-4 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[4px] transition-all border-2 border-brand-yellow h-32 w-full group cursor-pointer"
    >
      <div className="text-brand-blue mb-2 transform group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      <span className="text-brand-blue font-bold text-sm text-center leading-tight font-sans">
        {label}
      </span>
    </button>
  );
}

export function DashboardGrid() {
  const [, setLocation] = useLocation();

  const buttons = [
    { 
      icon: <Megaphone size={40} strokeWidth={1.5} />, 
      label: "Report an Incident",
      onClick: () => setLocation("/report-incident")
    },
    { icon: <CloudSun size={40} strokeWidth={1.5} />, label: "Weather Outlook" },
    { icon: <Map size={40} strokeWidth={1.5} />, label: "Evacuation Plan" },
    { icon: <ShieldAlert size={40} strokeWidth={1.5} />, label: "Disaster Plan" },
    { icon: <Backpack size={40} strokeWidth={1.5} />, label: "Go Bag" },
    { icon: <Wrench size={40} strokeWidth={1.5} />, label: "Emergency Tools" },
    { icon: <FileText size={40} strokeWidth={1.5} />, label: "Public Documents" },
    { icon: <GraduationCap size={40} strokeWidth={1.5} />, label: "Learning Materials" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 p-4 pb-24 overflow-y-auto">
      {buttons.map((btn, index) => (
        <DashboardButton 
          key={index} 
          icon={btn.icon} 
          label={btn.label} 
          onClick={btn.onClick}
        />
      ))}
    </div>
  );
}
