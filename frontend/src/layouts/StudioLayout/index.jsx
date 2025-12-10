
import { Outlet } from "react-router";
import HeaderStudio from "./components/HeaderStudio";
import SidebarStudio from "./components/SidebarStudio";
import VideoDetails from "@/pages/Studio/components/VideoDetails";
import VideoList from "@/pages/Studio/components/VideoList";

// Thêm useEffect để fetch dữ liệu khi mount
import React, { useState, useEffect } from "react";
import axios from 'axios';
// ... (các imports khác)

// API_BASE_URL phải được định nghĩa để dùng trong fetchVideos
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/videos";

// Bỏ mock data vì chúng ta sẽ fetch dữ liệu thực tế
// const mockVideosData = [ ... ]; // BỎ KHỎI ĐÂY

export default function StudioLayout() {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // 1. Quản lý danh sách videos TẠI StudioLayout
  const [videos, setVideos] = useState([]); // Khởi tạo mảng rỗng
  const [loadingVideos, setLoadingVideos] = useState(false); // Thêm state loading

  const [isModalOpen, setIsModalOpen] = useState(false);



  // Loại bỏ videoListRef vì chúng ta sẽ dùng State Lifting
  // const videoListRef = useRef(); 

  const user = {
    name: "",
    avatar: null,
  };


  // 2. Hàm Fetch Videos để tái sử dụng
  const fetchVideos = async () => {
    // Giả định bạn cần token để lấy danh sách video của người dùng
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found, cannot fetch videos.");
      return;
    }

    setLoadingVideos(true);
    try {
      // Giả định endpoint để lấy danh sách video của user là /api/videos/my-videos
      const response = await axios.get(`${API_BASE_URL}/my-videos`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Cập nhật state videos, kích hoạt re-render VideoList
      setVideos(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách video:", error);
    } finally {
      setLoadingVideos(false);
    }
  };

  // 3. Tải video khi component mount lần đầu
  useEffect(() => {
    fetchVideos();
  }, []); // [] đảm bảo chỉ chạy 1 lần khi mount


  // Hàm đóng modal
  const handleCloseModal = () => setIsModalOpen(false);

  // 4. Sửa hàm xử lý upload thành công: Chỉ cần gọi lại fetchVideos
  const handleUploadSuccess = () => {
    handleCloseModal();
    // GỌI LẠI HÀM FETCH VIDEOS
    // Việc này sẽ cập nhật state 'videos' và force VideoList re-render
    fetchVideos();
  };


  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Lỗi nhỏ trong prop onMenuClick, sửa lại tên biến cho phù hợp */}
        <HeaderStudio onMenuClick={() => setIsOpen((p) => !p)} />
      </div>

      <div className="flex">
        {/* SIDEBAR */}
        <SidebarStudio isOpen={isOpen} user={user} onNavigate={() => setSelectedVideo(null)} />

        {/* MAIN CONTENT */}

        {/* ==================== MAIN CONTENT (thay đổi theo route) ==================== */}
        <main
          className={`flex-1 transition-all h-screen overflow-auto duration-300 p-10 ${isOpen ? "ml-64" : "ml-20"
            }`}
        >
          <div className="p-6 lg:p-10">
            {/* Ở ĐÂY SẼ HIỆN:
                - VideoList      (khi vào /studio)
                - VideoDetails   (khi vào /studio/upload hoặc /studio/edit/:id)
                - các trang khác trong tương lai
            */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>

  );
}




// // import { Outlet } from "react-router";
// import HeaderStudio from "./components/HeaderStudio";
// import SidebarStudio from "./components/SidebarStudio";
// import VideoDetails from "@/pages/Studio/components/VideoDetails";
// import VideoList from "@/pages/Studio/components/VideoList";
// import { Outlet, useNavigate, useLocation } from "react-router-dom";
// // Thêm useEffect để fetch dữ liệu khi mount
// import React, { useState, useEffect } from "react";
// import axios from 'axios';
// // ... (các imports khác)

// // API_BASE_URL phải được định nghĩa để dùng trong fetchVideos
// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/videos";

