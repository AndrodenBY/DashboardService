import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AutorenewIcon from "@mui/icons-material/Autorenew";

import {subscriptionApiCalls} from '../api/calls/subscriptionApiCalls';
import {DateCalendar} from '@mui/x-date-pickers/DateCalendar';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {useErrorBoundary, withErrorBoundary} from "react-use-error-boundary";
import type {
  SubscriptionViewModel as Subscription
} from "../modules/types/subscription/view-model/SubscriptionViewModel.ts";

const DetailsSkeleton = () => (
  <Container maxWidth="md" sx={{ py: 4 }}>
    <Skeleton width={80} height={40} sx={{ mb: 2 }} />
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      <Stack direction="row" justifyContent="space-between">
        <Box sx={{ width: '60%' }}>
          <Skeleton variant="text" height={60} width="80%" />
          <Skeleton variant="text" height={30} width="40%" />
        </Box>
        <Stack alignItems="flex-end">
          <Skeleton variant="text" width={100} height={50} />
          <Skeleton variant="rounded" width={80} height={24} />
        </Stack>
      </Stack>
      <Divider sx={{ my: 4 }} />
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={2}>
            <Skeleton variant="rectangular" height={45} />
            <Skeleton variant="rectangular" height={45} />
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  </Container>
);

export const SubscriptionDetails = withErrorBoundary(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [monthsToRenew, setMonthsToRenew] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [hasLoadError, showBoundary] = useErrorBoundary();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleIncrement = () => setMonthsToRenew((prev) => prev + 1);
  const handleDecrement = () => setMonthsToRenew((prev) => (prev > 1 ? prev - 1 : 1));

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const data = await subscriptionApiCalls.getById(id);
        setSubscription(data);
      } catch (err) {
        console.error(err);
        showBoundary();
      } finally {
        setLoading(false);
      }
    };
    void fetchDetails();
  }, [id, showBoundary]);

  const handleStatusToggle = async () => {
    if (!subscription) return;

    setIsActionLoading(true);
    try {
      let updatedData: Subscription;

      if (subscription.active) {
        updatedData = await subscriptionApiCalls.cancel(subscription.id);
      } else {
        updatedData = await subscriptionApiCalls.renew(subscription.id, monthsToRenew);
      }
      setSubscription(updatedData);

      setMonthsToRenew(1);

      setSnackbar({
        open: true,
        message: `Subscription ${updatedData.active ? 'renewed' : 'cancelled'}`,
        severity: 'success'
      });
    } catch (err) {
      console.error("Failed to toggle status:", err);
      setSnackbar({
        open: true,
        message: "Failed to update subscription status.",
        severity: 'error'
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  if (hasLoadError) {
    return <Typography color="error">Critical system failure during load.</Typography>;
  }

  if (loading) return <DetailsSkeleton />;
  if (!subscription) return <Typography sx={{ mt: 10, textAlign: 'center' }}>Subscription not found.</Typography>;

  const nextBillDate = dayjs(subscription.dueDate);
  const isActive = Boolean(subscription.active);

  const calculateNewDueDate = () => {
    if (!subscription) return "";
    const today = dayjs();
    const currentDue = dayjs(subscription.dueDate);
    const baseDate = currentDue.isAfter(today) ? currentDue : today;
    return baseDate.add(monthsToRenew, 'month').format('D MMMM YYYY');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {subscription.name}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {subscription.type} • {subscription.content}
            </Typography>
          </Box>

          <Stack alignItems="flex-end" spacing={1}>
            <Typography variant="h4" color="primary.main" fontWeight="bold">
              ${subscription.price.toFixed(2)}
            </Typography>
            <Chip
              label={isActive ? "Active" : "Cancelled"}
              color={isActive ? "success" : "default"}
              variant={isActive ? "filled" : "outlined"}
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          </Stack>
        </Stack>

        <Divider sx={{ my: 4 }} />

        <Grid container spacing={4} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonthIcon color="action" />
              Next Billing: {nextBillDate.format('D MMMM YYYY')}
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
            <Typography variant="h6" gutterBottom>Manage</Typography>
            <Stack spacing={2}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                fullWidth
                disabled={isActionLoading}
                onClick={() => navigate(`/subscriptions/edit/${subscription.id}`)}
              >
                Edit Details
              </Button>

              {isActive ? (
                /* --- 1. SHOW ONLY CANCEL BUTTON WHEN ACTIVE --- */
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={isActionLoading ? <CircularProgress size={20} color="inherit" /> : <BlockIcon />}
                  fullWidth
                  onClick={handleStatusToggle}
                  disabled={isActionLoading}
                  sx={{ mt: 1 }}
                >
                  {isActionLoading ? "Cancelling..." : "Cancel Subscription"}
                </Button>
              ) : (
                /* --- 2. SHOW RENEWAL STEPPER ONLY WHEN CANCELLED --- */
                <Stack spacing={2} sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Renewal Duration
                  </Typography>

                  <TextField
                    value={monthsToRenew}
                    variant="outlined"
                    fullWidth
                    slotProps={{
                      input: {
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconButton
                              onClick={handleDecrement}
                              disabled={monthsToRenew <= 1 || isActionLoading}
                              size="small"
                              color="primary"
                            >
                              <RemoveIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleIncrement}
                              disabled={isActionLoading}
                              size="small"
                              color="primary"
                            >
                              <AddIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                        sx: {
                          textAlign: 'center',
                          fontWeight: 'bold',
                          '& input': { textAlign: 'center' }
                        }
                      }
                    }}
                  />

                  <Box sx={{
                    p: 2,
                    textAlign: 'center',
                    bgcolor: 'action.hover',
                    borderRadius: 2,
                    border: '1px dashed',
                    borderColor: 'divider'
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      Total renewal cost: <strong>${(monthsToRenew * subscription.price).toFixed(2)}</strong>
                    </Typography>
                    <Typography variant="caption" color="primary.main" sx={{ fontWeight: 'bold' }}>
                      Extension until: {calculateNewDueDate()}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    color="success"
                    fullWidth
                    size="large"
                    startIcon={isActionLoading ? <CircularProgress size={20} color="inherit" /> : <AutorenewIcon />}
                    onClick={handleStatusToggle}
                    disabled={isActionLoading}
                  >
                    Confirm Renewal
                  </Button>
                </Stack>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
});
