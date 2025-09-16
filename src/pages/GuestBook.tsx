import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/Navigation";
import { AuthButtons } from "@/components/AuthButtons";
import { UserProfile } from "@/components/UserProfile";
import { Footer } from "@/components/Footer";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { MessageCircle, Trash2 } from "lucide-react";

interface GuestBookEntry {
  id: string;
  created_at: string;
  name: string;
  message: string;
  is_private: boolean;
}

const GuestBook = () => {
  const { user } = useUser();
  const [entries, setEntries] = useState<GuestBookEntry[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<GuestBookEntry | null>(null);

  // NEW state for filters
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchEntries();
  }, [user]);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from("guest_book")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors du chargement des messages:", error);
      toast.error("Impossible de charger le livre d'or");
    } else if (data) {
      setEntries(data);
      if (user) {
        const existing = data.find((entry) => entry.name === user.pseudo);
        if (existing) {
          setEditingEntry(existing);
          setNewMessage(existing.message);
          setIsPrivate(existing.is_private);
        } else {
          setEditingEntry(null);
          setNewMessage("");
          setIsPrivate(false);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      toast.error("Le message ne peut pas être vide");
      return;
    }
    if (!user) {
      toast.error("Vous devez être connecté pour laisser un message");
      return;
    }

    setIsSubmitting(true);

    if (editingEntry) {
      const { error } = await supabase
        .from("guest_book")
        .update({ message: newMessage.trim(), is_private: isPrivate })
        .eq("id", editingEntry.id);

      if (error) {
        console.error("Erreur update:", error);
        toast.error("Impossible de modifier le message");
      } else {
        toast.success("Message modifié !");
        fetchEntries();
      }
    } else {
      const { data, error } = await supabase
        .from("guest_book")
        .insert([
          {
            name: user.pseudo,
            message: newMessage.trim(),
            is_private: isPrivate,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Erreur insert:", error);
        toast.error("Impossible d'ajouter le message");
      } else if (data) {
        setEntries([data, ...entries]);
        setEditingEntry(data);
        setNewMessage(data.message);
        setIsPrivate(data.is_private);
        toast.success("Message ajouté !");
      }
    }

    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      return;
    }
    const { error } = await supabase.from("guest_book").delete().eq("id", id);
    if (error) {
      console.error("Erreur suppression:", error);
      toast.error("Impossible de supprimer le message");
    } else {
      toast.success("Message supprimé !");
      setEntries(entries.filter((entry) => entry.id !== id));
      if (editingEntry?.id === id) {
        setEditingEntry(null);
        setNewMessage("");
        setIsPrivate(false);
      }
    }
  };

  // Filtrage + tri
  const filteredEntries = useMemo(() => {
    let result = [...entries];

    if (search.trim()) {
      const lower = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(lower) ||
          e.message.toLowerCase().includes(lower)
      );
    }

    result.sort((a, b) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return sortOrder === "asc" ? da - db : db - da;
    });

    return result;
  }, [entries, search, sortOrder]);

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

      {/* Main */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageCircle className="w-8 h-8 text-girl" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-girl to-boy bg-clip-text text-transparent">
              Livre d'or
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Laissez un petit mot pour accompagner cette belle aventure ✨
          </p>
        </div>

        {/* Formulaire */}
        {user ? (
          <Card className="mb-8 bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                {editingEntry ? "Modifier votre message" : "Votre message"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Textarea
                  id="message"
                  placeholder="Écrivez ici..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[100px]"
                />

                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                  />
                  Rendre ce message privé (visible uniquement par vous et les administrateurs)
                </label>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-girl to-boy hover:from-girl/90 hover:to-boy/90"
                  >
                    {isSubmitting
                      ? "Envoi en cours..."
                      : editingEntry
                      ? "Mettre à jour"
                      : "Publier"}
                  </Button>
                  {editingEntry && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => handleDelete(editingEntry.id)}
                    >
                      Supprimer
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <p className="text-center text-muted-foreground mb-8">
            Vous devez être connecté pour laisser un message.
          </p>
        )}

        {/* Filtres */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
          <Input
            placeholder="Rechercher par nom ou message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="border rounded px-3 py-2"
          >
            <option value="desc">Date décroissante</option>
            <option value="asc">Date croissante</option>
          </select>
        </div>

        {/* Liste des messages */}
        <div className="space-y-6">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => {
              const canView =
                !entry.is_private ||
                (user && (user.admin || user.pseudo === entry.name));

              if (!canView) return null;

              return (
                <Card
                  key={entry.id}
                  className="bg-card/80 backdrop-blur-sm border-0 shadow-md"
                >
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-girl-secondary to-boy-secondary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                          {entry.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold">{entry.name}</span>
                        {entry.is_private && (
                          <span className="ml-2 text-xs text-muted-foreground italic">
                            (privé)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.created_at).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                        {user &&
                          (user.admin || user.pseudo === entry.name) && (
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="text-destructive hover:opacity-80"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                      </div>
                    </div>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {entry.message}
                    </p>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <p className="text-center text-muted-foreground">
              Aucun message pour le moment.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GuestBook;
