

import React, { useState, useRef } from "react";
import axios from "axios";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";


import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";


const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/videos";


export default function VideoDetails({ onClose, onUploadSuccess }) {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();


    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [visibility, setVisibility] = useState("public");


    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState("");
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [duration, setDuration] = useState("");


    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, type: "", message: "" });


    const videoRef = useRef(null);
    const thumbRef = useRef(null);


    const showToast = (type, message) => {
        setToast({ show: true, type, message });
        setTimeout(() => setToast({ show: false }), 5000);
    };




    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setVideoFile(file);
        const url = URL.createObjectURL(file);
        setVideoPreview(url);


        const video = document.createElement("video");
        video.src = url;
        video.onloadedmetadata = () => {
            const m = Math.floor(video.duration / 60);
            const s = Math.floor(video.duration % 60).toString().padStart(2, "0");
            setDuration(`${m}:${s}`);
        };
    };


    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
    };


    const handleUpload = async () => {
        if (!isAuthenticated || !user) {
            showToast("error", "Bạn cần đăng nhập để upload video!");
            return;
        }


        if (!title.trim()) {
            showToast("error", "Vui lòng nhập tiêu đề video.");
            return;
        }
        if (!videoFile) {
            showToast("error", "Vui lòng chọn file video.");
            return;
        }
        if (!thumbnailFile) {
            showToast("error", "Vui lòng chọn thumbnail.");
            return;
        }


        setLoading(true);


        const tagArray = tags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0);


        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("description", description.trim());
        formData.append("tags", JSON.stringify(tagArray));
        formData.append("visibility", visibility);
        formData.append("video", videoFile);
        formData.append("thumbnail", thumbnailFile);


        formData.append("userId", user._id || user.id);


        try {
            const token = localStorage.getItem("token");


            await axios.post(`${API_BASE}`, formData, {
                timeout: 600000,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            showToast("success", "Tải video thành công! Video đã được gắn vào kênh của bạn.");


            // Reset form như cũ
            setTitle("");
            setDescription("");
            setTags("");
            setVisibility("public");
            setVideoFile(null);
            setThumbnailFile(null);
            setVideoPreview("");
            setThumbnailPreview("");
            setDuration("");
            if (videoRef.current) videoRef.current.value = "";
            if (thumbRef.current) thumbRef.current.value = "";


            // BÁO CHO COMPONENT CHA BIẾT RẰNG UPLOAD THÀNH CÔNG
            onUploadSuccess?.();


            onClose?.();


        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.message ||
                "Upload thất bại, vui lòng thử lại.";
            showToast("error", msg);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-5xl mx-auto p-2 bg-white">
            {/* <h1 className="text-3xl font-bold mb-8">Upload video</h1> */}


            
            {toast.show && (
                <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl text-white shadow-2xl animate-slide-in ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
                    {toast.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span className="font-medium">{toast.message}</span>
                    <button onClick={() => setToast({ ...toast, show: false })} className="ml-4">
                        <X size={18} />
                    </button>
                </div>
            )}


            <div className="grid lg:grid-cols-2 gap-10">
                {/* Left: Metadata Form (Chỉ còn các input text, textarea, select) */}
                <div className="space-y-7">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Hãy kể cho mọi người video này nói về điều gì..."
                        />
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tags (ngăn cách bằng dấu phẩy)
                        </label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                            placeholder="hài hước, lập trình react nextjs..."
                        />
                        <p className="text-xs text-gray-500 mt-1">Ví dụ: funny, tutorial, react</p>
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hiển thị</label>
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


                {/* Right: Preview & File Inputs (Đã chuyển file input sang đây) */}
                <div className="space-y-8">


                    {/* KHỐI 1: CHỌN VÀ XEM TRƯỚC VIDEO */}
                    <div>
                        {/* INPUT VIDEO ĐÃ CHUYỂN TỚI ĐÂY */}
                        <div className="flex items-center justify-between mb-4">
                            {/* Input Video (LEFT SIDE) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Video <span className="text-red-500">*</span>
                                </label>
                                <input
                                    ref={videoRef}
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoChange}
                                    // Thay đổi chiều rộng input tệp để nó không chiếm quá nhiều chỗ
                                    className="block w-100 text-sm file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                />
                            </div>
                        </div>
                        {videoPreview ? (
                            <div className="relative rounded-xl overflow-hidden shadow-lg bg-black">
                                <video controls className="w-full" src={videoPreview} />
                                {duration && (
                                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded text-sm font-medium">
                                        {duration}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="aspect-video bg-gray-100 border-2 border-dashed rounded-xl flex items-center justify-center">
                                <Upload className="w-16 h-16 text-gray-400" />
                            </div>
                        )}
                    </div>


                    {/* KHỐI 2: CHỌN VÀ XEM TRƯỚC THUMBNAIL */}
                    <div>
                        {/* INPUT THUMBNAIL ĐÃ CHUYỂN TỚI ĐÂY */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Thumbnail <span className="text-red-500">*</span>
                                </label>
                                <input
                                    ref={thumbRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    className="block w-100 text-sm file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                                />
                            </div>
                        </div>




                        <div className="max-w-xs">
                            {thumbnailPreview ? (
                                <img src={thumbnailPreview} alt="Thumbnail" className="w-full aspect-video object-cover rounded-xl shadow-md border" />
                            ) : (
                                <div className="aspect-video bg-gray-100 border-2 border-dashed rounded-xl flex items-center justify-center">
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
                    onClick={handleUpload}
                    disabled={loading}
                    className={`min-w-[200px] px-10 py-4 rounded-xl font-semibold text-white text-lg transition-all shadow-lg ${loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105"
                        }`}
                >
                    {loading ? "Đang tải..." : "Tải Video"}
                </button>
            </div>
        </div>
    );
}

