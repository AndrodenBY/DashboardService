import {type ReactNode, useEffect, useMemo, useRef, useState} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import axios from "axios";
import {userApiCalls} from '../api/calls/userApiCalls';
import {apiInterceptors} from '../api/calls/axios';
import {UserContext} from "./UserContext";
import type {UserViewModel} from "./types/user/view-model/UserViewModel.ts";

export function UserProvider({ children }: Readonly<{ children: ReactNode }>) {
  const {
    isAuthenticated,
    isLoading: authLoading,
    user,
    getAccessTokenSilently
  } = useAuth0();

  const [currentUser, setCurrentUser] = useState<UserViewModel | null>(null);
  const [isDbLoading, setIsDbLoading] = useState(false);
  const interceptorsAttached = useRef(false);

  useEffect(() => {
    const sync = async () => {
      if (authLoading) return;

      if (!isAuthenticated) {
        setCurrentUser((prev) => (prev !== null ? null : prev));
        return;
      }

      setIsDbLoading(true);
      try {
        if (!interceptorsAttached.current) {
          apiInterceptors(getAccessTokenSilently);
          interceptorsAttached.current = true;
        }

        const dbUser = await userApiCalls.getByIdentityId();
        setCurrentUser(dbUser);
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 404 && user) {
          const newUser = await userApiCalls.create({
            identityId: user.sub!,
            email: user.email!,
            firstName: user.given_name || user.name || "User",
          });
          setCurrentUser(newUser);
        } else {
          console.error("User sync error:", err);
        }
      } finally {
        setIsDbLoading(false);
      }
    };

    void sync();
  }, [isAuthenticated, authLoading, user, getAccessTokenSilently]);

  const contextValue = useMemo(() => ({
    currentUser,
    isSyncing: authLoading || isDbLoading
  }), [currentUser, authLoading, isDbLoading]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}
