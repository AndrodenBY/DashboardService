import {userApi} from './axios.ts';
import type {UserViewModel} from "../../modules/types/user/view-model/UserViewModel.ts";
import type {CreateUserDto} from "../../modules/types/user/dto/user/CreateUserDto.ts";
import type {UpdateUserDto} from "../../modules/types/user/dto/user/UpdateUserDto.ts";
import type {UserFilterDto} from "../../modules/filter/UserFilterDto.ts";

export const userApiCalls = {
  getById: async (id: string): Promise<UserViewModel> => {
    const { data } = await userApi.get<UserViewModel>(`/${id}`);
    return data;
  },

  getByAuth0Id: async  (): Promise<UserViewModel> => {
    const { data } = await userApi.get<UserViewModel>(`/me`);
    return data;
  },

  getAll: async (filter?: UserFilterDto): Promise<UserViewModel[]> => {
    const { data } = await userApi.get<UserViewModel[]>('', {
      params: filter,
    });
    return data;
  },

  create: async (dto: CreateUserDto): Promise<UserViewModel> => {
    const { data } = await userApi.post<UserViewModel>('', dto);
    return data;
  },

  update: async (dto: UpdateUserDto): Promise<UserViewModel> => {
    const { data } = await userApi.put<UserViewModel>('/me', dto);
    return data;
  },

  delete: async (): Promise<void> => {
    await userApi.delete('');
  },
};
