import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, CheckCircle2, Circle, Plus, Phone, Share2, Droplets, Heart, Shirt, Wrench, FileText, Users, AlertTriangle } from "lucide-react";

// Mock data for go bag items
const initialItems = [
  // Essentials
  { id: 1, category: "Water & Food", name: "1 gallon of water per person", checked: false },
  { id: 2, category: "Water & Food", name: "Non-perishable food for 3 days", checked: false },
  { id: 3, category: "Water & Food", name: "Manual can opener", checked: false },
  { id: 4, category: "Water & Food", name: "Disposable plates and utensils", checked: false },

  // First Aid
  { id: 5, category: "Health & Hygiene", name: "First aid kit", checked: false },
  { id: 6, category: "Health & Hygiene", name: "Prescription medications", checked: false },
  { id: 7, category: "Health & Hygiene", name: "Hand sanitizer", checked: false },
  { id: 8, category: "Health & Hygiene", name: "Personal hygiene items", checked: false },

  // Documents
  { id: 9, category: "Important Documents", name: "Identification documents", checked: false },
  { id: 10, category: "Important Documents", name: "Insurance papers", checked: false },
  { id: 11, category: "Important Documents", name: "Bank account records", checked: false },
  { id: 12, category: "Important Documents", name: "Emergency contact list", checked: false },

  // Clothing
  { id: 13, category: "Clothing & Protection", name: "Sturdy shoes", checked: false },
  { id: 14, category: "Clothing & Protection", name: "Weather-appropriate clothing", checked: false },
  { id: 15, category: "Clothing & Protection", name: "Rain gear", checked: false },
  { id: 16, category: "Clothing & Protection", name: "Blanket or sleeping bag", checked: false },

  // Tools
  { id: 17, category: "Emergency Tools", name: "Flashlight with extra batteries", checked: false },
  { id: 18, category: "Emergency Tools", name: "Battery-powered radio", checked: false },
  { id: 19, category: "Emergency Tools", name: "Multi-tool or Swiss Army knife", checked: false },
  { id: 20, category: "Emergency Tools", name: "Duct tape", checked: false },

  // Family Needs
  { id: 21, category: "Family Needs", name: "Baby supplies (if needed)", checked: false },
  { id: 22, category: "Family Needs", name: "Pet supplies (if needed)", checked: false },
  { id: 23, category: "Family Needs", name: "Entertainment items for children", checked: false },
  { id: 24, category: "Family Needs", name: "Important family photos", checked: false }
];

const categoryIcons = {
  "Water & Food": Droplets,
  "Health & Hygiene": Heart,
  "Clothing & Protection": Shirt,
  "Emergency Tools": Wrench,
  "Important Documents": FileText,
  "Family Needs": Users
};

const categoryColors = {
  "Water & Food": "bg-blue-100 text-blue-700",
  "Health & Hygiene": "bg-red-100 text-red-700",
  "Clothing & Protection": "bg-purple-100 text-purple-700",
  "Emergency Tools": "bg-yellow-100 text-yellow-700",
  "Important Documents": "bg-indigo-100 text-indigo-700",
  "Family Needs": "bg-pink-100 text-pink-700"
};

export default function GoBag() {
  const [, setLocation] = useLocation();
  const [items, setItems] = useState(initialItems);
  const [customItem, setCustomItem] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Water & Food");
  const [showAlert, setShowAlert] = useState(true);

  const toggleItem = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const addItem = () => {
    if (customItem.trim()) {
      const newItem = {
        id: items.length + 1,
        category: selectedCategory,
        name: customItem.trim(),
        checked: false
      };
      setItems([...items, newItem]);
      setCustomItem("");
    }
  };

  const handleBack = () => {
    setLocation("/");
  };

  const handleCallMDRRMO = () => {
    // Replace with actual emergency number
    window.open('tel:+09177725016');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Go Bag Checklist',
          text: 'Check out this emergency preparedness checklist!',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const progress = items.length > 0 
    ? Math.round((items.filter(i => i.checked).length / items.length) * 100) 
    : 0;

  const categories = Array.from(new Set(items.map(item => item.category)));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl relative">
      {/* Alert Banner */}
      {showAlert && (
        <div className="bg-red-500 text-white p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} />
            <span className="font-medium text-sm">Heavy Rainfall Advisory</span>
          </div>
          <button 
            onClick={() => setShowAlert(false)}
            className="text-white hover:text-red-100"
          >
            ×
          </button>
        </div>
      )}

      <header className="bg-brand-blue text-white p-4 sticky top-0 z-20 shadow-md flex items-center gap-3">
        <button onClick={handleBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="font-display font-bold text-xl tracking-wide uppercase">Go Bag Checklist</h1>
          <p className="text-sm opacity-90 mt-1">Be ready for 72 hours of safety</p>
        </div>
      </header>

      <div className="bg-brand-blue px-6 pb-6 pt-2 rounded-b-3xl shadow-lg z-10">
        <div className="flex justify-between items-end mb-2 text-white">
          <span className="font-bold text-3xl">{progress}%</span>
          <span className="text-sm opacity-80 mb-1">Preparedness Level</span>
        </div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-yellow transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-white text-xs mt-2 opacity-80 text-center">
          {progress === 100 
            ? "You're fully prepared! Stay safe." 
            : progress >= 75 
              ? "Almost there! Just a few more items." 
              : progress >= 50 
                ? "Good progress! Keep going." 
                : "Start packing - every item counts!"}
        </p>
      </div>

      <main className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
        {/* Add Custom Item */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
            <Plus size={18} className="text-brand-blue" />
            Add Custom Item
          </h3>
          <div className="flex text-black flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customItem}
              onChange={(e) => setCustomItem(e.target.value)}
              placeholder="Enter item name..."
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto border border-slate-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <button
            onClick={addItem}
            className="mt-2 w-full bg-brand-blue text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Add to Checklist
          </button>
        </div>

        {/* Category Lists */}
        {categories.map((category) => {
          const categoryItems = items.filter(i => i.category === category);
          const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
          const colorClass = categoryColors[category as keyof typeof categoryColors];

          return (
            <div key={category}>
              <div className={`flex items-center gap-2 mb-2 ml-1 ${colorClass} px-3 py-1 rounded-full w-fit`}>
                {IconComponent && <IconComponent size={16} />}
                <h3 className="font-bold text-sm uppercase tracking-wider">{category}</h3>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {categoryItems.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => toggleItem(item.id)}
                    className="flex items-center gap-3 p-4 border-b border-slate-100 last:border-0 active:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {item.checked ? (
                      <CheckCircle2 className="text-green-500 shrink-0" fill="currentColor" color="white" size={24} />
                    ) : (
                      <Circle className="text-slate-300 shrink-0" size={24} />
                    )}
                    <span className={`font-medium ${item.checked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </main>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 p-4 flex gap-3">
        <button 
          onClick={handleCallMDRRMO}
          className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
        >
          <Phone size={18} />
          Call MDRRMO
        </button>
        <button 
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 bg-brand-blue text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Share2 size={18} />
          Share
        </button>
      </div>
    </div>
  );
}