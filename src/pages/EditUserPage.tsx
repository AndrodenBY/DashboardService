import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Container, Paper, Stack, TextField, Typography} from '@mui/material';
import {userApiCalls} from "../api/calls/userApiCalls.ts";
import {useUser} from "../modules/UserContext";

export function EditUserPage() {
  const navigate = useNavigate();
  const { currentUser, isSyncing } = useUser();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName || '');
      setLastName(currentUser.lastName || '');
    }
  }, [currentUser]);

  const handleSave = async () => {
    try {
      await userApiCalls.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      navigate("/profile");
    } catch (e) {
      console.error("Update failed", e);
    }
  };

  if (isSyncing) return <Typography>Loading...</Typography>;

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
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <TextField
            label="Last Name"
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <Button
            variant="contained"
            onClick={handleSave}
            size="large"
            disabled={!firstName.trim()}
          >
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
