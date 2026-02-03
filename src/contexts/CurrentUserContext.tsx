import {createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState,} from 'react'
import {useAuth0} from '@auth0/auth0-react'
import {injectAuthHeader} from '../api/calls/axios.ts'
import {userApiCalls} from '../api/calls/userApiCalls.ts'
import type {CurrentUser as CurrentUserType} from '../modules/types/CurrentUser.ts'
import {CURRENT_USER_STORAGE_KEY} from '../modules/types/CurrentUser.ts'
import type {CreateUserDto} from '../modules/types/user/dto/user/CreateUserDto.ts'
import type {UserViewModel} from '../modules/types/user/view-model/user/UserViewModel.ts'

function parseName(fullName: string | undefined): { firstName: string; lastName?: string } {
  if (!fullName?.trim()) return { firstName: 'User', lastName: undefined }
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return { firstName: parts[0], lastName: undefined }
  const firstName = parts[0] ?? 'User'
  const lastName = parts.slice(1).join(' ')
  return { firstName, lastName }
}

async function ensureBackendUser(
  auth0User: { sub: string; name?: string; given_name?: string; family_name?: string; email?: string },
  getAccessTokenSilently: () => Promise<string>,
): Promise<CurrentUserType> {
  injectAuthHeader(getAccessTokenSilently)

  const email = auth0User.email ?? ''
  const { firstName, lastName } = auth0User.given_name
    ? { firstName: auth0User.given_name, lastName: auth0User.family_name }
    : parseName(auth0User.name)

  const dto: CreateUserDto = { firstName, lastName, email }
  let backendUser: UserViewModel

  try {
    backendUser = await userApiCalls.create(dto)
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status
    if (status === 409 || status === 422) {
      const list = await userApiCalls.getAll({ email })
      backendUser = list[0] ?? (await userApiCalls.create(dto))
    } else {
      throw err
    }
  }

  return {
    id: backendUser.id,
    auth0Sub: auth0User.sub,
    firstName: backendUser.firstName,
    lastName: backendUser.lastName,
    email: backendUser.email,
  }
}

function loadStoredCurrentUser(): CurrentUserType | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CurrentUserType
    return parsed?.id && parsed?.auth0Sub ? parsed : null
  } catch {
    return null
  }
}

function saveCurrentUser(user: CurrentUserType | null): void {
  if (user) {
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
  }
}

type CurrentUserContextValue = {
  currentUser: CurrentUserType | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  clearCurrentUser: () => void
}

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null)

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user: auth0User, getAccessTokenSilently } = useAuth0()
  const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(loadStoredCurrentUser)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clearCurrentUser = useCallback(() => {
    setCurrentUser(null)
    saveCurrentUser(null)
  }, [])

  const syncUser = useCallback(async () => {
    if (!isAuthenticated || !auth0User) {
      setCurrentUser(null);
      saveCurrentUser(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (auth0User.sub) {
        const user = await ensureBackendUser(
          auth0User as Required<typeof auth0User>,
          getAccessTokenSilently
        );
        setCurrentUser(user);
        saveCurrentUser(user);
      }
    }
    catch (e: unknown) {
      const message = e instanceof Error ? e.message : "An unexpected error occurred";

      setError(message);
      setCurrentUser(null);
      saveCurrentUser(null);
    }
    finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, auth0User, getAccessTokenSilently]);

  useEffect(() => {
    void syncUser()
  }, [syncUser])

  useEffect(() => {
    if (!isAuthenticated) clearCurrentUser()
  }, [isAuthenticated, clearCurrentUser])

  const value = useMemo<CurrentUserContextValue>(
    () => ({
      currentUser,
      isLoading,
      error,
      refetch: syncUser,
      clearCurrentUser,
    }),
    [currentUser, isLoading, error, syncUser, clearCurrentUser],
  )

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  )
}

export function useCurrentUser(): CurrentUserContextValue {
  const ctx = useContext(CurrentUserContext)
  if (!ctx) {
    throw new Error('useCurrentUser must be used within CurrentUserProvider')
  }
  return ctx
}
