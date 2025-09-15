import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Trash2, Heart } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  description?: string;
  created_at: string;
}

interface PhotoCardProps {
  photo: Photo;
  onDelete?: (id: string) => void; // callback pour rafraîchir la liste après suppression
}

export const PhotoCard = ({ photo, onDelete }: PhotoCardProps) => {
  const { user } = useUser();
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // Charger les likes à l'init
  useEffect(() => {
    const fetchLikes = async () => {
      const { data, error } = await supabase
        .from("photo_likes")
        .select("*", { count: "exact" })
        .eq("photo_id", photo.id);

      if (!error && data) {
        setLikesCount(data.length);
        if (user) {
          setHasLiked(data.some((like) => like.user_id === user.id));
        }
      }
    };

    fetchLikes();
  }, [photo.id, user]);

  // Toggle du like
  const handleLike = async () => {
    if (!user) return;

    if (hasLiked) {
      const { error } = await supabase
        .from("photo_likes")
        .delete()
        .eq("photo_id", photo.id)
        .eq("user_id", user.id);

      if (!error) {
        setLikesCount((prev) => prev - 1);
        setHasLiked(false);
      }
    } else {
      const { error } = await supabase
        .from("photo_likes")
        .insert([{ photo_id: photo.id, user_id: user.id }]);

      if (!error) {
        setLikesCount((prev) => prev + 1);
        setHasLiked(true);
      }
    }
  };

  // Suppression photo (admin seulement)
  const handleDelete = async () => {
    if (!user?.admin) return;
    if (!confirm("Supprimer cette photo ?")) return;

    const { error } = await supabase.from("photos").delete().eq("id", photo.id);

    if (!error && onDelete) {
      onDelete(photo.id);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-md overflow-hidden">
      <img src={photo.url} alt={photo.description} className="w-full object-cover" />
      <div className="p-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">{photo.description}</p>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 ${
                hasLiked ? "text-red-500" : "text-muted-foreground"
              }`}
            >
              <Heart className="w-5 h-5" fill={hasLiked ? "currentColor" : "none"} />
              {likesCount}
            </button>
          )}
          {user?.admin && (
            <Button
              onClick={handleDelete}
              variant="ghost"
              size="icon"
              className="text-destructive"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
