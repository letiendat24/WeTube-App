// import { Outlet } from "react-router";
// import SidebarStudio from "./components/SidebarStudio";
// import Header from "./components/Header"; 

// export default function StudioLayout() {
//   return (
//     <div className="flex flex-col h-screen bg-background">
//       <Header /> 
//       <div className="flex flex-1 overflow-hidden"> 
//         <SidebarStudio /> 
//         <main className="flex-1 overflow-y-auto"> 
//           <div className="p-6">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
// import { useState } from "react";
import { Outlet } from "react-router";
import HeaderStudio from "./components/HeaderStudio";
import SidebarStudio from "./components/SidebarStudio";
import VideoDetails from "@/pages/Studio/components/VideoDetails";
import VideoList from "@/pages/Studio/components/VideoList";
import React, { useState, useRef } from "react";
// import HomeStudio from "@/pages/HomeStudio";
import axios from 'axios';
// ... (các imports khác)

const API_BASE_URL = "http://localhost:3000/api/videos";

const mockVideosData = [
  {
    // ✅ Cần có ID duy nhất để xác định video khi Sửa/Xóa
    id: '123_react_router',
    title: "Hướng dẫn xây dựng ứng dụng React Router",
    duration: "12:35",
    views: 1540,
    likes: 120,
    comments: 45,
    status: "public", // Dùng cho cột Trạng thái
    visibility: "Public", // Dùng cho cột Visibility
    date: "2025-11-20",

    // ✅ Cần có URL cố định ngẫu nhiên (simulated URL)
    videoUrl: "https://youtu.be/A1bC2dE3fG4",
    thumbnail: "https://placehold.co/96x56/4169E1/FFFFFF?text=Router",
    description: "Đây là video hướng dẫn chi tiết cách thiết lập và sử dụng React Router V6 cho các dự án web hiện đại."
  },
  {
    id: '456_node_optimize',
    title: "Tối ưu hiệu suất cho Node.js API",
    duration: "08:10",
    views: 200,
    likes: 15,
    comments: 2,
    status: "private",
    visibility: "Private",
    date: "2025-11-15",
    videoUrl: "https://youtu.be/hIjKlMnOpQ1",
    thumbnail: "https://placehold.co/96x56/FF8C00/FFFFFF?text=NodeAPI",
    description: "Các kỹ thuật nâng cao để cải thiện tốc độ xử lý và giảm độ trễ của ứng dụng Node.js."
  },
  {
    id: '789_tailwind_css',
    title: "Giới thiệu về Tailwind CSS 4.0",
    duration: "25:00",
    views: 890,
    likes: 95,
    comments: 10,
    status: "unlisted",
    visibility: "Unlisted",
    date: "2025-11-01",
    videoUrl: "https://youtu.be/PqRsTuVwXyZ",
    thumbnail: "https://placehold.co/96x56/00CED1/FFFFFF?text=Tailwind",
    description: "Khám phá các tính năng mới và cách di chuyển dự án lên Tailwind CSS phiên bản 4.0."
  },
  {
    id: '012_draft_upload',
    title: "Bản nháp Video mới tải lên (Cần hoàn thiện)",
    duration: "00:00",
    views: 0,
    likes: 0,
    comments: 0,
    status: "draft",
    visibility: "Private",
    date: "2025-11-22",
    videoUrl: "http://localhost:3000/videos/temp_draft_012",
    thumbnail: "https://placehold.co/96x56/B0C4DE/333333?text=Draft",
    description: "Video này đang chờ bạn thêm mô tả chi tiết và thiết lập chế độ hiển thị."
  },
];

export default function StudioLayout() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoDetailsRef = useRef(null);
  const [videos, setVideos] = useState(mockVideosData);

  // Hàm API XÓA (GỌI DELETE /api/videos/:videoId)
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa video này?")) {
      return;
    }

    try {
      // 💡 Cần thêm header Authorization nếu API yêu cầu authMiddleware
      const token = localStorage.getItem('authToken'); // Giả sử token được lưu ở đây

      await axios.delete(`${API_BASE_URL}/${videoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Cập nhật state để xóa video khỏi danh sách
      setVideos(prev => prev.filter(v => v.id !== videoId));
      alert("Video đã được xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa video:", error);
      // Hiển thị thông báo lỗi chi tiết hơn từ server
      const errorMessage = error.response?.data?.message || "Xóa video thất bại.";
      alert(errorMessage);
    }
  };

  const user = {
    name: "me me",
    avatar: null,
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleVideoSelected = (file) => {
    console.log("VIDEO ĐƯỢC CHỌN:", file);
    setSelectedVideo(file);
  };



  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <HeaderStudio
          onMenuClick={toggleSidebar}
          user={user}
          // onVideoSelected={handleVideoSelected}
          onVideoSelected={(videoData) => setSelectedVideo(videoData)}
          // 💡 TRUYỀN PROPS ĐỂ CHUYỂN ĐỔI HEADER
          isDetailView={!!selectedVideo} // Là true khi selectedVideo tồn tại
          onBack={() => setSelectedVideo(null)}
          // TRUYỀN HÀM SAVE: GỌI HÀM handleSubmit TRONG VideoDetails QUA REF
          onSave={() => videoDetailsRef.current?.handleSubmit()}
        />
      </div>

      <div className="flex">
        {/* SIDEBAR */}
        <SidebarStudio isOpen={isOpen} user={user} onNavigate={() => setSelectedVideo(null)} />

        {/* MAIN CONTENT */}
        <div
          className={`flex-1 transition-all h-screen overflow-auto duration-300 p-10 ${isOpen ? "ml-64" : "ml-20"
            }`}
        >
          {/* Nếu không có route con thì load trang HomeStudio */}
          {/* <Outlet context={{ selectedVideo }} /> */}

          {selectedVideo ? (
            <VideoDetails
              videoData={selectedVideo}
              onBack={() => setSelectedVideo(null)} // Quay lại dashboard

            />
          ) : (
            // Hiển thị Dashboard hoặc Video List
            <VideoList user={user} videos={videos} />
          )}
        </div>
      </div>
    </div>
  );
}
