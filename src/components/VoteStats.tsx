import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface VoteStatsProps {
  girlVotes: number;
  boyVotes: number;
}

export const VoteStats = ({ girlVotes, boyVotes }: VoteStatsProps) => {
  const totalVotes = girlVotes + boyVotes;
  const girlPercentage = totalVotes > 0 ? Math.round((girlVotes / totalVotes) * 100) : 0;
  const boyPercentage = totalVotes > 0 ? Math.round((boyVotes / totalVotes) * 100) : 0;

  return (
    <Card className="p-8 bg-card/80 backdrop-blur-sm border-0 shadow-2xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Résultats en temps réel</h2>
        </div>
        <p className="text-lg text-muted-foreground">
          {totalVotes} vote{totalVotes !== 1 ? 's' : ''} enregistré{totalVotes !== 1 ? 's' : ''}
        </p>
      </div>

      {totalVotes > 0 ? (
        <div className="space-y-6">
          {/* Progress bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Girl Stats */}
            <div className="text-center">
              <div className="mb-3">
                <span className="text-4xl">👧</span>
                <p className="text-sm font-medium text-girl mt-1">Fille</p>
              </div>
              <div className="bg-girl-accent rounded-full h-6 mb-2 overflow-hidden border border-girl/20">
                <div
                  className="h-full bg-gradient-to-r from-girl to-girl/80 transition-all duration-1000 ease-out flex items-center justify-center"
                  style={{ width: `${girlPercentage}%` }}
                >
                  {girlPercentage > 15 && (
                    <span className="text-white text-sm font-bold">{girlPercentage}%</span>
                  )}
                </div>
              </div>
              <p className="text-2xl font-bold text-girl">{girlVotes} votes</p>
            </div>

            {/* Boy Stats */}
            <div className="text-center">
              <div className="mb-3">
                <span className="text-4xl">👦</span>
                <p className="text-sm font-medium text-boy mt-1">Garçon</p>
              </div>
              <div className="bg-boy-accent rounded-full h-6 mb-2 overflow-hidden border border-boy/20">
                <div
                  className="h-full bg-gradient-to-r from-boy to-boy/80 transition-all duration-1000 ease-out flex items-center justify-center"
                  style={{ width: `${boyPercentage}%` }}
                >
                  {boyPercentage > 15 && (
                    <span className="text-white text-sm font-bold">{boyPercentage}%</span>
                  )}
                </div>
              </div>
              <p className="text-2xl font-bold text-boy">{boyVotes} votes</p>
            </div>
          </div>

          {/* Winner indicator */}
          {girlVotes !== boyVotes && (
            <div className="text-center py-4">
              <div
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white shadow-lg ${
                  girlVotes > boyVotes
                    ? "bg-gradient-to-r from-girl to-girl/80"
                    : "bg-gradient-to-r from-boy to-boy/80"
                }`}
              >
                <span className="text-2xl">
                  {girlVotes > boyVotes ? "👑👧" : "👑👦"}
                </span>
                <span>
                  {girlVotes > boyVotes ? "Fille" : "Garçon"} en tête !
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤔</div>
          <p className="text-xl text-muted-foreground">
            Soyez les premiers à voter !
          </p>
        </div>
      )}
    </Card>
  );
};