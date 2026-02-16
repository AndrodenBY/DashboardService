import {createContext} from "react";
import type {UserViewModel} from "./types/user/view-model/UserViewModel.ts";

interface UserContextType {
  currentUser: UserViewModel | null;
  isSyncing: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);
