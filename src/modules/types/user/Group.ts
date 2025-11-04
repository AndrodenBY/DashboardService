import type {User} from "./User.ts";
import type {BaseModel} from "../BaseModel.ts";
import type {Member} from "./Member.ts";
import type {Subscription} from "../subscription/Subscription.ts";

export type Group = BaseModel & {
    name: string,
    userId?: string,
    user?: User,
    members?: Member[],
    sharedSubscriptions?: Subscription[];
}
