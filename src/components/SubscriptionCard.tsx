import {SubscriptionType} from "../modules/types/enums/SubscriptionType.ts";
import {SubscriptionContent} from "../modules/types/enums/SubscriptionContent.ts";

type StartPageProps = {
  subscriptionName: string;
  subscriptionType: SubscriptionType;
  subscriptionContent: SubscriptionContent;
};

export function SubscriptionCard ({subscriptionName, subscriptionType, subscriptionContent}: StartPageProps) {

  return (
    <div className="subscription-card">
      <h3>{subscriptionName}</h3>
      <p>Type: {subscriptionType}</p>
      <p>Content: {subscriptionContent}</p>
    </div>
  );
}



