import type {MemberRole} from "../../../enums/MemberRole.ts";

export type MemberDto = {
  id: string;
  userId: string;
  groupId: string;
  role: MemberRole;
}
