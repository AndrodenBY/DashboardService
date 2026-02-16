import {SubscriptionCard} from "./SubscriptionCard.tsx";
import type {SubscriptionViewModel} from "../modules/types/subscription/view-model/SubscriptionViewModel.ts";

type SubscriptionListProps = {
  subscriptions: SubscriptionViewModel[];
};

export function SubscriptionList({ subscriptions }: Readonly<SubscriptionListProps>) {
  return (
    <section className="subscription-list-section">
      <ul className="subscription-list" style={{ listStyleType: 'none', padding: 0 }}>
        {subscriptions.map((subscription) => (
          <li key={subscription.id} style={{ marginBottom: '16px' }}>
            <SubscriptionCard
              subscriptionInfo={subscription}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
