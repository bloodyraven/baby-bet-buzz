import { useEffect, useState } from "react";
import { GiftForm } from "@/components/GiftForm";
import { GiftsList, GiftType } from "@/components/GiftsList";
import { Button } from "@/components/ui/button";
import { Plus, Gift, Heart } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/context/UserContext";
import { AuthButtons } from "@/components/AuthButtons";
import { UserProfile } from "@/components/UserProfile";
import { Navigation } from "@/components/Navigation";

const GiftListPage = () => {
  const [gifts, setGifts] = useState<GiftType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const fetchGifts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cadeau")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Erreur lors du chargement des cadeaux :", error);
    else if (data) setGifts(data as GiftType[]);

    setLoading(false);
  };

  useEffect(() => {
    fetchGifts();
  }, []);

  const handleAddGift = async (gift: {
    titre: string;
    desc?: string;
    prix?: number;
    link?: string;
  }) => {
    const { data, error } = await supabase
      .from("cadeau")
      .insert([{ ...gift }])
      .select();

    if (error) console.error("Erreur lors de l'ajout du cadeau :", error);
    else if (data) {
      setGifts((prev) => [data[0], ...prev]);
      setShowForm(false);
    }
  };

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
            <Gift className="w-8 h-8 text-girl" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-girl to-boy bg-clip-text text-transparent">
              Liste de Naissance
            </h1>
            <Heart className="w-8 h-8 text-boy" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre liste de naissance et réservez les cadeaux qui vous font plaisir !
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4">
        {/* Move the Add button on the page (admin only) */}
        {user?.admin && (
          <div className="mb-6 flex justify-end">
            <Button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-gradient-to-r from-girl to-boy text-white">
              <Plus className="w-4 h-4" />
              Ajouter un cadeau
            </Button>
          </div>
        )}

        {showForm && <GiftForm onSubmit={handleAddGift} onCancel={() => setShowForm(false)} />}

        {loading ? (
          <div className="text-center text-muted-foreground py-12">Chargement...</div>
        ) : (
          <>
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border-0">
                <div className="text-3xl font-bold text-foreground">{gifts.length}</div>
                <div className="text-muted-foreground">Cadeaux au total</div>
              </div>

              <div className="bg-gradient-to-br from-girl-secondary to-girl-accent rounded-2xl p-6 text-center shadow-lg">
                <div className="text-3xl font-bold text-girl-primary">{gifts.filter(g => g.reserve && g.reserve.trim() !== "").length}</div>
                <div className="text-girl-primary/70">Réservés</div>
              </div>

              <div className="bg-gradient-to-br from-boy-secondary to-boy-accent rounded-2xl p-6 text-center shadow-lg">
                <div className="text-3xl font-bold text-boy-primary">{gifts.filter(g => !g.reserve || g.reserve.trim() === "").length}</div>
                <div className="text-boy-primary/70">Disponibles</div>
              </div>
            </div>

            <GiftsList gifts={gifts} setGifts={setGifts} supabase={supabase} />
          </>
        )}
      </main>
    </div>
  );
};

export default GiftListPage;