// import { useState, useEffect } from 'react';
// import axios from "axios";
// import { Upload, Copy, Check } from 'lucide-react';

// export default function VideoDetails({ videoData, onSaveDetails, onBack }) {

//     // 💡 Xác định Mode: Nếu videoData có thuộc tính 'id' (từ database), đó là Edit Mode.
//     const isEditMode = videoData && videoData.id;

//     // const [title, setTitle] = useState('Untitled');
//     // const [description, setDescription] = useState('');
//     // const [category, setCategory] = useState('');
//     // const [visibility, setVisibility] = useState('private');
//     const [thumbnail, setThumbnail] = useState(null);
//     const [videoFile, setVideoFile] = useState(null);
//     const [videoStatus, setVideoStatus] = useState('Waiting');
//     const [subtitles, setSubtitles] = useState('No Subtitles');
//     const [videoLink, setVideoLink] = useState('https://new-tube-...');
//     const [copied, setCopied] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [message, setMessage] = useState('');

//     // ✅ KHỞI TẠO STATE
//     // Nếu là Edit Mode (từ database), dùng dữ liệu có sẵn.
//     // Nếu là Create Mode (từ upload), dùng tên file.
//     const [title, setTitle] = useState(videoData
//         ? (isEditMode ? videoData.title : videoData.name.replace(/\.[^/.]+$/, ""))
//         : 'Untitled'
//     );
//     const [description, setDescription] = useState(isEditMode ? videoData.description : '');
//     const [category, setCategory] = useState(isEditMode ? videoData.category : '');
//     const [visibility, setVisibility] = useState(isEditMode ? videoData.visibility : 'private');

//     // Lưu trữ URL video/thumbnail cuối cùng (hoặc URL tạm thời)
//     const [finalVideoUrl, setFinalVideoUrl] = useState(isEditMode ? videoData.videoUrl : null);
//     const [finalThumbnailUrl, setFinalThumbnailUrl] = useState(isEditMode ? videoData.thumbnailUrl : null);

//     // useEffect(() => {
//     //     if (videoData) {
//     //         setTitle(videoData.name.replace(/\.[^/.]+$/, ""));
//     //         setVideoFile(videoData);
//     //         setVideoStatus("Uploaded");

//     //         const tempUrl = URL.createObjectURL(videoData);
//     //         setVideoLink(tempUrl);
//     //     }
//     // }, [videoData]);

//     // useEffect(() => {
//     //     if (!isEditMode && videoData && videoData instanceof File) {
//     //         // Trường hợp TẠO MỚI: Dùng file blob URL cho preview/link tạm thời
//     //         const tempUrl = URL.createObjectURL(videoData);
//     //         setVideoFile(videoData);
//     //         setVideoLink(tempUrl);
//     //         setVideoStatus("Uploaded");

//     //         // ⚠️ THÊM CLEANUP FUNCTION RẤT QUAN TRỌNG
//     //         return () => {
//     //             URL.revokeObjectURL(tempUrl);
//     //         };
//     //     } else if (isEditMode) {
//     //         // Trường hợp CHỈNH SỬA: Đã có URL thật từ database
//     //         setVideoLink(videoData.videoUrl);
//     //         setVideoStatus("Published"); // Giả định
//     //         setThumbnail(videoData.thumbnailUrl);
//     //     }
//     // }, [videoData]);

//     useEffect(() => {
//         if (videoData && videoData.videoUrl) { // Kiểm tra videoUrl đã có
//             setTitle(videoData.name.replace(/\.[^/.]+$/, "") || videoData.title || 'Untitled');

//             // ✅ CẬP NHẬT: Dùng videoData.videoUrl (link ngẫu nhiên)
//             setVideoLink(videoData.videoUrl);

//             // ... (các state khác)
//             // KHÔNG CÓ URL.createObjectURL()
//         }
//     }, [videoData]);

//     const API_UPLOAD_VIDEO = "http://localhost:3000/api/upload/video";     // CHANGE THIS
//     const API_SAVE_DETAILS = "http://localhost:3000/api/videos";           // CHANGE THIS

//     const categories = [
//         "Film & Animation", "Autos & Vehicles", "Music", "Pets & Animals", "Sports",
//         "Travel & Events", "Gaming", "People & Blogs", "Comedy", "Entertainment",
//         "News & Politics", "Howto & Style", "Education", "Science & Technology", "Nonprofits & Activism"
//     ];

