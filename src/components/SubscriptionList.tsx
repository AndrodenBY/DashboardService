import {SubscriptionType} from "../modules/types/enums/SubscriptionType.ts";
import {SubscriptionContent} from "../modules/types/enums/SubscriptionContent.ts";
import {SubscriptionCard} from "./SubscriptionCard.tsx";

type SubscriptionListProps = {
  subscriptionName: string;
  subscriptionType: SubscriptionType;
  subscriptionContent: SubscriptionContent;
};


export function SubscriptionList ({subscriptionName, subscriptionType, subscriptionContent}: SubscriptionListProps) {
  return (
    <section className="subscription-list-section">
      <ul className="subscription-list">
          <li>
            <SubscriptionCard
              subscriptionName = {subscriptionName}
              subscriptionType = {subscriptionType}
              subscriptionContent = {subscriptionContent}
            />
          </li>
      </ul>
    </section>
  );
}
