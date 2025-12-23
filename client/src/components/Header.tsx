import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";

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
              className="font-display font-extrabold text-3xl tracking-tight text-yellow-300 drop-shadow-lg uppercase text-center leading-none"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              MDRRMO PIO DURAN
            </motion.h1>
            <motion.div
              className="flex items-center mt-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="font-display text-xl text-yellow-400 tracking-wider uppercase font-bold">
                EMERGENCY HUB
              </span>
            </motion.div>
          </div>
        </div>

        {/* Time Display */}
        <motion.div
          className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/20 shadow-inner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-yellow-200 font-mono text-sm font-medium">
            {format(currentTime, "EEEE, MMMM d, yyyy • h:mm:ss a")}
          </div>
        </motion.div>
      </motion.div>

      {/* Animated Marquee Strip */}
      <motion.div
        className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 py-2 w-full overflow-hidden relative z-20 shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ib3JhbmdlIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')] opacity-20"></div>

        <div className="marquee-container w-full relative">
          <motion.div
            className="marquee-content inline-block whitespace-nowrap"
            animate={{ x: ["100%", "-100%"] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <span className="text-blue-950 font-extrabold text-sm px-4 flex items-center">
              <span className="mr-2">🚨</span>
              Tomorrow in Pio Duran City, expect partly cloudy weather with a
              chance of isolated rain showers. Stay safe and prepared!
              <span className="mx-4">📞</span>
              MDRRMO Hotline: 0917-772-5016
              <span className="mx-4">📡</span>
              Stay tuned for further updates.
              <span className="mx-4">🚨</span>
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative Bottom Accent */}
      <motion.div
        className="h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      ></motion.div>
    </div>
  );
}
