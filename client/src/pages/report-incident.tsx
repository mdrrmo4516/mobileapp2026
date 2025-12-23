import { useState } from "react";
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
  X
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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

  const submitIncident = useMutation({
    mutationFn: async (data: { type: string; description: string; location: string; isAnonymous: boolean; media?: string[] }) => {
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
    if (!selectedType || !description) {
      toast({
        title: "Missing Information",
        description: "Please select incident type and provide a description.",
        variant: "destructive",
      });
      return;
    }
    
    submitIncident.mutate({
      type: selectedType,
      description,
      location: "Current Location",
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
              <SelectContent>
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
              <div className="h-32 bg-gray-100 relative w-full">
                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Pio_Duran_Albay.png/640px-Pio_Duran_Albay.png')] bg-cover bg-center opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-[rgba(18,26,115,1)] text-white p-2 rounded-full shadow-lg animate-bounce">
                    <MapPin size={24} fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2 text-[rgba(18,26,115,1)]">
                  <MapPin size={16} />
                  <span className="text-sm font-bold">Current Location</span>
                </div>
                <button type="button" className="text-xs font-bold text-[rgba(18,26,115,1)] underline">
                  Change
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
          disabled={!selectedType || submitIncident.isPending}
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