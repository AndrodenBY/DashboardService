import type {MemberRole} from "../../../enums/MemberRole.ts";

export type MemberViewModel = {
  id: string;
  userId: string;
  groupId: string;
  role: MemberRole;
}
