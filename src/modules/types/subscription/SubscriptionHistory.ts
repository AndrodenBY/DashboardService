import type {BaseModel} from "../BaseModel.ts";
import type {SubscriptionAction} from "../enums/SubscriptionAction.ts";
import type {Subscription} from "./Subscription.ts";

export type SubscriptionHistory = BaseModel & {
    subscriptionId: string;
    subscription?: Subscription;
    subscriptionAction: SubscriptionAction;
    pricePaid?: number;
}
