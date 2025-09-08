import { useState } from "react";
import { VoteForm } from "@/components/VoteForm";
import { VotesList } from "@/components/VotesList";
import { VoteStats } from "@/components/VoteStats";
import { Baby, Heart } from "lucide-react";

export interface Vote {
  id: string;
  name: string;
  gender: "girl" | "boy";
  timestamp: Date;
}

const Index = () => {
  const [votes, setVotes] = useState<Vote[]>([]);

  const handleVote = (name: string, gender: "girl" | "boy") => {
    const newVote: Vote = {
      id: Date.now().toString(),
      name,
      gender,
      timestamp: new Date(),
    };
    setVotes(prev => [...prev, newVote]);
  };

  const girlVotes = votes.filter(vote => vote.gender === "girl");
  const boyVotes = votes.filter(vote => vote.gender === "boy");

  return (
    <div className="min-h-screen bg-gradient-to-r from-girl-secondary via-background to-boy-secondary">
      {/* Header */}
      <header className="text-center py-8 px-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Baby className="w-8 h-8 text-girl" />
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-girl to-boy bg-clip-text text-transparent">
            Fille ou Garçon ?
          </h1>
          <Heart className="w-8 h-8 text-boy" />
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Votez pour deviner le genre du bébé qui arrive ! Laissez votre nom et votre prédiction.
        </p>
      </header>

      {/* Vote Form */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <VoteForm onVote={handleVote} />
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <VoteStats girlVotes={girlVotes.length} boyVotes={boyVotes.length} />
      </div>

      {/* Votes Display */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Girls Section */}
          <div className="bg-gradient-to-br from-girl-accent to-girl-secondary/50 rounded-3xl p-6 border border-girl-secondary/20 backdrop-blur-sm">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-girl mb-2">👧 Fille</h2>
              <p className="text-girl/80 font-medium">{girlVotes.length} vote{girlVotes.length !== 1 ? 's' : ''}</p>
            </div>
            <VotesList votes={girlVotes} gender="girl" />
          </div>

          {/* Boys Section */}
          <div className="bg-gradient-to-br from-boy-accent to-boy-secondary/50 rounded-3xl p-6 border border-boy-secondary/20 backdrop-blur-sm">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-boy mb-2">👦 Garçon</h2>
              <p className="text-boy/80 font-medium">{boyVotes.length} vote{boyVotes.length !== 1 ? 's' : ''}</p>
            </div>
            <VotesList votes={boyVotes} gender="boy" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;