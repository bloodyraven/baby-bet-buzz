import { useEffect, useState } from "react";
import { VoteForm } from "@/components/VoteForm";
import { VotesList } from "@/components/VotesList";
import { VoteStats } from "@/components/VoteStats";
import { AuthButtons } from "@/components/AuthButtons";
import { UserProfile } from "@/components/UserProfile";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Baby, Heart, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/context/UserContext";

// Typage aligné avec ta table Supabase
export interface Vote {
  id: string;
  nom: string;
  prenom: string;
  gender: "girl" | "boy";
  created_at: string; // timestamp Supabase
}

const Votes = () => {
  const { user } = useUser();
  const [votes, setVotes] = useState<Vote[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Charger les votes existants au montage
  useEffect(() => {
    const fetchVotes = async () => {
      const { data, error } = await supabase
        .from("vote")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur fetch vote:", error);
      } else if (data) {
        setVotes(data);
        if (user) {
          const voted = data.some((v) => v.nom === user.nom && v.prenom === user.pseudo);
          setHasVoted(voted);
          if (voted) setShowResults(true);
        }
      }
    };

    fetchVotes();
  }, [user]);

  // Ajouter un vote dans Supabase
  const handleVote = async (nom: string, prenom: string, gender: "girl" | "boy") => {
    await supabase.from("vote").delete().eq("nom", nom).eq("prenom", prenom);

    const { data, error } = await supabase
      .from("vote")
      .insert([{ nom, prenom, gender }])
      .select();

    if (error) {
      console.error("Erreur insert vote:", error);
    } else if (data && data.length > 0) {
      setVotes((prev) => [data[0], ...prev]); // ajoute en haut de la liste
      setHasVoted(true);
      setShowResults(true);
    }
  };

  const girlVotes = votes.filter((vote) => vote.gender === "girl");
  const boyVotes = votes.filter((vote) => vote.gender === "boy");

  return (
    <div className="min-h-screen bg-gradient-to-r from-girl-secondary via-background to-boy-secondary">
      {/* Header */}
      <header className="sticky top-0 bg-card/80 backdrop-blur-md border-b z-40 mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Navigation />
            <div className="flex items-center gap-4">
              {user ? <UserProfile /> : <AuthButtons />}
            </div>
          </div>
        </div>
      </header>

      {/* Title Section */}
      <div className="text-center py-8 px-4">
        <div className="max-w-7xl mx-auto mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Baby className="w-8 h-8 text-girl" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-girl to-boy bg-clip-text text-transparent">
              Fille ou Garçon ?
            </h1>
            <Heart className="w-8 h-8 text-boy" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Votez pour deviner le genre du bébé ! Laissez votre nom et votre prédiction.
          </p>
        </div>
      </div>

      {/* Vote Form */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <VoteForm supabase={supabase} votes={votes} setVotes={setVotes} hasVoted={hasVoted}/>
      </div>

      {/* Results Section */}
      {showResults ? (
        <>
          {/* Stats */}
          <div className="max-w-6xl mx-auto px-4 mb-12">
            <VoteStats girlVotes={girlVotes.length} boyVotes={boyVotes.length} />
          </div>

          {/* Votes Display */}
          <div className="max-w-6xl mx-auto px-4 pb-12">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Girls Section */}
              <div className="bg-gradient-to-br from-girl-accent to-girl-secondary/50 rounded-3xl p-6 border border-girl-secondary/20 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-girl mb-2">👧 Fille</h2>
                  <p className="text-girl/80 font-medium">
                    {girlVotes.length} vote{girlVotes.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <VotesList votes={girlVotes} gender="girl" />
              </div>

              {/* Boys Section */}
              <div className="bg-gradient-to-br from-boy-accent to-boy-secondary/50 rounded-3xl p-6 border border-boy-secondary/20 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-boy mb-2">👦 Garçon</h2>
                  <p className="text-boy/80 font-medium">
                    {boyVotes.length} vote{boyVotes.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <VotesList votes={boyVotes} gender="boy" />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Hidden Results Message */}
          <div className="max-w-4xl mx-auto px-4 mb-12">
            <div className="text-center bg-card/80 backdrop-blur-sm rounded-3xl p-12 border-0 shadow-2xl">
              <div className="text-6xl mb-6">🤐</div>
              <h3 className="text-2xl font-bold mb-4">Résultats cachés</h3>
              <p className="text-muted-foreground mb-8 text-lg">
                {hasVoted
                  ? "Vous avez voté ! Les résultats sont maintenant visibles."
                  : "Votez d'abord pour découvrir les résultats, ou cliquez sur le bouton ci-dessous pour les révéler."}
              </p>
              <Button
                onClick={() => setShowResults(true)}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <Eye className="w-5 h-5" />
                Révéler les résultats
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Hide Results Button */}
      {showResults && (
        <div className="max-w-4xl mx-auto px-4 pb-12 text-center">
          <Button
            onClick={() => setShowResults(false)}
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground"
          >
            <EyeOff className="w-4 h-4" />
            Cacher les résultats
          </Button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Votes;