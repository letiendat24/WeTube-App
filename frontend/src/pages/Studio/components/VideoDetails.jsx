import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";


const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/videos";

// HELPER: Chuyển chuỗi tags (a, b, c) thành mảng ['a', 'b', 'c']
const processTags = (tagString) => {
    return tagString
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
};

export default function VideoDetails({ onClose, onActionSuccess, videoToEdit }) {
    const { user, isAuthenticated } = useAuth();


    const isEditMode = useMemo(() => !!videoToEdit, [videoToEdit]);

    // States cho Metadata
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [visibility, setVisibility] = useState("public");

    // States cho Files & Preview
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState("");
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [duration, setDuration] = useState("");

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, type: "", message: "" });

    const videoRef = useRef(null);
    const thumbRef = useRef(null);

    // ✨ [NEW] Ref để lưu trữ URL cục bộ để giải phóng (tránh rò rỉ bộ nhớ)
    const videoObjectURLRef = useRef(null);
    const thumbObjectURLRef = useRef(null);

    const showToast = useCallback((type, message) => {
        setToast({ show: true, type, message });
        setTimeout(() => setToast({ show: false }), 5000);
    }, []);

    // ✨ [NEW] HÀM RESET FORM HOÀN CHỈNH
    const resetForm = useCallback(() => {
        setTitle(""); setDescription(""); setTags(""); setVisibility("public");
        setVideoFile(null); setThumbnailFile(null);
        setVideoPreview(""); setThumbnailPreview(""); setDuration("");

        // Giải phóng bộ nhớ cục bộ
        if (videoObjectURLRef.current) URL.revokeObjectURL(videoObjectURLRef.current);
        if (thumbObjectURLRef.current) URL.revokeObjectURL(thumbObjectURLRef.current);
        videoObjectURLRef.current = null;
        thumbObjectURLRef.current = null;

        // Reset input file (để người dùng có thể chọn lại file cùng tên)
        if (videoRef.current) videoRef.current.value = "";
        if (thumbRef.current) thumbRef.current.value = "";
    }, []);


    // =========================================================
    // BƯỚC 3: ĐỔ DỮ LIỆU KHI EDIT (pre-fill) VÀ CLEANUP
    // =========================================================
    useEffect(() => {
        if (isEditMode && videoToEdit) {
            // ... (Logic Đổ dữ liệu giữ nguyên)
            setTitle(videoToEdit.title || "");
            setDescription(videoToEdit.description || "");
            const tagsString = Array.isArray(videoToEdit.tags) ? videoToEdit.tags.join(", ") : "";
            setTags(tagsString);
            setVisibility(videoToEdit.visibility || "public");

            //  ĐẶT URL SERVER CHO PREVIEW (Thêm timestamp để tránh cache)
            const serverThumbUrl = videoToEdit.thumbnailUrl || "";
            setVideoPreview(videoToEdit.videoUrl || "");
            setThumbnailPreview(`${serverThumbUrl}?t=${Date.now()}`); // Fix Caching Thumbnail
            setDuration(videoToEdit.duration || "");

            // Reset file inputs cho edit mode (chỉ dùng khi thay thế)
            setVideoFile(null); setThumbnailFile(null);
            if (videoRef.current) videoRef.current.value = "";
            if (thumbRef.current) thumbRef.current.value = "";

        } else if (!isEditMode) {
            resetForm(); // Reset cho chế độ upload mới
        }

        // CLEANUP: Giải phóng object URL khi component unmount
        return () => {
            if (videoObjectURLRef.current) URL.revokeObjectURL(videoObjectURLRef.current);
            if (thumbObjectURLRef.current) URL.revokeObjectURL(thumbObjectURLRef.current);
        };
    }, [isEditMode, videoToEdit, resetForm]);

    // =========================================================
    // XỬ LÝ FILE CHANGES (Cập nhật logic URL revoke)
    // =========================================================
    const handleVideoChange = (e) => {
        // Giải phóng URL cũ
        if (videoObjectURLRef.current) URL.revokeObjectURL(videoObjectURLRef.current);

        const file = e.target.files[0];
        if (!file) return;
        setVideoFile(file);

        const url = URL.createObjectURL(file);
        videoObjectURLRef.current = url; // Lưu URL mới để giải phóng sau
        setVideoPreview(url);

        // ... (Logic tính duration giữ nguyên)
        const video = document.createElement("video");
        video.src = url;
        video.onloadedmetadata = () => {
            const m = Math.floor(video.duration / 60);
            const s = Math.floor(video.duration % 60).toString().padStart(2, "0");
            setDuration(`${m}:${s}`);
        };
    };

    const handleThumbnailChange = (e) => {
        // Giải phóng URL cũ
        if (thumbObjectURLRef.current) URL.revokeObjectURL(thumbObjectURLRef.current);

        const file = e.target.files[0];
        if (!file) return;
        setThumbnailFile(file);

        const url = URL.createObjectURL(file);
        thumbObjectURLRef.current = url; // Lưu URL mới
        setThumbnailPreview(url);
    };

    // =========================================================
    // BƯỚC 5: GỌI API PATCH CHO CHỈNH SỬA
    // =========================================================
    const handleUpdate = async () => {
        if (!title.trim()) {
            showToast("error", "Vui lòng nhập tiêu đề video.");
            return;
        }
        setLoading(true);

        const tagArray = processTags(tags);
        const formData = new FormData();

        // Gửi Metadata
        formData.append("title", title.trim());
        formData.append("description", description.trim());
        // ✨ FIX LỖI TAGS: Gửi chuỗi ngăn cách bằng dấu phẩy, KHÔNG JSON.stringify
        formData.append("tags", tagArray.join(','));
        formData.append("visibility", visibility);

        // Chỉ gửi file nếu người dùng chọn file mới
        if (videoFile) formData.append("video", videoFile);
        if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

        try {
            const token = localStorage.getItem("token");
            const videoId = videoToEdit._id || videoToEdit.id;

            const response = await axios.patch(`${API_BASE}/${videoId}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const updatedVideo = response.data;

            // ✨ FIX LỖI CACHING THUMBNAIL: Cập nhật URL với timestamp mới
            // Cloudinary thường trả về URL đã được cập nhật
            const newThumbUrl = updatedVideo.thumbnailUrl || videoToEdit.thumbnailUrl;
            setThumbnailPreview(`${newThumbUrl}?t=${Date.now()}`);

            showToast("success", "Cập nhật video thành công!");

            onActionSuccess?.(); // Kích hoạt refresh danh sách

        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Cập nhật thất bại, vui lòng thử lại.";
            showToast("error", msg);
        } finally {
            setLoading(false);
        }
    };


    // =========================================================
    // BƯỚC 4: HÀM UPLOAD VIDEO (POST)
    // =========================================================
    const handleUpload = async () => {
        if (!isAuthenticated || !user) {
            showToast("error", "Bạn cần đăng nhập để upload video!");
            return;
        }
        if (!title.trim()) {
            showToast("error", "Vui lòng nhập tiêu đề video.");
            return;
        }

        setLoading(true);

        // ✨ KHAI BÁO VÀ KHỞI TẠO tagArray (Fix ReferenceError)
        const tagArray = processTags(tags);

        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("description", description.trim());
        // ✨ FIX LỖI TAGS: Gửi chuỗi ngăn cách bằng dấu phẩy
        formData.append("tags", tagArray.join(','));
        formData.append("visibility", visibility);
        formData.append("video", videoFile);
        formData.append("thumbnail", thumbnailFile);
        formData.append("userId", user._id || user.id);

        try {
            const token = localStorage.getItem("token");

            await axios.post(`${API_BASE}`, formData, {
                timeout: 600000,
                headers: { Authorization: `Bearer ${token}` }
            });

            showToast("success", "Tải video thành công!");

            // ✨ [YÊU CẦU] Xóa hết dữ liệu khi tạo video thành công
            resetForm();

            onActionSuccess?.(); // Kích hoạt refresh danh sách và đóng modal

        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Upload thất bại, vui lòng thử lại.";
            showToast("error", msg);
        } finally {
            setLoading(false);
        }
    };


    // =========================================================
    // BƯỚC 5: HÀM CHUNG XỬ LÝ SUBMIT (QUYẾT ĐỊNH LUỒNG)
    // =========================================================
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditMode) {
            handleUpdate();
        } else {
            // Kiểm tra file bắt buộc chỉ áp dụng cho chế độ Upload
            if (!videoFile || !thumbnailFile) {
                showToast("error", "Vui lòng chọn đủ File Video và Thumbnail.");
                return;
            }
            handleUpload();
        }
    };

    return (
        <div className="max-w-5xl p-2 mx-auto bg-white">
            {/* ... Toast ... */}
            {toast.show && (
                <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl text-white shadow-2xl animate-slide-in ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
                    {toast.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span className="font-medium">{toast.message}</span>
                    <button onClick={() => setToast({ ...toast, show: false })} className="ml-4">
                        <X size={18} />
                    </button>
                </div>
            )}


            {/* 💡 [FIXED] BỌC TOÀN BỘ NỘI DUNG FORM */}
            <form onSubmit={handleSubmit}>
                <div className="grid gap-10 lg:grid-cols-2">
                    {/* Left: Metadata Form */}
                    <div className="space-y-7">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Tiêu đề <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nhập tiêu đề hấp dẫn..."
                                maxLength={100}
                            />
                            <p className="mt-1 text-xs text-gray-500">{title.length}/100</p>
                        </div>


                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Mô tả</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Hãy kể cho mọi người video này nói về điều gì..."
                            />
                        </div>


                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Tags (ngăn cách bằng dấu phẩy)
                            </label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                placeholder="hài hước, lập trình react nextjs..."
                            />
                            <p className="mt-1 text-xs text-gray-500">{tags.length}/100</p>
                        </div>


                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Hiển thị</label>
                            <select
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                            >
                                <option value="public">Public - Mọi người đều thấy</option>
                                <option value="unlisted">Unlisted - Chỉ có link mới xem được</option>
                                <option value="private">Private - Chỉ mình tôi</option>
                            </select>
                        </div>
                    </div>


                    {/* Right: Preview & File Inputs */}
                    <div className="space-y-8">


                        {/* KHỐI 1: CHỌN VÀ XEM TRƯỚC VIDEO */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                {/* Input Video */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        {isEditMode ? "Video Gốc" : "Video"} {isEditMode ? "" : <span className="text-red-500">*</span>}
                                    </label>
                                    {!isEditMode ? (
                                        <input
                                            ref={videoRef}
                                            type="file"
                                            accept="video/*"
                                            onChange={handleVideoChange}
                                            className="block text-sm w-100 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                        />
                                    ) : (
                                        <p className="text-xs text-gray-500">Video đã tải lên không thể thay đổi.</p>
                                    )}
                                </div>
                            </div>
                            {videoPreview ? (
                                <div className="relative overflow-hidden bg-black shadow-lg rounded-xl">
                                    <video controls className="w-full" src={videoPreview} poster={thumbnailPreview} />
                                    {duration && (
                                        <div className="absolute px-3 py-1 text-sm font-medium text-white rounded bottom-3 right-3 bg-black/70">
                                            {duration}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center bg-gray-100 border-2 border-dashed aspect-video rounded-xl">
                                    <Upload className="w-16 h-16 text-gray-400" />
                                </div>
                            )}
                        </div>


                        {/* KHỐI 2: CHỌN VÀ XEM TRƯỚC THUMBNAIL */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Thumbnail {isEditMode ? "(Có thể thay đổi)" : <span className="text-red-500">*</span>}
                                    </label>
                                    {isEditMode && <p className="mb-2 text-xs text-gray-500">Chỉ cần chọn file mới nếu muốn thay đổi ảnh bìa.</p>}

                                    <input
                                        ref={thumbRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                        className="block text-sm w-100 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                                    />
                                </div>
                            </div>




                            <div className="max-w-xs">
                                {thumbnailPreview ? (
                                    <img src={thumbnailPreview} alt="Thumbnail" className="object-cover w-full border shadow-md aspect-video rounded-xl" />
                                ) : (
                                    <div className="flex items-center justify-center bg-gray-100 border-2 border-dashed aspect-video rounded-xl">
                                        <Upload className="w-12 h-12 text-gray-400" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


                {/* Upload Button */}
                <div className="mt-12 text-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`min-w-[200px] px-10 py-4 rounded-xl font-semibold text-white text-lg transition-all shadow-lg ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105"
                            }`}
                    >
                        {loading
                            ? (isEditMode ? "Đang lưu..." : "Đang tải...")
                            : (isEditMode ? "Lưu Thay Đổi" : "Tải Video")}
                    </button>
                </div>

            </form >
        </div >
    );
}
