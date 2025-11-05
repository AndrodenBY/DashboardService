import type {SubscriptionContent} from "../types/enums/SubscriptionContent.ts";
import type {SubscriptionType} from "../types/enums/SubscriptionType.ts";

export type SubscriptionFilterDto = {
  id?: string;
  name?: string;
  userId?: string;
  price?: number;
  type?: SubscriptionType;
  content?: SubscriptionContent;
}
