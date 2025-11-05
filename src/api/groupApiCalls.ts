import {groupApi} from "./axios.ts";
import type {GroupViewModel} from "../modules/types/user/view-model/group/GroupViewModel.ts";
import type {GroupFilterDto} from "../modules/filter/GroupFilterDto.ts";
import type {MemberViewModel} from "../modules/types/user/view-model/member/MemberViewModel.ts";
import type {MemberFilterDto} from "../modules/filter/MemberFilterDto.ts";
import type {CreateGroupDto} from "../modules/types/user/dto/group/CreateGroupDto.ts";
import type {UpdateGroupDto} from "../modules/types/user/dto/group/UpdateGroupDto.ts";
import type {CreateMemberDto} from "../modules/types/user/dto/member/CreateMemberDto.ts";

export const groupApiCalls = {
  getById: async (id: string): Promise<GroupViewModel> => {
    const { data } = await groupApi.get<GroupViewModel>(`/${id}`);
    return data;
  },

  getAll: async (filter?: GroupFilterDto) : Promise<GroupViewModel[]> => {
    const { data } = await groupApi.get<GroupViewModel[]>(``, {
      params: filter,
    });
    return data;
  },

  getAllMembers: async (filter?: MemberFilterDto) : Promise<MemberViewModel[]> => {
    const { data } = await groupApi.get<MemberViewModel[]>(``, {
      params: filter,
    });
    return data;
  },

  create: async (userId: string, dto: CreateGroupDto): Promise<GroupViewModel> => {
    const { data } = await groupApi.post<GroupViewModel>(`${userId}/create`, dto);
    return data;
  },

  update: async (id: string, dto: UpdateGroupDto): Promise<GroupViewModel> => {
    const { data } = await groupApi.put(`/${id}`, dto);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await groupApi.delete(`/${id}`);
  },

  joinGroup: async (dto: CreateMemberDto): Promise<void> => {
    const { data } = await groupApi.post(`/join`, dto);
    return data;
  },

  leaveGroup: async (groupId: string, userId: string): Promise<void> => {
    await groupApi.delete(`/leave`, {
      params: {groupId, userId}
    });
  },

  changeRole: async (memberId: string): Promise<MemberViewModel> => {
    const { data } = await groupApi.patch(`/members/${memberId}/role`);
    return data;
  },

  shareSubscription: async (groupId: string, subscriptionId: string): Promise<GroupViewModel> => {
    const { data } = await groupApi.post(`/share`, null, {
      params: { groupId, subscriptionId }
    });
    return data;
  },

  unshareSubscription: async (groupId: string, subscriptionId: string): Promise<GroupViewModel> => {
    const { data } = await groupApi.post(`/unshare`, null, {
      params: { groupId, subscriptionId }
    });
    return data;
  },
}