// // Bỏ mock data vì chúng ta sẽ fetch dữ liệu thực tế
// // const mockVideosData = [ ... ]; // BỎ KHỎI ĐÂY

// export default function StudioLayout() {
//   const navigate = useNavigate(); // 🧭 Hook điều hướng
//   const location = useLocation(); // 🗺️ Hook vị trí hiện tại
//   const [isOpen, setIsOpen] = useState(true);
//   const [selectedVideo, setSelectedVideo] = useState(null);

//   // 1. Quản lý danh sách videos TẠI StudioLayout
//   const [videos, setVideos] = useState([]); // Khởi tạo mảng rỗng
//   const [loadingVideos, setLoadingVideos] = useState(false); // Thêm state loading

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Loại bỏ videoListRef vì chúng ta sẽ dùng State Lifting
//   // const videoListRef = useRef();

//   const user = {
//     name: "",
//     avatar: null,
//   };


//   // 2. Hàm Fetch Videos để tái sử dụng
//   const fetchVideos = async () => {
//     // Giả định bạn cần token để lấy danh sách video của người dùng
//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.warn("No token found, cannot fetch videos.");
//       return;
//     }

//     setLoadingVideos(true);
//     try {
//       // Giả định endpoint để lấy danh sách video của user là /api/videos/my-videos
//       const response = await axios.get(`${API_BASE_URL}/my-videos`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       // Cập nhật state videos, kích hoạt re-render VideoList
//       setVideos(response.data);
//     } catch (error) {
//       console.error("Lỗi khi tải danh sách video:", error);
//     } finally {
//       setLoadingVideos(false);
//     }
//   };

//   // 3. Tải video khi component mount lần đầu
//   useEffect(() => {
//     fetchVideos();
//   }, []); // [] đảm bảo chỉ chạy 1 lần khi mount

//   // Hàm chuyển hướng đến trang chỉnh sửa
//   const handleEditVideo = (videoData) => {
//     const videoId = videoData._id || videoData.id;
//     if (videoId) {
//       // ⚠️ Đây là bước quan trọng: Chuyển hướng đến URL chỉnh sửa
//       // Truyền toàn bộ dữ liệu video (đã được tải đầy đủ từ API trong VideoList) qua state
//       // Giúp VideoDetailsPage tải nhanh hơn nếu cần
//       navigate(`/studio/edit/${videoId}`, { state: { video: videoData } });
//     } else {
//       console.error("Không tìm thấy ID video để chỉnh sửa.");
//     }
//   };

//   // Hàm xử lý upload thành công: Chỉ cần gọi lại fetchVideos
//   const handleUploadSuccess = () => {
//     // ... xử lý đóng modal (nếu có) ...
//     fetchVideos();
//   };



//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       {/* HEADER */}
//       <div className="fixed top-0 left-0 right-0 z-50">
//         {/* Lỗi nhỏ trong prop onMenuClick, sửa lại tên biến cho phù hợp */}
//         <HeaderStudio onMenuClick={() => setIsOpen((p) => !p)} />
//       </div>

//       <div className="flex">
//         {/* SIDEBAR */}
//         <SidebarStudio isOpen={isOpen} user={user} onNavigate={() => navigate('/studio')} />

//         {/* MAIN CONTENT */}

//         {/* ==================== MAIN CONTENT (thay đổi theo route) ==================== */}
//         <main
//           className={`flex-1 transition-all h-screen overflow-auto duration-300 p-10 ${isOpen ? "ml-64" : "ml-20"
//             }`}
//         >
//           <div className="p-6 lg:p-10">
//             {/* ⚠️ TRUYỀN HÀM XỬ LÝ CHO CÁC ROUTE CON BẰNG context */}
//             <Outlet context={{
//               onSelectVideo: handleEditVideo, // Đây là hàm cần truyền vào VideoList
//               onUploadSuccess: handleUploadSuccess,
//               videos: videos, // Dữ liệu danh sách video (nếu VideoList cần)
//               loadingVideos: loadingVideos // Trạng thái loading (nếu VideoList cần)
//             }} />
//           </div>
//         </main>
//       </div>
//     </div>

//   );
// }



