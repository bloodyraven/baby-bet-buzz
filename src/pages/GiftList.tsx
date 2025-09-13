import { useEffect, useState } from "react";
import { GiftForm } from "@/components/GiftForm";
import { GiftsList, GiftType } from "@/components/GiftsList";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/context/UserContext";
import { AuthButtons } from "@/components/AuthButtons";

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
    else if (data) setGifts(data);

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
      setGifts(prev => [data[0], ...prev]);
      setShowForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 bg-gradient-to-r from-girl-secondary via-background to-boy-secondary">
      <header className="max-w-4xl mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-girl-primary to-boy-primary bg-clip-text">
            Liste de Naissance
          </h1>
        </div>
        {user?.admin && (
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-gradient-to-r from-girl-primary to-boy-primary text-black">
          <Plus className="w-4 h-4" />
          Ajouter un cadeau
        </Button>
        )}
        <AuthButtons />
      </header>

      {showForm && <GiftForm onSubmit={handleAddGift} onCancel={() => setShowForm(false)} />}

      {loading ? (
        <div className="text-center text-muted-foreground">Chargement...</div>
      ) : (
        <>
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/20">
              <div className="text-3xl font-bold text-gray-800">{gifts.length}</div>
              <div className="text-muted-foreground">Cadeaux au total</div>
            </div>
            <div className="bg-gradient-to-br from-girl-secondary to-girl-accent rounded-2xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-girl-primary">{gifts.filter(g => g.reserve && g.reserve.trim() !== "").length}</div>
              <div className="text-girl-primary/70">Réservés</div>
            </div>
            <div className="bg-gradient-to-br from-boy-secondary to-boy-accent rounded-2xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-boy-primary">{gifts.length - gifts.filter(g => g.reserve && g.reserve.trim() !== "").length}</div>
              <div className="text-boy-primary/70">Disponibles</div>
            </div>
          </div>

          <GiftsList gifts={gifts} setGifts={setGifts} supabase={supabase} />
        </>
      )}
    </div>
  );
};

export default GiftListPage;
