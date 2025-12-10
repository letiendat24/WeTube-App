
import React, { useState, useEffect } from "react";
import { Video, Globe, Lock, Clock, FileText, Edit3, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/videos";

const getStatusIcon = (status) => {
    switch (status) {
        case 'public': return <Globe className="w-4 h-4 text-black-600 mr-1" />;
        case 'private': return <Lock className="w-4 h-4 text-black-600 mr-1" />;
        case 'unlisted': return <Clock className="w-4 h-4 text-black-600 mr-1" />;
        default: return <FileText className="w-4 h-4 text-gray-500 mr-1" />;
    }
};

export default function VideoList({ onSelectVideo }) {
    const { user, isAuthenticated } = useAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // GỌI API LẤY VIDEO CỦA USER HIỆN TẠI
    const fetchVideos = async () => {
        if (!isAuthenticated || !user) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_BASE}/studio`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setVideos(response.data.videos || response.data);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách video:", err);
            setError(err.response?.data?.message || "Không thể tải danh sách video");
        } finally {
            setLoading(false);
        }
    };

    // GỌI LẠI KHI ĐĂNG NHẬP HOẶC UPLOAD/XÓA VIDEO
    useEffect(() => {
        fetchVideos();
    }, [isAuthenticated, user]);

    // XÓA VIDEO THẬT QUA API
    const handleDelete = async (videoId) => {
        if (!confirm("Bạn có chắc chắn muốn xóa video này? Hành động này không thể hoàn tác!")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_BASE}/${videoId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // ĐIỂM SỬA/XÁC MINH: Đảm bảo loại bỏ đúng video
            setVideos(prev => prev.filter(v => v._id !== videoId));
            // Nếu API của bạn luôn trả về _id, đây là cách đơn giản nhất.
            // Hoặc dùng:
            // setVideos(prev => prev.filter(v => !(v._id === videoId || v.id === videoId)));

            alert("Xóa video thành công!");

            // **NẾU VẤN ĐỀ VẪN XẢY RA, HÃY GỌI HÀM NÀY**
            // setTimeout(() => fetchVideos(), 100); 
            // (Đây chỉ là giải pháp tạm thời nếu State vẫn lỗi, không phải giải pháp tối ưu)

        } catch (err) {
            alert("Xóa thất bại: " + (err.response?.data?.message || err.message));
        }
    };

    // SỬA VIDEO → CHUYỂN QUA MODAL VIDEO DETAILS
    const handleEdit = (video) => {
        if (onSelectVideo) {
            onSelectVideo(video); // Mở modal VideoDetails với dữ liệu video
        }
    };

    // TRƯỜNG HỢP CHƯA ĐĂNG NHẬP
    if (!isAuthenticated) {
        return (
            <div className="p-10 text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                <p className="text-lg font-medium text-gray-700">Bạn cần đăng nhập để xem video của mình</p>
                <Button className="mt-4" onClick={() => window.location.href = "/login"}>
                    Đăng nhập ngay
                </Button>
            </div>
        );
    }

    // LOADING
    if (loading) {
        return (
            <div className="p-10 text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Đang tải video của bạn...</p>
            </div>
        );
    }

    // LỖI
    if (error) {
        return (
            <div className="p-10 text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                <p className="text-lg font-medium text-red-600">{error}</p>
                <Button onClick={fetchVideos} className="mt-4">Thử lại</Button>
            </div>
        );
    }

    // KHÔNG CÓ VIDEO
    if (!videos || videos.length === 0) {
        return (
            <div className="p-10 text-center text-gray-500">
                <Video className="w-20 h-20 mx-auto mb-4 opacity-50" />
                <p className="text-xl font-medium">Bạn chưa tải lên video nào</p>
                <p className="text-sm mt-2">Hãy nhấn nút <strong>"Tạo"</strong> ở góc trên để bắt đầu!</p>
            </div>
        );
    }

    // HIỂN THỊ DANH SÁCH VIDEO
    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <Video className="w-8 h-8 text-black-600" />
                Nội dung kênh của bạn
            </h1>

            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b-2 border-gray-200">
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Video</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Ngày đăng</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Trạng thái</th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Views</th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Likes</th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Dislikes</th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Bình luận</th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videos.map((video) => (
                                <tr key={video._id || video.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-32 h-20 rounded-lg overflow-hidden shadow-md">
                                                <img
                                                    src={video.thumbnailUrl || video.thumbnail || "https://placehold.co/128x80"}
                                                    alt={video.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                {video.duration && (
                                                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                                        {video.duration}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 line-clamp-2">{video.title}</p>
                                                <p className="text-xs text-gray-500 mt-1">ID: {video._id || video.id}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(video.createdAt || video.date).toLocaleDateString('vi-VN')}
                                    </td>

                                    <td className="px-6 py-4 text-left">
                                        <span className={`inline-flex items-center py-1 rounded-full text-xs text-gray-600 
                                            ${video.visibility === 'public' ? 'bg-black-100 text-black-800' :
                                                video.visibility === 'private' ? 'bg-black-100 text-black-800' :
                                                    'bg-black-100 text-black-800'}`}>
                                            {getStatusIcon(video.visibility)}
                                            {video.visibility === 'public' ? 'Công khai' :
                                                video.visibility === 'private' ? 'Riêng tư' : 'Không công khai'}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-center text-sm text-gray-600">{video.views || 0}</td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-600">{video.likes?.length || 0}</td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-600">{video.dislikes?.length || 0}</td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-600">{video.comments?.length || 0}</td>

                                    <td className="px-6 py-4 text-center text-gray-600">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => onSelectVideo(video)}
                                                className="p-2 rounded-lg hover:bg-blue-100 text-black-600 transition"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit3 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(video._id || video.id)}
                                                className="p-2 rounded-lg hover:bg-red-100 text-black-600 transition"
                                                title="Xóa video"
                                            >
                                                <Trash2 className="w-5 h-5" />
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





// import React, { useState, useEffect } from "react";
// import { Video, Globe, Lock, Clock, FileText, Edit3, Trash2, AlertCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/context/AuthContext";
// import axios from "axios";

// // Đảm bảo API_BASE trỏ đến root của API, không phải '/api/videos'
// // Ví dụ: http://localhost:3000/api
// const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
// const VIDEO_API_BASE = `${API_ROOT}/videos`; // Endpoint cho video: /api/videos/studio hoặc /api/videos/:id

// const getStatusIcon = (status) => {
//     switch (status) {
//         case 'public': return <Globe className="w-4 h-4 text-black-600 mr-1" />;
//         case 'private': return <Lock className="w-4 h-4 text-black-600 mr-1" />;
//         case 'unlisted': return <Clock className="w-4 h-4 text-black-600 mr-1" />;
//         default: return <FileText className="w-4 h-4 text-gray-500 mr-1" />;
//     }
// };

// export default function VideoList({ onSelectVideo }) {
//     const { user, isAuthenticated } = useAuth();
//     const [videos, setVideos] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [editingId, setEditingId] = useState(null); // Trạng thái để hiển thị loading cho nút Sửa

//     // GỌI API LẤY VIDEO CỦA USER HIỆN TẠI
//     const fetchVideos = async () => {
//         if (!isAuthenticated || !user) {
//             setLoading(false);
//             return;
//         }
//         try {
//             setLoading(true);
//             setError("");
//             const token = localStorage.getItem("token");
//             // SỬA: Dùng VIDEO_API_BASE
//             const response = await axios.get(`${VIDEO_API_BASE}/studio`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             // Giả sử API trả về mảng video trực tiếp hoặc trong trường 'videos'
//             setVideos(response.data.videos || response.data);
//         } catch (err) {
//             console.error("Lỗi khi lấy danh sách video:", err);
//             setError(err.response?.data?.message || "Không thể tải danh sách video");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchVideos();
//     }, [isAuthenticated, user]);

//     // XÓA VIDEO THẬT QUA API
//     const handleDelete = async (videoId) => {
//         if (!confirm("Bạn có chắc chắn muốn xóa video này? Hành động này không thể hoàn tác!")) return;
//         try {
//             const token = localStorage.getItem("token");
//             // SỬA: Dùng VIDEO_API_BASE
//             await axios.delete(`${VIDEO_API_BASE}/${videoId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setVideos(prev => prev.filter(v => v._id !== videoId && v.id !== videoId));
//             alert("Xóa video thành công!");
//         } catch (err) {
//             alert("Xóa thất bại: " + (err.response?.data?.message || err.message));
//         }
//     };

//     // HÀM MỚI: GỌI API ĐỂ LẤY CHI TIẾT CỦA MỘT VIDEO CỤ THỂ
//     const fetchVideoDetails = async (videoId) => {
//         try {
//             setEditingId(videoId); // Bắt đầu loading cho nút Sửa
//             const token = localStorage.getItem("token");
//             const response = await axios.get(`${VIDEO_API_BASE}/${videoId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setEditingId(null); // Kết thúc loading
//             return response.data; // Trả về chi tiết video
//         } catch (err) {
//             setEditingId(null); // Kết thúc loading ngay cả khi có lỗi
//             console.error("Lỗi khi lấy chi tiết video:", err);
//             alert("Không thể tải chi tiết video: " + (err.response?.data?.message || err.message));
//             return null;
//         }
//     };

//     // CHỨC NĂNG SỬA: Lấy chi tiết mới nhất trước khi CHUYỂN TRANG
//     const handleEdit = async (video) => {
//         const videoId = video._id || video.id;

//         if (!onSelectVideo) {
//             console.error("Lỗi: Prop onSelectVideo không được cung cấp.");
//             alert("Lỗi cấu hình: Không thể điều hướng.");
//             return;
//         }

//         // 1. Bắt đầu loading cho nút này
//         setEditingId(videoId);

//         try {
//             // 2. Gọi API lấy chi tiết video để đảm bảo data mới nhất
//             const detailedVideo = await fetchVideoDetails(videoId);

//             // 3. Nếu lấy chi tiết thành công, chuyển video chi tiết sang component cha
//             if (detailedVideo) {
//                 // CHỈ GỌI onSelectVideo VỚI ID (hoặc dữ liệu nếu cần)
//                 // Component cha sẽ dùng ID này để điều hướng
//                 onSelectVideo(detailedVideo);
//             } else {
//                 alert("Không thể tải chi tiết video. Vui lòng thử lại.");
//             }
//         } catch (error) {
//             alert("Đã xảy ra lỗi không mong muốn khi chỉnh sửa.");
//             console.error("Lỗi trong handleEdit:", error);
//         } finally {
//             // 4. Luôn luôn tắt trạng thái loading
//             setEditingId(null);
//         }
//     };

//     // TRƯỜNG HỢP CHƯA ĐĂNG NHẬP (Không đổi)
//     if (!isAuthenticated) {
//         return (
//             <div className="p-10 text-center">
//                 <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
//                 <p className="text-lg font-medium text-gray-700">Bạn cần đăng nhập để xem video của mình</p>
//                 <Button className="mt-4" onClick={() => window.location.href = "/login"}>
//                     Đăng nhập ngay
//                 </Button>
//             </div>
//         );
//     }

//     // LOADING (Không đổi)
//     if (loading) {
//         return (
//             <div className="p-10 text-center">
//                 <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
//                 <p className="mt-4 text-gray-600">Đang tải video của bạn...</p>
//             </div>
//         );
//     }

//     // LỖI (Không đổi)
//     if (error) {
//         return (
//             <div className="p-10 text-center">
//                 <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
//                 <p className="text-lg font-medium text-red-600">{error}</p>
//                 <Button onClick={fetchVideos} className="mt-4">Thử lại</Button>
//             </div>
//         );
//     }

//     // KHÔNG CÓ VIDEO (Không đổi)
//     if (!videos || videos.length === 0) {
//         return (
//             <div className="p-10 text-center text-gray-500">
//                 <Video className="w-20 h-20 mx-auto mb-4 opacity-50" />
//                 <p className="text-xl font-medium">Bạn chưa tải lên video nào</p>
//                 <p className="text-sm mt-2">Hãy nhấn nút <strong>"Tạo"</strong> ở góc trên để bắt đầu!</p>
//             </div>
//         );
//     }

//     // HIỂN THỊ DANH SÁCH VIDEO
//     return (
//         <div className="p-10">
//             <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3">
//                 <Video className="w-8 h-8 text-black-600" />
//                 Nội dung kênh của bạn
//             </h1>
//             <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="w-full">
//                         <thead>
//                             <tr className="bg-gray-50 border-b-2 border-gray-200">
//                                 <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Video</th>
//                                 <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Ngày đăng</th>
//                                 <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Trạng thái</th>
//                                 <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Views</th>
//                                 <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Likes</th>
//                                 <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Dislikes</th>
//                                 <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Bình luận</th>
//                                 <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Thao tác</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {videos.map((video) => {
//                                 const videoId = video._id || video.id;
//                                 const isEditing = editingId === videoId;

//                                 return (
//                                     <tr key={videoId} className="hover:bg-gray-50 transition">
//                                         {/* Phần thông tin video (Không đổi) */}
//                                         <td className="px-6 py-4">
//                                             <div className="flex items-center gap-4">
//                                                 <div className="relative w-32 h-20 rounded-lg overflow-hidden shadow-md">
//                                                     <img
//                                                         src={video.thumbnailUrl || video.thumbnail || "https://placehold.co/128x80"}
//                                                         alt={video.title}
//                                                         className="w-full h-full object-cover"
//                                                     />
//                                                     {video.duration && (
//                                                         <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-2 py-1 rounded">
//                                                             {video.duration}
//                                                         </span>
//                                                     )}
//                                                 </div>
//                                                 <div>
//                                                     <p className="font-medium text-gray-900 line-clamp-2">{video.title}</p>
//                                                     <p className="text-xs text-gray-500 mt-1">ID: {videoId}</p>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                         <td className="px-6 py-4 text-sm text-gray-600">
//                                             {new Date(video.createdAt || video.date).toLocaleDateString('vi-VN')}
//                                         </td>
//                                         <td className="px-6 py-4 text-left">
//                                             <span className={`inline-flex items-center py-1 rounded-full text-xs text-gray-600
//                                                 ${video.visibility === 'public' ? 'bg-black-100 text-black-800' :
//                                                     video.visibility === 'private' ? 'bg-black-100 text-black-800' :
//                                                         'bg-black-100 text-black-800'}`}>
//                                                 {getStatusIcon(video.visibility)}
//                                                 {video.visibility === 'public' ? 'Công khai' :
//                                                     video.visibility === 'private' ? 'Riêng tư' : 'Không công khai'}
//                                             </span>
//                                         </td>
//                                         <td className="px-6 py-4 text-center text-sm text-gray-600">{video.views || 0}</td>
//                                         <td className="px-6 py-4 text-center text-sm text-gray-600">{video.likes?.length || 0}</td>
//                                         <td className="px-6 py-4 text-center text-sm text-gray-600">{video.dislikes?.length || 0}</td>
//                                         <td className="px-6 py-4 text-center text-sm text-gray-600">{video.comments?.length || 0}</td>

//                                         {/* Phần Thao tác (ĐÃ SỬA ĐỔI) */}
//                                         <td className="px-6 py-4 text-center text-gray-600">
//                                             <div className="flex justify-center gap-3">
//                                                 <button
//                                                     onClick={() => handleEdit(video)}
//                                                     className="p-2 rounded-lg hover:bg-blue-100 text-black-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                                                     title="Chỉnh sửa"
//                                                     disabled={isEditing}
//                                                 >
//                                                     {isEditing ? (
//                                                         <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
//                                                     ) : (
//                                                         <Edit3 className="w-5 h-5" />
//                                                     )}
//                                                 </button>
//                                                 <button
//                                                     onClick={() => handleDelete(videoId)}
//                                                     className="p-2 rounded-lg hover:bg-red-100 text-black-600 transition"
//                                                     title="Xóa video"
//                                                 >
//                                                     <Trash2 className="w-5 h-5" />
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// }



// import React, { useState, useEffect } from "react";
// import { Video, Globe, Lock, Clock, FileText, Edit3, Trash2, AlertCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/context/AuthContext";
// import axios from "axios";

// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/videos";

// const getStatusIcon = (status) => {
//     switch (status) {
//         case 'public': return <Globe className="w-4 h-4 text-black-600 mr-1" />;
//         case 'private': return <Lock className="w-4 h-4 text-black-600 mr-1" />;
//         case 'unlisted': return <Clock className="w-4 h-4 text-black-600 mr-1" />;
//         default: return <FileText className="w-4 h-4 text-gray-500 mr-1" />;
//     }
// };

// export default function VideoList({ onSelectVideo }) {
//     const { user, isAuthenticated } = useAuth();
//     const [videos, setVideos] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     const [editingId, setEditingId] = useState(null);

//     // GỌI API LẤY VIDEO CỦA USER HIỆN TẠI
//     const fetchVideos = async () => {
//         if (!isAuthenticated || !user) {
//             setLoading(false);
//             return;
//         }

//         try {
//             setLoading(true);
//             setError("");

//             const token = localStorage.getItem("token");
//             const response = await axios.get(`${API_BASE}/studio`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });

//             setVideos(response.data.videos || response.data);
//         } catch (err) {
//             console.error("Lỗi khi lấy danh sách video:", err);
//             setError(err.response?.data?.message || "Không thể tải danh sách video");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchVideoDetails = async (videoId) => {
//         try {
//             const token = localStorage.getItem("token");
//             const response = await axios.get(`${API_BASE}/${videoId}`, { // Gọi GET /api/videos/:id
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             // Giả sử API trả về đối tượng video ở root (response.data)
//             return response.data;
//         } catch (err) {
//             console.error("Lỗi khi lấy chi tiết video:", err);
//             alert("Không thể tải chi tiết video: " + (err.response?.data?.message || err.message));
//             return null;
//         }
//     };

//     const handleEdit = async (video) => {
//         const videoId = video._id || video.id;

//         if (!onSelectVideo) return; // Bảo vệ hàm onSelectVideo

//         // 1. Bắt đầu loading cho nút này
//         setEditingId(videoId);

//         try {
//             // 2. Gọi API lấy chi tiết video để đảm bảo data mới nhất
//             const detailedVideo = await fetchVideoDetails(videoId);

//             // 3. Nếu lấy chi tiết thành công, truyền dữ liệu chi tiết sang component cha
//             if (detailedVideo) {
//                 onSelectVideo(detailedVideo);
//             }
//         } catch (error) {
//             // Lỗi đã được xử lý trong fetchVideoDetails
//         } finally {
//             // 4. Luôn luôn tắt trạng thái loading
//             setEditingId(null);
//         }
//     };

//     // GỌI LẠI KHI ĐĂNG NHẬP HOẶC UPLOAD/XÓA VIDEO
//     useEffect(() => {
//         fetchVideos();
//     }, [isAuthenticated, user]);

//     // XÓA VIDEO THẬT QUA API
//     const handleDelete = async (videoId) => {
//         if (!confirm("Bạn có chắc chắn muốn xóa video này? Hành động này không thể hoàn tác!")) return;

//         try {
//             const token = localStorage.getItem("token");
//             await axios.delete(`${API_BASE}/${videoId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             // ĐIỂM SỬA/XÁC MINH: Đảm bảo loại bỏ đúng video
//             setVideos(prev => prev.filter(v => v._id !== videoId));
//             // Nếu API của bạn luôn trả về _id, đây là cách đơn giản nhất.
//             // Hoặc dùng:
//             // setVideos(prev => prev.filter(v => !(v._id === videoId || v.id === videoId)));

//             alert("Xóa video thành công!");

//             // **NẾU VẤN ĐỀ VẪN XẢY RA, HÃY GỌI HÀM NÀY**
//             // setTimeout(() => fetchVideos(), 100);
//             // (Đây chỉ là giải pháp tạm thời nếu State vẫn lỗi, không phải giải pháp tối ưu)

//         } catch (err) {
//             alert("Xóa thất bại: " + (err.response?.data?.message || err.message));
//         }
//     };



//     // TRƯỜNG HỢP CHƯA ĐĂNG NHẬP
//     if (!isAuthenticated) {
//         return (
//             <div className="p-10 text-center">
//                 <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
//                 <p className="text-lg font-medium text-gray-700">Bạn cần đăng nhập để xem video của mình</p>
//                 <Button className="mt-4" onClick={() => window.location.href = "/login"}>
//                     Đăng nhập ngay
//                 </Button>
//             </div>
//         );
//     }

//     // LOADING
//     if (loading) {
//         return (
//             <div className="p-10 text-center">
//                 <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
//                 <p className="mt-4 text-gray-600">Đang tải video của bạn...</p>
//             </div>
//         );
//     }

//     // LỖI
//     if (error) {
//         return (
//             <div className="p-10 text-center">
//                 <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
//                 <p className="text-lg font-medium text-red-600">{error}</p>
//                 <Button onClick={fetchVideos} className="mt-4">Thử lại</Button>
//             </div>
//         );
//     }

//     // KHÔNG CÓ VIDEO
//     if (!videos || videos.length === 0) {
//         return (
//             <div className="p-10 text-center text-gray-500">
//                 <Video className="w-20 h-20 mx-auto mb-4 opacity-50" />
//                 <p className="text-xl font-medium">Bạn chưa tải lên video nào</p>
//                 <p className="text-sm mt-2">Hãy nhấn nút <strong>"Tạo"</strong> ở góc trên để bắt đầu!</p>
//             </div>
//         );
//     }

//     // HIỂN THỊ DANH SÁCH VIDEO
//     return (
//         <div className="p-10">
//             <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3">
//                 <Video className="w-8 h-8 text-black-600" />
//                 Nội dung kênh của bạn
//             </h1>

//             <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="w-full">
//                         <thead>
//                             <tr className="bg-gray-50 border-b-2 border-gray-200">
//                                 <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Video</th>
//                                 <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Ngày đăng</th>
//                                 <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Trạng thái</th>
//                                 <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Views</th>
//                                 <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Likes</th>
//                                 <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Bình luận</th>
//                                 <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Thao tác</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {videos.map((video) => (
//                                 <tr key={video._id || video.id} className="hover:bg-gray-50 transition">
//                                     <td className="px-6 py-4">
//                                         <div className="flex items-center gap-4">
//                                             <div className="relative w-32 h-20 rounded-lg overflow-hidden shadow-md">
//                                                 <img
//                                                     src={video.thumbnailUrl || video.thumbnail || "https://placehold.co/128x80"}
//                                                     alt={video.title}
//                                                     className="w-full h-full object-cover"
//                                                 />
//                                                 {video.duration && (
//                                                     <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-2 py-1 rounded">
//                                                         {video.duration}
//                                                     </span>
//                                                 )}
//                                             </div>
//                                             <div>
//                                                 <p className="font-medium text-gray-900 line-clamp-2">{video.title}</p>
//                                                 <p className="text-xs text-gray-500 mt-1">ID: {video._id || video.id}</p>
//                                             </div>
//                                         </div>
//                                     </td>

//                                     <td className="px-6 py-4 text-sm text-gray-600">
//                                         {new Date(video.createdAt || video.date).toLocaleDateString('vi-VN')}
//                                     </td>

//                                     <td className="px-6 py-4 text-left">
//                                         <span className={`inline-flex items-center py-1 rounded-full text-xs text-gray-600
//                                             ${video.visibility === 'public' ? 'bg-black-100 text-black-800' :
//                                                 video.visibility === 'private' ? 'bg-black-100 text-black-800' :
//                                                     'bg-black-100 text-black-800'}`}>
//                                             {getStatusIcon(video.visibility)}
//                                             {video.visibility === 'public' ? 'Công khai' :
//                                                 video.visibility === 'private' ? 'Riêng tư' : 'Không công khai'}
//                                         </span>
//                                     </td>

//                                     <td className="px-6 py-4 text-center text-sm text-gray-600">{video.views || 0}</td>
//                                     <td className="px-6 py-4 text-center text-sm text-gray-600">{video.likes?.length || 0}</td>
//                                     <td className="px-6 py-4 text-center text-sm text-gray-600">{video.comments?.length || 0}</td>

//                                     <td className="px-6 py-4 text-center text-gray-600">
//                                         <div className="flex justify-center gap-3">
//                                             <button
//                                                 onClick={() => handleEdit(video)} // GỌI HÀM SỬA MỚI
//                                                 className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                                                 title="Chỉnh sửa"
//                                                 disabled={isEditing} // Vô hiệu hóa khi đang loading
//                                             >
//                                                 {/* ✨ HIỂN THỊ LOADING HOẶC ICON SỬA */}
//                                                 {isEditing ? (
//                                                     <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
//                                                 ) : (
//                                                     <Edit3 className="w-5 h-5" />
//                                                 )}
//                                             </button>
//                                             <button
//                                                 onClick={() => handleDelete(video._id || video.id)}
//                                                 className="p-2 rounded-lg hover:bg-red-100 text-black-600 transition"
//                                                 title="Xóa video"
//                                             >
//                                                 <Trash2 className="w-5 h-5" />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// }