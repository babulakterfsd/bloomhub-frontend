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
    getProfile: builder.query({
      query: () => {
        return {
          url: '/auth/get-profile',
          method: 'GET',
        };
      },
      providesTags: ['shopkeeper'],
    }),
    updateProfile: builder.mutation({
      query: (profileDataToBeUpdated) => {
        return {
          url: '/auth/update-profile',
          method: 'PUT',
          body: profileDataToBeUpdated,
        };
      },
      invalidatesTags: ['shopkeeper'],
    }),
    deletePhoto: builder.mutation({
      query: (photoId) => {
        return {
          url: `/auth/delete-photo-from-profile`,
          method: 'PUT',
          body: { photoUrl: photoId },
        };
      },
      invalidatesTags: ['shopkeeper'],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useGetProfileQuery,
  useDeletePhotoMutation,
} = authApi;
