import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "@/utils/baseQuery";

export const videosApi = createApi({
    reducerPath:"videosApi",
    baseQuery, 
    endpoints: (build) => ({
        getSubscribedVideos: build.query({
            query: () => "videos/sub",
            providesTags: ['Videos'],
        }),
        getTrendingVideos: build.query({
            query: () => "videos/trend",
            providesTags: ['Videos'],
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
            invalidatesTags: ['History'],
        }),
    })
})

export const { 
    useGetSubscribedVideosQuery, 
    useGetTrendingVideosQuery,
    useAddToHistoryMutation, 
    useGetHistoryQuery,
} = videosApi;
