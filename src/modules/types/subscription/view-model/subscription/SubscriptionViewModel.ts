import type {SubscriptionType} from "../../enums/SubscriptionType.ts";
import type {SubscriptionContent} from "../../enums/SubscriptionContent.ts";

export type SubscriptionViewModel = {
  id: string;
  name: string;
  dueDate: string;
  type: SubscriptionType;
  content: SubscriptionContent;
}
