import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-card border-t py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="font-quicksand font-bold text-xl bg-gradient-to-r from-girl to-boy bg-clip-text text-transparent">
              Baby Duj
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              © 2025 - Tous droits réservés
            </p>
          </div>
          
          <Button
            onClick={scrollToTop}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowUp className="w-4 h-4" />
            Haut de page
          </Button>
        </div>
      </div>
    </footer>
  );
};

export { Footer };