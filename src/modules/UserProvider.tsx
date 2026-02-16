import {type ReactNode, useEffect, useMemo, useRef, useState} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import {userApiCalls} from '../api/calls/userApiCalls';
import {apiInterceptors} from '../api/calls/axios';
import type {UserViewModel} from "./types/user/view-model/UserViewModel.ts";
import axios from "axios";
import {UserContext} from "./UserContext.ts";

export function UserProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { isAuthenticated, isLoading: authLoading, user, getAccessTokenSilently } = useAuth0();
  const [currentUser, setCurrentUser] = useState<UserViewModel | null>(null);
  const [isSyncing, setIsSyncing] = useState(true);
  const interceptorsAttached = useRef(false);

  useEffect(() => {
    const sync = async () => {
      if (authLoading) return;

      if (!isAuthenticated) {
        setIsSyncing(false);
        return;
      }
      
      try {
        if (!interceptorsAttached.current) {
          apiInterceptors(getAccessTokenSilently);
          interceptorsAttached.current = true;
        }

        console.log("Syncing user from DB...");
        const dbUser = await userApiCalls.getByAuth0Id();
        setCurrentUser(dbUser);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404 && user) {
            console.log("User not found in DB, creating...");
            const newUser = await userApiCalls.create({
              auth0Id: user.sub!,
              email: user.email!,
              firstName: user.given_name || user.name || "User",
            });
            setCurrentUser(newUser);
          }
        } else {
          console.error("An unexpected non-network error occurred:", err);
        }
      } finally {
        setIsSyncing(false);
      }
    };

    void sync();
  }, [isAuthenticated, authLoading, user, getAccessTokenSilently]);

  const contextValue = useMemo(() => ({
    currentUser,
    isSyncing
  }), [currentUser, isSyncing]);
  
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}
