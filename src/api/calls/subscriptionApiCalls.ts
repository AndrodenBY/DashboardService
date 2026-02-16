import {subscriptionApi} from './axios.ts';
import type {SubscriptionFilterDto} from '../../modules/filter/SubscriptionFilterDto.ts';
import type {CreateSubscriptionDto} from '../../modules/types/subscription/dto/CreateSubscriptionDto.ts';
import type {UpdateSubscriptionDto} from '../../modules/types/subscription/dto/UpdateSubscriptionDto.ts';
import type {SubscriptionViewModel} from "../../modules/types/subscription/view-model/SubscriptionViewModel.ts";

export const subscriptionApiCalls = {
  getById: async (id: string): Promise<SubscriptionViewModel> => {
    const { data } = await subscriptionApi.get<SubscriptionViewModel>(`/${id}`);
    return data;
  },

  getAll: async (filter?: SubscriptionFilterDto): Promise<SubscriptionViewModel[]> => {
    const { data } = await subscriptionApi.get<SubscriptionViewModel[]>('', {
      params: filter,
    });
    return data;
  },

  create: async (dto: CreateSubscriptionDto): Promise<SubscriptionViewModel> => {
    const { data } = await subscriptionApi.post<SubscriptionViewModel>(``, dto);
    return data;
  },

  update: async (id: string, dto: UpdateSubscriptionDto): Promise<SubscriptionViewModel> => {
    const { data } = await subscriptionApi.put<SubscriptionViewModel>(`/${id}`, dto);
    return data;
  },

  cancel: async (subscriptionId: string, userId: string): Promise<SubscriptionViewModel> => {
    const { data } = await subscriptionApi.patch<SubscriptionViewModel>(`/${subscriptionId}/cancel`, null, {
      params: { userId },
    });
    return data;
  },

  renew: async (subscriptionId: string, monthsToRenew: number): Promise<SubscriptionViewModel> => {
    const { data } = await subscriptionApi.patch<SubscriptionViewModel>(`/${subscriptionId}/renew`, null, {
      params: { monthsToRenew },
    });
    return data;
  },

  getUpcomingBills: async (userId: string): Promise<SubscriptionViewModel[]> => {
    const { data } = await subscriptionApi.get<SubscriptionViewModel[]>(`/bills/users/${userId}`);
    return data;
  },
};
