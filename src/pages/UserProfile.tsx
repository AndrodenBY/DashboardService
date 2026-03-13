import {Avatar, Box, Button, Card, Container, Divider, Grid, Skeleton, Typography} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import {useAuth0} from "@auth0/auth0-react";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from 'react';
import {useErrorBoundary, withErrorBoundary} from "react-use-error-boundary";
import {userApiCalls} from '../api/calls/userApiCalls';
import {subscriptionApiCalls} from '../api/calls/subscriptionApiCalls';
import type {SubscriptionViewModel} from "../modules/types/subscription/view-model/SubscriptionViewModel.ts";

const ProfileSkeleton = () => (
  <Container maxWidth="md" sx={{ py: 8 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 6 }}>
      <Skeleton variant="circular" width={100} height={100} />
      <Box sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" width="40%" height={40} />
        <Skeleton variant="text" width="30%" />
        <Skeleton variant="text" width="20%" />
      </Box>
      <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
    </Box>
    <Divider sx={{ mb: 6 }} />
    <Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} />
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Skeleton variant="rounded" width="100%" height={120} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Skeleton variant="rounded" width="100%" height={120} />
      </Grid>
    </Grid>
  </Container>
);

export const UserProfile = withErrorBoundary(() => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const navigate = useNavigate();
  const [error, showBoundary] = useErrorBoundary();

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
        setSubscriptions(userSubscriptions.items ?? []);
      } catch (err) {
        console.error("Failed to load profile stats:", err);
        showBoundary(); // Trigger the error UI
      } finally {
        setIsDataLoading(false);
      }
    };

    void fetchProfileData();
  }, [isAuthenticated, showBoundary]);

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>Could not load profile</Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>Retry</Button>
      </Container>
    );
  }

  if (authLoading || isDataLoading) {
    return <ProfileSkeleton />;
  }

  if (!isAuthenticated || !user)
  {
    return null;
  }

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
  const totalCost = subscriptions.reduce((sum, sub) => sum + sub.price, 0);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4, mb: 6 }}>
        <Avatar
          src={user.picture}
          sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: '2.5rem' }}
        >
          {initials}
        </Avatar>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight="bold">{user.name}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>{user.email}</Typography>
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
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{subscriptions.length}</Typography>
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
    </Container>
  );
});
