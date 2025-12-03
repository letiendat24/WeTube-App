import axiosClient from "./axiosClient";

const commentApi = {
  getComments: (videoId) => {
    return axiosClient.get(`/comments/${videoId}`);
  },
  addComment: (videoId, content) => {
    return axiosClient.post('/comments', { videoId, content });
  }
};
export default commentApi;