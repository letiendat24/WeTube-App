import axiosClient from "./axiosClient";

const historyApi = {
  // Ghi nhận video vào lịch sử
  addToHistory: (videoId) => {
    return axiosClient.post(`/history/${videoId}`);
  },

  // Lấy danh sách lịch sử
  getHistory: () => {
    return axiosClient.get('/history');
  },

  // Xóa 1 video khỏi lịch sử
  removeFromHistory: (videoId) => {
    return axiosClient.delete(`/history/${videoId}`);
  },

  // Xóa toàn bộ lịch sử
  clearHistory: () => {
    return axiosClient.delete('/history');
  }
};

export default historyApi;