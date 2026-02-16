import {useEffect, useState} from 'react';
import {useAuth0} from "@auth0/auth0-react";
import {useNavigate} from "react-router-dom";
import {Button, Container, Paper, Stack, TextField, Typography} from '@mui/material';
import {userApiCalls} from "../api/calls/userApiCalls.ts";

export function EditUserPage() {
  const { user, getAccessTokenSilently} = useAuth0();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.name || '',
    lastName: user?.lastName || '',
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const dbUser = await userApiCalls.getByAuth0Id();

        if (dbUser && (dbUser.firstName || dbUser.lastName)) {
          setFormData({
            firstName: dbUser.firstName || '',
            lastName: dbUser.lastName || '',
          });
        }
        else if (user?.name) {
          const parts = user.name.trim().split(/\s+/);
          setFormData({
            firstName: parts[0] || '',
            lastName: parts.slice(1).join(' ') || '',
          });
        }
      } catch (e) {
        console.error("Failed to load user data from DB, using Auth0 defaults", e);
      }
    };

    void loadUserData();
  }, [user]);

  const handleSave = async () => {
    try {
      if (user?.sub) {
        const cleanedData = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
        };

        await userApiCalls.update(cleanedData);
        await getAccessTokenSilently({ cacheMode: 'off' });

        navigate("/profile");
      }
    } catch (e) {
      console.error("Update failed", e);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Edit Profile
        </Typography>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            label="First Name"
            fullWidth
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />

          <TextField
            label="Last Name"
            fullWidth
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />

          <Button variant="contained" onClick={handleSave} size="large">
            Save Changes
          </Button>
          <Button color="inherit" onClick={() => navigate("/profile")}>
            Cancel
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
