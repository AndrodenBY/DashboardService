import type {BaseModel} from "../BaseModel.ts";
import type {User} from "../users/types/User.ts";
import type {SubscriptionType} from "../SubscriptionType.ts";
import type {SubscriptionContent} from "../SubscriptionContent.ts";
import type {SubscriptionHistory} from "./SubscriptionHistory.ts";

export type Subscription = BaseModel & {
    name: string;
    price: number;
    userId?: string;
    user?: User;
    dueDate: string;
    active: boolean;
    subscriptionType: SubscriptionType;
    subscriptionContent: SubscriptionContent;
    history: SubscriptionHistory[];
}