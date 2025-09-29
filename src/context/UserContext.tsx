import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface User {
  id: string;
  pseudo: string;
  nom: string;
  admin: boolean;
}

interface UserContextType {
  user: User | null;
  login: (pseudo: string, nom: string, code: string) => Promise<void>;
  signup: (pseudo: string, nom: string, code: string) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("users");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async (pseudo: string, nom: string, code: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .ilike("pseudo", pseudo.toLowerCase())
      .ilike("nom", nom.toLowerCase())
      .eq("code", code)
      .single();

    if (error || !data) throw new Error("Pseudo ou code incorrect");

    const loggedUser: User = { id: data.id, pseudo: data.pseudo, nom: data.nom, admin: data.admin };
    setUser(loggedUser);
    localStorage.setItem("users", JSON.stringify(loggedUser));

    // Mettre à jour last_login
    await supabase.from("users").update({ last_login: new Date() }).eq("id", data.id);
  };

  const signup = async (pseudo: string, nom: string, code: string) => {
    // Vérifier si le pseudo existe déjà
    const { data: existingUser, error: selectError } = await supabase
      .from("users")
      .select("id")
      .ilike("pseudo", pseudo.toLowerCase())
      .ilike("nom", nom.toLowerCase())
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      // PGRST116 = record not found, donc si autre erreur on stoppe
      throw new Error("Erreur lors de la vérification du pseudo");
    }

    if (existingUser) {
      throw new Error("Ce pseudo est déjà utilisé !");
    }

    const pseudoLower = pseudo.toLowerCase();
    const nomLower = nom.toLowerCase();
    const { data, error } = await supabase
      .from("users")
      .insert([{ pseudo:pseudoLower, nom:nomLower, code:code, admin: false, last_login: new Date() }])
      .select()
      .single();

    if (error || !data) throw new Error("Impossible de créer le compte");

    const newUser: User = { id: data.id, pseudo: data.pseudo, nom: data.nom, admin: data.admin };
    setUser(newUser);
    localStorage.setItem("users", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("users");
  };

  return (
    <UserContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
