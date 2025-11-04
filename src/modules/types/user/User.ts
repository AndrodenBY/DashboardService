import type {Group} from "./Group.ts";
import type {Subscription} from "../subscription/Subscription.ts";
import type {BaseModel} from "../BaseModel.ts";

export type User = BaseModel &{
    firstName: string;
    lastName?: string;
    email: string;
    subscriptions?: Subscription[];
    groups?: Group[];
}
