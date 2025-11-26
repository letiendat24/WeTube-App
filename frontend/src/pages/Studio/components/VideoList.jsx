// import React from 'react';
// import { Video, Clock, Eye, Lock, FileText, Globe, Play } from "lucide-react";
// import { Button } from "@/components/ui/button"; // Giả định dùng Button component

// // Dữ liệu giả lập (Mock Data)
// const mockVideos = [
//     {
//         id: 1,
//         title: "Hướng dẫn xây dựng ứng dụng React Router",
//         status: "public",
//         views: 1540,
//         date: "2025-11-20",
//         duration: "12:35",
//         thumbnail: "https://via.placeholder.com/320x180?text=Thumbnail+Video+1"
//     },
//     {
//         id: 2,
//         title: "Tối ưu hiệu suất cho Node.js API",
//         status: "private",
//         views: 200,
//         date: "2025-11-15",
//         duration: "08:10",
//         thumbnail: "https://via.placeholder.com/320x180?text=Thumbnail+Video+2"
//     },
//     {
//         id: 3,
//         title: "Giới thiệu về Tailwind CSS 4.0",
//         status: "unlisted",
//         views: 890,
//         date: "2025-11-01",
//         duration: "25:00",
//         thumbnail: "https://via.placeholder.com/320x180?text=Thumbnail+Video+3"
//     },
//     {
//         id: 4,
//         title: "Bản nháp Video mới tải lên",
//         status: "draft",
//         views: 0,
//         date: "2025-11-22",
//         duration: "00:00",
//         thumbnail: "https://via.placeholder.com/320x180?text=Draft+Video"
//     },
// ];

// // Hàm lấy Icon theo trạng thái
// const getStatusIcon = (status) => {
//     switch (status) {
//         case 'public':
//             return <Globe className="w-4 h-4 text-green-600 mr-1" />;
//         case 'private':
//             return <Lock className="w-4 h-4 text-red-600 mr-1" />;
//         case 'unlisted':
//             return <Clock className="w-4 h-4 text-yellow-600 mr-1" />;
//         case 'draft':
//             return <FileText className="w-4 h-4 text-gray-500 mr-1" />;
//         default:
//             return <FileText className="w-4 h-4 text-gray-500 mr-1" />;
//     }
// };

// export default function VideoList({ user }) {
//     // Trong thực tế, bạn sẽ dùng useState và useEffect để fetch (lấy) dữ liệu video từ API
//     const videos = mockVideos;

//     return (
//         <div className="p-6">
//             <h1 className="text-3xl font-bold mb-6 text-gray-800">
//                 <Video className="inline-block mr-3 w-7 h-7" /> Nội dung kênh của bạn
//             </h1>

//             <div className="bg-white shadow-lg rounded-xl overflow-hidden">
//                 {/* Header Bảng */}
//                 <div className="grid grid-cols-12 font-semibold text-sm text-gray-500 border-b p-4 bg-gray-50">
//                     <div className="col-span-4">Video</div>
//                     <div className="col-span-2">Ngày đăng</div>
//                     <div className="col-span-2 flex items-center">
//                         <Eye className="w-4 h-4 mr-1" /> Lượt xem
//                     </div>
//                     <div className="col-span-2">Trạng thái</div>
//                     <div className="col-span-2 text-right">Hành động</div>
//                 </div>

//                 {/* Danh sách Video */}
//                 {videos.length === 0 ? (
//                     <div className="p-10 text-center text-gray-500">
//                         Bạn chưa tải lên video nào.
//                     </div>
//                 ) : (
//                     videos.map((video) => (
//                         <div
//                             key={video.id}
//                             className="grid grid-cols-12 items-center border-b p-4 hover:bg-gray-50 transition-colors"
//                         >
//                             {/* Cột 1: Video Info */}
//                             <div className="col-span-4 flex items-center gap-3">
//                                 <div className="relative w-32 h-18 flex-shrink-0 rounded overflow-hidden">
//                                     <img
//                                         src={video.thumbnail}
//                                         alt={video.title}
//                                         className="w-full h-full object-cover"
//                                     />
//                                     <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
//                                         {video.duration}
//                                     </span>
//                                 </div>
//                                 <div>
//                                     <p className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 cursor-pointer">
//                                         {video.title}
//                                     </p>
//                                     <p className="text-xs text-gray-500 mt-1">
//                                         ID: {video.id}
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* Cột 2: Ngày đăng */}
//                             <div className="col-span-2 text-sm text-gray-600">
//                                 {new Date(video.date).toLocaleDateString('vi-VN')}
//                             </div>

//                             {/* Cột 3: Lượt xem */}
//                             <div className="col-span-2 text-sm font-medium text-gray-800">
//                                 {video.views.toLocaleString('en-US')}
//                             </div>