//     // ============================================
//     // THUMBNAIL UPLOAD PREVIEW
//     // ============================================
//     const handleThumbnailUpload = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => setThumbnail(reader.result);
//             reader.readAsDataURL(file);
//         }
//     };

//     // ============================================
//     // VIDEO UPLOAD (REAL FILE)
//     // ============================================
//     const handleVideoUpload = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setVideoFile(file);
//             setVideoStatus("Uploaded");
//         }
//     };

//     // ============================================
//     // COPY LINK
//     // ============================================
//     const copyToClipboard = () => {
//         navigator.clipboard.writeText(videoLink);
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//     };

//     // ============================================
//     // SUBMIT LOGIC (Tạo mới hoặc Chỉnh sửa)
//     // ============================================
//     const handleSubmit = async () => {
//         // Kiểm tra cơ bản
//         if (!title || (!isEditMode && !videoFile)) {
//             setMessage("✗ Vui lòng điền tiêu đề và tải file video (nếu là tạo mới).");
//             return;
//         }

//         setIsSubmitting(true);
//         setMessage('');

//         try {
//             // 💡 BƯỚC 1: Xử lý Upload file (Video và Thumbnail)
//             // Trong luồng này, chúng ta giả định rằng file video đã được upload lên S3/Cloud
//             // VÀ server đã trả về videoUrl/thumbnailUrl TẠM THỜI cho file đó.
//             // Nếu bạn không có logic upload file thực tế, HÃY GÁN MỘT URL MÔ PHỎNG.

//             let currentVideoUrl = finalVideoUrl;
//             let currentThumbnailUrl = finalThumbnailUrl;

//             if (!isEditMode) {
//                 // Nếu TẠO MỚI, phải có URL TẠM THỜI cho API POST hoạt động.
//                 // Trong thực tế, HeaderStudio sẽ trả về URL này.
//                 // Tạm thời, gán URL mô phỏng nếu chưa có:
//                 if (!currentVideoUrl) {
//                     currentVideoUrl = `http://localhost:3000/videos/${videoFile.name}_${Date.now()}.mp4`;
//                     currentThumbnailUrl = `http://localhost:3000/thumbnails/${videoFile.name}_${Date.now()}.jpg`;
//                 }
//             }

//             // 💡 BƯỚC 2: Chuẩn bị dữ liệu metadata
//             const metadata = {
//                 title,
//                 description,
//                 tags: [], // Thêm tags nếu cần
//                 visibility,
//                 category,
//                 // ✅ SỬ DỤNG URL CUỐI CÙNG HOẶC MÔ PHỎNG ĐỂ GỌI API BACKEND
//                 videoUrl: currentVideoUrl,
//                 thumbnailUrl: currentThumbnailUrl,
//             };

//             let saveResponse;
//             const headers = { 'Authorization': `Bearer YOUR_AUTH_TOKEN` }; // Thêm token xác thực

//             if (isEditMode) {
//                 // CHẾ ĐỘ CHỈNH SỬA: PATCH/PUT tới /api/videos/:id
//                 const API_UPDATE_DETAILS = `${API_SAVE_DETAILS}/${videoData.id}`;
//                 saveResponse = await axios.patch(API_UPDATE_DETAILS, metadata, { headers });
//                 setMessage("✓ Cập nhật video thành công!");
//             } else {
//                 // CHẾ ĐỘ TẠO MỚI: POST tới /api/videos (như router backend của bạn)
//                 saveResponse = await axios.post(API_SAVE_DETAILS, metadata, { headers });
//                 setMessage("✓ Video đã được lưu và xuất bản thành công!");
//             }

//             // ✅ GỌI HÀM CALLBACK VỀ COMPONENT CHA
//             onSaveDetails(saveResponse.data); // Gửi dữ liệu video mới về StudioLayout

//         } catch (error) {
//             console.error("Lỗi khi lưu/cập nhật video:", error);
//             setMessage("✗ Lỗi Server hoặc xác thực.");
//         }

//         setIsSubmitting(false);
//     };

//     // ============================================
//     // SUBMIT LOGIC — AXIOS FULL INTEGRATION
//     // ============================================
//     const saveDetails = async () => {

