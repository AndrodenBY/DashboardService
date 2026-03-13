import type {MemberRole} from "../../../enums/MemberRole.ts";

export type CreateMemberDto = {
  id: string;
  role: MemberRole;
}
