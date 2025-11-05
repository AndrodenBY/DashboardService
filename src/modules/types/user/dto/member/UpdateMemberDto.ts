import type {MemberRole} from "../../../enums/MemberRole.ts";

export type UpdateMemberDto = {
  id: string;
  role: MemberRole;
}
