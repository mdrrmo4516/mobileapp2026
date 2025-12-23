import { useLocation } from "wouter";
import {
  ArrowLeft,
  FileText,
  BookOpen,
  ChevronRight,
  Download,
  Eye,
  Map,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function LearningMaterials() {
  const [, setLocation] = useLocation();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Google Drive Folder ID
  const FOLDER_ID = "1vMJmirCo-PTLjEtU7AsCYUxau-Svesk5";

  // Mock data for documents (in a real app, this would come from Google Drive API)
  const mockDocuments = [
    {
      id: "1",
      name: "Emergency Response Manual.pdf",
      mimeType: "application/pdf",
      size: "2.4 MB",
      modifiedTime: "2023-10-15",
      webViewLink: "#",
    },
    {
      id: "2",
      name: "First Aid Procedures.docx",
      mimeType: "application/vnd.google-apps.document",
      size: "1.8 MB",
      modifiedTime: "2023-11-02",
      webViewLink: "#",
    },
    {
      id: "3",
      name: "Disaster Preparedness Guide.pptx",
      mimeType: "application/vnd.google-apps.presentation",
      size: "5.2 MB",
      modifiedTime: "2023-09-28",
      webViewLink: "#",
    },
    {
      id: "4",
      name: "Evacuation Plans.pdf",
      mimeType: "application/pdf",
      size: "3.1 MB",
      modifiedTime: "2023-12-10",
      webViewLink: "#",
    },
  ];

  useEffect(() => {
    // Simulate API call to Google Drive
    const fetchDocuments = async () => {
      setLoading(true);
      // In a real implementation, you would use:
      // const response = await fetch(`https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents&key=YOUR_API_KEY`);
      // const data = await response.json();

      // Using mock data for demonstration
      setTimeout(() => {
        setDocuments(mockDocuments);
        setLoading(false);
      }, 1000);
    };

    fetchDocuments();
  }, []);

  const getFileIcon = (mimeType) => {
    if (mimeType.includes("pdf")) return "📄";
    if (mimeType.includes("document")) return "📝";
    if (mimeType.includes("presentation")) return "📊";
    if (mimeType.includes("spreadsheet")) return "📈";
    return "📁";
  };

  const formatMimeType = (mimeType) => {
    if (mimeType.includes("pdf")) return "PDF Document";
    if (mimeType.includes("document")) return "Google Doc";
    if (mimeType.includes("presentation")) return "Presentation";
    if (mimeType.includes("spreadsheet")) return "Spreadsheet";
    return "Document";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl relative">
      <header className="bg-brand-blue text-white p-4 sticky top-0 z-20 shadow-md flex items-center gap-3">
        <button
          onClick={() => setLocation("/")}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-display font-bold text-xl tracking-wide uppercase">
          Learning Materials
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24 space-y-6">
        {/* Documents Section */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-bold text-brand-blue text-lg">
              Documents & Resources
            </h2>
            <button
              className="text-xs font-bold text-brand-blue/70 flex items-center gap-2"
              onClick={() => setLocation("/interactive-map")}
            >
              <Map size={16} />
              Interactive Map
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 animate-pulse"
                >
                  <div className="bg-slate-200 rounded-lg w-12 h-12"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors group"
                  onClick={() => window.open(doc.webViewLink, "_blank")}
                >
                  <div className="bg-brand-yellow/20 text-2xl p-3 rounded-lg flex items-center justify-center">
                    {getFileIcon(doc.mimeType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-brand-blue text-sm truncate">
                      {doc.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {formatMimeType(doc.mimeType)}
                      </span>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {doc.size}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-2 text-slate-500 hover:text-brand-blue hover:bg-slate-100 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle download logic here
                      }}
                    >
                      <Download size={16} />
                    </button>
                    <button
                      className="p-2 text-slate-500 hover:text-brand-blue hover:bg-slate-100 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(doc.webViewLink, "_blank");
                      }}
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-slate-300 group-hover:hidden"
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="font-bold text-brand-blue text-lg mb-3 px-1">
            Guides & Articles
          </h2>
          <div className="space-y-3">
            {[
              "Understanding Earthquake Magnitudes",
              "How to perform CPR correctly",
              "Water Sanitation Methods",
              "Emergency Signals and Codes",
            ].map((title, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="bg-brand-yellow/20 text-brand-blue p-3 rounded-lg">
                  <BookOpen size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-brand-blue text-sm">{title}</h3>
                  <p className="text-xs text-slate-400 mt-1">Read Article</p>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
