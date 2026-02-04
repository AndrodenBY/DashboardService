import {Box, Container, Typography} from '@mui/material'
import type {ReactNode} from 'react'
import {useAuth0} from "@auth0/auth0-react";

interface HomepageProps {
  children?: ReactNode
}

export function Homepage({ children }: Readonly<HomepageProps>) {

  const { user, isAuthenticated } = useAuth0();

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
          {isAuthenticated && user && (<Typography variant="h3" component="h1" color="textPrimary" gutterBottom>
            Hello, {user.name} :)
          </Typography>
          )}
          <Typography variant="body1" color="text.secondary">
            You’re signed in. Your session is persisted so you stay logged in across reloads.
          </Typography>
        </Box>

        <Box sx={{ my: 3 }}>{children}</Box>
      </Container>
    </div>
  )
}
