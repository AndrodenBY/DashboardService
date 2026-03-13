import {Skeleton, Stack} from '@mui/material';

export function SubscriptionListSkeleton() {
  return (
    <Stack spacing={3}>
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} variant="rounded" width="100%" height={120} />
      ))}
    </Stack>
  );
}
