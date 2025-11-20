

// import { NavLink } from "react-router"
// import { Home, Clapperboard, PlaySquare, User } from "lucide-react"
// import { cn } from "@/lib/utils"

// const menuItems = [
//   { icon: Home, label: "Trang chủ", to: "/" },
//   { icon: Clapperboard, label: "Shorts", to: "/shorts" },
//   { icon: PlaySquare, label: "Kênh đăng ký", to: "/subscriptions" },
//   { icon: User, label: "Bạn", to: "/you" },
  
// ]

// export default function Sidebar({ className }) {
//   return (
//     <aside
//       className={cn(
//         "fixed top-0 left-0 z-40 flex flex-col items-center gap-2 w-[72px] h-screen pt-16",
//         className
//       )}
//     >
//       <nav className="flex flex-col items-center w-full gap-1">
//         {menuItems.map(({ icon: Icon, label, to }) => (
//           <NavLink
//             key={label}
//             to={to}
//             end
//             className={({ isActive }) =>
//               cn(
//                 "flex flex-col items-center justify-center w-full py-3 text-[12px] font-medium rounded-xl transition-colors",
//                 isActive
//                   ? "text-[var(--accent-color)] bg-[var(--surface-active)]"
//                   : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
//               )
//             }
//           >
//             {({ isActive }) => (
//               <>
//                 <Icon
//                   size={22}
//                   strokeWidth={isActive ? 2.5 : 2}
//                   className="mb-1"
//                 />
//                 <span>{label}</span>
//               </>
//             )}
//           </NavLink>
//         ))}
//       </nav>
//     </aside>
//   )
// }
// src/components/Sidebar.jsx

import { useEffect, useState } from "react";
import { NavLink } from "react-router"; 
import {
  Home,
  PlaySquare,
  Flame,
  History,
  ThumbsUp,
  ListVideo,
  User,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Cần Avatar


// Phần 1: Menu chính
const mainMenuItems = [
  { icon: Home, label: "Trang chủ", to: "/" },
  { icon: PlaySquare, label: "Kênh đăng ký", to: "/subscribed" },
  { icon: Flame, label: "Thịnh hành", to: "/trending" },
];

// Phần 2: Menu "Của bạn"
const youMenuItems = [
  { icon: History, label: "Video đã xem", to: "/history" },
  { icon: ThumbsUp, label: "Video đã thích", to: "/liked" },
  { icon: ListVideo, label: "Danh sách phát", to: "/playlists" },
];

// Hàm render NavLink 
const renderNavLink = ({ icon: Icon, label, to }) => (
  <NavLink
    key={label}
    to={to}
    end
    className={({ isActive }) =>
      cn(
        "flex flex-row items-center gap-4 w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors",
        isActive
          ? "text-foreground font-semibold bg-secondary" // Style khi active
          : "text-foreground hover:bg-secondary" // Style khi không active
      )
    }
  >
    {({ isActive }) => (
      <>
        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
        <span>{label}</span>
      </>
    )}
  </NavLink>
);

export default function Sidebar() {
  const [subscriptions, setSubscriptions] = useState([]);

  // Tự động tải các kênh (giả lập)
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        // 1. Tải tất cả video
        const res = await fetch("http://localhost:3001/videos");
        const videos = await res.json();

        // 2. Tạo danh sách các kênh duy nhất từ video
        const channelsMap = new Map();
        videos.forEach((video) => {
          if (!channelsMap.has(video.channelId)) {
            channelsMap.set(video.channelId, {
              id: video.channelId,
              name: video.channel,
              // Tạo avatar giả từ chữ cái đầu
              avatar: `https://via.placeholder.com/24.png?text=${video.channel[0]}`,
            });
          }
        });
        
        // 3. Cập nhật state (chỉ lấy 5 kênh đầu tiên làm ví dụ)
        setSubscriptions(Array.from(channelsMap.values()).slice(0, 5));

      } catch (error) {
        console.error("Lỗi tải kênh:", error);
      }
    };
    fetchChannels();
  }, []);

  return (
    <nav className="flex flex-col w-full gap-1 p-2">
      {/* PHẦN 1: MENU CHÍNH */}
      <div className="flex flex-col gap-1">
        {mainMenuItems.map(renderNavLink)}
      </div>

      <hr className="my-2 border-border" />

      {/* PHẦN 2: CỦA BẠN */}
      <h3 className="px-4 py-2 text-sm font-semibold text-foreground">Bạn</h3>
      <div className="flex flex-col gap-1">
        {youMenuItems.map(renderNavLink)}
      </div>

      <hr className="my-2 border-border" />

      {/* PHẦN 3: KÊNH ĐĂNG KÝ */}
      <h3 className="px-4 py-2 text-sm font-semibold text-foreground">Kênh đăng ký</h3>
      <div className="flex flex-col gap-1">
        {subscriptions.map((channel) => (
          <NavLink
            key={channel.id}
            to={`/channel/${channel.id}`}
            className={({ isActive }) =>
              cn(
                "flex flex-row items-center gap-4 w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "text-foreground font-semibold bg-secondary"
                  : "text-foreground hover:bg-secondary"
              )
            }
          >
            <Avatar className="w-6 h-6">
              <AvatarImage src={channel.avatar} />
              <AvatarFallback>{channel.name[0]}</AvatarFallback>
            </Avatar>
            <span className="truncate">{channel.name}</span>
          </NavLink>
        ))}
        {/* Link "Tất cả kênh" */}
        {renderNavLink({ icon: List, label: "Tất cả kênh", to: "/subscriptions/all" })}
      </div>
    </nav>
  );
}