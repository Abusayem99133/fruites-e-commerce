import { createContext, useContext, useEffect, useState } from "react";
import { supabase, getCurrentUser } from "@/lib/supabase";

const AuthContext = createContext({
  user: null,
  isLoading: true,
  isAdmin: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { user: currentUser } = await getCurrentUser();

      setUser(currentUser || null);

      // Check if user is admin (you would typically check a specific role)
      if (currentUser) {
        const { data } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", currentUser.id)
          .single();

        setIsAdmin(data?.is_admin || false);
      }

      setIsLoading(false);
    }

    loadUser();

    // Set up auth listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);

        if (currentUser) {
          const { data } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", currentUser.id)
            .single();

          setIsAdmin(data?.is_admin || false);
        } else {
          setIsAdmin(false);
        }

        setIsLoading(false);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const value = {
    user,
    isLoading,
    isAdmin,
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    },
    signUp: async (email, password) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { data, error };
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      return { error };
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
