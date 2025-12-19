import { Outlet } from "react-router";
import HeaderStudio from "./components/HeaderStudio";
import SidebarStudio from "./components/SidebarStudio";
import VideoDetails from "@/pages/Studio/components/VideoDetails";
import { useState, useEffect, useCallback } from "react";
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/videos";

export default function StudioLayout() {
  const [isOpen, setIsOpen] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  // State này sẽ lưu trữ DỮ LIỆU CHI TIẾT (đã được fetch) hoặc null.
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false); // [NEW] Loading cho fetch chi tiết

  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const { user } = {};

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
    setIsFetchingDetail(false);
  };

  const handleOpenUploadModal = () => {
    setSelectedVideo(null);
    setIsModalOpen(true);
  };

  // 1. [NEW] HÀM FETCH CHI TIẾT VIDEO
  const fetchVideoDetail = useCallback(async (videoId) => {
    const token = localStorage.getItem("token");
    if (!token || !videoId) return;

    setIsFetchingDetail(true); // Bật loading
    try {
      // [NEW] SỬ DỤNG API ĐỌC CHI TIẾT
      const response = await axios.get(`${API_BASE_URL}/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Gán dữ liệu chi tiết vào state, điều này sẽ làm Modal mở ra (nếu isModalOpen là true)
      setSelectedVideo(response.data);
      setIsModalOpen(true); // Mở modal sau khi có dữ liệu
    } catch (error) {
      console.error("Lỗi khi tải chi tiết video:", error);
      alert("Không thể tải chi tiết video để chỉnh sửa.");
      handleCloseModal(); // Đóng modal nếu lỗi
    } finally {
      setIsFetchingDetail(false); // Tắt loading
    }
  }, []);

  const fetchVideos = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoadingVideos(true);
    try {
      // ✨ THÊM TIMESTAMP VÀO URL ĐỂ CHỐNG CACHE
      const cacheBuster = `&t=${Date.now()}`;

      const response = await axios.get(`${API_BASE_URL}/studio?${cacheBuster}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVideos(response.data.videos || response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách video:", error);
    } finally {
      setLoadingVideos(false);
    }
  }, []);

  // Tải video khi component mount lần đầu
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Hàm xử lý upload/edit thành công
  const handleActionSuccess = () => {
    handleCloseModal();
    fetchVideos();
  };

  // 3. [MODIFIED] Hàm xử lý khi nhấn nút Chỉnh sửa (chỉ nhận ID)
  const handleSelectVideoForEdit = (video) => {
    const videoId = video._id || video.id;
    // KHÔNG LƯU DATA LÊN STATE TRƯỚC, CHỈ DÙNG ID ĐỂ FETCH CHI TIẾT
    fetchVideoDetail(videoId);
  };

  // Hàm xử lý khi xóa video
  const handleDeleteVideo = async (videoId) => {
    // ... (Logic xóa, gọi fetchVideos() sau khi xóa thành công)
    fetchVideos();
  };


  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <HeaderStudio
          onMenuClick={() => setIsOpen((p) => !p)}
          onUploadClick={handleOpenUploadModal}
        />
      </div>

      <div className="flex pt-[72px]">
        {/* SIDEBAR */}
        <SidebarStudio isOpen={isOpen} user={user} onNavigate={handleCloseModal} />

        {/* MAIN CONTENT */}
        <main
          className={`flex-1 transition-all min-h-[calc(100vh-72px)] duration-300 ${isOpen ? "ml-64" : "ml-20"
            }`}
        >
          <div className="p-6 lg:p-10">
            <Outlet context={{
              videos,
              loading: loadingVideos,
              onSelectVideo: handleSelectVideoForEdit,
              onDeleteVideo: handleDeleteVideo,
              fetchVideos: fetchVideos
            }} />
          </div>
        </main>

        {/* MODAL VIDEO DETAILS/UPLOAD */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto w-full max-w-6xl relative">
              <button onClick={handleCloseModal} className="absolute z-10 text-gray-500 top-4 right-4 hover:text-gray-900">
                X
              </button>

              {/* [NEW] HIỂN THỊ LOADING NẾU ĐANG TẢI CHI TIẾT */}
              {isFetchingDetail ? (
                <div className="p-20 text-center">Đang tải chi tiết video...</div>
              ) : (
                <VideoDetails
                  // Truyền selectedVideo (đã được fetch) hoặc null (chế độ Upload)
                  videoToEdit={selectedVideo}
                  onClose={handleCloseModal}
                  onActionSuccess={handleActionSuccess}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}