/// <reference types="@types/google.maps" />
import React, { useEffect, useRef, useState } from "react";
import { loadGoogleMapsScript } from "@/lib/google-maps";
import { motion } from "framer-motion";

export default function InteractiveMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );

  useEffect(() => {
    let listener: google.maps.MapsEventListener | null = null;
    loadGoogleMapsScript()
      .then(() => {
        if (!mapRef.current || map) return;

        const mapInstance = new google.maps.Map(mapRef.current!, {
          center: { lat: 13.030140119488692, lng: 123.44566048537946 13.030140119488692%2C123.44566048537946&z=18 }, // center of the Philippines
          zoom: 6,
          fullscreenControl: true,
        });

        listener = mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
          const lat = e.latLng?.lat();
          const lng = e.latLng?.lng();
          if (lat == null || lng == null) return;

          if (marker) marker.setMap(null);

          const m = new google.maps.Marker({
            position: { lat, lng },
            map: mapInstance,
          });

          setMarker(m);
          setCoords({ lat, lng });
        });

        setMap(mapInstance);
      })
      .catch(() => {
        // ignore script load errors for now
      });

    return () => {
      if (listener) google.maps.event.removeListener(listener);
    };
  }, [mapRef]);

  const locateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      if (!map) return;
      map.panTo({ lat: latitude, lng: longitude });
      map.setZoom(14);
      if (marker) marker.setMap(null);
      const m = new google.maps.Marker({ position: { lat: latitude, lng: longitude }, map });
      setMarker(m);
      setCoords({ lat: latitude, lng: longitude });
    });
  };

  const resetMap = () => {
    if (!map) return;
    map.setCenter({ lat: 12.8797, lng: 121.774 });
    map.setZoom(6);
    if (marker) {
      marker.setMap(null);
      setMarker(null);
      setCoords(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-900 to-blue-800 flex flex-col">
      <div className="p-4 flex items-center justify-between text-white">
        <motion.h1
          className="text-xl font-bold"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Interactive Map
        </motion.h1>

        <div className="flex items-center gap-2">
          <button
            className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-md font-semibold"
            onClick={locateMe}
          >
            Locate me
          </button>
          <button
            className="bg-white text-blue-900 px-3 py-1 rounded-md font-semibold"
            onClick={resetMap}
          >
            Reset
          </button>
        </div>
      </div>

      <div ref={mapRef} className="flex-1" style={{ minHeight: "60vh" }} />

      {coords && (
        <div className="p-4 text-white">
          Selected: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
}
