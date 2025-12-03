// src/api/channelApi.js
import axiosClient from "./axiosClient";

const channelApi = {
  // Subscribe
  subscribe: (channelId) => {
    return axiosClient.post(`/channels/${channelId}/subscribe`);
  },

  // Unsubscribe
  unsubscribe: (channelId) => {
    return axiosClient.delete(`/channels/${channelId}/subscribe`);
  },

  // Lấy danh sách đã subscribe (để check trạng thái)
  getMySubscriptions: () => {
    return axiosClient.get('/channels/my-subscriptions');
  }
};

export default channelApi;