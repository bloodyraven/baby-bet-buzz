import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Crown } from "lucide-react";
import { useUser } from "@/context/UserContext";

const UserProfile = () => {
  const { user, logout } = useUser();

  if (!user) return null;

  // Génère les initiales du pseudo
  const getInitials = (pseudo: string) => {
    return pseudo
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-3 px-3 py-2 h-auto hover:bg-gradient-to-r hover:from-girl-secondary/20 hover:to-boy-secondary/20"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src="" /> {/* Pas d'image pour l'instant */}
            <AvatarFallback className="bg-gradient-to-r from-girl-secondary to-boy-secondary text-primary-foreground text-sm font-semibold">
              {getInitials(user.pseudo)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{user.pseudo}</span>
              {user.admin && (
                <Badge variant="secondary" className="hidden md:flex h-5 px-2 text-xs bg-gradient-to-r from-girl to-boy text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">Connecté</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.pseudo}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.admin ? "Administrateur" : "Membre"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="cursor-default">
          <User className="mr-2 h-4 w-4" />
          <span>Mon Profil</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { UserProfile };