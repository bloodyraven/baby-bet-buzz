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
import { Footer } from "@/components/Footer";

const GiftListPage = () => {
  const [gifts, setGifts] = useState<GiftType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  // filtres & tri
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "reserved" | "available">("all");

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

  // gifts filtrés + triés
  const filteredGifts = gifts
    .filter((gift) => {
      if (filter === "reserved" && (!gift.reserve || gift.reserve.trim() === ""))
        return false;
      if (filter === "available" && gift.reserve && gift.reserve.trim() !== "")
        return false;
      if (
        search &&
        !gift.titre.toLowerCase().includes(search.toLowerCase()) &&
        !(gift.desc || "").toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      const prixA = a.prix || 0;
      const prixB = b.prix || 0;
      return sortOrder === "asc" ? prixA - prixB : prixB - prixA;
    });

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
        {/* Add button (admin only) */}
        {user?.admin && (
          <div className="mb-6 flex justify-end">
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-girl to-boy text-white"
            >
              <Plus className="w-4 h-4" />
              Ajouter un cadeau
            </Button>
          </div>
        )}

        {showForm && (
          <GiftForm onSubmit={handleAddGift} onCancel={() => setShowForm(false)} />
        )}

        {loading ? (
          <div className="text-center text-muted-foreground py-12">
            Chargement...
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border-0">
                <div className="text-3xl font-bold text-foreground">{gifts.length}</div>
                <div className="text-muted-foreground">Cadeaux au total</div>
              </div>

              <div className="bg-gradient-to-br from-girl-secondary to-girl-accent rounded-2xl p-6 text-center shadow-lg">
                <div className="text-3xl font-bold text-girl-primary">
                  {gifts.filter((g) => g.reserve && g.reserve.trim() !== "").length}
                </div>
                <div className="text-girl-primary/70">Réservés</div>
              </div>

              <div className="bg-gradient-to-br from-boy-secondary to-boy-accent rounded-2xl p-6 text-center shadow-lg">
                <div className="text-3xl font-bold text-boy-primary">
                  {gifts.filter((g) => !g.reserve || g.reserve.trim() === "").length}
                </div>
                <div className="text-boy-primary/70">Disponibles</div>
              </div>
            </div>

            {/* Filtres et tri */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
              <input
                type="text"
                placeholder="Rechercher un cadeau..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-2 border rounded-lg w-full md:w-1/3"
              />

              <div className="flex gap-2">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="asc">Prix croissant</option>
                  <option value="desc">Prix décroissant</option>
                </select>

                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value as "all" | "reserved" | "available")
                  }
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="all">Tous</option>
                  <option value="available">Disponibles</option>
                  <option value="reserved">Réservés</option>
                </select>
              </div>
            </div>

            <GiftsList gifts={filteredGifts} setGifts={setGifts} supabase={supabase} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default GiftListPage;
