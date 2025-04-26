import {
  HTTPResponse,
  IChatData,
  ICreateGroup,
  ICreateGroupResponse,
  IFriendList,
  IMessageResponse,
  IPostChat,
  IRecentConversation,
} from '@/types/types';
import { API_ENDPOINTS } from '@/utils/api-endpoints';
import { baseApi } from './baseAPI';

export const OrderApisEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    recentConversation: builder.query<HTTPResponse<IRecentConversation[]>, void>({
      query: () => ({
        url: API_ENDPOINTS.FRIEND_RECENT_MESSAGE,
        method: 'GET',
      }),
      providesTags: ['RECENT_CONVERSATION'],
    }),

    getAllFriends: builder.query<HTTPResponse<IFriendList[]>, void>({
      query: () => ({
        url: API_ENDPOINTS.FRIEND_LIST,
        method: 'GET',
      }),
      providesTags: ['FRIEND_LIST'],
    }),

    getConversationDetails: builder.query<HTTPResponse<IChatData>, { chatId: string }>({
      query: ({ chatId }) => ({
        url: `${API_ENDPOINTS.CONVERSATION}/${chatId}`,
        method: 'GET',
      }),
      providesTags: ['CONVERSATION_DETAILS'],
    }),

    joinConversation: builder.mutation<HTTPResponse<IMessageResponse>, IPostChat>({
      query: (body) => ({
        url: `${API_ENDPOINTS.SEND_MESSAGE}`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['CONVERSATION_DETAILS'],
    }),

    newConversation: builder.mutation<HTTPResponse<IMessageResponse>, IPostChat>({
      query: (body) => ({
        url: `${API_ENDPOINTS.SEND_MESSAGE}`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['RECENT_CONVERSATION'],
    }),

    createGroup: builder.mutation<HTTPResponse<ICreateGroupResponse>, ICreateGroup>({
      query: (body) => ({
        url: `${API_ENDPOINTS.CREATE_GROUP}`,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['RECENT_CONVERSATION'],
    }),
  }),
});

export const {
  useRecentConversationQuery,
  useGetAllFriendsQuery,
  useGetConversationDetailsQuery,
  useJoinConversationMutation,
  useNewConversationMutation,
  useCreateGroupMutation,
} = OrderApisEndpoints;
