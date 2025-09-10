import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Gift, ExternalLink } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface GiftType {
  id: string;
  titre: string;
  desc?: string;
  prix?: number;
  link?: string;
  reserve?: string;
}

interface GiftsListProps {
  gifts: GiftType[];
  supabase: SupabaseClient;
}

export const GiftsList = ({ gifts, supabase }: GiftsListProps) => {
  const [reservationName, setReservationName] = useState<{ [key: string]: string }>({});
  const [localGifts, setLocalGifts] = useState<GiftType[]>(gifts);

  const handleReserve = async (giftId: string) => {
    const name = reservationName[giftId]?.trim();
    if (!name) return;

    // Mettre à jour dans Supabase
    await supabase
      .from("cadeau")
      .update({ reserve: name })
      .eq("id", giftId);

    // Mettre à jour localement
    setLocalGifts(prev =>
      prev.map(g => (g.id === giftId ? { ...g, reserve: name } : g))
    );
    setReservationName({ ...reservationName, [giftId]: "" });
  };

  const handleUnreserve = async (giftId: string) => {
    await supabase
      .from("cadeau")
      .update({ reserve: null })
      .eq("id", giftId);

    setLocalGifts(prev =>
      prev.map(g => (g.id === giftId ? { ...g, reserve: undefined } : g))
    );
  };

  if (localGifts.length === 0) {
    return (
      <div className="text-center py-12">
        <Gift className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          Aucun cadeau pour le moment
        </h3>
        <p className="text-muted-foreground">
          Ajoutez des cadeaux à la liste de naissance pour commencer !
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 py-8">
      <h2 className="text-xl font-semibold text-center">
        Cadeaux de Naissance ({localGifts.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {localGifts.map(gift => (
          <Card
            key={gift.id}
            className={`overflow-hidden transition-all duration-300 ${
              gift.reserve
                ? "bg-muted/50 opacity-75"
                : "bg-white/90 backdrop-blur-sm hover:shadow-lg"
            }`}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between gap-2">
                <span className={gift.reserve ? "line-through text-muted-foreground" : ""}>
                  {gift.titre}
                </span>
                {gift.reserve && (
                  <div className="bg-gradient-to-r from-girl-primary to-boy-primary text-primary text-xs px-2 py-1 rounded-full">
                    Réservé
                  </div>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {gift.desc && <p className="text-muted-foreground text-sm">{gift.desc}</p>}
              <div className="flex items-center justify-between text-sm">
                {gift.prix && <span className="font-semibold text-primary">{gift.prix}€</span>}
                {gift.link && (
                  <a href={gift.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    Lien vers l'article
                  </a>
                )}
              </div>

              {gift.reserve ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    Réservé par {gift.reserve}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnreserve(gift.id)}
                    className="w-full"
                  >
                    Annuler la réservation
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    placeholder="Votre prénom"
                    value={reservationName[gift.id] || ""}
                    onChange={e =>
                      setReservationName({ ...reservationName, [gift.id]: e.target.value })
                    }
                    onKeyDown={e => e.key === "Enter" && handleReserve(gift.id)}
                  />
                  <Button
                    onClick={() => handleReserve(gift.id)}
                    disabled={!reservationName[gift.id]?.trim()}
                    className="w-full font-semibold bg-gradient-to-r from-girl to-boy hover:from-girl/90 hover:to-boy/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                    size="sm"
                  >
                    Réserver ce cadeau
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
