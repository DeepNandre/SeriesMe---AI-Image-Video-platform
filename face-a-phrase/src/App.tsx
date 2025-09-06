import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useOnlineStatus } from './lib/useOnline';
import { ThemeProvider } from './components/ThemeProvider';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignIn, SignUp } from '@clerk/clerk-react';
import { FLAGS } from './lib/flags';
import Index from "./pages/Index";
import Create from "./pages/Create";
import Library from "./pages/Library";
import CloudLibrary from "./pages/CloudLibrary";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

function OnlineBanner(){
  const { isOffline } = useOnlineStatus();
  if (!isOffline) return null;
  return (
    <div className="fixed top-0 inset-x-0 z-50 text-center text-xs py-2 bg-destructive/90 text-destructive-foreground backdrop-blur-sm">
      🔌 Offline — Browser-based features still work, but cloud services may be unavailable
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <OnlineBanner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/create" 
              element={
                FLAGS.AUTH_ENABLED ? (
                  <ProtectedRoute>
                    <Create />
                  </ProtectedRoute>
                ) : (
                  <Create />
                )
              } 
            />
            <Route path="/library" element={<Library />} />
            {/* Cloud Library - protected route example */}
            <Route 
              path="/cloud" 
              element={
                <ProtectedRoute>
                  <CloudLibrary />
                </ProtectedRoute>
              } 
            />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            {/* Auth routes - only when AUTH_ENABLED=true */}
            {FLAGS.AUTH_ENABLED && (
              <>
                <Route 
                  path="/sign-in/*" 
                  element={
                    <div className="flex justify-center items-center min-h-screen">
                      <SignIn routing="path" path="/sign-in" />
                    </div>
                  } 
                />
                <Route 
                  path="/sign-up/*" 
                  element={
                    <div className="flex justify-center items-center min-h-screen">
                      <SignUp routing="path" path="/sign-up" />
                    </div>
                  } 
                />
              </>
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
