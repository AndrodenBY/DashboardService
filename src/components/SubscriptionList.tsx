import {SubscriptionCard} from "./SubscriptionCard.tsx";
import {Stack} from "@mui/material";
import type {SubscriptionViewModel} from "../modules/types/subscription/view-model/SubscriptionViewModel.ts";
import {useNavigate} from "react-router-dom";

type SubscriptionListProps = {
  subscriptions: SubscriptionViewModel[];
};

export function SubscriptionList({ subscriptions }: Readonly<SubscriptionListProps>) {
  const navigate = useNavigate();

  const handleCardClick = (id: string) => {
    navigate(`/subscriptions/${id}`);
  }

  return (
    <section className="subscription-list-section">
      <Stack spacing={3}>
        {subscriptions.map((subscription) => (
          <SubscriptionCard
            key={subscription.id}
            subscriptionInfo={subscription}
            onClick={() => handleCardClick(subscription.id)}
          />
        ))}
      </Stack>
    </section>
  );
}
