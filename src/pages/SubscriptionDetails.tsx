import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Box, Button, Chip, CircularProgress, Container, Divider, Grid, Paper, Stack, Typography} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {subscriptionApiCalls} from '../api/calls/subscriptionApiCalls';
import {DateCalendar} from '@mui/x-date-pickers/DateCalendar';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs'
import type {
  SubscriptionViewModel as Subscription
} from "../modules/types/subscription/view-model/SubscriptionViewModel.ts"
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import AutorenewIcon from "@mui/icons-material/Autorenew";

export function SubscriptionDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const data = await subscriptionApiCalls.getById(id);
        setSubscription(data);
      } catch (err) {
        console.error("Failed to load subscription details:", err);
      } finally {
        setLoading(false);
      }
    };
    void fetchDetails();
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (!subscription) return <Typography sx={{ mt: 10, textAlign: 'center' }}>Subscription not found.</Typography>;

  const nextBillDate = dayjs(subscription.dueDate);
  const formattedDate = nextBillDate.format('D MMMM YYYY');

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {subscription.name}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {subscription.type} | {subscription.content}
            </Typography>
          </Box>

        <Stack alignItems="flex-end" spacing={1}>
          <Typography variant="h4" color="primary.main" fontWeight="bold">
            ${subscription.price.toFixed(2)}
          </Typography>
          <Chip
            label={subscription.active ? "Active" : "Cancelled"}
            color={subscription.active ? "success" : "default"}
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        </Stack>
      </Stack>

      <Divider sx={{ my: 4 }} />

        <Grid container spacing={4} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonthIcon /> Next Billing Date: {formattedDate}
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1, bgcolor: 'background.paper' }}>
                <DateCalendar
                  value={nextBillDate}
                  readOnly
                  reduceAnimations
                />
              </Box>
            </LocalizationProvider>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h6" gutterBottom>
              Actions
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                fullWidth
                onClick={() => navigate(`/subscriptions/edit/${subscription.id}`)}
              >
                Edit
              </Button>

              {subscription.active ? (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<BlockIcon />}
                  fullWidth
                >
                  Cancel Subscription
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<AutorenewIcon />}
                  fullWidth
                >
                  Renew Subscription
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
