import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { majPremiereLettre } from "@/utils/utils";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface DetailedPrediction {
  id: string;
  nom: string;
  prenom: string;
  baby_name: string;
  birth_date: string;
  weight: number;
  height: number;
  created_at: string;
}

interface DetailedPredictionFormProps {
  supabase: SupabaseClient;
  predictions: DetailedPrediction[];
  setPredictions: (predictions: DetailedPrediction[]) => void;
  hasPredicted: boolean;
  setShowResults: (show: boolean) => void;
}

export const DetailedPredictionForm = ({ 
  supabase, 
  predictions, 
  setPredictions, 
  hasPredicted, 
  setShowResults 
}: DetailedPredictionFormProps) => {
  const { user } = useUser();
  const [babyName, setBabyName] = useState("");
  const [birthDate, setBirthDate] = useState<Date>();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  // Pré-remplir les données si l'utilisateur a déjà prédit
  useEffect(() => {
    if (!user) {
      setBabyName("");
      setBirthDate(undefined);
      setWeight("");
      setHeight("");
      return;
    }
    const previousPrediction = predictions.find(p => p.nom === user.nom && p.prenom === user.pseudo);
    if (previousPrediction) {
      setBabyName(previousPrediction.baby_name);
      setBirthDate(new Date(previousPrediction.birth_date));
      setWeight(previousPrediction.weight.toString());
      setHeight(previousPrediction.height.toString());
    }
  }, [user, predictions]);

  const fetchPredictions = async () => {
    const { data, error } = await supabase
      .from("detailed_predictions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setPredictions(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Vous devez être connecté pour faire une prédiction !");
      return;
    }

    if (!babyName.trim()) {
      toast.error("Veuillez saisir un prénom");
      return;
    }

    if (!birthDate) {
      toast.error("Veuillez sélectionner une date de naissance");
      return;
    }

    if (!weight || parseFloat(weight) <= 0) {
      toast.error("Veuillez saisir un poids valide");
      return;
    }

    if (!height || parseFloat(height) <= 0) {
      toast.error("Veuillez saisir une taille valide");
      return;
    }

    // Supprimer la prédiction précédente si elle existe
    const previousPrediction = predictions.find(p => p.nom === user.nom && p.prenom === user.pseudo);
    if (previousPrediction) {
      await supabase.from("detailed_predictions").delete().eq("id", previousPrediction.id);
    }

    // Ajouter la nouvelle prédiction
    const { error } = await supabase.from("detailed_predictions").insert({
      nom: user.nom,
      prenom: user.pseudo,
      baby_name: babyName.trim(),
      birth_date: birthDate.toISOString().split('T')[0],
      weight: parseFloat(weight),
      height: parseFloat(height)
    });

    if (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast.error("Erreur lors de l'enregistrement de votre prédiction");
      return;
    }

    if (hasPredicted) {
      toast.success("Votre prédiction a été modifiée !");
    } else {
      toast.success(`Merci ${majPremiereLettre(user.pseudo)} ! Votre prédiction a été enregistrée ! 🎉`);
    }

    await fetchPredictions();
    setShowResults(true);
  };

  return (
    <Card className="p-8 bg-card/80 backdrop-blur-sm border-0 shadow-2xl">
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-foreground">
              Vos prédictions détaillées, {majPremiereLettre(user.pseudo)} :
            </h3>
            <p className="text-muted-foreground mt-2">
              Prénom, date de naissance, poids et taille du bébé
            </p>
          </div>

          {/* Prénom */}
          <div className="space-y-2">
            <Label htmlFor="babyName">Prénom du bébé</Label>
            <Input
              id="babyName"
              type="text"
              value={babyName}
              onChange={(e) => setBabyName(e.target.value)}
              placeholder="Ex: Emma, Lucas..."
              className="text-base"
            />
          </div>

          {/* Date de naissance */}
          <div className="space-y-2">
            <Label>Date de naissance prédite</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !birthDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDate ? format(birthDate, "PPP", { locale: fr }) : "Sélectionnez une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={birthDate}
                  onSelect={setBirthDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Poids */}
            <div className="space-y-2">
              <Label htmlFor="weight">Poids (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                min="0.5"
                max="8"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ex: 3.2"
                className="text-base"
              />
            </div>

            {/* Taille */}
            <div className="space-y-2">
              <Label htmlFor="height">Taille (cm)</Label>
              <Input
                id="height"
                type="number"
                min="30"
                max="70"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Ex: 48"
                className="text-base"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-girl to-boy hover:from-girl/90 hover:to-boy/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {hasPredicted ? "Modifier ma prédiction 📝" : "Enregistrer ma prédiction 🔮"}
          </Button>
        </form>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p className="mb-4 text-lg">Connectez-vous pour faire vos prédictions détaillées.</p>
          <p className="text-sm">Après connexion, vous pourrez prédire le prénom, la date, le poids et la taille.</p>
        </div>
      )}
    </Card>
  );
};