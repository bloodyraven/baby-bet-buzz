import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/Navigation";
import { AuthButtons } from "@/components/AuthButtons";
import { UserProfile } from "@/components/UserProfile";
import { Footer } from "@/components/Footer";
import { Camera, Heart, Upload, Image as ImageIcon, Calendar, Trash } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Photo {
  id: string;
  title: string;
  description: string;
  image_url: string;
  week_number: number;
  created_at: string;
}

interface Like {
  id: string;
  photo_id: string;
  user_id: string;
  user: { pseudo: string };
}

const Gallery = () => {
  const { user } = useUser();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [likes, setLikes] = useState<Record<string, Like[]>>({});
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [newPhoto, setNewPhoto] = useState({
    title: "",
    description: "",
    week_number: "",
    image_url: ""
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("week_number", { ascending: false });

    if (error) {
      console.error("Erreur lors du chargement des photos:", error);
      toast.error("Erreur lors du chargement des photos");
    } else if (data) {
      setPhotos(data);
      // charger aussi les likes
      fetchLikes(data.map((p) => p.id));
    }
  };

  const fetchLikes = async (photoIds: string[]) => {
    const { data, error } = await supabase
      .from("photo_likes")
      .select(
        `
        id,
        photo_id,
        user_id,
        user:user_id(pseudo)
      `
      )
      .in("photo_id", photoIds);

    if (error) {
      console.error("Erreur lors du chargement des likes:", error);
    } else if (data) {
      const typedLikes = data as unknown as Like[];

      const grouped = typedLikes.reduce((acc: Record<string, Like[]>, like: Like) => {
        if (!acc[like.photo_id]) acc[like.photo_id] = [];
        acc[like.photo_id].push(like);
        return acc;
      }, {});

      setLikes(grouped);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.title.trim() || !newPhoto.image_url.trim() || !newPhoto.week_number) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsUploading(true);
    const { data, error } = await supabase
      .from("gallery")
      .insert([
        {
          title: newPhoto.title.trim(),
          description: newPhoto.description.trim(),
          image_url: newPhoto.image_url.trim(),
          week_number: parseInt(newPhoto.week_number)
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de l'ajout de la photo:", error);
      toast.error("Erreur lors de l'ajout de la photo");
    } else if (data) {
      setPhotos([data, ...photos]);
      setNewPhoto({ title: "", description: "", week_number: "", image_url: "" });
      toast.success("Photo ajoutée avec succès !");
    }
    setIsUploading(false);
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette photo ?")) return;

    const { error } = await supabase.from("gallery").delete().eq("id", photoId);

    if (error) {
      console.error("Erreur lors de la suppression de la photo:", error);
      toast.error("Erreur lors de la suppression de la photo");
    } else {
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      toast.success("Photo supprimée avec succès !");
    }
  };

  const toggleLike = async (photoId: string) => {
    if (!user) {
      toast.error("Vous devez être connecté pour liker une photo.");
      return;
    }

    const alreadyLiked = likes[photoId]?.some((l) => l.user_id === user.id);

    if (alreadyLiked) {
      // unlike
      const { error } = await supabase
        .from("photo_likes")
        .delete()
        .eq("photo_id", photoId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Erreur lors du unlike:", error);
        toast.error("Impossible d'annuler le like");
      } else {
        setLikes((prev) => ({
          ...prev,
          [photoId]: prev[photoId].filter((l) => l.user_id !== user.id)
        }));
      }
    } else {
      // like
      const { data, error } = await supabase
        .from("photo_likes")
        .insert([{ photo_id: photoId, user_id: user.id }])
        .select(
          `
          id,
          photo_id,
          user_id,
          user:user_id(pseudo)
        `
        )
        .single();

      if (error) {
        console.error("Erreur lors du like:", error);
        toast.error("Impossible de liker");
      } else if (data) {
        const normalized: Like = {
          id: data.id,
          photo_id: data.photo_id,
          user_id: data.user_id,
          user: Array.isArray(data.user) ? data.user[0] : data.user, // récupère le premier élément
        };
      
        setLikes((prev) => ({
          ...prev,
          [photoId]: [...(prev[photoId] || []), normalized],
        }));
      }
    }
  };

  const renderLikeButton = (photoId: string) => {
    const photoLikes = likes[photoId] || [];
    const userLiked = user ? photoLikes.some((l) => l.user_id === user.id) : false;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={userLiked ? "default" : "outline"}
              size="sm"
              onClick={() => toggleLike(photoId)}
              className="flex items-center gap-1"
            >
              <Heart className={`w-4 h-4 ${userLiked ? "text-red-500 fill-red-500" : ""}`} />
              <span>{photoLikes.length}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {photoLikes.length > 0 ? (
              <div className="text-sm">
                {photoLikes.map((l) => l.user.pseudo).join(", ")}
              </div>
            ) : (
              <span>Aucun like pour le moment</span>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Camera className="w-8 h-8 text-girl" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-girl to-boy bg-clip-text text-transparent">
              Galerie Photo
            </h1>
            <Heart className="w-8 h-8 text-boy" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Suivez l'évolution de la grossesse semaine après semaine à travers ces beaux souvenirs !
          </p>
        </div>

        {/* Upload Form (Admin only) */}
        {user?.admin && (
          <Card className="mb-12 bg-gradient-to-r from-girl-accent/50 to-boy-accent/50 border-0 shadow-lg">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Ajouter une nouvelle photo
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Ex: 20ème semaine"
                      value={newPhoto.title}
                      onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="week">Semaine de grossesse *</Label>
                    <Input
                      id="week"
                      type="number"
                      min="1"
                      max="42"
                      placeholder="Ex: 20"
                      value={newPhoto.week_number}
                      onChange={(e) => setNewPhoto({ ...newPhoto, week_number: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">URL de l'image *</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={newPhoto.image_url}
                    onChange={(e) => setNewPhoto({ ...newPhoto, image_url: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez ce moment spécial..."
                    value={newPhoto.description}
                    onChange={(e) => setNewPhoto({ ...newPhoto, description: e.target.value })}
                    className="min-h-[80px]"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-gradient-to-r from-girl to-boy hover:from-girl/90 hover:to-boy/90"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? "Ajout en cours..." : "Ajouter la photo"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Photos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.length > 0 ? (
            photos.map((photo) => (
              <Card
                key={photo.id}
                className="bg-card/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={photo.image_url}
                    alt={photo.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelectedPhoto(photo)}
                  />
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {photo.week_number}SA
                  </div>
                </div>
                <CardContent className="pt-4 flex flex-col gap-2">
                  <h3 className="font-semibold">{photo.title}</h3>
                  {photo.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{photo.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    {renderLikeButton(photo.id)}
                    {user?.admin && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePhoto(photo.id);
                        }}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-md">
                <CardContent className="pt-6 text-center">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Aucune photo pour le moment. Les premiers souvenirs arrivent bientôt !
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Photo Modal */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="max-w-4xl max-h-full bg-card rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedPhoto.image_url}
                  alt={selectedPhoto.title}
                  className="w-full max-h-[70vh] object-contain"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-4 right-4"
                  onClick={() => setSelectedPhoto(null)}
                >
                  ✕
                </Button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold">{selectedPhoto.title}</h2>
                  <span className="bg-gradient-to-r from-girl-secondary to-boy-secondary text-primary-foreground px-2 py-1 rounded-full text-sm">
                    {selectedPhoto.week_number}SA
                  </span>
                </div>
                {selectedPhoto.description && (
                  <p className="text-muted-foreground mb-4">{selectedPhoto.description}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Ajouté le{" "}
                  {new Date(selectedPhoto.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </p>
                <div className="flex items-center justify-between">
                  {renderLikeButton(selectedPhoto.id)}
                  {user?.admin && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePhoto(selectedPhoto.id)}
                    >
                      <Trash className="w-4 h-4" />
                      Supprimer
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Gallery;
