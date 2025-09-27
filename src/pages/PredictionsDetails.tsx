import { useEffect, useState } from "react";
import { DetailedPredictionForm, DetailedPrediction } from "@/components/DetailedPredictionForm";
import { DetailedPredictionsList } from "@/components/DetailedPredictionsList";
import { AuthButtons } from "@/components/AuthButtons";
import { UserProfile } from "@/components/UserProfile";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Baby, Heart, Eye, EyeOff, Calendar, Scale, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/context/UserContext";

const PredictionsDetails = () => {
  const { user } = useUser();
  const [predictions, setPredictions] = useState<DetailedPrediction[]>([]);
  const [hasPredicted, setHasPredicted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Charger les prédictions existantes au montage
  useEffect(() => {
    const fetchPredictions = async () => {
      const { data, error } = await supabase
        .from("detailed_predictions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur fetch detailed_predictions:", error);
      } else if (data) {
        setPredictions(data);
        if (user) {
          const predicted = data.some((p) => p.nom === user.nom && p.prenom === user.pseudo);
          setHasPredicted(predicted);
          if (predicted) setShowResults(true);
        }
      }
    };

    fetchPredictions();
  }, [user]);

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
              Prédictions Détaillées
            </h1>
            <Heart className="w-8 h-8 text-boy" />
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            Faites vos prédictions complètes sur le bébé : prénom, date de naissance, poids et taille !
          </p>
          
          {/* Features Icons */}
          <div className="flex items-center justify-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Baby className="w-5 h-5" />
              <span className="text-sm">Prénom</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">Date</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5" />
              <span className="text-sm">Poids</span>
            </div>
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              <span className="text-sm">Taille</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Form */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <DetailedPredictionForm 
          supabase={supabase} 
          predictions={predictions} 
          setPredictions={setPredictions} 
          hasPredicted={hasPredicted}
          setShowResults={setShowResults}
        />
      </div>

      {/* Results Section */}
      {showResults ? (
        <>
          {/* Statistics */}
          <div className="max-w-6xl mx-auto px-4 mb-8">
            <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 border-0 shadow-2xl">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">📊 Statistiques</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-girl to-boy bg-clip-text text-transparent">
                      {predictions.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Prédiction{predictions.length !== 1 ? 's' : ''}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-girl">
                      {predictions.length > 0 ? 
                        (predictions.reduce((sum, p) => sum + p.weight, 0) / predictions.length).toFixed(1) + " kg"
                        : "- kg"
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Poids moyen</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-boy">
                      {predictions.length > 0 ? 
                        Math.round(predictions.reduce((sum, p) => sum + p.height, 0) / predictions.length) + " cm"
                        : "- cm"
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Taille moyenne</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Predictions Display */}
          <div className="max-w-6xl mx-auto px-4 pb-12">
            <div className="bg-gradient-to-br from-girl-accent to-boy-accent rounded-3xl p-8 border border-girl-secondary/20 backdrop-blur-sm">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">🔮 Toutes les prédictions</h2>
                <p className="text-muted-foreground">
                  Découvrez ce que tout le monde pense !
                </p>
              </div>
              <DetailedPredictionsList predictions={predictions} />
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
                {hasPredicted
                  ? "Vous avez fait vos prédictions ! Les résultats sont maintenant visibles."
                  : "Faites d'abord vos prédictions pour découvrir les résultats, ou cliquez sur le bouton ci-dessous pour les révéler."}
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

export default PredictionsDetails;