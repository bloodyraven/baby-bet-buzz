import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DetailedPrediction } from "./DetailedPredictionForm";
import { majPremiereLettre } from "@/utils/utils";

interface DetailedPredictionsListProps {
  predictions: DetailedPrediction[];
}

export const DetailedPredictionsList = ({ predictions }: DetailedPredictionsListProps) => {
  if (predictions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <div className="text-4xl mb-4">🤷‍♀️</div>
        <p>Aucune prédiction pour le moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {predictions.map((prediction) => (
        <div
          key={prediction.id}
          className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:bg-card/80 transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-bold text-lg text-foreground">
                {majPremiereLettre(prediction.prenom)}
              </h4>
              <p className="text-sm text-muted-foreground">
                {format(new Date(prediction.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👶</span>
                <div>
                  <p className="text-sm text-muted-foreground">Prénom</p>
                  <p className="font-semibold text-lg">{prediction.baby_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="text-sm text-muted-foreground">Date de naissance</p>
                  <p className="font-semibold">
                    {format(new Date(prediction.birth_date), "EEEE d MMMM yyyy", { locale: fr })}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚖️</span>
                <div>
                  <p className="text-sm text-muted-foreground">Poids</p>
                  <p className="font-semibold">{prediction.weight} kg</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-2xl">📏</span>
                <div>
                  <p className="text-sm text-muted-foreground">Taille</p>
                  <p className="font-semibold">{prediction.height} cm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};