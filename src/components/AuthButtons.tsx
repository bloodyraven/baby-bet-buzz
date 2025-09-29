import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, UserPlus, User } from "lucide-react";
import { useUser } from "@/context/UserContext";

const AuthButtons = () => {
  const { user, login, signup, logout } = useUser();
  const [loginData, setLoginData] = useState({ pseudo: "", nom: "", code: "" });
  const [signupData, setSignupData] = useState({ pseudo: "", nom : "", code: "", confirmCode: "" });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginData.pseudo, loginData.nom, loginData.code);
      setIsLoginOpen(false);
      setLoginData({ pseudo: "", nom:"", code: "" });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.code !== signupData.confirmCode) {
      alert("Les codes ne correspondent pas !");
      return;
    }
    try {
      await signup(signupData.pseudo, signupData.nom, signupData.code);
      setIsSignupOpen(false);
      setSignupData({ pseudo: "", nom: "", code: "", confirmCode: "" });
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (user) {
    return null; // UserProfile component is now used instead
  }

  return (
    <div className="flex items-center gap-3">
      {/* Connexion */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <LogIn className="w-4 h-4" /> Connexion
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Connexion
            </DialogTitle>
            <DialogDescription>
              Entrez votre pseudo et votre code pour vous connecter.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label>Prénom</Label>
              <Input
                type="text"
                placeholder="Votre prénom"
                value={loginData.pseudo}
                onChange={(e) => setLoginData({ ...loginData, pseudo: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input
                type="text"
                placeholder="Votre nom"
                value={loginData.nom}
                onChange={(e) => setLoginData({ ...loginData, nom: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Code (4 chiffres)</Label>
              <Input
                type="password"
                placeholder="****"
                maxLength={4}
                pattern="[0-9]{4}"
                value={loginData.code}
                onChange={(e) => setLoginData({ ...loginData, code: e.target.value })}
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsLoginOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="flex-1">Se connecter</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Inscription */}
      <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="gap-2 bg-gradient-to-r from-girl-primary to-boy-primary text-black">
            <UserPlus className="w-4 h-4" /> Inscription
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" /> Inscription
            </DialogTitle>
            <DialogDescription>
              Créez votre compte avec un pseudo et un code à 4 chiffres.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label>Prénom</Label>
              <Input
                type="text"
                placeholder="Votre prénom"
                value={signupData.pseudo}
                onChange={(e) => setSignupData({ ...signupData, pseudo: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input
                type="text"
                placeholder="Votre nom"
                value={signupData.nom}
                onChange={(e) => setSignupData({ ...signupData, nom: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Code (4 chiffres)</Label>
              <Input
                type="password"
                placeholder="****"
                maxLength={4}
                pattern="[0-9]{4}"
                value={signupData.code}
                onChange={(e) => setSignupData({ ...signupData, code: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Confirmer le code</Label>
              <Input
                type="password"
                placeholder="****"
                maxLength={4}
                pattern="[0-9]{4}"
                value={signupData.confirmCode}
                onChange={(e) => setSignupData({ ...signupData, confirmCode: e.target.value })}
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsSignupOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="flex-1">S'inscrire</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { AuthButtons };
