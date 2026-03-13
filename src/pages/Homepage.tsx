import {Box, Button, Container, Divider, Skeleton, Stack, Typography} from '@mui/material';
import {type ReactNode, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {subscriptionApiCalls} from '../api/calls/subscriptionApiCalls';
import Counter from "../modules/Counter.tsx";
import {SubscriptionList} from "../components/SubscriptionList.tsx";
import {useUser} from "../modules/useUser.ts";
import type {
  SubscriptionViewModel as Subscription
} from "../modules/types/subscription/view-model/SubscriptionViewModel.ts"
import {useErrorBoundary, withErrorBoundary} from "react-use-error-boundary";

const HomepageSkeleton = () => (
  <Stack spacing={3}>
    <Skeleton variant="rounded" width="100%" height={60} />
    <Skeleton variant="rounded" width="100%" height={140} />
    <Skeleton variant="rounded" width="100%" height={140} />
  </Stack>
);

export const Homepage = withErrorBoundary(({ children }: { children?: ReactNode }) => {
  const { currentUser, isSyncing } = useUser();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [error, showBoundary] = useErrorBoundary();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (isSyncing || !currentUser) return;

      setIsLoading(true);
      try {
        const response = await subscriptionApiCalls.getAll({ userId: currentUser.id });
        setSubscriptions(response.items ?? []);
      } catch (err) {
        showBoundary();
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchDashboardData();
  }, [currentUser, isSyncing, showBoundary]);

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Cannot load subscriptions
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Container>
    );
  }

  if (isSyncing) {
    return <Box
      sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}
    >
      <Skeleton variant="circular" width={40} height={40} />
    </Box>;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center', bgcolor: 'background.default', p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        {currentUser && (
          <Typography variant="h3" component="h1" gutterBottom>
            Hello, {currentUser.firstName} :)
          </Typography>
        )}
      </Box>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3, px: 2, py: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2, backgroundColor: 'background.paper' }}>
        {currentUser && (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Counter
              fetchMethod={async () => {
                const response = await subscriptionApiCalls.getAll({ userId: currentUser.id });
                return response.items;
              }}
              title="Subscriptions"
            />
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          </Stack>
        )}
        <Button variant="contained" size="large" onClick={() => navigate('/subscriptions/add')}>
          + Add Subscription
        </Button>
      </Stack>

      <Box sx={{ my: 3 }}>
        {isLoading ? (
          <HomepageSkeleton />
        ) : subscriptions.length > 0 ? (
          <SubscriptionList subscriptions={subscriptions} />
        ) : (
          <Typography variant="body1" color="text.secondary" textAlign="center">
            No subscriptions found.
          </Typography>
        )}
      </Box>

      <Box sx={{ my: 3, textAlign: 'center' }}>{children}</Box>
    </Container>
  );
});
