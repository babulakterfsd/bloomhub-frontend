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
  baseUrl: 'https://bloomhub-backend.vercel.app/api',
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

  if (result?.error && result?.error?.status !== 406) {
    // for other application, i will not check result?.error?.status !== 406, cause it is not a common status code for unauthorized type errors. it is only used for this project. for other projects, i will only use result?.error?.status === 401. here i am doing this customly for frequesnt password change senario. even, programming hero showed only result?.error check
    const errorMessage = (result.error.data as any)?.message;
    toast.error(errorMessage || 'Something went wrong', {
      position: 'top-right',
      duration: 2500,
      icon: '🚨',
    });
  }

  /* for this project only, i am using result?.error?.status === 401 || result?.error?.status === 406 logic, either result?.error?.status === 401 is enough to check if i need to fetch new access token using refresh token. here , i am checking this cause after password change, lastpasswordchangetime is newer then lastaccesstokenissedtime. so i have to detect that error while changing password and should not show unauthorized toast to the user (as token is invalided, from line 40, a toast would pop up as unauthorized, it is common for all 401 unauth type errors, then it refetches the accesstoken using refreshtoken. but for pass change, user should not see that toast, thats why I used custom logic here that if the status code is 406 , then no toast will be shown, but new access token will be fetched, user wont be informed. so, lets visualize the senario. guess, a user is logged in now. he tries to change his password, he will successfully change it. so in databse, his last pass change time is newer than his last access token generation time (access token gets generated when a user logs in). from here he if sends any api request server will see that his token is invalid and server will quickly send new access token using the refresh token from his browser. user wont be informed cause i am not showing any toast or error message for that. but in password change senario, first time user will change password. then his token is invalid. with that invalid token, if he tries to change pass again, if the password fields data follows other requirements, it will get new access token and password will be changed again. but if something is wrong like current pass unmatched, new pass is less than 6 char, then on first click nothing will happen (user will see nothing, but new access token will be generated). and if he clicks again, as there is no token related issue, so then he will see exact error that current pass doesnt match or new pass is ... so so ... if he sends all correct data then, it will change pass again and then same process.)  */

  if (result?.error?.status === 401 || result?.error?.status === 406) {
    const response = await fetch(
      'https://bloomhub-backend.vercel.app/api/auth/refresh-token',
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
