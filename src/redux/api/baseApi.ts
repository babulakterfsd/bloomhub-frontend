import {
  BaseQueryApi,
  BaseQueryFn,
  DefinitionType,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { toast } from 'sonner';
import {
  RemoveShopkeeperFromLocalState,
  setShopkeeperInLocalState,
} from '../features/authSlice';
import { RootState } from '../store';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState)?.auth?.token;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error) {
    const errorMessage = (result.error.data as any)?.message;
    toast.error(errorMessage || 'Something went wrong', {
      position: 'top-right',
      duration: 1500,
      icon: '🚨',
    });
  }

  if (result?.error?.status === 401) {
    const response = await fetch(
      'http://localhost:5000/api/auth/refresh-token',
      {
        method: 'POST',
        credentials: 'include',
      }
    );

    const data = await response.json();
    if (data?.data?.accessToken) {
      const shopkeeper = (api.getState() as RootState).auth.shopkeeper;

      api.dispatch(
        setShopkeeperInLocalState({
          shopkeeper,
          token: data?.data?.accessToken,
        })
      );

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(RemoveShopkeeperFromLocalState());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ['products', 'product', 'sells', 'sell', 'shopkeeper'],
  endpoints: () => ({}),
});
