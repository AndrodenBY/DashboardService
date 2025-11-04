import type {User} from "./User.ts";
import type {Group} from "./Group.ts";
import type {BaseModel} from "../BaseModel.ts";
import type {MemberRole} from "../enums/MemberRole.ts";

export type Member = BaseModel & {
    userId: string;
    user?: User;
    groupId: string;
    group: Group;
    role: MemberRole;
}
