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
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shadow-sm">
      {/* LEFT */}
      <div className="flex items-center gap-6">
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Menu className="w-6 h-6" />
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
          <Video className="w-5 h-5" />
          Tạo
        </Button>

        {/* Auth component – hoàn toàn độc lập, tự động cập nhật */}
        <Auth />
      </div>
    </header>
  );
}