//         // 2️⃣ SAVE VIDEO DETAILS (JSON)
//         const detailsToSave = {
//             title,
//             description,
//             category,
//             visibility,
//             thumbnail: thumbnail || null,
//             videoStatus,
//             subtitles,
//             videoLink: uploadedVideoUrl,
//             uploadedAt: new Date().toISOString(),
//             fileName: videoFile.name,
//             fileSize: videoFile.size
//         };
//         onSaveDetails(detailsToSave);
//     };
//     // const handleSubmit = async () => {
//     //     // Sửa logic handleSubmit để CHỈ GỌI API SAVE DETAILS
//     //     if (!videoFile) {
//     //         setMessage("✗ Video file is missing.");
//     //         return;
//     //     }

//     //     setIsSubmitting(true);
//     //     setMessage('');

//     //     try {
//     //         // ⚠️ BỎ BƯỚC UPLOAD FILE (1️⃣) TRONG ĐÂY NẾU HEADER STUDIO ĐÃ XỬ LÝ UPLOAD RỒI.
//     //         // Nếu bạn muốn VideoDetails xử lý việc tải lên thực tế sau khi nhập metadata:

//     //         // 1️⃣ GỌI API ĐỂ CHỈ LƯU METADATA (VÀO SỬ DỤNG videoFile.id/url ĐƯỢC TRẢ VỀ TỪ UPLOAD TRƯỚC)
//     //         const videoData = {
//     //             title, description, category, visibility,
//     //             thumbnail: thumbnail || null, videoLink: videoLink,
//     //             uploadedAt: new Date().toISOString(), fileName: videoFile.name, fileSize: videoFile.size
//     //         };

//     //         // Gọi API lưu chi tiết
//     //         const saveResponse = await axios.post(API_SAVE_DETAILS, videoData);

//     //         setMessage("✓ Video details saved successfully!");
//     //         // Gọi onBack hoặc onSave từ component cha để xử lý chuyển trang
//     //         // onSave(saveResponse.data); // Dùng prop onSave nếu có

//     //     } catch (error) {
//     //         // ... (xử lý lỗi)
//     //     }

//     //     setIsSubmitting(false);
//     // };

//     // ========================================================================
//     // UI RENDER
//     // ========================================================================
//     return (
//         <div className="min-h-screen bg-white">

//             {/* MAIN CONTENT */}
//             <main className="flex-1 p-8">
//                 <div className="max-w-6xl mx-auto">
//                     <div className="flex justify-between items-start mb-8">
//                         <div>
//                             <h1 className="text-3xl font-semibold mb-2">Video details</h1>
//                             <p className="text-gray-500">Manage your video details</p>
//                         </div>
//                         <button
//                             onClick={handleSubmit}
//                             disabled={isSubmitting}
//                             className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
//                         >
//                             {isSubmitting ? "Saving..." : (isEditMode ? "Update" : "Save")}
//                         </button>
//                     </div>

//                     {message && (
//                         <div className={`mb-4 p-4 rounded ${message.includes("✓")
//                             ? "bg-green-50 text-green-800"
//                             : "bg-red-50 text-red-800"
//                             }`}>
//                             {message}
//                         </div>
//                     )}

//                     {/* 2 COLUMN LAYOUT */}
//                     <div className="grid grid-cols-3 gap-8">
//                         {/* LEFT SIDE */}
//                         <div className="col-span-2 space-y-6">
//                             {/* TITLE */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-2">
//                                     Title
//                                 </label>
//                                 <input
//                                     value={title}
//                                     onChange={(e) => setTitle(e.target.value)}
//                                     className="w-full px-4 py-2 border rounded"
//                                 />
//                             </div>

//                             {/* DESCRIPTION */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-2">Description</label>
//                                 <textarea
//                                     rows="8"
//                                     value={description}
//                                     onChange={(e) => setDescription(e.target.value)}
//                                     className="w-full px-4 py-2 border rounded resize-none"
//                                     placeholder="Add a description to your video"
//                                 />
//                             </div>

//                             {/* THUMBNAIL */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-3">Thumbnail</label>
//                                 <input type="file" accept="image/*" id="thumb" className="hidden" onChange={handleThumbnailUpload} />
//                                 <label htmlFor="thumb" className="cursor-pointer block w-40 h-24 bg-gray-900 rounded">
//                                     {thumbnail ? (
//                                         <img src={thumbnail} className="w-full h-full object-cover rounded" />
//                                     ) : (
//                                         <div className="h-full flex items-center justify-center text-white">Upload</div>
//                                     )}
//                                 </label>
//                             </div>

