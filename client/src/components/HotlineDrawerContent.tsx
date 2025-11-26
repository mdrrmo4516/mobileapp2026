import { Phone, Building2, Siren, Stethoscope, Shield } from "lucide-react";
import { 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription,
  DrawerFooter,
  DrawerClose 
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface HotlineItem {
  agency: string;
  description: string;
  numbers: string[];
  icon: React.ReactNode;
}

const hotlines: HotlineItem[] = [
  {
    agency: "MDRRMO",
    description: "Municipal Disaster Risk Reduction Management Office",
    numbers: ["0917-772-5016", "0966-395-6804"],
    icon: <Siren className="text-brand-red" size={24} />
  },
  {
    agency: "PSO",
    description: "Public Safety Officer",
    numbers: ["0946-743-2735"],
    icon: <Shield className="text-blue-600" size={24} />
  },
  {
    agency: "Mayor's Office",
    description: "Office of the Mayor",
    numbers: ["0961-690-2026", "0995-072-9306"],
    icon: <Building2 className="text-purple-600" size={24} />
  },
  {
    agency: "MSWDO",
    description: "Municipal Social Welfare and Development Office",
    numbers: ["0910-122-8971", "0919-950-9515"],
    icon: <Building2 className="text-orange-600" size={24} />
  },
  {
    agency: "BFP",
    description: "Bureau of Fire Protection",
    numbers: ["0949-889-7134", "0931-929-3408"],
    icon: <Siren className="text-red-600" size={24} />
  },
  {
    agency: "PNP",
    description: "Philippine National Police",
    numbers: ["0998-598-5946"],
    icon: <Shield className="text-blue-800" size={24} />
  },
  {
    agency: "MARITIME POLICE",
    description: "Maritime Police Station",
    numbers: ["0917-500-2325"],
    icon: <Shield className="text-cyan-600" size={24} />
  },
  {
    agency: "BJMP",
    description: "Bureau of Jail Management and Penology",
    numbers: ["0936-572-9067"],
    icon: <Shield className="text-gray-600" size={24} />
  },
  {
    agency: "PCG",
    description: "Philippine Coast Guard",
    numbers: ["0970-667-5457"],
    icon: <Shield className="text-sky-500" size={24} />
  },
  {
    agency: "RHU",
    description: "Rural Health Unit Pio Duran",
    numbers: ["0927-943-4663", "0907-640-7701"],
    icon: <Stethoscope className="text-green-600" size={24} />
  },
  {
    agency: "PDMDH",
    description: "Pio Duran Memorial District Hospital",
    numbers: ["0985-317-1769"],
    icon: <Stethoscope className="text-red-500" size={24} />
  }
];

export function HotlineDrawerContent() {
  return (
    <DrawerContent className="max-h-[85vh]">
      <DrawerHeader>
        <DrawerTitle className="text-center text-2xl font-bold text-brand-yellow uppercase">Emergency Hotlines</DrawerTitle>
        <DrawerDescription className="text-center">Tap any number to dial immediately</DrawerDescription>
      </DrawerHeader>
      
      <div className="p-4 overflow-y-auto">
        <div className="grid gap-3">
          {hotlines.map((item, index) => (
            <div key={index} className="bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-sm flex items-start gap-3">
              <div className="bg-white p-2 rounded-full shadow-sm mt-1">
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-brand-blue">{item.agency}</h3>
                <p className="text-xs text-slate-500 mb-2">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.numbers.map((number, idx) => (
                    <a 
                      key={idx}
                      href={`tel:${number}`}
                      className="flex items-center gap-1 bg-brand-blue/5 hover:bg-brand-blue/10 text-brand-blue px-3 py-1.5 rounded-full text-sm font-bold transition-colors border border-brand-blue/10"
                    >
                      <Phone size={14} />
                      {number}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DrawerFooter>
        <DrawerClose asChild>
          <Button variant="outline">Close</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  );
}
