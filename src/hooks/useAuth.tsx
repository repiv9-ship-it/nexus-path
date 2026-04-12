import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  activeRole: string;
  university?: string;
  universityId?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  switchRole: (role: string) => void;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const buildAppUser = useCallback(async (supabaseUser: SupabaseUser): Promise<AppUser | null> => {
    try {
      // Fetch roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', supabaseUser.id);

      const roles = rolesData?.map(r => r.role) || ['student'];

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url, university_id, email')
        .eq('user_id', supabaseUser.id)
        .maybeSingle();

      // Determine active role (prefer stored or first available)
      const storedRole = localStorage.getItem(`active_role_${supabaseUser.id}`);
      const activeRole = storedRole && roles.includes(storedRole as any) ? storedRole : roles[0] || 'student';

      let universityName: string | undefined;
      let universityId: string | undefined;
      if (profile?.university_id) {
        universityId = profile.university_id;
        const { data: uni } = await supabase
          .from('universities')
          .select('name')
          .eq('id', profile.university_id)
          .maybeSingle();
        universityName = uni?.name || undefined;
      }

      return {
        id: supabaseUser.id,
        email: supabaseUser.email || profile?.email || '',
        name: [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || supabaseUser.email?.split('@')[0] || 'User',
        roles,
        activeRole,
        university: universityName,
        universityId,
        avatarUrl: profile?.avatar_url || undefined,
      };
    } catch (err) {
      console.error('Error building app user:', err);
      return null;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (currentSession?.user) {
      const appUser = await buildAppUser(currentSession.user);
      setUser(appUser);
    }
  }, [buildAppUser]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        // Use setTimeout to avoid potential deadlock with Supabase client
        setTimeout(async () => {
          const appUser = await buildAppUser(newSession.user);
          setUser(appUser);
          setLoading(false);
        }, 0);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // THEN check existing session
    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      setSession(existingSession);
      if (existingSession?.user) {
        const appUser = await buildAppUser(existingSession.user);
        setUser(appUser);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [buildAppUser]);

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const switchRole = (role: string) => {
    if (user && user.roles.includes(role)) {
      localStorage.setItem(`active_role_${user.id}`, role);
      setUser({ ...user, activeRole: role });
    }
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message };
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, switchRole, updatePassword, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
