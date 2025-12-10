

import { Video, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext"; // Dùng đúng Context của bạn

const menuItems = [
  { icon: Video, label: "Nội dung", to: "/studio" },
  // Thêm sau nếu cần: Analytics, Comments, Settings...
];

export default function SidebarStudio({ isOpen, onNavigate, className }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleExit = () => {
    // Không xóa token, chỉ chuyển về trang chủ
    navigate("/"); // hoặc "/" nếu trang chủ của bạn
  };

  // // Hàm xử lý logout – dùng đúng logout() từ Context
  // const handleLogout = () => {
  //   logout();                    // Xóa token, user trong Context + localStorage
  //   navigate("/");               // Quay về trang chủ
  // };

  // Lấy chữ cái đầu tên kênh hoặc username
  const getInitials = () => {
    const name = user?.channelName || user?.username || "";
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <aside
      className={cn(
        "fixed top-14 left-0 z-40 h-[calc(100vh-56px)] bg-white border-r border-gray-200 transition-all duration-300 shadow-lg",
        isOpen ? "w-64" : "w-20",
        className
      )}
    >
      {/* PHẦN THÔNG TIN NGƯỜI DÙNG */}
      {/* <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 ring-4 ring-white shadow-2xl bg-gradient-to-br from-blue-500 to-purple-600">
            <AvatarImage src={user?.avatarUrl} alt={user?.username} />
            <AvatarFallback className="text-xl font-bold text-white bg-gradient-to-br from-blue-600 to-purple-600">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          {isOpen && (
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 truncate text-sm">
                {user?.channelName || user?.username || "Khách"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || (isAuthenticated ? "Đã đăng nhập" : "Chưa đăng nhập")}
              </p>
            </div>
          )}
        </div>
      </div> */}

      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {/* Avatar đơn giản hơn, bỏ bớt `ring-4` nếu không cần nhấn mạnh */}
          <Avatar className="w-12 h-12 shadow-md bg-gray-200">
            <AvatarImage src={user?.avatarUrl} alt={user?.username} />
            <AvatarFallback className="text-lg font-semibold text-gray-700 bg-gray-100">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          {isOpen && (
            <div className="min-w-0 flex-1">
              {/* Tên người dùng */}
              <p className="font-semibold text-gray-800 truncate text-base">
                {user?.channelName || user?.username || "Khách"}
              </p>
              {/* Trạng thái/Email mỏng hơn, màu xám nhạt */}
              <p className="text-xs text-gray-400 truncate font-light italic">
                {user?.email || (isAuthenticated ? "Đã đăng nhập" : "Chưa đăng nhập")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MENU CHÍNH */}
      <nav className="flex-1 py-4">
        {menuItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={label}
            to={to}
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-4 px-5 py-3 mx-3 rounded-xl text-left transition-all",
                isActive
                  ? "bg-blue-50 text-blue-700 font-semibold shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              )
            }
          >
            <Icon size={22} className="flex-shrink-0" />
            {isOpen && <span className="text-sm font-medium">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* NÚT THOÁT */}
      <div className="p-3 border-t border-gray-200">
        <button onClick={handleExit} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f2f2f2] transition-colors text-[#0f0f0f]">
          <LogOut size={20} className="flex-shrink-0" />
          {isOpen && <span className="text-sm font-medium">Thoát</span>}
        </button>

      </div>
    </aside>
  );
}