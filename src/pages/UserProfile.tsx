import {Avatar, Box, Button, Card, CircularProgress, Container, Divider, Grid, Typography,} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import {useAuth0} from "@auth0/auth0-react";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from 'react';
import {userApiCalls} from '../api/calls/userApiCalls';
import {subscriptionApiCalls} from '../api/calls/subscriptionApiCalls';
import type {SubscriptionViewModel} from "../modules/types/subscription/view-model/SubscriptionViewModel.ts";

export function UserProfile() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const navigate = useNavigate();

  const [subscriptions, setSubscriptions] = useState<SubscriptionViewModel[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!isAuthenticated) return;
      setIsDataLoading(true);
      try {
        const internalUser = await userApiCalls.getByIdentityId();
        const userSubscriptions = await subscriptionApiCalls.getAll({
          userId: internalUser.id
        });
        setSubscriptions(userSubscriptions.items);
      } catch (err) {
        console.error("Failed to load profile stats:", err);
      } finally {
        setIsDataLoading(false);
      }
    };

    void fetchProfileData();
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !user) return null;

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
  const totalCost = subscriptions.reduce((sum, sub) => sum + sub.price, 0);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>

      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4, mb: 6 }}>
        <Avatar
          src={user.picture}
          sx={{
            width: 100, height: 100,
            bgcolor: 'primary.main',
            fontSize: '2.5rem',
          }}
        >
          {initials}
        </Avatar>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {user.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
            {user.email}
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace' }}>
            ID: {user.sub}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate("/profile/edit")}
        >
          Edit Profile
        </Button>
      </Box>

      <Divider sx={{ mb: 6 }} />

      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Subscriptions Overview
      </Typography>

      {isDataLoading ? (
        <Box sx={{ display: 'flex', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mt: 1 }}>


          <Grid size={{ xs: 12, sm: 6 }}>
            <Card variant="outlined" sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3, borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.light', width: 56, height: 56 }}>
                <FormatListBulletedIcon color="primary" />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                  Active Subscriptions
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {subscriptions.length}
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Card variant="outlined" sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3, borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: 'error.light', width: 56, height: 56 }}>
                <AccountBalanceWalletIcon color="error" />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                  Total Monthly Cost
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                  ${totalCost.toFixed(2)}
                </Typography>
              </Box>
            </Card>
          </Grid>

        </Grid>
      )}

    </Container>
  );
}
