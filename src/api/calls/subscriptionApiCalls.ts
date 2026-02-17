import {subscriptionApi} from './axios.ts';
import type {SubscriptionFilterDto} from '../../modules/filter/SubscriptionFilterDto.ts';
import type {CreateSubscriptionDto} from '../../modules/types/subscription/dto/CreateSubscriptionDto.ts';
import type {UpdateSubscriptionDto} from '../../modules/types/subscription/dto/UpdateSubscriptionDto.ts';
import type {
  SubscriptionViewModel as Subscription
} from "../../modules/types/subscription/view-model/SubscriptionViewModel.ts";
import type {PaginationParameters} from "../../modules/types/pagination/PaginationParameters.ts";
import type {PaginatedList} from "../../modules/types/pagination/PaginatedList.ts"

export const subscriptionApiCalls = {
  getById: async (id: string): Promise<Subscription> => {
    const { data } = await subscriptionApi.get<Subscription>(`/${id}`);
    return data;
  },

  getAll: async (
    filter?: SubscriptionFilterDto,
    pagination?: PaginationParameters
  ): Promise<PaginatedList<Subscription>> => {
    const { data } = await subscriptionApi.get<PaginatedList<Subscription>>('', {
      params: { ...filter, ...pagination },
    });
    return data;
  },

  create: async (dto: CreateSubscriptionDto): Promise<Subscription> => {
    const { data } = await subscriptionApi.post<Subscription>(``, dto);
    return data;
  },

  update: async (dto: UpdateSubscriptionDto): Promise<Subscription> => {
    const { data } = await subscriptionApi.put<Subscription>(``, dto);
    return data;
  },

  cancel: async (subscriptionId: string): Promise<Subscription> => {
    const { data } = await subscriptionApi.patch<Subscription>(`/${subscriptionId}/cancel`);
    return data;
  },

  renew: async (subscriptionId: string, monthsToRenew: number): Promise<Subscription> => {
    const { data } = await subscriptionApi.patch<Subscription>(`/${subscriptionId}/renew`, null, {
      params: { monthsToRenew },
    });
    return data;
  },

  getUpcomingBills: async (): Promise<Subscription[]> => {
    const { data } = await subscriptionApi.get<Subscription[]>(`/bills/users`);
    return data;
  },
};
