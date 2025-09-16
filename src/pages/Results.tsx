import { Navigation } from "@/components/Navigation";
import { UserProfile } from "@/components/UserProfile";
import { AuthButtons } from "@/components/AuthButtons";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Baby, Calendar, Trophy, Users, Heart, Crown } from "lucide-react";
import { useUser } from "@/context/UserContext";

const Results = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-girl-secondary/20 via-background to-boy-secondary/20">
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

      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-girl" />
            <h1 className="text-4xl md:text-5xl font-bold font-quicksand bg-gradient-to-r from-girl to-boy bg-clip-text text-transparent">
              Résultats du Concours
            </h1>
            <Trophy className="w-8 h-8 text-boy" />
          </div>
          <p className="text-lg text-muted-foreground">
            Découvrez les résultats de notre grand concours de prédictions !
          </p>
        </div>

        {/* Reveal Section */}
        <Card className="mb-8 bg-gradient-to-br from-girl-accent/30 to-boy-accent/30 border-0">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Baby className="w-6 h-6" />
              La Grande Révélation
            </CardTitle>
            <CardDescription>
              <div className="flex items-center justify-center gap-2 text-base">
                <Calendar className="w-4 h-4" />
                Date de révélation : XX/XX/XXXX
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-6xl font-bold bg-gradient-to-r from-girl to-boy bg-clip-text text-transparent">
              XX
            </div>
            <p className="text-lg text-muted-foreground">
              Le résultat sera bientôt révélé...
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Vote Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Statistiques des Votes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-girl" />
                    Votes Fille
                  </span>
                  <Badge variant="outline" className="bg-girl-accent text-girl font-bold">
                    XX votes (XX%)
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-boy" />
                    Votes Garçon
                  </span>
                  <Badge variant="outline" className="bg-boy-accent text-boy font-bold">
                    XX votes (XX%)
                  </Badge>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Total des participants</span>
                    <span>XX participants</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Winners */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Gagnants du Concours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  Tous ceux qui ont deviné correctement :
                </p>
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="text-lg font-semibold">À révéler bientôt...</p>
                  <p className="text-sm text-muted-foreground">
                    La liste des gagnants sera affichée après la révélation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Informations sur le Concours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Période des votes</h4>
                <p className="text-muted-foreground">Du XX/XX/XXXX au XX/XX/XXXX</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Nombre total de votes</h4>
                <p className="text-muted-foreground">XX votes collectés</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Date de naissance</h4>
                <p className="text-muted-foreground">XX/XX/XXXX</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Poids et taille</h4>
                <p className="text-muted-foreground">XX kg - XX cm</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Results;