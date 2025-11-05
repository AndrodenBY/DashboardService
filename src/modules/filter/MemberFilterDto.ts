import type {MemberRole} from "../types/enums/MemberRole.ts";

export type MemberFilterDto = {
  id?: string;
  role?: MemberRole;
}
