import type {BaseModel} from "../BaseModel.ts";
import type {Subscription} from "./Subscription.ts";
import type {SubscriptionAction} from "../SubscriptionAction.ts";

export type SubscriptionHistory = BaseModel & {
    subscriptionId: string;
    subscription?: Subscription;
    subscriptionAction: SubscriptionAction;
    pricePaid?: number;
}