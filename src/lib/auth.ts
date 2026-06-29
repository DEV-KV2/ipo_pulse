import { createClient } from "@/utils/supabase/server";

// This is a compatibility layer to avoid rewriting all NextAuth Server Component imports.
export async function auth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    return {
      user: {
        id: user.id,
        name: user.user_metadata?.name || null,
        email: user.email,
        image: user.user_metadata?.avatar_url || null,
      }
    };
  }
  
  return null;
}

// Stubs for other NextAuth exports that might be imported but not used directly in SCs anymore
export const signIn = () => {};
export const signOut = () => {};
export const handlers = { GET: () => {}, POST: () => {} };
