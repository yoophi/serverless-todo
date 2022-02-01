import { createContext, useContext } from "react";
import { Profile } from "~/profile";

export interface AuthContextState {
  isSignedIn: boolean;
  profile: null | Profile;
  setIsSignedIn(isSignedIn: boolean): void;
  setProfile(profile: null | Profile): void;
}

export const AuthContext = createContext<AuthContextState>({
  isSignedIn: false,
  profile: null,
  setIsSignedIn: () => {},
  setProfile: () => {},
});

export const useAuth = () => useContext(AuthContext);
