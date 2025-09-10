import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface GiftFormProps {
  onSubmit: (gift: {
    titre: string;
    desc?: string;
    prix?: number;
    link?: string;
  }) => void;
  onCancel: () => void;
}

export const GiftForm = ({ onSubmit, onCancel }: GiftFormProps) => {
  const [titre, setTitre] = useState("");
  const [desc, setDesc] = useState("");
  const [prix, setPrix] = useState("");
  const [link, setLink] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titre.trim()) return;

    onSubmit({
      titre: titre.trim(),
      desc: desc.trim() || undefined,
      prix: prix ? parseFloat(prix) : undefined,
      link: link.trim() || undefined,
    });

    setTitre("");
    setDesc("");
    setPrix("");
    setLink("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-girl-primary to-boy-primary bg-clip-text text-transparent">
            Nouveau Cadeau
          </h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="titre">Nom du cadeau *</Label>
            <Input
              id="titre"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Ex: Peluche lapin"
              required
            />
          </div>

          <div>
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Description du cadeau..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="prix">Prix (€)</Label>
            <Input
              id="prix"
              type="number"
              step="0.01"
              min="0"
              value={prix}
              onChange={(e) => setPrix(e.target.value)}
              placeholder="Ex: 25.00"
            />
          </div>

          <div>
            <Label htmlFor="link">Lien (optionnel)</Label>
            <Input
              id="link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-girl-primary to-boy-primary hover:from-girl-primary/90 hover:to-boy-primary/90 text-white"
            >
              Ajouter
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
