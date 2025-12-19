

// import React, { useState, useEffect } from "react";
import { Video, Globe, Lock, Clock, FileText, Edit3, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
// [NEW] Import useOutletContext
import { useOutletContext } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/videos";

const getStatusIcon = (status) => {
    switch (status) {
        case 'public': return <Globe className="w-4 h-4 mr-1 text-black-600" />;
        case 'private': return <Lock className="w-4 h-4 mr-1 text-black-600" />;
        case 'unlisted': return <Clock className="w-4 h-4 mr-1 text-black-600" />;
        default: return <FileText className="w-4 h-4 mr-1 text-gray-500" />;
    }
};

export default function VideoList() {
    const { user, isAuthenticated } = useAuth();

    // 1. LẤY DỮ LIỆU VÀ CÁC HÀM TỪ OUTLET CONTEXT
    // Đây là cách duy nhất để component này nhận dữ liệu từ StudioLayout
    const {
        videos,
        loading,
        error,
        onSelectVideo: handleEdit, // Hàm mở modal Edit/View từ StudioLayout
        fetchVideos // Hàm fetch/refresh danh sách từ StudioLayout
        // Lưu ý: Nếu StudioLayout truyền handleDelete, ta sẽ dùng nó. 
        // Nếu không, ta định nghĩa ở đây và dùng fetchVideos để cập nhật.
    } = useOutletContext();

    // 2. ĐỊNH NGHĨA HÀM DELETE (Sử dụng fetchVideos từ context để cập nhật UI)
    const handleDelete = async (videoId) => {
        if (!confirm("Bạn có chắc chắn muốn xóa video này? Hành động này không thể hoàn tác!")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_BASE}/${videoId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Xóa video thành công!");

            // ✅ GỌI HÀM FETCH TỪ CONTEXT để tải lại danh sách sau khi xóa
            fetchVideos();

        } catch (err) {
            alert("Xóa thất bại: " + (err.response?.data?.message || err.message));
        }
    };

    // TRƯỜNG HỢP CHƯA ĐĂNG NHẬP (Giữ nguyên)
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

    // LOADING (Lấy từ context)
    if (loading) {
        return (
            <div className="p-10 text-center">
                <div className="inline-block w-10 h-10 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Đang tải video của bạn...</p>
            </div>
        );
    }

    // LỖI (Lấy từ context)
    if (error) {
        return (
            <div className="p-10 text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                <p className="text-lg font-medium text-red-600">{error}</p>
                <Button onClick={fetchVideos} className="mt-4">Thử lại</Button>
            </div>
        );
    }

    // KHÔNG CÓ VIDEO (Lấy từ context)
    if (!videos || videos.length === 0) {
        return (
            <div className="p-10 text-center text-gray-500">
                <Video className="w-20 h-20 mx-auto mb-4 opacity-50" />
                <p className="text-xl font-medium">Bạn chưa tải lên video nào</p>
                <p className="mt-2 text-sm">Hãy nhấn nút <strong>"Tạo"</strong> ở góc trên để bắt đầu!</p>
            </div>
        );
    }

    // HIỂN THỊ DANH SÁCH VIDEO
    return (
        <div className="p-5">
            <h1 className="flex items-center gap-3 mb-6 text-3xl font-bold text-gray-800">
                <Video className="w-8 h-8 text-black-600" />
                Nội dung kênh của bạn
            </h1>

            <div className="overflow-hidden bg-white shadow-xl rounded-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200 bg-gray-50">
                                <th className="px-6 py-4 text-sm font-bold text-left text-gray-700">Video</th>
                                <th className="px-6 py-4 text-sm font-bold text-left text-gray-700">Ngày đăng</th>
                                <th className="px-6 py-4 text-sm font-bold text-left text-gray-700">Trạng thái</th>
                                <th className="px-6 py-4 text-sm font-bold text-center text-gray-700">Views</th>
                                <th className="px-6 py-4 text-sm font-bold text-center text-gray-700">Likes</th>
                                <th className="px-6 py-4 text-sm font-bold text-center text-gray-700">Dislikes</th>
                                <th className="px-6 py-4 text-sm font-bold text-center text-gray-700">Bình luận</th>
                                <th className="px-6 py-4 text-sm font-bold text-center text-gray-700">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videos.map((video) => (
                                <tr key={video._id || video.id} className="transition hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-32 h-20 overflow-hidden rounded-lg shadow-md">
                                                <img
                                                    src={video.thumbnailUrl || video.thumbnail || "https://placehold.co/128x80"}
                                                    alt={video.title}
                                                    className="object-cover w-full h-full"
                                                />
                                                {video.duration && (
                                                    <span className="absolute px-2 py-1 text-xs text-white rounded bottom-1 right-1 bg-black/80">
                                                        {video.duration}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 line-clamp-2">{video.title}</p>
                                                <p className="mt-1 text-xs text-gray-500">ID: {video._id || video.id}</p>
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

                                    <td className="px-6 py-4 text-sm text-center text-gray-600">{video.stats.views || 0}</td>
                                    <td className="px-6 py-4 text-sm text-center text-gray-600">{video.stats.likes || 0}</td>
                                    <td className="px-6 py-4 text-sm text-center text-gray-600">{video.stats.dislikes || 0}</td>
                                    <td className="px-6 py-4 text-sm text-center text-gray-600">{video.stats.comments || 0}</td>

                                    <td className="px-6 py-4 text-center text-gray-600">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                // ✅ [FIXED] Gọi hàm handleEdit từ context
                                                onClick={() => handleEdit(video)}
                                                className="p-2 transition rounded-lg hover:bg-blue-100 text-black-600"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit3 className="w-5 h-5" />
                                            </button>
                                            <button
                                                // ✅ [FIXED] Gọi hàm handleDelete mới
                                                onClick={() => handleDelete(video._id || video.id)}
                                                className="p-2 transition rounded-lg hover:bg-red-100 text-black-600"
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



