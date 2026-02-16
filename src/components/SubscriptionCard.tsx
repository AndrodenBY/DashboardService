import {Box, Card, CardContent, Chip, Divider, Stack, Typography} from "@mui/material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import type {SubscriptionViewModel} from "../modules/types/subscription/view-model/SubscriptionViewModel.ts";

type SubscriptionCardProps = {subscriptionInfo: SubscriptionViewModel};

export function SubscriptionCard({ subscriptionInfo }: Readonly<SubscriptionCardProps>) {

  const formattedDate = new Date(subscriptionInfo.dueDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card variant="outlined" sx={{ '&:hover': { boxShadow: 3 }, transition: '0.2s' }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Box>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            {subscriptionInfo.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subscriptionInfo.content}
          </Typography>
        </Box>

        <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
          ${(subscriptionInfo.price || 0).toFixed(2)}
        </Typography>
      </Stack>

      <Divider />

      <CardContent sx={{ '&:last-child': { pb: 2 }, pt: 2 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            label={subscriptionInfo.type}
            size="small"
            color="secondary"
            variant="outlined"
          />

          <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
            <CalendarTodayIcon fontSize="small" />
            <Typography variant="body2">
              Next bill: {formattedDate}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
