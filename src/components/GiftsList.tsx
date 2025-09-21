import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User as UserIcon, Gift as GiftIcon, ExternalLink, Trash } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import type { Dispatch, SetStateAction } from "react";

export interface GiftType {
  id: string;
  titre: string;
  desc?: string;
  prix?: number;
  link?: string;
  nom?: string;
  prenom?: string;
}

interface GiftsListProps {
  gifts: GiftType[];
  supabase: SupabaseClient;
  setGifts: Dispatch<SetStateAction<GiftType[]>>;
}

export const GiftsList = ({ gifts, supabase, setGifts }: GiftsListProps) => {
  const { user } = useUser();

  const handleReserve = async (giftId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase.from("cadeau").update({ prenom: user.pseudo, nom: user.nom }).eq("id", giftId);
      if (error) throw error;
      setGifts(prev => prev.map(g => (g.id === giftId ? { ...g, prenom: user.pseudo, nom: user.nom } : g)));
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la réservation");
    }
  };

  const handleUnreserve = async (giftId: string) => {
    try {
      const { error } = await supabase.from("cadeau").update({ prenom: null, nom: null }).eq("id", giftId);
      if (error) throw error;
      setGifts(prev => prev.map(g => (g.id === giftId ? { ...g, prenom: null, nom: null } : g)));
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'annulation");
    }
  };

  const handleDelete = async (giftId: string, titre?: string) => {
    if (!user?.admin) return;
    const ok = window.confirm(`Supprimer le cadeau "${titre || ""}" ? Cette action est irréversible.`);
    if (!ok) return;

    try {
      const { error } = await supabase.from("cadeau").delete().eq("id", giftId);
      if (error) throw error;
      setGifts(prev => prev.filter(g => g.id !== giftId));
      toast.success("Cadeau supprimé");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression");
    }
  };

  if (gifts.length === 0) {
    return (
      <div className="text-center py-12">
        <GiftIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">Aucun cadeau ne correspond à la recherche</h3>
        <p className="text-muted-foreground">Contactez nous si besoin !</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gifts.map((gift) => (
          <Card key={gift.id} className={`overflow-hidden transition-all duration-300 ${gift.nom ? "bg-muted/50 opacity-75" : "bg-white/90 backdrop-blur-sm hover:shadow-lg"}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-start justify-between gap-2">
                <span className={gift.nom ? "line-through text-muted-foreground" : ""}>{gift.titre}</span>
                {gift.nom && (
                  <div className="bg-gradient-to-r from-girl-primary to-boy-primary text-black text-xs px-2 py-1 rounded-full">Réservé</div>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {gift.desc && <p className="text-muted-foreground text-sm">{gift.desc}</p>}

              <div className="flex items-center justify-between text-sm">
                {gift.prix && <span className="font-semibold text-primary">{gift.prix}€</span>}
                {gift.link && (
                  <a href={gift.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> Lien vers l'article
                  </a>
                )}
              </div>

              {gift.nom ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserIcon className="w-4 h-4" /> Réservé par {gift.nom}
                  </div>

                  <div className="flex gap-2">
                    {gift.prenom === user?.pseudo && gift.nom === user?.nom && (
                      <Button variant="outline" size="sm" onClick={() => handleUnreserve(gift.id)} className="flex-1">
                        Annuler la réservation
                      </Button>
                    )}

                    {user?.admin && (
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(gift.id, gift.titre)} className="flex-1">
                        <Trash className="w-4 h-4 mr-2" /> Supprimer
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button onClick={() => handleReserve(gift.id)} disabled={!user} className="w-full font-semibold bg-gradient-to-r from-girl to-boy hover:from-girl/90 hover:to-boy/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" size="sm">
                      {user ? "Réserver ce cadeau" : "Connectez-vous pour réserver"}
                    </Button>

                    {user?.admin && (
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(gift.id, gift.titre)}>
                        <Trash className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
