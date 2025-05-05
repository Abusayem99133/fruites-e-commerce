import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

  const getProfile = async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Profile fetch error:", error.message);
      return false;
    }

    return data?.is_admin || false;
  };

  const loadUser = async () => {
    setIsLoading(true);

    const { data, error } = await supabase.auth.getUser();
    const currentUser = data?.user || null;

    setUser(currentUser);

    if (currentUser?.id) {
      const adminStatus = await getProfile(currentUser.id);
      setIsAdmin(adminStatus);
    } else {
      setIsAdmin(false);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);

        if (currentUser?.id) {
          const adminStatus = await getProfile(currentUser.id);
          setIsAdmin(adminStatus);
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
    isAdmin,
    isLoading,

    // ✅ Sign Up (normal user only)
    signUp: async (email, password) => {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        console.error("SignUp Error:", error.message);
        return { data: null, error };
      }

      const newUser = data?.user;
      if (newUser?.id) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: newUser.id,
            email: newUser.email,
            is_admin: false, // always normal user from frontend
          },
        ]);

        if (profileError) {
          console.error("Error inserting profile:", profileError.message);
        }
      }

      return { data, error };
    },

    // ✅ Sign In
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.user?.id) {
        const adminStatus = await getProfile(data.user.id);
        setIsAdmin(adminStatus);
      }

      return { data, error };
    },

    // ✅ Sign Out
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
      return { error };
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
