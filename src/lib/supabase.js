import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data?.user, error };
};

// Fruits CRUD operations
export const getFruits = async () => {
  const { data, error } = await supabase
    .from("fruits")
    .select("*")
    .order("name");
  // console.log("Data from Supabase:", data);
  // console.log("Error from Supabase:", error);
  return { fruits: data, error };
};

export const getFruitById = async (id) => {
  const { data, error } = await supabase
    .from("fruits")
    .select("*")
    .eq("id", id)
    .single();
  return { fruit: data, error };
};

export const createFruit = async (fruit) => {
  const { data, error } = await supabase
    .from("fruits")
    .insert([fruit])
    .select();
  return { fruit: data?.[0], error };
};

export const updateFruit = async (id, updates) => {
  const { data, error } = await supabase
    .from("fruits")
    .update(updates)
    .eq("id", id)
    .select();
  return { fruit: data?.[0], error };
};

export const deleteFruit = async (id) => {
  const { error } = await supabase.from("fruits").delete().eq("id", id);
  return { error };
};

// Orders
export const getOrders = async (userId) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, fruits(*))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return { orders: data, error };
};

export const createOrder = async (order) => {
  const { data, error } = await supabase
    .from("orders")
    .insert([order])
    .select();
  return { order: data?.[0], error };
};

export const getOrderById = async (id) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, fruits(*))")
    .eq("id", id)
    .single();
  return { order: data, error };
};
