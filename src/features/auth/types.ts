import { User } from "@/types/auth";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
