import { useLocation } from "wouter";
import {
  Megaphone,
  CloudSun,
  Map,
  ShieldAlert,
  Backpack,
  Wrench,
  FileText,
  GraduationCap,
} from "lucide-react";
import { motion } from "framer-motion";

interface DashboardButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  index: number;
}

function DashboardButton({
  icon,
  label,
  onClick,
  index,
}: DashboardButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center justify-center bg-gradient-to-br from-white to-blue-50 rounded-2xl p-5 shadow-[0_8px_0_0_rgba(59,130,246,0.5)] active:shadow-none active:translate-y-[8px] transition-all border-2 border-yellow-500 h-36 w-full group cursor-pointer relative overflow-hidden"
    >
      {/* Animated background element */}
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-yellow-400 rounded-full opacity-10 blur-xl"></div>

      <motion.div
        whileHover={{ scale: 1.15, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="text-blue-950 mb-3"
      >
        {icon}
      </motion.div>
      <span className="text-blue-950 font-bold text-base text-center leading-tight font-sans z-10">
        {label}
      </span>

      {/* Decorative corner element */}
      <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-yellow-400 rounded-br-lg"></div>
    </motion.button>
  );
}

export function DashboardGrid() {
  const [, setLocation] = useLocation();

  const buttons = [
    {
      icon: <Megaphone size={40} strokeWidth={1.5} />,
      label: "Report an Incident",
      onClick: () => setLocation("/report-incident"),
    },
    {
      icon: <CloudSun size={40} strokeWidth={1.5} />,
      label: "Weather Hub",
      onClick: () => setLocation("/weather-outlook"),
    },
    {
      icon: <Map size={40} strokeWidth={1.5} />,
      label: "Evacuation Plan",
      onClick: () => setLocation("/evacuation-plan"),
    },
    {
      icon: <ShieldAlert size={40} strokeWidth={1.5} />,
      label: "Emergency Plan",
      onClick: () => setLocation("/disaster-plan"),
    },
    {
      icon: <Backpack size={40} strokeWidth={1.5} />,
      label: "Go Bag",
      onClick: () => setLocation("/go-bag"),
    },
    {
      icon: <Wrench size={40} strokeWidth={1.5} />,
      label: "Emergency Tools",
      onClick: () => setLocation("/emergency-tools"),
    },
    {
      icon: <FileText size={40} strokeWidth={1.5} />,
      label: "Resources",
      onClick: () => setLocation("/public-documents"),
    },
    {
      icon: <GraduationCap size={40} strokeWidth={1.5} />,
      label: "Learning Materials",
      onClick: () => setLocation("/learning-materials"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            radial-gradient(circle at 10% 20%, yellow 0.5px, transparent 1px),
            radial-gradient(circle at 90% 80%, yellow 0.5px, transparent 1px),
            radial-gradient(circle at 30% 70%, yellow 0.5px, transparent 1px),
            radial-gradient(circle at 70% 30%, yellow 0.5px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Secondary Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
          linear-gradient(45deg, #ffffff 25%, transparent 25%),
          linear-gradient(-45deg, #ffffff 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #ffffff 75%),
          linear-gradient(-45deg, transparent 75%, #ffffff 75%)
        `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        }}
      ></div>

      {/* Main Grid */}
      <div className="px-4 mt-6 pb-15 relative z-10">
        <div className="grid grid-cols-2 gap-4">
          {buttons.map((btn, index) => (
            <DashboardButton
              key={index}
              icon={btn.icon}
              label={btn.label}
              onClick={btn.onClick}
              index={index}
            />
          ))}
        </div>
      </div>

    
    </div>
  );
}
