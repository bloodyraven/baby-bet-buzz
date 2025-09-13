import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import { AuthButtons } from "@/components/AuthButtons";
import { UserProfile } from "@/components/UserProfile";
import { BookOpen, Heart, MessageCircle, Send } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface GuestBookEntry {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

const GuestBook = () => {
  const { user } = useUser();
  const [entries, setEntries] = useState<GuestBookEntry[]>([]);
  const [newEntry, setNewEntry] = useState({ name: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from("guest_book")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors du chargement des messages:", error);
      toast.error("Erreur lors du chargement des messages");
    } else if (data) {
      setEntries(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.name.trim() || !newEntry.message.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsSubmitting(true);
    const { data, error } = await supabase
      .from("guest_book")
      .insert([{ name: newEntry.name.trim(), message: newEntry.message.trim() }])
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de l'ajout du message:", error);
      toast.error("Erreur lors de l'ajout du message");
    } else if (data) {
      setEntries([data, ...entries]);
      setNewEntry({ name: "", message: "" });
      toast.success("Message ajouté avec succès !");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-girl-secondary via-background to-boy-secondary">
      {/* Header */}
      <header className="sticky top-0 bg-card/80 backdrop-blur-md border-b z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Navigation />
            <div className="flex items-center gap-4">
              {user ? <UserProfile /> : <AuthButtons />}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-girl" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-girl to-boy bg-clip-text text-transparent">
              Livre d'Or
            </h1>
            <Heart className="w-8 h-8 text-boy" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Laissez vos messages de félicitations, vos conseils ou simplement vos mots doux pour accompagner cette belle aventure !
          </p>
        </div>

        {/* Message Form */}
        <Card className="mb-12 bg-gradient-to-r from-girl-accent/50 to-boy-accent/50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Laissez votre message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Votre nom</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Votre nom ou pseudo"
                  value={newEntry.name}
                  onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Votre message</Label>
                <Textarea
                  id="message"
                  placeholder="Écrivez votre message de félicitations, vos conseils ou vos mots doux..."
                  value={newEntry.message}
                  onChange={(e) => setNewEntry({ ...newEntry, message: e.target.value })}
                  className="min-h-[120px]"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-girl to-boy hover:from-girl/90 hover:to-boy/90"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Envoi en cours..." : "Ajouter le message"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Messages List */}
        <div className="space-y-6">
          {entries.length > 0 ? (
            entries.map((entry) => (
              <Card key={entry.id} className="bg-card/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-girl-secondary to-boy-secondary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                        {entry.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold">{entry.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(entry.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {entry.message}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-md">
              <CardContent className="pt-6 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Aucun message pour le moment. Soyez le premier à laisser vos félicitations !
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default GuestBook;