import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Upload, Copy, Check } from 'lucide-react';

export default function VideoDetails({ videoData, onSaveDetails, onBack }) {

    // 💡 Xác định Mode: Nếu videoData có thuộc tính 'id' (từ database), đó là Edit Mode.
    const isEditMode = videoData && videoData.id;

    // const [title, setTitle] = useState('Untitled');
    // const [description, setDescription] = useState('');
    // const [category, setCategory] = useState('');
    // const [visibility, setVisibility] = useState('private');
    const [thumbnail, setThumbnail] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [videoStatus, setVideoStatus] = useState('Waiting');
    const [subtitles, setSubtitles] = useState('No Subtitles');
    const [videoLink, setVideoLink] = useState('https://new-tube-...');
    const [copied, setCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    // ✅ KHỞI TẠO STATE
    // Nếu là Edit Mode (từ database), dùng dữ liệu có sẵn.
    // Nếu là Create Mode (từ upload), dùng tên file.
    const [title, setTitle] = useState(videoData
        ? (isEditMode ? videoData.title : videoData.name.replace(/\.[^/.]+$/, ""))
        : 'Untitled'
    );
    const [description, setDescription] = useState(isEditMode ? videoData.description : '');
    const [category, setCategory] = useState(isEditMode ? videoData.category : '');
    const [visibility, setVisibility] = useState(isEditMode ? videoData.visibility : 'private');

    // Lưu trữ URL video/thumbnail cuối cùng (hoặc URL tạm thời)
    const [finalVideoUrl, setFinalVideoUrl] = useState(isEditMode ? videoData.videoUrl : null);
    const [finalThumbnailUrl, setFinalThumbnailUrl] = useState(isEditMode ? videoData.thumbnailUrl : null);

    // useEffect(() => {
    //     if (videoData) {
    //         setTitle(videoData.name.replace(/\.[^/.]+$/, ""));
    //         setVideoFile(videoData);
    //         setVideoStatus("Uploaded");

    //         const tempUrl = URL.createObjectURL(videoData);
    //         setVideoLink(tempUrl);
    //     }
    // }, [videoData]);

    // useEffect(() => {
    //     if (!isEditMode && videoData && videoData instanceof File) {
    //         // Trường hợp TẠO MỚI: Dùng file blob URL cho preview/link tạm thời
    //         const tempUrl = URL.createObjectURL(videoData);
    //         setVideoFile(videoData);
    //         setVideoLink(tempUrl);
    //         setVideoStatus("Uploaded");

    //         // ⚠️ THÊM CLEANUP FUNCTION RẤT QUAN TRỌNG
    //         return () => {
    //             URL.revokeObjectURL(tempUrl);
    //         };
    //     } else if (isEditMode) {
    //         // Trường hợp CHỈNH SỬA: Đã có URL thật từ database
    //         setVideoLink(videoData.videoUrl);
    //         setVideoStatus("Published"); // Giả định
    //         setThumbnail(videoData.thumbnailUrl);
    //     }
    // }, [videoData]);

    useEffect(() => {
        if (videoData && videoData.videoUrl) { // Kiểm tra videoUrl đã có
            setTitle(videoData.name.replace(/\.[^/.]+$/, "") || videoData.title || 'Untitled');

            // ✅ CẬP NHẬT: Dùng videoData.videoUrl (link ngẫu nhiên)
            setVideoLink(videoData.videoUrl);

            // ... (các state khác)
            // KHÔNG CÓ URL.createObjectURL()
        }
    }, [videoData]);

    const API_UPLOAD_VIDEO = "http://localhost:3000//api/videos";     // CHANGE THIS
    const API_SAVE_DETAILS = "http://localhost:3000/api/videos";           // CHANGE THIS

    const categories = [
        "Film & Animation", "Autos & Vehicles", "Music", "Pets & Animals", "Sports",
        "Travel & Events", "Gaming", "People & Blogs", "Comedy", "Entertainment",
        "News & Politics", "Howto & Style", "Education", "Science & Technology", "Nonprofits & Activism"
    ];

    // ============================================
    // THUMBNAIL UPLOAD PREVIEW
    // ============================================
    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setThumbnail(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // ============================================
    // VIDEO UPLOAD (REAL FILE)
    // ============================================
    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            setVideoStatus("Uploaded");
        }
    };

    // ============================================
    // COPY LINK
    // ============================================
    const copyToClipboard = () => {
        navigator.clipboard.writeText(videoLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // ============================================
    // SUBMIT LOGIC (Tạo mới hoặc Chỉnh sửa)
    // ============================================
    const handleSubmit = async () => {
        // Kiểm tra cơ bản
        if (!title || (!isEditMode && !videoFile)) {
            setMessage("✗ Vui lòng điền tiêu đề và tải file video (nếu là tạo mới).");
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        try {
            // 💡 BƯỚC 1: Xử lý Upload file (Video và Thumbnail)
            // Trong luồng này, chúng ta giả định rằng file video đã được upload lên S3/Cloud 
            // VÀ server đã trả về videoUrl/thumbnailUrl TẠM THỜI cho file đó.
            // Nếu bạn không có logic upload file thực tế, HÃY GÁN MỘT URL MÔ PHỎNG.

            let currentVideoUrl = finalVideoUrl;
            let currentThumbnailUrl = finalThumbnailUrl;

            if (!isEditMode) {
                // Nếu TẠO MỚI, phải có URL TẠM THỜI cho API POST hoạt động.
                // Trong thực tế, HeaderStudio sẽ trả về URL này.
                // Tạm thời, gán URL mô phỏng nếu chưa có:
                if (!currentVideoUrl) {
                    currentVideoUrl = `http://localhost:3000/videos/${videoFile.name}_${Date.now()}.mp4`;
                    currentThumbnailUrl = `http://localhost:3000/thumbnails/${videoFile.name}_${Date.now()}.jpg`;
                }
            }

            // 💡 BƯỚC 2: Chuẩn bị dữ liệu metadata
            const metadata = {
                title,
                description,
                tags: [], // Thêm tags nếu cần
                visibility,
                category,
                // ✅ SỬ DỤNG URL CUỐI CÙNG HOẶC MÔ PHỎNG ĐỂ GỌI API BACKEND
                videoUrl: currentVideoUrl,
                thumbnailUrl: currentThumbnailUrl,
            };

            let saveResponse;
            const headers = { 'Authorization': `Bearer YOUR_AUTH_TOKEN` }; // Thêm token xác thực

            if (isEditMode) {
                // CHẾ ĐỘ CHỈNH SỬA: PATCH/PUT tới /api/videos/:id
                const API_UPDATE_DETAILS = `${API_SAVE_DETAILS}/${videoData.id}`;
                saveResponse = await axios.patch(API_UPDATE_DETAILS, metadata, { headers });
                setMessage("✓ Cập nhật video thành công!");
            } else {
                // CHẾ ĐỘ TẠO MỚI: POST tới /api/videos (như router backend của bạn)
                saveResponse = await axios.post(API_SAVE_DETAILS, metadata, { headers });
                setMessage("✓ Video đã được lưu và xuất bản thành công!");
            }

            // ✅ GỌI HÀM CALLBACK VỀ COMPONENT CHA
            onSaveDetails(saveResponse.data); // Gửi dữ liệu video mới về StudioLayout

        } catch (error) {
            console.error("Lỗi khi lưu/cập nhật video:", error);
            setMessage("✗ Lỗi Server hoặc xác thực.");
        }

        setIsSubmitting(false);
    };

    // ============================================
    // SUBMIT LOGIC — AXIOS FULL INTEGRATION
    // ============================================
    const saveDetails = async () => {

        // 2️⃣ SAVE VIDEO DETAILS (JSON)
        const detailsToSave = {
            title,
            description,
            category,
            visibility,
            thumbnail: thumbnail || null,
            videoStatus,
            subtitles,
            videoLink: uploadedVideoUrl,
            uploadedAt: new Date().toISOString(),
            fileName: videoFile.name,
            fileSize: videoFile.size
        };
        onSaveDetails(detailsToSave);
    };
    // const handleSubmit = async () => {
    //     // Sửa logic handleSubmit để CHỈ GỌI API SAVE DETAILS
    //     if (!videoFile) {
    //         setMessage("✗ Video file is missing.");
    //         return;
    //     }

    //     setIsSubmitting(true);
    //     setMessage('');

    //     try {
    //         // ⚠️ BỎ BƯỚC UPLOAD FILE (1️⃣) TRONG ĐÂY NẾU HEADER STUDIO ĐÃ XỬ LÝ UPLOAD RỒI.
    //         // Nếu bạn muốn VideoDetails xử lý việc tải lên thực tế sau khi nhập metadata:

    //         // 1️⃣ GỌI API ĐỂ CHỈ LƯU METADATA (VÀO SỬ DỤNG videoFile.id/url ĐƯỢC TRẢ VỀ TỪ UPLOAD TRƯỚC)
    //         const videoData = {
    //             title, description, category, visibility,
    //             thumbnail: thumbnail || null, videoLink: videoLink,
    //             uploadedAt: new Date().toISOString(), fileName: videoFile.name, fileSize: videoFile.size
    //         };

    //         // Gọi API lưu chi tiết
    //         const saveResponse = await axios.post(API_SAVE_DETAILS, videoData);

    //         setMessage("✓ Video details saved successfully!");
    //         // Gọi onBack hoặc onSave từ component cha để xử lý chuyển trang
    //         // onSave(saveResponse.data); // Dùng prop onSave nếu có

    //     } catch (error) {
    //         // ... (xử lý lỗi)
    //     }

    //     setIsSubmitting(false);
    // };

    // ========================================================================
    // UI RENDER
    // ========================================================================
    return (
        <div className="min-h-screen bg-white">


            {/* MAIN CONTENT */}
            <main className="flex-1 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-semibold mb-2">Video details</h1>
                            <p className="text-gray-500">Manage your video details</p>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : (isEditMode ? "Update" : "Save")}
                        </button>
                    </div>

                    {message && (
                        <div className={`mb-4 p-4 rounded ${message.includes("✓")
                            ? "bg-green-50 text-green-800"
                            : "bg-red-50 text-red-800"
                            }`}>
                            {message}
                        </div>
                    )}

                    {/* 2 COLUMN LAYOUT */}
                    <div className="grid grid-cols-3 gap-8">
                        {/* LEFT SIDE */}
                        <div className="col-span-2 space-y-6">
                            {/* TITLE */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Title
                                </label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>

                            {/* DESCRIPTION */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    rows="8"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-2 border rounded resize-none"
                                    placeholder="Add a description to your video"
                                />
                            </div>

                            {/* THUMBNAIL */}
                            <div>
                                <label className="block text-sm font-medium mb-3">Thumbnail</label>
                                <input type="file" accept="image/*" id="thumb" className="hidden" onChange={handleThumbnailUpload} />
                                <label htmlFor="thumb" className="cursor-pointer block w-40 h-24 bg-gray-900 rounded">
                                    {thumbnail ? (
                                        <img src={thumbnail} className="w-full h-full object-cover rounded" />
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-white">Upload</div>
                                    )}
                                </label>
                            </div>

                            {/* CATEGORY */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2 border rounded"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="space-y-6">
                            {/* THUMBNAIL PREVIEW */}
                            <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                                {thumbnail ? (
                                    <img src={thumbnail} className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                    <Upload className="text-white w-12 h-12" />
                                )}
                            </div>

                            {/* LINK */}
                            <div>
                                <label className="block text-sm mb-2">Video link</label>
                                <div className="flex gap-2">
                                    <input value={videoLink} readOnly className="flex-1 bg-gray-100 px-3 py-2 border rounded text-blue-600 text-sm" />
                                    <button onClick={copyToClipboard} className="p-2">
                                        {copied ? <Check className="text-green-600" /> : <Copy />}
                                    </button>
                                </div>
                            </div>

                            {/* STATUS */}
                            <p><b>Status:</b> {videoStatus}</p>
                            <p><b>Subtitles:</b> {subtitles}</p>

                            {/* VISIBILITY */}
                            <div>
                                <label className="block text-sm mb-3">Visibility</label>
                                <select
                                    value={visibility}
                                    onChange={(e) => setVisibility(e.target.value)}
                                    className="w-full px-4 py-2 border rounded"
                                >
                                    <option value="private">🔒 Private</option>
                                    <option value="unlisted">🔗 Unlisted</option>
                                    <option value="public">🌍 Public</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>

    );
}


