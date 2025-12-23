import React, { useEffect, useRef, useState } from 'react';

const LeafletMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const centerMarkerRef = useRef<L.Marker | null>(null);
  const [coordinates, setCoordinates] = useState({ lat: 13.030140119488692, lng: 123.44566048537946 });

  useEffect(() => {
    // Dynamically load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Dynamically load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      initializeMap();
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  const initializeMap = () => {
    // @ts-ignore - Leaflet is loaded dynamically
    const L = window.L;

    if (!L) return;

    // Initialize the map
    const map = L.map(mapRef.current!).setView([13.030140119488692, 123.44566048537946], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker at the center
    const centerMarker = L.marker([13.030140119488692, 123.44566048537946]).addTo(map)
      .bindPopup('Center Location')
      .openPopup();

    centerMarkerRef.current = centerMarker;
    mapInstanceRef.current = map;

    // Update location info when map moves
    map.on('moveend', () => {
      const center = map.getCenter();
      setCoordinates({ lat: center.lat, lng: center.lng });
    });

    // Add click event to get coordinates
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      // Add marker at clicked location
      L.marker([lat, lng]).addTo(map)
        .bindPopup(`Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}`)
        .openPopup();
      
      // Update location info
      setCoordinates({ lat, lng });
    });
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const map = mapInstanceRef.current;
        
        if (!map) return;
        
        // Update map view
        map.setView([latitude, longitude], 15);
        
        // Remove existing marker if present (except center marker)
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker && layer !== centerMarkerRef.current) {
            map.removeLayer(layer);
          }
        });
        
        // Add new marker at current location
        // @ts-ignore - Leaflet is loaded dynamically
        L.marker([latitude, longitude]).addTo(map)
          .bindPopup('Your Location')
          .openPopup();
        
        // Update location info
        setCoordinates({ lat: latitude, lng: longitude });
      },
      (error) => {
        alert('Unable to get your location: ' + error.message);
      }
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      
      <div 
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          background: 'white',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}
      >
        <button 
          onClick={handleZoomIn}
          style={{
            margin: '5px',
            padding: '8px 12px',
            border: 'none',
            background: '#121a73',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Zoom In
        </button>
        <button 
          onClick={handleZoomOut}
          style={{
            margin: '5px',
            padding: '8px 12px',
            border: 'none',
            background: '#121a73',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Zoom Out
        </button>
        <button 
          onClick={handleCurrentLocation}
          style={{
            margin: '5px',
            padding: '8px 12px',
            border: 'none',
            background: '#121a73',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Current Location
        </button>
      </div>
      
      <div 
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          zIndex: 1000,
          background: 'white',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          fontSize: '14px'
        }}
      >
        Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}
      </div>
    </div>
  );
};

export default LeafletMap;