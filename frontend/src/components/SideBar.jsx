import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useGetMySubscriptionsQuery } from "@/features/videos/videoSlice";
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
import channelApi from "@/api/channelApi";

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
  // const [subscriptions, setSubscriptions] = useState([]);

  // useEffect(() => {
  //   const fetchChannels = async () => {
  //     try {
  //       const res = await channelApi.getMySubscriptions();
  //       const channels = res.data;
  //       console.log(channels);
  //       console.log(res);
  //       setSubscriptions(channels);
  //     } catch (error) {
  //       console.error("Lỗi tải kênh:", error);
  //     }
  //   };
  //   fetchChannels();
  // }, []);
  const { data: subscriptions} = useGetMySubscriptionsQuery();
  if (!subscriptions) {
    return;
  }
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
      <h3 className="px-4 py-2 text-sm font-semibold text-foreground">
        Kênh đăng ký
      </h3>
      <div className="flex flex-col gap-1">
        {subscriptions.map((channel) => (
          <NavLink
            key={channel._id}
            to={`/channel/${channel._id}`}
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
              <AvatarFallback>{channel.channelName[0]}</AvatarFallback>
            </Avatar>
            <span className="truncate">{channel.channelName}</span>
          </NavLink>
        ))}
        {/* Link "Tất cả kênh" */}
        {renderNavLink({
          icon: List,
          label: "Tất cả kênh",
          to: "/subscriptions/all",
        })}
      </div>
    </nav>
  );
}
