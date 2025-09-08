import { Vote } from "@/pages/Index";
import { Clock, User } from "lucide-react";

interface VotesListProps {
  votes: Vote[];
  gender: "girl" | "boy";
}

export const VotesList = ({ votes, gender }: VotesListProps) => {
  if (votes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">
          {gender === "girl" ? "🌸" : "⚽"}
        </div>
        <p className="text-muted-foreground">
          Aucun vote pour {gender === "girl" ? "fille" : "garçon"} pour le moment
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {votes.map((vote) => (
        <div
          key={vote.id}
          className={`p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
            gender === "girl"
              ? "bg-white/60 border border-girl/20 hover:shadow-[var(--shadow-girl)]"
              : "bg-white/60 border border-boy/20 hover:shadow-[var(--shadow-boy)]"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  gender === "girl" ? "bg-girl" : "bg-boy"
                }`}
              >
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{vote.name}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {vote.timestamp.toLocaleDateString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
            
            <div className="text-2xl">
              {gender === "girl" ? "💕" : "💙"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};