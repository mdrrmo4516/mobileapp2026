import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ReportIncident from "@/pages/report-incident";
import EvacuationPlan from "@/pages/evacuation-plan";
import GoBag from "@/pages/go-bag";
import WeatherOutlook from "@/pages/weather-outlook";
import DisasterPlan from "@/pages/disaster-plan";
import EmergencyTools from "@/pages/emergency-tools";
import PublicDocuments from "@/pages/public-documents";
import LearningMaterials from "@/pages/learning-materials";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/report-incident" component={ReportIncident} />
      <Route path="/evacuation-plan" component={EvacuationPlan} />
      <Route path="/go-bag" component={GoBag} />
      <Route path="/weather-outlook" component={WeatherOutlook} />
      <Route path="/disaster-plan" component={DisasterPlan} />
      <Route path="/emergency-tools" component={EmergencyTools} />
      <Route path="/public-documents" component={PublicDocuments} />
      <Route path="/learning-materials" component={LearningMaterials} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
