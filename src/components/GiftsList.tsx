import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Gift, User } from "lucide-react";
import type { Gift as GiftType } from "@/pages/GiftList";

interface GiftsListProps {
  gifts: GiftType[];
  onReserve: (giftId: string, reservedBy: string) => void;
  onUnreserve: (giftId: string) => void;
}

export const GiftsList = ({ gifts, onReserve, onUnreserve }: GiftsListProps) => {
  const [reservationName, setReservationName] = useState<{ [key: string]: string }>({});

  const handleReservation = (giftId: string) => {
    const name = reservationName[giftId]?.trim();
    if (name) {
      onReserve(giftId, name);
      setReservationName({ ...reservationName, [giftId]: "" });
    }
  };

  if (gifts.length === 0) {
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
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold text-center">
        Cadeaux de Naissance ({gifts.length})
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gifts.map((gift) => (
          <Card 
            key={gift.id} 
            className={`overflow-hidden transition-all duration-300 ${
              gift.reserved 
                ? "bg-gradient-to-br from-muted/50 to-muted opacity-75" 
                : "bg-white/90 backdrop-blur-sm hover:shadow-lg"
            }`}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-start justify-between gap-2">
                <span className={gift.reserved ? "line-through text-muted-foreground" : ""}>
                  {gift.name}
                </span>
                {gift.reserved && (
                  <div className="bg-gradient-to-r from-girl-primary to-boy-primary text-white text-xs px-2 py-1 rounded-full">
                    Réservé
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {gift.description && (
                <p className="text-muted-foreground text-sm">
                  {gift.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-sm">
                {gift.price && (
                  <span className="font-semibold text-primary">
                    {gift.price}€
                  </span>
                )}
                {gift.url && (
                  <a
                    href={gift.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Voir
                  </a>
                )}
              </div>

              {gift.reserved ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    Réservé par {gift.reservedBy}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUnreserve(gift.id)}
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
                    onChange={(e) => setReservationName({
                      ...reservationName,
                      [gift.id]: e.target.value
                    })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleReservation(gift.id);
                      }
                    }}
                  />
                  <Button
                    onClick={() => handleReservation(gift.id)}
                    disabled={!reservationName[gift.id]?.trim()}
                    className="w-full bg-gradient-to-r from-girl-primary to-boy-primary hover:from-girl-primary/90 hover:to-boy-primary/90 text-white"
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