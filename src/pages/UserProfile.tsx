import {
  Avatar,
  Box,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import {useAuth0} from "@auth0/auth0-react";

export function UserProfile() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !user) return null;

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>

        <Box sx={{ height: 100, bgcolor: 'primary.main' }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: -6 }}>
          <Avatar
            src={user.picture}
            sx={{
              width: 110, height: 110,
              bgcolor: 'secondary.main',
              fontSize: '2.5rem',
              border: '4px solid white',
              boxShadow: 2
            }}
          >
            {initials}
          </Avatar>

          <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID: {user.sub}
          </Typography>
        </Box>

        <CardContent sx={{ px: 4, py: 3 }}>
          <Stack spacing={3}>
            <Divider>
              <Typography variant="overline" color="text.secondary">
                Details
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BadgeIcon color="primary" />
              <Box>
                <Typography variant="caption" display="block" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1">
                  {user.name}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <EmailIcon color="action" />
              <Box>
                <Typography variant="caption" display="block" color="text.secondary">
                  Email Address
                </Typography>
                <Typography variant="body1">
                  {user.email}
                </Typography>
              </Box>
            </Box>
          </Stack>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <IconButton
              color="primary"
              sx={{ border: '1px solid', borderColor: 'primary.light' }}
              onClick={() => alert("Edit clicked!")}
            >
              <EditIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Paper>
    </Container>
  );
}
