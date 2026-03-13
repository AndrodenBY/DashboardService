import * as React from 'react';
import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useAuth0} from '@auth0/auth0-react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import {subscriptionApiCalls} from '../api/calls/subscriptionApiCalls';
import {SubscriptionType} from '../modules/types/enums/SubscriptionType';
import {SubscriptionContent} from '../modules/types/enums/SubscriptionContent';
import dayjs from 'dayjs';
import {useErrorBoundary, withErrorBoundary} from "react-use-error-boundary";

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  PLN: "zł"
};

const FormSkeleton = () => (
  <Stack spacing={2} sx={{ mt: 4 }}>
    <Skeleton variant="text" width="60%" height={40} sx={{ alignSelf: 'center', mb: 2 }} />
    {[1, 2, 3, 4, 5].map((i) => (
      <Skeleton key={i} variant="rounded" width="100%" height={56} />
    ))}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
      <Skeleton variant="rectangular" width={100} height={40} />
      <Skeleton variant="rectangular" width={100} height={40} />
    </Box>
  </Stack>
);

export const ManageSubscriptionPage = withErrorBoundary(() => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [boundaryError, showBoundary] = useErrorBoundary();

  const [name, setName] = useState('');
  const [price, setPrice] = useState<string>('');
  const [currency, setCurrency] = useState('USD');
  const [dueDate, setDueDate] = useState('');
  const [type, setType] = useState<SubscriptionType>(SubscriptionType.None);
  const [content, setContent] = useState<SubscriptionContent>(SubscriptionContent.None);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchSubscription = async () => {
        try {
          const data = await subscriptionApiCalls.getById(id);
          setName(data.name);
          setPrice(data.price.toFixed(2));
          setDueDate(dayjs(data.dueDate).format('YYYY-MM-DD'));
          setType(data.type);
          setContent(data.content);
        } catch (err) {
          console.log(err);
          showBoundary();
        } finally {
          setIsFetching(false);
        }
      };
      void fetchSubscription();
    }
  }, [id, isEditMode, showBoundary]);

  const handlePriceChange = (value: string) => {
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setPrice(value);
    }
  };

  const handleBlur = () => {
    if (price !== '' && !isNaN(Number(price))) {
      setPrice(Number(price).toFixed(2));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setIsLoading(true);
    setFormError(null);

    try {
      const dto = {
        name,
        price: Number(price),
        dueDate,
        type: type,
        content: content
      };

      if (isEditMode && id) {
        await subscriptionApiCalls.update({ ...dto, id });
      } else {
        await subscriptionApiCalls.create(dto);
      }

      navigate(isEditMode ? `/subscriptions/${id}` : '/');
    } catch (err) {
      console.error(err);
      setFormError(`Failed to ${isEditMode ? 'update' : 'create'} subscription.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (boundaryError) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <Alert severity="error" variant="filled">
          Failed to load subscription details.
        </Alert>
        <Button
          sx={{ mt: 2 }}
          variant="outlined"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Container>
    );
  }

  if (isFetching)
  {
    return (
      <Container maxWidth="sm">
        <FormSkeleton />
      </Container>
      );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
          {isEditMode ? 'Edit Subscription' : 'Add Subscription'}
        </Typography>

        {formError && <Alert severity="error" sx={{ mb: 3 }}>{formError}</Alert>}

        {/* ✅ Using Box as a form element */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* ✅ Fixed: Added opening Stack tag and wrapped inputs properly */}
          <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 1 }}>
            <TextField
              fullWidth
              label="Price"
              required
              value={price}
              onBlur={handleBlur}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="0.00"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      {currencySymbols[currency]}
                    </InputAdornment>
                  )
                }
              }}
            />

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Currency</InputLabel>
              <Select
                value={currency}
                label="Currency"
                onChange={(e) => setCurrency(e.target.value)}
              >
                {Object.entries(currencySymbols).map(([code, symbol]) => (
                  <MenuItem key={code} value={code}>{code} ({symbol})</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <TextField
            fullWidth
            label="Next Billing Date"
            type="date"
            margin="normal"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Billing Cycle</InputLabel>
            <Select
              value={type}
              label="Billing Cycle"
              onChange={(e) => setType(e.target.value as SubscriptionType)}
            >
              {Object.values(SubscriptionType)
                .filter((v) => v !== SubscriptionType.None)
                .map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Category</InputLabel>
            <Select
              value={content}
              label="Category"
              onChange={(e) => setContent(e.target.value as SubscriptionContent)}
            >
              {Object.values(SubscriptionContent)
                .filter((v) => v !== SubscriptionContent.None)
                .map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </Select>
          </FormControl>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
});
