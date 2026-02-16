import {Box, Button, CircularProgress, Container, Divider, Stack, Typography} from '@mui/material';
import {type ReactNode, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {subscriptionApiCalls} from '../api/calls/subscriptionApiCalls';
import type {SubscriptionViewModel} from '../modules/types/subscription/view-model/SubscriptionViewModel.ts';
import Counter from "../modules/Counter.tsx";
import {SubscriptionList} from "../components/SubscriptionList.tsx";
import {useUser} from "../modules/useUser.ts";

interface HomepageProps {
  children?: ReactNode;
}

export function Homepage({children}: Readonly<HomepageProps> ) {
  const { currentUser, isSyncing } = useUser();
  const navigate = useNavigate();

  const [subscriptions, setSubscriptions] = useState<SubscriptionViewModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (isSyncing || !currentUser) return;

      setIsLoading(true);
      try {
        const userSubscriptions = await subscriptionApiCalls.getAll({
          userId: currentUser.id
        });
        setSubscriptions(userSubscriptions);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDashboardData();
  }, [currentUser, isSyncing]);


  if (isSyncing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
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
        {currentUser && (
          <Typography variant="h3" component="h1" color="textPrimary" gutterBottom>
            Hello, {currentUser.firstName} :)
          </Typography>
        )}
        <Typography variant="body1" color="text.secondary">
          You’re signed in. Your session is persisted so you stay logged in across reloads.
        </Typography>
      </Box>

      <Box sx={{ my: 3, textAlign: 'center' }}>{children}</Box>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          mb: 3,
          px: 2,
          py: 1,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          backgroundColor: 'background.paper',
        }}
      >
        {currentUser && (
          <Stack direction="row" alignItems="center" spacing={2}>

            <Counter
              fetchMethod={() =>
                subscriptionApiCalls.getAll({ userId: currentUser.id })
              }
              title="subs"
            />

            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: 'divider', mx: 1 }}
            />
          </Stack>
        )}


        <Button
          variant="contained"
          size="large"
          sx={{
            px: 4,
            minWidth: 140,
            fontWeight: 'bold'
          }}
          onClick={() => navigate('/subscriptions/add')}
        >
          + Add Subscription
        </Button>
      </Stack>


      <Box sx={{ my: 3 }}>
        {isLoading ? (
          <CircularProgress />
        ) : subscriptions.length > 0
          ? (
          <SubscriptionList subscriptions={subscriptions} />
        ) : (
          <Typography variant="body1" color="text.secondary">
            You don't have any subscriptions yet. Click the add button to get started!
          </Typography>
        )}
      </Box>
    </Container>
  );
}
