import type {BaseModel} from "../../BaseModel.ts";
import type {Group} from "./Group.ts";
import type {Subscription} from "../../subscriptions/Subscription.ts";

export type User = BaseModel &{
    firstName: string;
    lastName?: string;
    email: string;
    subscriptions?: Subscription[];
    groups?: Group[];
}