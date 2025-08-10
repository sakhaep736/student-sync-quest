import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthWrapper from "./components/AuthWrapper";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import BrowseStudents from "./pages/BrowseStudents";
import ViewJobs from "./pages/ViewJobs";
import PostJob from "./pages/PostJob";
import JoinAsStudent from "./pages/JoinAsStudent";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import JobHistory from "./pages/JobHistory";
import SavedJobs from "./pages/SavedJobs";
import AccountSettings from "./pages/AccountSettings";
import HelpSupport from "./pages/HelpSupport";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <BrowserRouter>
          <AuthWrapper>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/browse-students" element={<BrowseStudents />} />
            <Route path="/view-jobs" element={<ViewJobs />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/join-as-student" element={<JoinAsStudent />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/job-history" element={<JobHistory />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/help-support" element={<HelpSupport />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </AuthWrapper>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
