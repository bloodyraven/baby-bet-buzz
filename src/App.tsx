import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Votes from "./pages/Votes";
import Results from "./pages/Results";
import GiftList from "./pages/GiftList";
import GuestBook from "./pages/GuestBook";
import Gallery from "./pages/Gallery";
import NotFound from "./pages/NotFound";
import PredictionsDetails from "./pages/PredictionsDetails";
import { UserProvider } from "@/context/UserContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
    <UserProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/votes" element={<Votes />} />
          <Route path="/resultats" element={<Results />} />
          <Route path="/cadeaux" element={<GiftList />} />
          <Route path="/livre-or" element={<GuestBook />} />
          <Route path="/galerie" element={<Gallery />} />
          <Route path="/predictions-detaillees" element={<PredictionsDetails />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
