import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, UserPlus, User } from "lucide-react";

const AuthButtons = () => {
  const [loginData, setLoginData] = useState({ pseudo: "", code: "" });
  const [signupData, setSignupData] = useState({ pseudo: "", code: "", confirmCode: "" });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Connexion:", loginData);
    setIsLoginOpen(false);
    setLoginData({ pseudo: "", code: "" });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.code !== signupData.confirmCode) {
      alert("Les codes ne correspondent pas !");
      return;
    }
    console.log("Inscription:", signupData);
    setIsSignupOpen(false);
    setSignupData({ pseudo: "", code: "", confirmCode: "" });
  };

  return (
    <div className="flex items-center gap-3">
      {/* Bouton Connexion */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <LogIn className="w-4 h-4" />
            Connexion
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Connexion
            </DialogTitle>
            <DialogDescription>
              Entrez votre pseudo et votre code pour vous connecter.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-pseudo">Pseudo</Label>
              <Input
                id="login-pseudo"
                type="text"
                placeholder="Votre pseudo"
                value={loginData.pseudo}
                onChange={(e) => setLoginData({ ...loginData, pseudo: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-code">Code (4 chiffres)</Label>
              <Input
                id="login-code"
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
              <Button type="submit" className="flex-1">
                Se connecter
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bouton Inscription */}
      <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="gap-2">
            <UserPlus className="w-4 h-4" />
            Inscription
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Inscription
            </DialogTitle>
            <DialogDescription>
              Créez votre compte avec un pseudo et un code à 4 chiffres.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-pseudo">Pseudo</Label>
              <Input
                id="signup-pseudo"
                type="text"
                placeholder="Choisissez votre pseudo"
                value={signupData.pseudo}
                onChange={(e) => setSignupData({ ...signupData, pseudo: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-code">Code (4 chiffres)</Label>
              <Input
                id="signup-code"
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
              <Label htmlFor="signup-confirm">Confirmer le code</Label>
              <Input
                id="signup-confirm"
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
              <Button type="submit" className="flex-1">
                S'inscrire
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { AuthButtons };