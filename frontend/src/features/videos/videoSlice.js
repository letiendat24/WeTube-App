import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "@/utils/baseQuery";

export const videosApi = createApi({
  reducerPath: "videosApi",
  baseQuery,
  endpoints: (build) => ({
    getSubscribedVideos: build.query({
      query: () => "videos/sub",
      providesTags: ["Videos"],
    }),
    getTrendingVideos: build.query({
      query: () => "videos/trend",
      providesTags: ["Videos"],
    }),
    getHistory: build.query({
      query: () => "videos/history",
      providesTags: ["History"],
    }),
    addToHistory: build.mutation({
      query: (videoId) => ({
        url: `videos/${videoId}/history`,
        method: "POST",
      }),
      invalidatesTags: ["History"],
    }),
    getRelatedVideos: build.query({
      query: (tags) => `videos/tags?tags=${tags.join(",")}`,
      providesTags: ["Videos"],
    }),
    getLikedVideos: build.query({
      query: () => "videos/liked",
      providesTags: ["LikedVideos"],
    }),
    // 1. Lấy trạng thái Auth (Like/Sub)
    getAuthStatus: build.query({
      query: (videoId) => `videos/${videoId}/auth-status`,
      // Tag này quan trọng: Để khi mình Like/Sub xong, nó tự fetch lại status mới
      providesTags: (result, error, id) => [{ type: "AuthStatus", id }],
    }),

    // 2. Like Video
    likeVideo: build.mutation({
      query: (videoId) => ({
        url: `videos/${videoId}/like`,
        method: "POST",
      }),
      // Khi Like xong -> Báo hiệu 'AuthStatus' và 'Videos' (chi tiết video) đã cũ -> Fetch lại
      invalidatesTags: (result, error, id) => [
        { type: "AuthStatus", id },
        { type: "Videos", id }, // Để cập nhật lại số like hiển thị trên video
      ],
    }),

    // 3. Dislike Video
    dislikeVideo: build.mutation({
      query: (videoId) => ({
        url: `videos/${videoId}/dislike`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "AuthStatus", id },
        { type: "Videos", id },
      ],
    }),

    // 4. Hủy Like/Dislike
    removeInteraction: build.mutation({
      query: (videoId) => ({
        url: `videos/${videoId}/like`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "AuthStatus", id },
        { type: "Videos", id },
      ],
    }),

    getMySubscriptions: build.query({
      query: () => '/channels/my-subscriptions',
      providesTags: ['Subscriptions'], 
    }),
    
    subscribeChannel: build.mutation({
      query: (channelId) => ({
        url: `/channels/${channelId}/subscribe`,
        method: 'POST',
      }),
      // Bấm xong thì báo hiệu: List Sub ở sidebar cũ rồi (refresh đi) 
      // và Trạng thái nút bấm ở WatchPage cũ rồi (refresh đi)
      invalidatesTags: (result, error, id) => ['Subscriptions', { type: 'AuthStatus', id }],
    }),

    unsubscribeChannel: build.mutation({
      query: (channelId) => ({
        url: `/channels/${channelId}/subscribe`,
        method: 'DELETE',
      }),
      // Tương tự: Refresh sidebar và nút bấm
      invalidatesTags: (result, error, id) => ['Subscriptions', { type: 'AuthStatus', id }],
    }),
  }),
});

export const {
  useGetSubscribedVideosQuery,
  useGetTrendingVideosQuery,
  useAddToHistoryMutation,
  useGetHistoryQuery,
  useGetRelatedVideosQuery,
  useGetLikedVideosQuery,
  useGetAuthStatusQuery,
  useDislikeVideoMutation,
  useRemoveInteractionMutation,
  useLikeVideoMutation,
  useGetMySubscriptionsQuery,
  useSubscribeChannelMutation,
  useUnsubscribeChannelMutation,
} = videosApi;
