import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserSession, LoginInput, RegisterInput } from "@indigo/shared";
import { api } from "../lib/api";

interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (input: LoginInput) => Promise<UserSession>;
  register: (input: RegisterInput) => Promise<UserSession>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: UserSession | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (input) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post<{ user: UserSession }>("/auth/login", input);
          const user = res.data!.user;
          set({ user, isAuthenticated: true, isLoading: false });
          return user;
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },

      register: async (input) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post<{ user: UserSession }>("/auth/register", input);
          const user = res.data!.user;
          set({ user, isAuthenticated: true, isLoading: false });
          return user;
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        try {
          await api.post("/auth/logout");
        } catch {
          // ignore
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        try {
          const res = await api.get<{ user: UserSession }>("/auth/me");
          if (res.data?.user) {
            set({ user: res.data.user, isAuthenticated: true });
          }
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "indigo-auth-store",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
