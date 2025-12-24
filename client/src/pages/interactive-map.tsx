import React, { useState } from "react";
import { motion } from "framer-motion";
import MobileInteractiveMap from "@/components/MobileInteractiveMap";
import { ArrowLeft } from "lucide-react";
// Example data for demonstration
const exampleMarkers = [
  {
    id: '1',
    lat: 13.030140119488692,
    lng: 123.44566048537946,
    type: 'incident' as const,
    title: 'Sample Incident',
    description: 'Emergency response needed'
  }
];

const exampleHazardZones = [
  {
    id: '1',
    type: 'polygon' as const,
    geometry: {
      type: 'Polygon',
      coordinates: [[[123.4, 13.0], [123.5, 13.0], [123.5, 13.1], [123.4, 13.1], [123.4, 13.0]]]
    },
    riskLevel: 'high' as const
  }
];

export default function InteractiveMap() {
  const [markers, setMarkers] = useState(exampleMarkers);
  const [hazardZones, setHazardZones] = useState(exampleHazardZones);

  const handleMarkerAdd = (marker: any) => {
    setMarkers(prev => [...prev, marker]);
  };

  const handleZoneAdd = (zone: any) => {
    setHazardZones(prev => [...prev, zone]);
  };

  const handleZoneEdit = (zone: any) => {
    setHazardZones(prev => prev.map(z => z.id === zone.id ? zone : z));
  };

  const handleZoneDelete = (id: string) => {
    setHazardZones(prev => prev.filter(z => z.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex flex-col relative overflow-hidden">
      {/* Emergency Header */}
      <div className="relative z-20 p-6 safe-area-inset-top">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Emergency Command</h1>
              <p className="text-slate-300 text-sm">Interactive Response Map</p>
            </div>
          </motion.div>

          <motion.button
            className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-4 py-3 rounded-xl font-bold text-white text-sm uppercase tracking-wide shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95"
            onClick={() => {/* SOS functionality can be added here */}}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="relative z-10 flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>SOS</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </motion.button>
        </div>

        {/* Status Indicators */}
        <motion.div
          className="mt-4 flex items-center space-x-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-xs font-medium">System Online</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-blue-400 text-xs font-medium">GPS Active</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-purple-400 text-xs font-medium">Offline Ready</span>
          </div>
        </motion.div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Map Component */}
      <MobileInteractiveMap
        markers={markers}
        hazardZones={hazardZones}
        onMarkerAdd={handleMarkerAdd}
        onZoneAdd={handleZoneAdd}
        onZoneEdit={handleZoneEdit}
        onZoneDelete={handleZoneDelete}
        className="flex-1 relative z-10"
      />
    </div>
  );
}
