import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface VoteFormProps {
  onVote: (name: string, gender: "girl" | "boy") => void;
}

export const VoteForm = ({ onVote }: VoteFormProps) => {
  const [name, setName] = useState("");
  const [selectedGender, setSelectedGender] = useState<"girl" | "boy" | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Veuillez entrer votre nom");
      return;
    }
    
    if (!selectedGender) {
      toast.error("Veuillez choisir votre prédiction");
      return;
    }

    onVote(name.trim(), selectedGender);
    setName("");
    setSelectedGender(null);
    
    toast.success(`Merci ${name.trim()} ! Votre vote pour "${selectedGender === "girl" ? "Fille" : "Garçon"}" a été enregistré ! 🎉`);
  };

  return (
    <Card className="p-8 bg-card/80 backdrop-blur-sm border-0 shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Votre nom
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Entrez votre nom..."
            className="text-lg h-12 border-2 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-4">
            Votre prédiction
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setSelectedGender("girl")}
              className={`h-20 text-lg font-semibold border-2 transition-all duration-300 ${
                selectedGender === "girl"
                  ? "bg-girl text-white border-girl shadow-[var(--shadow-girl)] scale-105"
                  : "border-girl/30 text-girl hover:bg-girl/10 hover:border-girl/50"
              }`}
            >
              <span className="text-2xl mr-3">👧</span>
              Fille
            </Button>
            
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setSelectedGender("boy")}
              className={`h-20 text-lg font-semibold border-2 transition-all duration-300 ${
                selectedGender === "boy"
                  ? "bg-boy text-white border-boy shadow-[var(--shadow-boy)] scale-105"
                  : "border-boy/30 text-boy hover:bg-boy/10 hover:border-boy/50"
              }`}
            >
              <span className="text-2xl mr-3">👦</span>
              Garçon
            </Button>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-girl to-boy hover:from-girl/90 hover:to-boy/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Enregistrer mon vote ! 🗳️
        </Button>
      </form>
    </Card>
  );
};