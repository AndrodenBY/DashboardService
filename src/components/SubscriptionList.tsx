import {SubscriptionCard} from "./SubscriptionCard.tsx";
import {Stack} from "@mui/material";
import type {SubscriptionViewModel} from "../modules/types/subscription/view-model/SubscriptionViewModel.ts";

type SubscriptionListProps = {
  subscriptions: SubscriptionViewModel[];
};

export function SubscriptionList({ subscriptions }: Readonly<SubscriptionListProps>) {
  return (
    <section className="subscription-list-section">
      <Stack spacing={3}>
        {subscriptions.map((subscription) => (
          <SubscriptionCard
            key={subscription.id}
            subscriptionInfo={subscription}
          />
        ))}
      </Stack>
    </section>
  );
}
