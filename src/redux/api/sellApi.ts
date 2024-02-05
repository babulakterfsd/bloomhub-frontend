import { baseApi } from './baseApi';

const sellApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sellAProduct: builder.mutation({
      query: (productToBeSoldData) => {
        return {
          url: '/sells',
          method: 'POST',
          body: productToBeSoldData,
        };
      },
      invalidatesTags: ['products', 'product', 'sells'],
    }),
    getAllSoldProducts: builder.query({
      query: (query) => {
        const { page, limit, shopkeepersEmail, timeframe } = query;
        return {
          url: `/sells?page=${page}&limit=${limit}&shopkeepersEmail=${shopkeepersEmail}&timeframe=${timeframe}`,
          method: 'GET',
        };
      },
      providesTags: ['sells'],
    }),
  }),
});

export const { useSellAProductMutation, useGetAllSoldProductsQuery } = sellApi;
