import {groupApi} from "./axios.ts";
import type {GroupViewModel} from "../../modules/types/user/view-model/GroupViewModel.ts";
import type {GroupFilterDto} from "../../modules/filter/GroupFilterDto.ts";
import type {MemberViewModel} from "../../modules/types/user/view-model/MemberViewModel.ts";
import type {MemberFilterDto} from "../../modules/filter/MemberFilterDto.ts";
import type {CreateGroupDto} from "../../modules/types/user/dto/group/CreateGroupDto.ts";
import type {UpdateGroupDto} from "../../modules/types/user/dto/group/UpdateGroupDto.ts";
import type {CreateMemberDto} from "../../modules/types/user/dto/member/CreateMemberDto.ts";
import type {PaginationParameters} from "../../modules/types/pagination/PaginationParameters.ts";
import type {PaginatedList} from "../../modules/types/pagination/PaginatedList.ts";

export const groupApiCalls = {
  getById: async (id: string): Promise<GroupViewModel> => {
    const { data } = await groupApi.get<GroupViewModel>(`/${id}`);
    return data;
  },

  getAll: async (
    filter?: GroupFilterDto,
    pagination?: PaginationParameters
  ): Promise<PaginatedList<GroupViewModel>> => {
    const { data } = await groupApi.get<PaginatedList<GroupViewModel>>('', {
      params: { ...filter, ...pagination },
    });
    return data;
  },

  getAllMembers: async (
    filter?: MemberFilterDto,
    pagination?: PaginationParameters
  ): Promise<PaginatedList<MemberViewModel>> => {
    const { data } = await groupApi.get<PaginatedList<MemberViewModel>>('/members', {
      params: { ...filter, ...pagination },
    });
    return data;
  },

  create: async (dto: CreateGroupDto): Promise<GroupViewModel> => {
    const { data } = await groupApi.post<GroupViewModel>('', dto);
    return data;
  },

  update: async (id: string, dto: UpdateGroupDto): Promise<GroupViewModel> => {
    const { data } = await groupApi.put<GroupViewModel>(`/${id}`, dto);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await groupApi.delete(`/${id}`);
  },

  join: async (dto: CreateMemberDto): Promise<void> => {
    await groupApi.post('/join', dto);
  },

  leave: async (groupId: string, userId: string): Promise<void> => {
    await groupApi.delete('/leave', {
      params: { groupId, userId },
    });
  },

  changeMemberRole: async (memberId: string): Promise<MemberViewModel> => {
    const { data } = await groupApi.patch<MemberViewModel>(`/members/${memberId}/role`);
    return data;
  },

  shareSubscription: async (groupId: string, subscriptionId: string): Promise<GroupViewModel> => {
    const { data } = await groupApi.post<GroupViewModel>('/share', null, {
      params: { groupId, subscriptionId },
    });
    return data;
  },

  unshareSubscription: async (groupId: string, subscriptionId: string): Promise<GroupViewModel> => {
    const { data } = await groupApi.post<GroupViewModel>('/unshare', null, {
      params: { groupId, subscriptionId },
    });
    return data;
  },
};
