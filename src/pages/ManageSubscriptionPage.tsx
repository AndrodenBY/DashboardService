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
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import {subscriptionApiCalls} from '../api/calls/subscriptionApiCalls';
import {SubscriptionType} from '../modules/types/enums/SubscriptionType';
import {SubscriptionContent} from '../modules/types/enums/SubscriptionContent';
import dayjs from 'dayjs';

export function ManageSubscriptionPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [dueDate, setDueDate] = useState('');
  const [type, setType] = useState<SubscriptionType>(SubscriptionType.None);
  const [content, setContent] = useState<SubscriptionContent>(SubscriptionContent.None);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchSubscription = async () => {
        try {
          const data = await subscriptionApiCalls.getById(id);
          setName(data.name);
          setPrice(data.price);
          setDueDate(dayjs(data.dueDate).format('YYYY-MM-DD'));
          setType(data.type);
          setContent(data.content);
        } catch (err) {
          console.error("Failed to load subscription:", err);
          setError("Could not load subscription details.");
        } finally {
          setIsFetching(false);
        }
      };
      void fetchSubscription();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const dto = {
        name,
        price: Number(price),
        dueDate: dueDate,
        type: type as SubscriptionType,
        content: content as SubscriptionContent
      };

      if (isEditMode && id) {
        await subscriptionApiCalls.update({ ...dto, id });
      } else {
        await subscriptionApiCalls.create(dto);
      }

      navigate(isEditMode ? `/subscriptions/${id}` : '/');
    } catch (err) {
      console.error("Failed to save subscription:", err);
      setError(`Failed to ${isEditMode ? 'update' : 'create'} subscription.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {isEditMode ? 'Edit Subscription' : 'Add New Subscription'}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Subscription Name"
            variant="outlined"
            margin="normal"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            fullWidth
            label="Price"
            type="number"
            variant="outlined"
            margin="normal"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
          />

          <TextField
            fullWidth
            label="Next Billing Date"
            type="date"
            variant="outlined"
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
            <Button variant="outlined" onClick={() => navigate(-1)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}
