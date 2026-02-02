import { Box, Container, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { useCurrentUser } from '../contexts/CurrentUserContext.tsx'

interface HomepageProps {
  children?: ReactNode
}

/**
 * Main page shown when the user is signed in. Gates on CurrentUser so the
 * authenticated user sees a clear welcome and their name without interruption.
 */
export function Homepage({ children }: Readonly<HomepageProps>) {
  const { currentUser } = useCurrentUser()
  const displayName = currentUser
    ? [currentUser.firstName, currentUser.lastName].filter(Boolean).join(' ').trim() || currentUser.email || 'User'
    : 'User'

  return (
    <div>
      <Container maxWidth="md">
        <Box
          sx={{
            my: 4,
            textAlign: 'center',
            bgcolor: 'background.default',
            padding: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h3" component="h1" color="textPrimary" gutterBottom>
            Hello, {displayName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You’re signed in. Your session is persisted so you stay logged in across reloads.
          </Typography>
        </Box>

        <Box sx={{ my: 3 }}>{children}</Box>
      </Container>
    </div>
  )
}
