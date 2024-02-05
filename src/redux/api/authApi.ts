import { baseApi } from './baseApi';

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (loginData) => {
        return {
          url: '/auth/login',
          method: 'POST',
          body: loginData,
        };
      },
    }),
    signup: builder.mutation({
      query: (signupData) => {
        return {
          url: '/auth/register',
          method: 'POST',
          body: signupData,
        };
      },
    }),
    changePassword: builder.mutation({
      query: (passwordData) => {
        return {
          url: '/auth/change-password',
          method: 'POST',
          body: passwordData,
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useChangePasswordMutation,
} = authApi;
