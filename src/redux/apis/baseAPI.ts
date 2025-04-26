import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { TagTypes } from './tagTypes';
import { baseURL } from '@/utils/constant';

interface EnhancedFetchArgs extends FetchArgs {
  token?: string;
}

const baseQuery: BaseQueryFn<string | EnhancedFetchArgs, unknown, FetchBaseQueryError> =
  fetchBaseQuery({
    baseUrl: baseURL,
    credentials: 'include',
    prepareHeaders: async (headers, { getState }) => {
      return headers;
    },
  });

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: async (args: string | EnhancedFetchArgs, api, extraOptions) => {
    const response = await baseQuery(args, api, extraOptions);
    return response;
  },
  keepUnusedDataFor: 24 * 60 * 60,

  endpoints: () => ({}),
  tagTypes: Object.values(TagTypes),
});
