// // src/components/studio/StudioSidebar.jsx

// import { NavLink, Link } from "react-router";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   LayoutGrid,
//   BarChart3,
//   MessageSquare,
//   LogOut,
//   Video,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import avatar from "@/assets/react.svg";
// // (Hàm render StudioNavLink giữ nguyên)
// const StudioNavLink = ({ to, icon: Icon, label }) => (
//   <NavLink
//     to={to}
//     end
//     className={({ isActive }) =>
//       cn(
//         "flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-secondary",
//         isActive && "bg-secondary font-semibold"
//       )
//     }
//   >
//     <Icon className="w-5 h-5" />
//     <span>{label}</span>
//   </NavLink>
// );

// export default function StudioSidebar() {
//   const user = {
//     name: "Antonio Codes",
//     avatar,
//   };

//   return (
//     <aside className="flex flex-col flex-shrink-0 h-full p-4 overflow-y-auto border-r w-60 bg-background border-border">
//       <div className="flex flex-col items-center justify-center gap-3 mb-6 text-center">
//         <Avatar className="w-15 h-15 ring-4 ring-primary ring-offset-4 ring-offset-background">
//           <AvatarImage src={user.avatar} />
//         </Avatar>
//         <div>
//           <p className="text-sm font-semibold text-muted-foreground">
//             Your profile
//           </p>
//           <p className="font-semibold text-foreground">{user.name}</p>
//         </div>
//       </div>

//       {/* Menu (flex-1 để đẩy nút Exit xuống) */}
//       <nav className="flex flex-col gap-2">
//         <StudioNavLink to="/studio/content" icon={Video} label="Content" />
//       </nav>

//       {/* Nút Exit (luôn ở dưới cùng) */}
//       <div className="">
//         <hr className="my-1" />
//         <Link
//           to="/"
//           className="flex items-center gap-3 px-3 py-2 transition-all rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
//         >
//           <LogOut className="w-5 h-5" />
//           Exit studio
//         </Link>
//       </div>
//     </aside>
//   );
// }

import { Video, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
// import { NavLink } from "react-router";
import { NavLink, useNavigate } from "react-router";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const menuItems = [
  { icon: Video, label: "Content", to: "/studio/content" }
];


export default function SidebarStudio({ isOpen, user, className }) {
  // ✅ KHỞI TẠO HOOK navigate
  const navigate = useNavigate();
  // Hàm xử lý khi click vào mục Content
  // ✅ HÀM XỬ LÝ LOGOUT
  const handleLogout = () => {
    // 1. Xóa Token/Session/User Data khỏi Local Storage hoặc Redux (Thêm logic này)
    // Ví dụ: localStorage.removeItem('authToken');

    // 2. Điều hướng về trang chủ (http://localhost:5173/)
    // Dùng "/" để trỏ về root path.
    navigate("/");
  };

  const handleNavigation = (e, itemTo) => {
    // Nếu mục là 'Content' (hoặc Dashboard), chúng ta gọi onNavigate để reset trạng thái
    // Mục đích là quay lại VideoList từ VideoDetails
    if (itemTo === "/studio/content" && onNavigate) {
      // Ngăn NavLink thực hiện điều hướng mặc định (nếu cần)
      // Tuy nhiên, NavLink sẽ xử lý điều hướng, ta chỉ cần kích hoạt reset state.
      onNavigate();
    }
  };

  // Hàm lấy chữ cái đầu
  const getInitials = (name) => {
    if (!name) return "👋";
    return name
      .split(" ")
      .map(n => n[0].toUpperCase())
      .slice(0, 2)
      .join("");
  };
  return (
    <aside
      className={cn(
        "fixed top-14 left-0 z-40 h-[calc(100vh-56px)] bg-white border-r border-[#d9d9d9] transition-all duration-300",
        isOpen ? "w-64" : "w-20",
        className
      )}
    >

      <div className="p-4 border-b border-[#d9d9d9]">
        <div className="flex items-center gap-3">
          {/* Thay thế DIV thủ công bằng Component Avatar */}
          <Avatar className="flex-shrink-0 w-12 h-12 border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 to-blue-600">
            {user?.avatar ? (
              // Nếu có avatar URL, sử dụng AvatarImage
              <AvatarImage src={user.avatar} alt={user?.name || "User"} />
            ) : (
              // Nếu không có avatar URL, sử dụng AvatarFallback
              <AvatarFallback className="text-xl text-white">
                {/* Hiển thị ký tự đầu tiên của tên hoặc icon "👋" */}
                {user?.name ? user.name.charAt(0).toUpperCase() : "👋"}
              </AvatarFallback>
            )}
          </Avatar>

          {isOpen && (
            <div className="overflow-hidden">
              <p className="font-medium text-sm text-[#0f0f0f] truncate">Your profile</p>
              <p className="text-sm text-[#606060] truncate">{user?.name || "User"}</p>
            </div>
          )}
        </div>
      </div>

      {/* MENU ITEMS */}
      <nav className="flex flex-col flex-1 p-2">
        {menuItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={label}
            to={to}
            onClick={(e) => handleNavigation(e, to)}
            className={({ isActive }) =>
              cn(
                "flex no-underline items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors w-full text-left",
                isActive
                  ? "bg-[#f2f2f2] text-[#0f0f0f]"
                  : "text-[#0f0f0f] hover:bg-[#f2f2f2]"
              )
            }
          >
            <Icon size={20} className="flex-shrink-0" />
            {isOpen && <span className="text-sm font-medium">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* LOGOUT */}
      <div className="p-2 border-t border-[#d9d9d9]">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f2f2f2] transition-colors text-[#0f0f0f]">
          <LogOut size={20} className="flex-shrink-0" />
          {isOpen && <span className="text-sm font-medium">Thoát</span>}
        </button>
      </div>
    </aside>
  );
}
