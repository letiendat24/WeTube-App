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
} = videosApi;
