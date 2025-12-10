import axiosClient from "./axiosClient";

const videoApi = {
  // Lấy danh sách video (có phân trang)
  getAll: async (params) => {
    const url = "/videos";
    // params sẽ là { page: 1, limit: 10, sort: 'latest', ... }
    const response = await axiosClient.get(url, { params });
    return response.data;
  },

  // Lấy chi tiết video (dùng cho trang Watch sau này)
  getDetail: async (id) => {
    const url = `/videos/${id}`;
    const response = await axiosClient.get(url);
    return response.data;
  },

  //Like video
  like: (id) => {
    return axiosClient.post(`/videos/${id}/like`);
  },

  // Dislike video
  dislike: (id) => {
    return axiosClient.post(`/videos/${id}/dislike`);
  },
 // Hủy tương tác (Xóa Like hoặc Dislike)
  removeInteraction: (id) => {
    return axiosClient.delete(`/videos/${id}/like`);
  },

  // Lấy danh sách video đã like (để check trạng thái)
  getLikedVideos: () => {
    return axiosClient.get("/videos/liked");
  },

  //lay danh sach video da xem
  getHistoryVideos: () => {
    return axiosClient.get("/history");
  },
  // Update video
  updateVideo: (id, data) => {
    return axiosClient.patch(`/videos/${id}`, data);
  }
};

export default videoApi;