// import { Outlet } from "react-router";
// import HeaderStudio from "./components/HeaderStudio";
// import SidebarStudio from "./components/SidebarStudio";
// import VideoDetails from "@/pages/Studio/components/VideoDetails";
// import VideoList from "@/pages/Studio/components/VideoList";

// // Thêm useEffect để fetch dữ liệu khi mount
// import React, { useState, useEffect } from "react";
// import axios from 'axios';
// // ... (các imports khác)

// // API_BASE_URL phải được định nghĩa để dùng trong fetchVideos
// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/videos";

// // Bỏ mock data vì chúng ta sẽ fetch dữ liệu thực tế
// // const mockVideosData = [ ... ]; // BỎ KHỎI ĐÂY

// export default function StudioLayout() {
//   const [isOpen, setIsOpen] = useState(true);
//   const [selectedVideo, setSelectedVideo] = useState(null);

//   // 1. Quản lý danh sách videos TẠI StudioLayout
//   const [videos, setVideos] = useState([]); // Khởi tạo mảng rỗng
//   const [loadingVideos, setLoadingVideos] = useState(false); // Thêm state loading

//   const [isModalOpen, setIsModalOpen] = useState(false);



//   // Loại bỏ videoListRef vì chúng ta sẽ dùng State Lifting
//   // const videoListRef = useRef();

//   const user = {
//     name: "",
//     avatar: null,
//   };


//   // 2. Hàm Fetch Videos để tái sử dụng
//   const fetchVideos = async () => {
//     // Giả định bạn cần token để lấy danh sách video của người dùng
//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.warn("No token found, cannot fetch videos.");
//       return;
//     }

//     setLoadingVideos(true);
//     try {
//       // Giả định endpoint để lấy danh sách video của user là /api/videos/my-videos
//       const response = await axios.get(`${API_BASE_URL}/my-videos`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       // Cập nhật state videos, kích hoạt re-render VideoList
//       setVideos(response.data);
//     } catch (error) {
//       console.error("Lỗi khi tải danh sách video:", error);
//     } finally {
//       setLoadingVideos(false);
//     }
//   };

//   // 3. Tải video khi component mount lần đầu
//   useEffect(() => {
//     fetchVideos();
//   }, []); // [] đảm bảo chỉ chạy 1 lần khi mount

//   // 2. Hàm được truyền làm prop onSelectVideo
//   const handleSelectVideo = (videoData) => {
//     setSelectedVideo(videoData);
//   };

//   const handleCloseForm = () => {
//     setSelectedVideo(null); // Đóng form
//     // BỔ SUNG: Gọi lại fetchVideos trong VideoList để cập nhật danh sách
//   };

//   if (selectedVideo) {
//     // HIỂN THỊ FORM CHỈNH SỬA
//     return (
//       <VideoDetailsForm
//         video={selectedVideo} // Truyền dữ liệu chi tiết
//         onClose={handleCloseForm}
//       // Thêm các prop khác (ví dụ: onUpdateSuccess)
//       />
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       {/* HEADER */}
//       <div className="fixed top-0 left-0 right-0 z-50">
//         {/* Lỗi nhỏ trong prop onMenuClick, sửa lại tên biến cho phù hợp */}
//         <HeaderStudio onMenuClick={() => setIsOpen((p) => !p)} />
//       </div>

//       <div className="flex">
//         {/* SIDEBAR */}
//         <SidebarStudio isOpen={isOpen} user={user} onNavigate={() => setSelectedVideo(null)} />

//         {/* MAIN CONTENT */}

//         {/* ==================== MAIN CONTENT (thay đổi theo route) ==================== */}
//         <main
//           className={`flex-1 transition-all h-screen overflow-auto duration-300 p-10 ${isOpen ? "ml-64" : "ml-20"
//             }`}
//         >
//           <div className="p-6 lg:p-10">
//             {/* Ở ĐÂY SẼ HIỆN:
//                 - VideoList      (khi vào /studio)
//                 - VideoDetails   (khi vào /studio/upload hoặc /studio/edit/:id)
//                 - các trang khác trong tương lai
//             */}
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>

//   );
// }
