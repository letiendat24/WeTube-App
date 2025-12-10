// src/api/adminApi.js
import axiosClient from "./axiosClient";

const adminApi = {
  // Lấy thống kê tổng quan (Users, Videos, Views)
  getSystemStats: () => {
    return axiosClient.get("/admin/stats");
  },

  // Lấy danh sách người dùng (có phân trang)
  getUsers: (page = 1, limit = 10) => {
    return axiosClient.get(`/admin/users?page=${page}&limit=${limit}`);
  },

  // Xóa (Ban) người dùng
  deleteUser: (userId) => {
    return axiosClient.delete(`/admin/users/${userId}`);
  },

  // Xóa video vi phạm (nếu cần dùng sau này)
  deleteVideo: (videoId) => {
    return axiosClient.delete(`/admin/videos/${videoId}`);
  },
};

export default adminApi;