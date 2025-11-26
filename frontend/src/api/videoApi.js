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

  // Dislike (hoặc Un-like)
  removeLike: (id) => {
    return axiosClient.delete(`/videos/${id}/like`);
  },

  // Lấy danh sách video đã like (để check trạng thái)
  getLikedVideos: () => {
    return axiosClient.get("/videos/liked");
  },
};

export default videoApi;
