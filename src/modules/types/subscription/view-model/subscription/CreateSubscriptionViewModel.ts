import type {SubscriptionType} from "../../../enums/SubscriptionType.ts";
import type {SubscriptionContent} from "../../../enums/SubscriptionContent.ts";

export type CreateSubscriptionViewModel = {
  name: string;
  price: number;
  dueDate: string;
  type: SubscriptionType;
  content: SubscriptionContent;
}
