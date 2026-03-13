import {createContext, useContext} from 'react';
import type {UserViewModel} from "./types/user/view-model/UserViewModel.ts";


export interface UserContextType {
  currentUser: UserViewModel | null;
  isSyncing: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
