import type {ReactNode} from 'react'
import {useEffect} from 'react'
import {useAuth0} from '@auth0/auth0-react'
import {useCurrentUser} from '../contexts/CurrentUserContext.tsx'
import {Box, Typography} from '@mui/material'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading: auth0Loading, loginWithRedirect } = useAuth0()
  const { currentUser, isLoading: userLoading, error: userError } = useCurrentUser()

  useEffect(() => {
    if (!auth0Loading && !isAuthenticated) {
      void loginWithRedirect()
    }
  }, [auth0Loading, isAuthenticated, loginWithRedirect])

  if (auth0Loading) {
    return (
      <Box sx={{ padding: '2rem', textAlign: 'center' }}>
        <Typography>Loading…</Typography>
      </Box>
    )
  }

  if (!isAuthenticated) {
    return (
      <Box sx={{ padding: '2rem', textAlign: 'center' }}>
        <Typography>Redirecting to sign in…</Typography>
      </Box>
    )
  }

  if (userError) {
    return (
      <Box sx={{ padding: '2rem', textAlign: 'center' }}>
        <Typography color="error">{userError}</Typography>
      </Box>
    )
  }

  if (userLoading || !currentUser) {
    return (
      <Box sx={{ padding: '2rem', textAlign: 'center' }}>
        <Typography>Setting up your account…</Typography>
      </Box>
    )
  }

  return <>{children}</>
}
