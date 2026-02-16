import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
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
import type {CreateSubscriptionDto} from '../modules/types/subscription/dto/CreateSubscriptionDto';

export function AddSubscriptionPage() {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [dueDate, setDueDate] = useState('');
  const [type, setType] = useState<SubscriptionType>(SubscriptionType.None);
  const [content, setContent] = useState<SubscriptionContent>(SubscriptionContent.None);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const dto: CreateSubscriptionDto = {
        name,
        price: Number(price),
        dueDate: dueDate,
        type: type as SubscriptionType,
        content: content as SubscriptionContent
      };

      await subscriptionApiCalls.create(dto);

      navigate('/');

    } catch (err) {
      console.error("Failed to create subscription:", err);
      setError("Failed to create subscription. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Add New Subscription
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Subscription Name (e.g., Netflix)"
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
            slotProps={{
              inputLabel: { shrink: true }
            }}
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Billing Cycle (Type)</InputLabel>
            <Select
              value={type}
              label="Billing Cycle (Type)"
              onChange={(e) => setType(e.target.value as SubscriptionType)}
            >
              {Object.values(SubscriptionType)
                .filter((enumValue) => enumValue !== SubscriptionType.None)
                .map((enumValue) => (
                  <MenuItem key={enumValue} value={enumValue}>
                    {enumValue}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Content Category</InputLabel>
            <Select
              value={content}
              label="Content Category"
              onChange={(e) => setContent(e.target.value as SubscriptionContent)}
            >
              {Object.values(SubscriptionContent)
                .filter((enumValue) => enumValue !== SubscriptionContent.None)
                .map((enumValue) => (
                <MenuItem key={enumValue} value={enumValue}>
                  {enumValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Save Subscription'}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}