//                             {/* Cột 4: Trạng thái */}
//                             <div className="col-span-2 text-sm">
//                                 <span
//                                     className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
//                                         ${video.status === 'public' ? 'bg-green-100 text-green-800' :
//                                             video.status === 'private' ? 'bg-red-100 text-red-800' :
//                                                 video.status === 'unlisted' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`
//                                     }
//                                 >
//                                     {getStatusIcon(video.status)}
//                                     {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
//                                 </span>
//                             </div>

//                             {/* Cột 5: Hành động */}
//                             <div className="col-span-2 flex justify-end gap-2">
//                                 <Button variant="outline" size="icon" title="Xem trước">
//                                     <Play className="w-4 h-4" />
//                                 </Button>
//                                 <Button variant="outline" size="sm" title="Chỉnh sửa">
//                                     Sửa
//                                 </Button>
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>

//         </div>
//     );
// }

import React from 'react';
// Thêm Edit3, Trash2
import { Video, Clock, Eye, Lock, FileText, Globe, Play, Edit3, Trash2 } from "lucide-react";
// ✅ Giữ lại Button nếu bạn dùng nó trong cột Actions
import { Button } from "@/components/ui/button";

// Hàm lấy Icon theo trạng thái (Giữ nguyên)
const getStatusIcon = (status) => {
    switch (status) {
        case 'public':
            return <Globe className="w-4 h-4 text-green-600 mr-1" />;
        case 'private':
            return <Lock className="w-4 h-4 text-red-600 mr-1" />;
        case 'unlisted':
            return <Clock className="w-4 h-4 text-yellow-600 mr-1" />;
        case 'draft':
            return <FileText className="w-4 h-4 text-gray-500 mr-1" />;
        default:
            return <FileText className="w-4 h-4 text-gray-500 mr-1" />;
    }
};

// ✅ NHẬN PROPS CHO CHỨC NĂNG SỬA VÀ XÓA
export default function VideoList({ user, videos, onSelectVideo, onDeleteVideo }) {

    // 1. HANDLER CHO NÚT SỬA (Chuyển sang VideoDetails)
    const handleEdit = (video) => {
        if (onSelectVideo) {
            onSelectVideo(video);
        }
    };

    // 2. HANDLER CHO NÚT XÓA (Kích hoạt API DELETE)
    const handleDelete = (videoId) => {
        if (onDeleteVideo) {
            onDeleteVideo(videoId);
        }
    };

    if (!videos || videos.length === 0) {
        return (
            <div className="p-10 text-center text-gray-500">
                <Video className="w-8 h-8 mx-auto mb-3" />
                <p>Bạn chưa tải lên video nào.</p>
                <p className='text-xs mt-2'>Hãy nhấn "Tạo" trên thanh header để bắt đầu!</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                <Video className="inline-block mr-3 w-7 h-7" /> Nội dung kênh của bạn
            </h1>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full"> {/* Đảm bảo đủ rộng cho nhiều cột */}
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-[30%]">Video</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ngày đăng</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Views</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Likes</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Comments</th>
                                {/* ✅ CỘT THAO TÁC */}
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-28">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videos.map((video) => (
                                <tr key={video.id} className="border-b hover:bg-gray-50 transition">

                                    {/* Cột 1: Video Info (Title, Thumb, Duration) */}
                                    <td className="px-4 py-3">
                                        <div className="flex gap-3 items-center">
                                            <div className="relative w-24 h-14 flex-shrink-0 rounded overflow-hidden">
                                                <img
                                                    src={video.thumbnail || "https://placehold.co/96x56/cccccc/333333?text=Thumb"}
                                                    alt={video.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <span className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-1 rounded-tl">
                                                    {video.duration || '00:00'}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate hover:text-blue-600 cursor-pointer">{video.title}</p>
                                                <p className="text-xs text-gray-500 mt-1">ID: {video.id}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Cột 2: Ngày đăng */}
                                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                                        {new Date(video.date).toLocaleDateString('vi-VN')}
                                    </td>

                                    {/* Cột 3: Trạng thái */}
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                                                ${video.status === 'public' ? 'bg-green-100 text-green-800' :
                                                    video.status === 'private' ? 'bg-red-100 text-red-800' :
                                                        video.status === 'unlisted' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`
                                            }
                                        >
                                            {getStatusIcon(video.status)}
                                            {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                                        </span>
                                    </td>

                                    {/* Cột 4-6: Thống kê */}
                                    <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">{video.views || 0}</td>
                                    <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">{video.likes || 0}</td>
                                    <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">{video.comments || 0}</td>

                                    {/* ✅ CỘT THAO TÁC (ACTIONS) */}
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleEdit(video)}
                                                title="Chỉnh sửa video"
                                                className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(video.id)}
                                                title="Xóa vĩnh viễn"
                                                className="p-2 rounded-full text-red-600 hover:bg-red-100 transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}