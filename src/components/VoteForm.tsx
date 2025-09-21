import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Vote } from "@/pages/Votes";
import { majPremiereLettre } from "@/utils/utils";

interface VoteFormProps {
  supabase: SupabaseClient;
  votes: Vote[];
  setVotes: (votes: Vote[]) => void;
  hasVoted: boolean;
}

export const VoteForm = ({ supabase, votes, setVotes, hasVoted }: VoteFormProps) => {
  const { user } = useUser();
  const [selectedGender, setSelectedGender] = useState<"girl" | "boy" | null>(null);

  // Pré-remplir le vote si l'utilisateur a déjà voté
  useEffect(() => {
    if (!user) {
      setSelectedGender(null);
      return;
    }
    const previousVote = votes.find(v => v.nom === user.nom && v.prenom === user.pseudo);
    setSelectedGender(previousVote ? previousVote.gender : null);
  }, [user, votes]);

  const fetchVotes = async () => {
    const { data, error } = await supabase
      .from("vote")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setVotes(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Vous devez être connecté pour voter !");
      return;
    }
    if (!selectedGender) {
      toast.error("Veuillez choisir votre prédiction");
      return;
    }

    // Supprimer le vote précédent si existant
    const previousVote = votes.find(v => v.nom === user.nom && v.prenom === user.pseudo);
    if (previousVote) {
      await supabase.from("vote").delete().eq("id", previousVote.id);
    }

    // Ajouter le nouveau vote
    await supabase.from("vote").insert({ nom: user.nom, prenom: user.pseudo, gender: selectedGender });

    if (hasVoted) {
      toast.success(`Votre vote a été modifié.`);
    } else {
      toast.success(
        `Merci ${majPremiereLettre(user.pseudo)} ! Votre vote pour "${selectedGender === "girl" ? "Fille" : "Garçon"}" a été enregistré ! 🎉`
      );
    }

    await fetchVotes(); // Recharge la liste
  };

  return (
    <Card className="p-8 bg-card/80 backdrop-blur-sm border-0 shadow-2xl">
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-4">
              Votre prédiction, {user.pseudo} :
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
            {hasVoted ? "Modifier mon vote 📝" : "Enregistrer mon vote 🗳️"}
          </Button>
        </form>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p className="mb-4 text-lg">Connectez-vous pour voter et voir vos résultats.</p>
          <p className="text-sm">Après connexion, vous pourrez voter et modifier votre choix si besoin.</p>
        </div>
      )}
    </Card>
  );
};
