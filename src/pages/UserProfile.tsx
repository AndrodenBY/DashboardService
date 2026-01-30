import {Avatar, Box, CardContent, Container, Divider, IconButton, Paper, Stack, Typography} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import type {UserViewModel} from "../modules/types/user/view-model/user/UserViewModel.ts";
import {useEffect, useState} from "react";
import {userApiCalls} from "../api/calls/userApiCalls.ts";
import {useNavigate} from 'react-router-dom';

export function UserProfile() {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate('/edit-profile');
  };

  const [user, setUser] = useState<UserViewModel | null>(null);

  useEffect(() => {
    userApiCalls.getById("019a0b60-122c-7786-bb8a-3177b38b1011")
      .then((data) =>{
        setUser(data);
      })
  }, []);

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName?.charAt(0) || ''}`
    : "";

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{ height: 100, bgcolor: 'primary.main' }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: -5 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'secondary.main',
              fontSize: '2rem',
              border: '4px solid white'
            }}
          >
            {initials}
          </Avatar>

          <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            User ID: {user?.id}
          </Typography>
        </Box>

        <CardContent sx={{ px: 4, py: 3 }}>
          <Stack spacing={3}>
            <Divider>
              <Typography variant="overline" color="text.secondary">Details</Typography>
            </Divider>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                color="primary"
                onClick={handleEditClick}
              >
                <BadgeIcon />
              </IconButton>
              <Box>
                <Typography variant="caption" display="block" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1">
                  {user?.firstName} {user?.lastName || '(Not set)'}
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
                  {user?.email || 'No email provided'}
                </Typography>
              </Box>
            </Box>
          </Stack>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <IconButton color="primary" sx={{ border: '1px solid', borderColor: 'primary.light' }}>
              <EditIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Paper>
    </Container>
  );
}