//                             {/* CATEGORY */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-2">Category</label>
//                                 <select
//                                     value={category}
//                                     onChange={(e) => setCategory(e.target.value)}
//                                     className="w-full px-4 py-2 border rounded"
//                                 >
//                                     <option value="">Select category</option>
//                                     {categories.map((cat) => (
//                                         <option key={cat}>{cat}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>

//                         {/* RIGHT SIDE */}
//                         <div className="space-y-6">
//                             {/* THUMBNAIL PREVIEW */}
//                             <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
//                                 {thumbnail ? (
//                                     <img src={thumbnail} className="w-full h-full object-cover rounded-lg" />
//                                 ) : (
//                                     <Upload className="text-white w-12 h-12" />
//                                 )}
//                             </div>

//                             {/* LINK */}
//                             <div>
//                                 <label className="block text-sm mb-2">Video link</label>
//                                 <div className="flex gap-2">
//                                     <input value={videoLink} readOnly className="flex-1 bg-gray-100 px-3 py-2 border rounded text-blue-600 text-sm" />
//                                     <button onClick={copyToClipboard} className="p-2">
//                                         {copied ? <Check className="text-green-600" /> : <Copy />}
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* STATUS */}
//                             <p><b>Status:</b> {videoStatus}</p>
//                             <p><b>Subtitles:</b> {subtitles}</p>

//                             {/* VISIBILITY */}
//                             <div>
//                                 <label className="block text-sm mb-3">Visibility</label>
//                                 <select
//                                     value={visibility}
//                                     onChange={(e) => setVisibility(e.target.value)}
//                                     className="w-full px-4 py-2 border rounded"
//                                 >
//                                     <option value="private">🔒 Private</option>
//                                     <option value="unlisted">🔗 Unlisted</option>
//                                     <option value="public">🌍 Public</option>
//                                 </select>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </div>

//     );
// }

import { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { Upload, Copy, Check, Loader2, X, Image as ImageIcon } from 'lucide-react';

export default function VideoDetails({ videoData, onSaveDetails, onBack }) {
    // ----------------------------------------------------------------------
    // 1. CONFIG & INIT STATE
    // ----------------------------------------------------------------------
    const API_BASE_URL = "http://localhost:3000/api/videos"; 

    // State cho Form Data
    // Mặc định lấy tên file làm tiêu đề nếu có
    const defaultTitle = videoData && videoData.name ? videoData.name.replace(/\.[^/.]+$/, "") : "";
    
    const [title, setTitle] = useState(defaultTitle);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [visibility, setVisibility] = useState('private');

    // State cho Files & Previews
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    
    // State cho UI/UX
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); 
    const [message, setMessage] = useState({ type: '', text: '' });
    const [copied, setCopied] = useState(false);

    const categories = [
        "Film & Animation", "Autos & Vehicles", "Music", "Pets & Animals", "Sports",
        "Travel & Events", "Gaming", "People & Blogs", "Comedy", "Entertainment",
        "News & Politics", "Howto & Style", "Education", "Science & Technology"
    ];

    const previewUrlsRef = useRef([]); 

    // ----------------------------------------------------------------------
    // 2. LOGIC KHỞI TẠO & CLEANUP
    // ----------------------------------------------------------------------
    useEffect(() => {
        if (videoData) {
            // Tự động tạo preview URL cho video từ file gốc
            // Lưu ý: videoData ở đây BẮT BUỘC phải là File object từ input upload
            const url = URL.createObjectURL(videoData);
            setVideoPreview(url);
            previewUrlsRef.current.push(url);
        }

        return () => {
            previewUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
        };
    }, [videoData]);

    // ----------------------------------------------------------------------
    // 3. HANDLERS
    // ----------------------------------------------------------------------

    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnailFile(file);
            const url = URL.createObjectURL(file);
            setThumbnailPreview(url);
            previewUrlsRef.current.push(url);
        }
    };

    const copyToClipboard = () => {
        if (!videoPreview) return;
        navigator.clipboard.writeText(videoPreview);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // --- HANDLE SUBMIT: LUÔN GỌI POST ---
    const handleSubmit = async () => {
        if (!title.trim()) {
            setMessage({ type: 'error', text: "Please enter a title." });
            return;
        }

        setIsSubmitting(true);
        setUploadProgress(0);
        setMessage({ type: '', text: '' });

        try {
            const formData = new FormData();
            
            // 1. Append thông tin text
            formData.append('title', title);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('visibility', visibility);

            // 2. Append Thumbnail (nếu có)
            if (thumbnailFile) {
                formData.append('thumbnail', thumbnailFile);
            }

            // 3. Append Video File Gốc (Bắt buộc cho Create)
            // videoData được truyền từ component cha (là file vừa kéo thả)
            if (videoData) {
                formData.append('video', videoData);
            }

            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            };

            // ⚠️ QUAN TRỌNG: LUÔN GỌI POST (CREATE)
            const response = await axios.post(API_BASE_URL, formData, config);
            
            setMessage({ type: 'success', text: "Video created successfully!" });

            // Callback về cha
            if (onSaveDetails) {
                setTimeout(() => onSaveDetails(response.data), 1000);
            }

        } catch (error) {
            console.error("Create error:", error);
            const errText = error.response?.data?.message || "Failed to create video.";
            setMessage({ type: 'error', text: errText });
            setIsSubmitting(false);
        }
    };

    // ----------------------------------------------------------------------
    // 4. UI RENDER
    // ----------------------------------------------------------------------
    return (
        <div className="flex flex-col h-full bg-white text-gray-800 animate-in fade-in duration-300">
            
            {/* HEADER */}
            <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Create Video</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Enter details and publish your new video
                    </p>
                </div>
                
                <div className="flex gap-3">
                    {onBack && (
                        <button 
                            onClick={onBack} 
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    )}
                    
                    {/* NÚT TẠO MỚI (CREATE) */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isSubmitting ? `${uploadProgress}% Uploading...` : "Create Video"}
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto">
                    
                    {/* MESSAGE ALERT */}
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-md flex items-center gap-3 border ${
                            message.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
                        }`}>
                            {message.type === 'error' ? <X className="w-5 h-5"/> : <Check className="w-5 h-5"/>}
                            <span className="font-medium">{message.text}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* LEFT: INPUTS */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Title (required)</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Add a title..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Description</label>
                                <textarea
                                    rows="6"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    placeholder="Tell viewers about your video"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700">Thumbnail</label>
                                <div className="flex gap-4 items-start">
                                    <div>
                                        <input 
                                            type="file" 
                                            id="thumb-upload" 
                                            accept="image/*"
                                            className="hidden" 
                                            onChange={handleThumbnailUpload}
                                        />
                                        <label 
                                            htmlFor="thumb-upload"
                                            className="flex flex-col items-center justify-center w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-50"
                                        >
                                            <Upload className="w-5 h-5 text-gray-400 mb-1" />
                                            <span className="text-xs text-gray-500">Upload</span>
                                        </label>
                                    </div>

                                    {thumbnailPreview ? (
                                        <div className="relative w-36 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                                            <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
                                            <button 
                                                onClick={() => { setThumbnailFile(null); setThumbnailPreview(null); }}
                                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-36 h-20 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                            <ImageIcon className="w-6 h-6 text-gray-300" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* RIGHT: PREVIEW */}
                        <div className="space-y-6">
                            <div className="sticky top-6">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="aspect-video bg-black relative">
                                        {videoPreview ? (
                                            <video src={videoPreview} controls className="w-full h-full object-contain" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-white/50">No Preview</div>
                                        )}
                                    </div>

                                    <div className="p-4 bg-gray-50 border-t space-y-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Visibility</label>
                                            <select
                                                value={visibility}
                                                onChange={(e) => setVisibility(e.target.value)}
                                                className="w-full text-sm p-2 border border-gray-300 rounded bg-white outline-none"
                                            >
                                                <option value="private">🔒 Private</option>
                                                <option value="unlisted">🔗 Unlisted</option>
                                                <option value="public">🌍 Public</option>
                                            </select>
                                        </div>

                                        {isSubmitting && (
                                            <div className="pt-2">
                                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                    <span>Uploading...</span>
                                                    <span>{uploadProgress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                    <div 
                                                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                                                        style={{ width: `${uploadProgress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}