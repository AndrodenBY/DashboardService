import type {BaseModel} from "../BaseModel.ts";
import type {SubscriptionHistory} from "./SubscriptionHistory.ts";
import type {User} from "../user/User.ts";
import type {SubscriptionType} from "../enums/SubscriptionType.ts";
import type {SubscriptionContent} from "../enums/SubscriptionContent.ts";

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
