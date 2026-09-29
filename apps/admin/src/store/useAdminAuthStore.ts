import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserSession, LoginInput } from "@indigo/shared";
import { adminApi } from "../lib/api";

interface AdminAuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (input: LoginInput) => Promise<UserSession>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  isAuthorizedStaff: () => boolean;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (input) => {
        set({ isLoading: true, error: null });
        try {
          const res = await adminApi.post<{ user: UserSession }>("/auth/login", input);
          const user = res.data!.user;

          if (user.role !== "admin" && user.role !== "manager" && user.role !== "support") {
            throw new Error("Access restricted: Staff credentials required to enter operations portal.");
          }

          set({ user, isAuthenticated: true, isLoading: false });
          return user;
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        try {
          await adminApi.post("/auth/logout");
        } catch {
          // ignore
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        try {
          const res = await adminApi.get<{ user: UserSession }>("/auth/me");
          if (res.data?.user) {
            const user = res.data.user;
            if (user.role === "admin" || user.role === "manager" || user.role === "support") {
              set({ user, isAuthenticated: true });
            } else {
              set({ user: null, isAuthenticated: false });
            }
          }
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },

      clearError: () => set({ error: null }),

      isAuthorizedStaff: () => {
        const role = get().user?.role;
        return role === "admin" || role === "manager" || role === "support";
      },
    }),
    {
      name: "indigo-admin-auth-store",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
