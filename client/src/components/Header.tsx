import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { PhoneCall } from "lucide-react";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { HotlineDrawerContent } from "@/components/HotlineDrawerContent";

export function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col w-full z-10">
      {/* Main Header with Gradient */}
      <motion.div
        className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 pt-3 pb-2 px-4 flex flex-col items-center justify-center text-white relative shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-400 rounded-full mix-blend-soft-light opacity-20 animate-pulse"></div>
          <div
            className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-300 rounded-full mix-blend-soft-light opacity-20 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Logos and Title */}
        <div className="flex items-center gap-4 mb-2 relative z-10">
          <motion.div
            className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 border-2 border-yellow-300 flex items-center justify-center overflow-hidden shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <img
              src="/mdrrmopioduran_160px.png"
              alt="mdrrmo"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="flex flex-col items-center">
            <motion.h1
              className="font-display font-extrabold text-2xl tracking-tight text-yellow-300 drop-shadow-lg uppercase text-center leading-none"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              MDRRMO PIO DURAN
            </motion.h1>
            <Drawer>
              <DrawerTrigger asChild>
                <button className="bg-brand-red hover:bg-brand-red-hover mt-1 text-white w-full max-w-md rounded-full shadow-lg flex items-center justify-center gap-2 border-1 border-white active:scale-95 transition-transform animate-pulse cursor-pointer">
                  <PhoneCall size={14} fill="white" />
                  <span className="font-bold text-lg uppercase tracking-wide">
                    Hotlines!
                  </span>
                </button>
              </DrawerTrigger>
              <HotlineDrawerContent />
            </Drawer>
          </div> 
        </div>
      </motion.div>


      {/* Decorative Bottom Accent */}
      <motion.div
        className="h-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      ></motion.div>
    </div> 
  );
}
