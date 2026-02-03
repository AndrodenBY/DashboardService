import {Avatar, Box, CardContent, Container, Divider, IconButton, Paper, Stack, Typography} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import {useCurrentUser} from "../contexts/CurrentUserContext.tsx";
import {useNavigate} from 'react-router-dom';
import {useAuth0} from "@auth0/auth0-react";

export function UserProfile() {
  const navigate = useNavigate();
  const { user: auth0User } = useAuth0();
  const { currentUser, isLoading } = useCurrentUser();

  if (isLoading) return <Typography sx={{ p: 4 }}>Loading database profile...</Typography>;
  if (!currentUser) return <Typography sx={{ p: 4 }}>No user data found.</Typography>;

  const handleEditClick = () => navigate('/edit-profile');

  const initials = `${currentUser.firstName.charAt(0)}${currentUser.lastName?.charAt(0) || ''}`;

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{ height: 100, bgcolor: 'primary.main' }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: -5 }}>
          <Avatar
            src={auth0User?.picture}
            sx={{
              width: 100, height: 100,
              bgcolor: 'secondary.main', fontSize: '2rem',
              border: '4px solid white'
            }}
          >
            {initials}
          </Avatar>

          <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
            {currentUser.firstName} {currentUser.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Internal ID: {currentUser.auth0Sub}
          </Typography>
        </Box>

        <CardContent sx={{ px: 4, py: 3 }}>
          <Stack spacing={3}>
            <Divider><Typography variant="overline" color="text.secondary">Details</Typography></Divider>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BadgeIcon color="primary" />
              <Box>
                <Typography variant="caption" display="block" color="text.secondary">Full Name</Typography>
                <Typography variant="body1">{currentUser.firstName} {currentUser.lastName || ''}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <EmailIcon color="action" />
              <Box>
                <Typography variant="caption" display="block" color="text.secondary">Email Address</Typography>
                <Typography variant="body1">{currentUser.email}</Typography>
              </Box>
            </Box>
          </Stack>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <IconButton onClick={handleEditClick} color="primary" sx={{ border: '1px solid', borderColor: 'primary.light' }}>
              <EditIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Paper>
    </Container>
  );
}
