import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-girl-secondary/20 via-background to-boy-secondary/20 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-card/80 backdrop-blur-md border-b z-40 mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Navigation />
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6">🤱</div>
          <h1 className="text-4xl font-bold font-quicksand bg-gradient-to-r from-girl to-boy bg-clip-text text-transparent mb-4">
            Oups !
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Cette page n'existe pas dans notre petit cocon familial.
          </p>
          <Button asChild className="bg-gradient-to-r from-girl to-boy hover:from-girl/90 hover:to-boy/90">
            <a href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Retour à l'accueil
            </a>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotFound;
