import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { WorkoutDetails } from "./components/WorkoutDetails";
import ProfileSettings from "./pages/ProfileSettings";
import GeneralSettings from "./pages/GeneralSettings";
import NotificationSettings from "./pages/NotificationSettings";
import UnitsSettings from "./pages/UnitsSettings";
import PrivacySettings from "./pages/PrivacySettings";
import HelpSupport from "./pages/HelpSupport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/workout/:workoutId" element={<WorkoutDetails />} />
          <Route path="/settings/profile" element={<ProfileSettings />} />
          <Route path="/settings/general" element={<GeneralSettings />} />
          <Route path="/settings/notifications" element={<NotificationSettings />} />
          <Route path="/settings/units" element={<UnitsSettings />} />
          <Route path="/settings/privacy" element={<PrivacySettings />} />
          <Route path="/help" element={<HelpSupport />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
