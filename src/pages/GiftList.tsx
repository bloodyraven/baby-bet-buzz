import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GiftForm } from "@/components/GiftForm";
import { GiftsList } from "@/components/GiftsList";
import { ArrowLeft, Gift } from "lucide-react";
import { Link } from "react-router-dom";

export interface Gift {
  id: string;
  name: string;
  description: string;
  price?: number;
  url?: string;
  reserved: boolean;
  reservedBy?: string;
}

const GiftList = () => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [showForm, setShowForm] = useState(false);

  const addGift = (gift: Omit<Gift, "id" | "reserved">) => {
    const newGift: Gift = {
      ...gift,
      id: Date.now().toString(),
      reserved: false,
    };
    setGifts([...gifts, newGift]);
    setShowForm(false);
  };

  const reserveGift = (giftId: string, reservedBy: string) => {
    setGifts(gifts.map(gift => 
      gift.id === giftId 
        ? { ...gift, reserved: true, reservedBy }
        : gift
    ));
  };

  const unreserveGift = (giftId: string) => {
    setGifts(gifts.map(gift => 
      gift.id === giftId 
        ? { ...gift, reserved: false, reservedBy: undefined }
        : gift
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-girl-accent via-background to-boy-accent">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux votes
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Gift className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-girl-primary to-boy-primary bg-clip-text text-transparent">
                  Liste de Naissance
                </h1>
              </div>
            </div>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-girl-primary to-boy-primary hover:from-girl-primary/90 hover:to-boy-primary/90 text-white shadow-lg"
            >
              Ajouter un cadeau
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/20">
              <div className="text-3xl font-bold text-gray-800">{gifts.length}</div>
              <div className="text-muted-foreground">Cadeaux au total</div>
            </div>
            <div className="bg-gradient-to-br from-girl-secondary to-girl-accent rounded-2xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-girl-primary">{gifts.filter(g => g.reserved).length}</div>
              <div className="text-girl-primary/70">Réservés</div>
            </div>
            <div className="bg-gradient-to-br from-boy-secondary to-boy-accent rounded-2xl p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-boy-primary">{gifts.filter(g => !g.reserved).length}</div>
              <div className="text-boy-primary/70">Disponibles</div>
            </div>
          </div>

          {/* Gifts List */}
          <GiftsList 
            gifts={gifts} 
            onReserve={reserveGift}
            onUnreserve={unreserveGift}
          />
        </div>
      </main>

      {/* Form Modal */}
      {showForm && (
        <GiftForm 
          onSubmit={addGift}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default GiftList;