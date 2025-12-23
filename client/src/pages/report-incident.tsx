/// <reference types="@types/google.maps" />
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Plus,
  Camera,
  Video,
  FileImage,
  X,
  Navigation,
  LocateFixed
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { loadGoogleMapsScript } from "@/lib/google-maps";
import { useMutation } from "@tanstack/react-query";

const INCIDENT_TYPES = [
  { id: "fire", label: "Fire" },
  { id: "flood", label: "Flood" },
  { id: "landslide", label: "Landslide" },
  { id: "vehicular-accident", label: "Vehicular Accident" },
  { id: "medical-emergency", label: "Medical Emergency" },
  { id: "earthquake", label: "Earthquake" },
];

export default function ReportIncident() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [description, setDescription] = useState("");
  const [uploadedMedia, setUploadedMedia] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [location, setLocationData] = useState({ 
    lat: 13.028133144587647, 
    lng: 123.44411597207234, 
    address: "Legazpi City, Albay" 
  });
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const submitIncident = useMutation({
    mutationFn: async (data: { type: string; description: string; location: string; coordinates?: { lat: number; lng: number }; isAnonymous: boolean; media?: string[] }) => {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit incident");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted Successfully",
        description: "Your incident report has been received by the MDRRMO.",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Could not submit your report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support location services.",
        variant: "destructive",
      });
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocationData({
          lat: latitude,
          lng: longitude,
          address: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
        });

        // Update map and marker if already initialized
        if (markerRef.current) {
          markerRef.current.setPosition({ lat: latitude, lng: longitude });
        }
        if (mapInstance) {
          mapInstance.panTo({ lat: latitude, lng: longitude });
          mapInstance.setZoom(16);
        }

        setIsGettingLocation(false);
        toast({
          title: "Location Found",
          description: "Your current location has been set.",
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsGettingLocation(false);
        toast({
          title: "Unable to get location",
          description: "Please enable location services or enter your address manually.",
          variant: "destructive",
        });
      }
    );
  };

  // Use Google Maps instead of a simulated static map
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance) return;

    // Initialize Google Maps
    loadGoogleMapsScript()
      .then(() => {
        const map = new google.maps.Map(mapRef.current!, {
          center: { lat: location.lat, lng: location.lng },
          zoom: 14,
          mapTypeId: 'roadmap',
          fullscreenControl: false,
          streetViewControl: false,
        });

        // Create a marker at the current location
        const marker = new google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map,
          draggable: true,
          title: 'Incident Location',
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
                <path fill="#121A73" d="M12 2C8 2 5 5 5 9c0 7 7 13 7 13s7-6 7-13c0-4-3-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5" fill="#fff"/>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(36, 36),
          },
        });

        // Update state refs
        markerRef.current = marker;
        setMapInstance(map);

        // Reverse geocode helper
        const geocoder = new google.maps.Geocoder();
        const setAddressFromLatLng = (lat: number, lng: number) => {
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              setLocationData((prev) => ({ ...prev, address: results[0].formatted_address }));
            } else {
              setLocationData((prev) => ({ ...prev, address: `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})` }));
            }
          });
        };

        // Marker drag end -> update coordinates
        marker.addListener('dragend', (e: google.maps.MapMouseEvent) => {
          const lat = e.latLng!.lat();
          const lng = e.latLng!.lng();
          setLocationData({ lat, lng, address: `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})` });
          setAddressFromLatLng(lat, lng);
        });

        // Map click -> move marker and update coordinates
        map.addListener('click', (e: google.maps.MapMouseEvent) => {
          const lat = e.latLng!.lat();
          const lng = e.latLng!.lng();
          marker.setPosition({ lat, lng });
          map.panTo({ lat, lng });
          setLocationData({ lat, lng, address: `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})` });
          setAddressFromLatLng(lat, lng);
        });
      })
      .catch((err) => console.error('Failed to load Google Maps', err));
  }, [mapRef, mapInstance]);

  // Keep marker position in sync when `location` state changes externally
  useEffect(() => {
    if (!mapInstance) return;

    const { lat, lng } = location;
    mapInstance.panTo({ lat, lng });
    if (markerRef.current) {
      markerRef.current.setPosition({ lat, lng });
    } else {
      const marker = new google.maps.Marker({ position: { lat, lng }, map: mapInstance });
      markerRef.current = marker;
    }
  }, [location, mapInstance]);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    setUploadedMedia(prev => [...prev, ...newFiles]);
    setMediaPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeMedia = (index: number) => {
    setUploadedMedia(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !description || !location.lat || !location.lng) {
      toast({
        title: "Missing Information",
        description: "Please select incident type, provide a description, and ensure location is set.",
        variant: "destructive",
      });
      return;
    }
    
    submitIncident.mutate({
      type: selectedType,
      description,
      location: location.address,
      coordinates: { lat: location.lat, lng: location.lng },
      isAnonymous,
      media: mediaPreviews,
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto shadow-none relative" style={{ background: "white" }}>
      <header className="bg-[rgba(18,26,115,1)] text-white p-4 sticky top-0 z-20 shadow-sm flex items-center gap-3">
        <button 
          onClick={() => setLocation("/")}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-xl tracking-wide uppercase">Report an Incident</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="space-y-3">
            <Label className="text-[rgba(18,26,115,1)] font-bold text-sm uppercase tracking-wider">Incident Type</Label>
            <Select value={selectedType || ""} onValueChange={setSelectedType}>
              <SelectTrigger 
                className="w-full h-12 bg-white border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-[rgba(18,26,115,0.2)] focus:border-[rgba(18,26,115,1)]"
                data-testid="select-incident-type"
              >
                <SelectValue placeholder="Select incident type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {INCIDENT_TYPES.map((type) => (
                  <SelectItem 
                    key={type.id} 
                    value={type.id}
                    data-testid={`option-incident-type-${type.id}`}
                  >
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>

          <section className="space-y-3">
            <Label className="text-[rgba(18,26,115,1)] font-bold text-sm uppercase tracking-wider">Time of Incident</Label>
            <div className="flex gap-3">
              <div className="flex-1 bg-white border border-gray-300 rounded-lg p-3 flex items-center gap-2 text-gray-600">
                <Calendar size={18} className="text-[rgba(18,26,115,1)]" />
                <span className="text-sm font-medium">{format(new Date(), "MMM dd, yyyy")}</span>
              </div>
              <div className="flex-1 bg-white border border-gray-300 rounded-lg p-3 flex items-center gap-2 text-gray-600">
                <Clock size={18} className="text-[rgba(18,26,115,1)]" />
                <span className="text-sm font-medium">{format(new Date(), "hh:mm a")}</span>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <Label className="text-[rgba(18,26,115,1)] font-bold text-sm uppercase tracking-wider">Location</Label>
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-100 relative w-full" ref={mapRef} data-testid="google-map">
                {/* Google Map will be rendered here */}
              </div>
              <div className="p-3 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2 text-[rgba(18,26,115,1)]">
                  <MapPin size={16} />
                  <span className="text-sm font-bold truncate max-w-[200px]">{location.address}</span>
                </div>
                <button 
                  type="button" 
                  className="flex items-center gap-1 text-xs font-bold text-[rgba(18,26,115,1)] underline"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                >
                  {isGettingLocation ? (
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 border-2 border-[rgba(18,26,115,1)] border-t-transparent rounded-full animate-spin"></span>
                      Getting...
                    </span>
                  ) : (
                    <>
                      <LocateFixed size={12} />
                      {location.lat ? "Change" : "Set"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <Label className="text-[rgba(18,26,115,1)] font-bold text-sm uppercase tracking-wider">Description</Label>
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide a detailed description of what happened..."
                className="w-full min-h-[120px] p-4 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[rgba(18,26,115,0.2)] focus:border-[rgba(18,26,115,1)] resize-none text-sm"
                maxLength={500}
                data-testid="input-description"
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400 font-mono">
                {description.length}/500
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <Label className="text-[rgba(18,26,115,1)] font-bold text-sm uppercase tracking-wider">
              Add Photos or Video <span className="text-gray-400 font-normal normal-case">(Optional)</span>
            </Label>
            <div className="space-y-3">
              <label className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[rgba(18,26,115,1)] hover:text-[rgba(18,26,115,1)] transition-all group cursor-pointer">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*,video/*" 
                  multiple 
                  onChange={handleMediaUpload}
                />
                <div className="p-2 bg-gray-100 rounded-full group-hover:bg-white transition-colors">
                  <Plus size={24} />
                </div>
                <span className="text-xs font-bold">Tap to upload media</span>
              </label>
              
              {mediaPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {mediaPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border border-gray-300">
                        {preview.endsWith('.mp4') ? (
                          <video 
                            src={preview} 
                            className="w-full h-full object-cover"
                            controls
                          />
                        ) : (
                          <img 
                            src={preview} 
                            alt={`Preview ${index}`} 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="bg-white p-4 rounded-lg border border-gray-300 flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-[rgba(18,26,115,1)] font-bold">Report Anonymously</Label>
              <p className="text-xs text-gray-500">Hide your identity from public records</p>
            </div>
            <Switch 
              checked={isAnonymous} 
              onCheckedChange={setIsAnonymous}
              className="data-[state=checked]:bg-[rgba(18,26,115,1)]"
              data-testid="switch-anonymous"
            />
          </section>
        </form>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-300 shadow-sm flex gap-3 z-20 max-w-md mx-auto">
        <Button 
          variant="outline" 
          className="flex-1 border-gray-300 text-gray-600 font-bold h-12 rounded-lg hover:bg-gray-50"
          type="button"
          onClick={() => setLocation("/")}
          data-testid="button-cancel"
        >
          Cancel
        </Button>
        <Button 
          className="flex-[2] bg-[rgba(18,26,115,1)] hover:bg-[rgba(18,26,115,0.9)] text-white font-bold h-12 rounded-lg"
          onClick={handleSubmit}
          disabled={!selectedType || !location.lat || !location.lng || submitIncident.isPending}
          data-testid="button-submit"
        >
          {submitIncident.isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Submitting...
            </span>
          ) : (
            "Submit Report"
          )}
        </Button>
      </footer>
    </div>
  );
}