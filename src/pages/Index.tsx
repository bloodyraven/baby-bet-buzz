import { AuthButtons } from "@/components/AuthButtons";
import { UserProfile } from "@/components/UserProfile";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Baby, Gift, BookOpen, Camera, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";

const Index = () => {
  const { user } = useUser();

  const sections = [
    {
      title: "Concours de Prédictions",
      description: "Participez au grand jeu ! Devinez si c'est une fille ou un garçon et laissez votre prédiction.",
      icon: Baby,
      href: "/votes",
      gradient: "from-girl to-boy",
      bgGradient: "from-girl-accent to-boy-accent"
    },
    {
      title: "Liste de Naissance",
      description: "Découvrez notre liste de cadeaux soigneusement sélectionnés et réservez celui qui vous fait plaisir.",
      icon: Gift,
      href: "/cadeaux",
      gradient: "from-girl to-boy",
      bgGradient: "from-girl-accent to-boy-accent"
    },
    {
      title: "Livre d'Or",
      description: "Partagez vos félicitations, conseils et messages d'amour pour cette nouvelle aventure.",
      icon: BookOpen,
      href: "/livre-or",
      gradient: "from-girl to-boy",
      bgGradient: "from-girl-accent to-boy-accent"
    },
    {
      title: "Galerie Photo",
      description: "Revivez les moments magiques de cette grossesse à travers notre collection de photos.",
      icon: Camera,
      href: "/galerie",
      gradient: "from-girl to-boy",
      bgGradient: "from-girl-accent to-boy-accent"
    }
  ];

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

      {/* Hero Section */}
      <div className="text-center py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="w-10 h-10 text-girl" />
            <h1 className="text-5xl md:text-7xl font-bold font-quicksand bg-gradient-to-r from-girl to-boy bg-clip-text text-transparent">
              Baby Duj
            </h1>
            <Heart className="w-10 h-10 text-boy" />
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Bienvenue dans notre univers d'attente et de bonheur ! Découvrez toutes les façons de partager cette aventure extraordinaire avec nous.
          </p>
        </div>
      </div>

      {/* Registration Invitation */}
      {user ? "" :
        <div className="max-w-4xl mx-auto px-4 mb-8">
          <div className="bg-gradient-to-r from-girl-accent to-boy-accent rounded-3xl p-6 border-2 border-dashed border-girl/20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-3">Inscription Requise</h2>
              <p className="text-muted-foreground mb-4">
                Pour participer au concours, laisser des messages dans le livre d'or et réserver des cadeaux, vous devez vous inscrire sur le site. C'est rapide et gratuit !
              </p>
                <div className="flex items-center justify-center">
                  {!user && <AuthButtons />}
                </div>
            </div>
          </div>
        </div>
      }

      {/* Sections Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <Card key={index} className={`group hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${section.bgGradient} border-0 overflow-hidden`}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${section.gradient} text-white`}>
                    <section.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl">{section.title}</CardTitle>
                </div>
                <CardDescription className="text-base leading-relaxed">
                  {section.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  asChild 
                  className={`w-full group-hover:scale-105 transition-transform bg-gradient-to-r ${section.gradient} hover:opacity-90`}
                  size="lg"
                >
                  <Link to={section.href} className="flex items-center justify-center gap-2">
                    Découvrir
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;