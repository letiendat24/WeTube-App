// import { Menu, Video, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import logo from "../../../assets/logo.svg";
// import { useState, useEffect } from "react";
// import Auth from "@/components/Auth";                    // component Auth chung
// import VideoDetails from "@/pages/Studio/components/VideoDetails";

// export default function HeaderStudio({ onMenuClick }) {
//   const [user, setUser] = useState(null);
//   const [showUploadModal, setShowUploadModal] = useState(false);



//   // ĐỌC USER + LẮNG NGHE MỌI THAY ĐỔI (quan trọng nhất!)
//   useEffect(() => {
//     const syncUser = () => {
//       try {
//         const saved = localStorage.getItem("user");
//         const token = localStorage.getItem("token");
//         if (saved && token) {
//           setUser(JSON.parse(saved));
//         } else {
//           setUser(null);
//         }
//       } catch (e) {
//         setUser(null);
//       }
//     };

//     // Lần đầu load
//     syncUser();

//     // Lắng nghe mọi thay đổi của localStorage (login ở tab khác, logout, v.v.)
//     window.addEventListener("storage", syncUser);

//     // Nhiều dự án hay dispatch custom event sau khi login/logout
//     window.addEventListener("userChanged", syncUser);
//     window.addEventListener("login", syncUser);
//     window.addEventListener("logout", syncUser);

//     return () => {
//       window.removeEventListener("storage", syncUser);
//       window.removeEventListener("userChanged", syncUser);
//       window.removeEventListener("login", syncUser);
//       window.removeEventListener("logout", syncUser);
//     };
//   }, []);

//   // Nếu Auth component của bạn có dispatch event thì thêm cái này vào cuối file Auth.jsx
//   // (nếu chưa có thì thêm luôn, chỉ 3 dòng):
//   // localStorage.setItem("user", JSON.stringify(data));
//   // window.dispatchEvent(new Event("userChanged"));
//   // window.dispatchEvent(new Event("login"));

//   return (
//     <>
//       <header className="flex items-center justify-between px-6 h-16 bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
//         <div className="flex items-center gap-6">
//           <Button variant="ghost" size="icon" onClick={onMenuClick}>
//             <Menu className="h-6 w-6" />
//           </Button>
//           <div className="flex items-center gap-3">
//             <img src={logo} alt="WeTube Studio" className="h-7" />
//             <span className="text-xl font-bold text-gray-800">Studio</span>
//           </div>
//         </div>

//         <div className="flex items-center gap-4">
//           {/* NÚT TẠO LUÔN HIỆN */}
//           <Button
//             onClick={() => setShowUploadModal(true)}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 px-5 py-2.5"
//           >
//             <Video className="h-5 w-5" />
//             Tạo
//           </Button>

//           {/* Auth component – tự động cập nhật avatar khi login */}
//           <Auth user={user} setUser={setUser} />
//         </div>
//       </header>

//       {/* MODAL CHI TIẾT VIDEO */}
//       {showUploadModal && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white border-b px-8 py-5 flex items-center justify-between z-10">
//               <h2 className="text-2xl font-bold">Chi tiết video</h2>
//               <button
//                 onClick={() => setShowUploadModal(false)}
//                 className="p-2 hover:bg-gray-100 rounded-full"
//               >
//                 <X className="w-7 h-7" />
//               </button>
//             </div>
//             <div className="p-8">
//               <VideoDetails onClose={() => setShowUploadModal(false)} />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Thông báo nhẹ nhàng khi chưa login
//       {!user && (
//         <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-6 py-3 rounded-full text-sm font-medium z-50 shadow-lg animate-pulse">
//           Bạn chưa đăng nhập → Một số tính năng bị giới hạn
//         </div>
//       )} */}
//     </>
//   );
// }

import { Menu, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "../../../assets/logo.svg";
import Auth from "@/components/Auth";                    // Component Auth chung – tự lo hết
import { useNavigate } from "react-router-dom";

export default function HeaderStudio({ onMenuClick }) {
  const navigate = useNavigate();

  const handleCreateClick = () => {
    // Auth component sẽ tự hiển thị modal login nếu chưa đăng nhập
    // Nhưng để UX tốt hơn, ta có thể kiểm tra nhanh localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      // Bạn có thể để Auth tự xử lý, hoặc hiện toast nhẹ
      alert("Vui lòng đăng nhập để tải video lên!");
      return;
    }

    // Đã đăng nhập → chuyển sang trang upload
    navigate("/studio/upload");
  };

  return (
    <header className="flex items-center justify-between px-6 h-16 bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      {/* LEFT */}
      <div className="flex items-center gap-6">
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-3">
          <img src={logo} alt="WeTube Studio" className="h-7" />
          <span className="text-xl font-bold text-gray-800">Studio</span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* Nút Tạo → chuyển trang */}
        <Button
          onClick={handleCreateClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 px-5 py-2.5"
        >
          <Video className="h-5 w-5" />
          Tạo
        </Button>

        {/* Auth component – hoàn toàn độc lập, tự động cập nhật */}
        <Auth />
      </div>
    </header>
  );
}