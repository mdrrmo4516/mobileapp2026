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

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-1 px-8 relative z-10"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-yellow-300 mt-1"
            >
              Be Prepared. Stay Safe.
            </motion.p>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg"
          >
            <ShieldAlert className="text-blue-950" size={24} />
          </motion.div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="px-4 pb-15 relative z-10">
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

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-5 left-6 w-3 h-3 rounded-full bg-yellow-400 opacity-70"
      ></motion.div>

      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute top-40 right-8 w-2 h-2 rounded-full bg-white opacity-50"
      ></motion.div>

      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-40 left-10 w-4 h-4 rounded-full bg-yellow-300 opacity-60"
      ></motion.div>
    </div>
  );
}
