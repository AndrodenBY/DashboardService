import type {MemberRole} from "../../../enums/MemberRole.ts";

export type CreateMemberViewModel = {
  userId: string;
  groupId: string;
  role: MemberRole;
}
