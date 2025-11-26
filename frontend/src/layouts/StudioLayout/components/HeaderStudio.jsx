
import { Menu, Video, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "../../../assets/logo.svg";
import React, { useState } from 'react';

// ✅ HÀM TIỆN ÍCH TẠO ID NGẪU NHIÊN GIỐNG YOUTUBE
const generateRandomId = (length = 11) => {
  // Ký tự hợp lệ trong ID của YouTube (bao gồm '-' và '_')
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default function HeaderStudio({ onMenuClick, user, onVideoSelected, isDetailView, onBack }) {
  const [loading, setLoading] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFile, setUploadFile] = useState(null);

  // 

  const startUpload = () => {
    // ... (Logic kiểm tra và setInterval giữ nguyên)
    if (!uploadFile) return alert("Select a video file first!");
    setUploadProgress(0);
    setLoading(true);

    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          finishUpload(uploadFile);
          return 100;
        }
        return p + 5;
      });
    }, 150);
  };

  // ✅ SỬA HÀM FINISH UPLOAD
  const finishUpload = (file) => {
    // 1. TẠO ID NGẪU NHIÊN 11 KÝ TỰ
    const videoId = generateRandomId(11);

    // 2. MÔ PHỎNG PHẢN HỒI TỪ SERVER VỚI URL CỐ ĐỊNH DÙNG ID NGẪU NHIÊN
    const simulatedServerResponse = {
      // Dữ liệu ban đầu
      name: file.name,
      size: file.size,

      // ✅ URL CỐ ĐỊNH VÀ NGẪU NHIÊN
      videoUrl: `https://wetu.be/${videoId}`,

      // URL thumbnail mô phỏng (cũng dùng ID)
      thumbnailUrl: `http://localhost:3000/thumbnails/${videoId}.jpg`,

      // ID video (sử dụng trong API calls sau này)
      id: videoId
    };

    setTimeout(() => {
      // 3. TRUYỀN DỮ LIỆU CÓ URL CỐ ĐỊNH VÀO COMPONENT CHA
      onVideoSelected(simulatedServerResponse);

      setUploadModal(false);
      setUploadFile(null);
      setUploadProgress(0);
      setLoading(false);
    }, 500);
  };

  // const finishUpload = () => {
  //   setTimeout(() => {
  //     onVideoSelected(uploadFile); // đẩy setState sang microtask
  //     setUploadModal(false);
  //     setUploadFile(null);
  //     setUploadProgress(0);
  //     setLoading(false);
  //   }, 0);
  // };

  const getInitials = (name) => {
    if (!name) return "AC";
    return name
      .split(" ")
      .map(n => n[0].toUpperCase())
      .slice(0, 2)
      .join("");
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 h-14 bg-white border-b border-[#d9d9d9]">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <img src={logo} alt="" className="h-5" />
            <span className="text-xl font-semibold">Studio</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setUploadModal(true)}
            className="bg-blue-600 text-white flex gap-2"
          >
            <Video /> Tạo
          </Button>

          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
            {getInitials(user.name)}
          </div>
        </div>
      </header>

      {/* UPLOAD MODAL */}
      {uploadModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Upload video</h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center">
              {!uploadFile ? (
                <>
                  <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setUploadFile(e.target.files?.[0])}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="bg-blue-600 text-white px-6 py-2 rounded cursor-pointer">
                    Select File
                  </label>
                </>
              ) : (
                <div>
                  <Video size={48} className="mx-auto mb-2 text-blue-600" />
                  <p className="font-medium">{uploadFile.name}</p>
                  <button className="text-sm text-red-600 mt-2" onClick={() => setUploadFile(null)}>
                    Remove
                  </button>
                </div>
              )}
            </div>

            {loading && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-2" style={{ width: uploadProgress + "%" }} />
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button onClick={() => setUploadModal(false)} className="px-6 py-2">Cancel</button>
              <button
                onClick={startUpload}
                className="px-6 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
                disabled={loading || !uploadFile}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
