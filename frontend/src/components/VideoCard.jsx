import { Link } from "react-router";
import { formatDateTime } from "@/utils/formatDateTime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical } from "lucide-react";

const getAvatarSrc = (channel) => {
  return channel?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${channel?.channelName || "User"}`;
};

const getChannelName = (channel) => {
  return channel?.channelName ? channel?.channelName : "Unknown Channel";
};

// 1. Component con cho kiểu "Grid" (Trang chủ)
function GridCard({ video }) {
  // Map dữ liệu từ Backend mới
  const videoId = video._id;
  const title = video.title;
  const thumbnail = video.thumbnailUrl;
  const duration = "10:00"; 
  const views = video.stats?.views || 0;
  const publishedAt = video.createdAt; // Backend dùng createdAt
  
  // Thông tin kênh (được populate/lookup từ backend)
  const channel = video.channelInfo || video.ownerId; // Tùy vào endpoint trả về tên field nào
  const channelId = channel?._id;
  const channelName = getChannelName(channel);
  const avatarSrc = getAvatarSrc(channel);

  return (
    <div className="flex flex-col transition-all duration-200 cursor-pointer group hover:bg-secondary hover:rounded-xl hover:shadow-lg hover:p-2 hover:-m-2 hover:z-10 hover:relative">
      <Link to={`/video/${videoId}`}>
        <div className="relative w-full overflow-hidden aspect-video rounded-xl">
          <img
            src={thumbnail}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded-sm">
            {duration}
          </span>
        </div>
      </Link>

      <div className="flex gap-3 px-1 mt-3 group-hover:px-0">
        <Link to={`/channel/${channelId}`} className="flex-shrink-0">
          <Avatar className="w-9 h-9">
            <AvatarImage src={avatarSrc} />
            <AvatarFallback>{channelName[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col flex-grow">
          <Link to={`/video/${videoId}`}>
            <h3 className="text-base font-medium leading-snug line-clamp-2 text-foreground">
              {title}
            </h3>
          </Link>
          <div className="mt-1 text-sm text-muted-foreground">
            <Link
              to={`/channel/${channelId}`}
              className="block hover:text-foreground"
            >
              {channelName}
            </Link>
            <div className="flex items-center">
              <span>{views.toLocaleString()} lượt xem</span>
              <span className="mx-1">•</span>
              <span>{formatDateTime(publishedAt)}</span>
            </div>
          </div>
        </div>
        <button className="p-1 cursor-pointer">
          <MoreVertical size={20} className="text-foreground" />
        </button>
      </div>
    </div>
  );
}

// 2. Component con cho kiểu "Row" (Trang tìm kiếm / Danh sách ngang)
function RowCard({ video }) {
  const videoId = video._id;
  const title = video.title;
  const description = video.description || "Không có mô tả";
  const thumbnail = video.thumbnailUrl;
  const views = video.stats?.views || video.views;
  const publishedAt = video.createdAt;

  const channel = video.channelInfo || video.ownerId;
  const channelId = channel?.channelId;
  let channelName = getChannelName(channel);
  if (channelName === "Unknown Channel") {
    channelName = video.channelName;
  }
  const avatarSrc = getAvatarSrc(channel);

  return (
    <Link to={`/video/${videoId}`}>
      <div className="flex flex-col gap-4 p-2 bg-transparent rounded-lg cursor-pointer sm:flex-row hover:bg-secondary">
        <div className="relative flex-shrink-0">
            <img
            src={thumbnail}
            alt={title}
            className="object-cover w-full rounded-lg aspect-video sm:w-[360px] sm:h-[200px]"
            />
             <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded-sm">
                10:00
            </span>
        </div>
        
        <div className="flex flex-col flex-grow">
          <h3 className="mb-1 text-lg font-medium line-clamp-2 text-foreground">
            {title}
          </h3>
          <p className="mb-2 text-xs text-muted-foreground">
            {views.toLocaleString()} lượt xem • {formatDateTime(publishedAt)}
          </p>
          
          <div className="flex items-center gap-2 py-2 mb-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={avatarSrc} />
              <AvatarFallback>{channelName[0]}</AvatarFallback>
            </Avatar>
            <p className="text-xs text-muted-foreground hover:text-foreground">{channelName}</p>
          </div>
          
          <p className="hidden text-xs text-muted-foreground line-clamp-2 sm:block">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

// 3. Component con cho kiểu "Compact" (Video đề xuất bên phải trang Watch)
function CompactCard({ video }) {
  const videoId = video._id;
  const title = video.title;
  const thumbnail = video.thumbnailUrl;
  const views = video.stats?.views || 0;
  const publishedAt = video.createdAt;

  const channel = video.channelInfo || video.ownerId;
  const channelName = getChannelName(channel);

  return (
    <Link to={`/video/${videoId}`} className="block w-full">
      <div className="flex gap-2 p-1 bg-transparent rounded-lg cursor-pointer hover:bg-secondary/50 group">
        <div className="relative flex-shrink-0 w-[168px] h-[94px]">
            <img
            src={thumbnail}
            alt={title}
            className="object-cover w-full h-full rounded-lg"
            />
            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded-sm">
                10:00
            </span>
        </div>
        
        <div className="relative flex flex-col flex-grow min-w-0 pr-6">
          <h3 className="mb-1 text-sm font-medium transition-colors line-clamp-2 text-foreground group-hover:text-primary">
            {title}
          </h3>
          <p className="text-xs truncate text-muted-foreground hover:text-foreground">
            {channelName}
          </p>
          <div className="text-xs text-muted-foreground flex items-center mt-0.5">
            <span>{views.toLocaleString()} lượt xem</span>
            <span className="mx-1">•</span>
            <span>{formatDateTime(publishedAt)}</span>
          </div>
           <button className="absolute right-[-8px] top-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical size={16} className="text-foreground" />
            </button>
        </div>
      </div>
    </Link>
  );
}

// 4. Component chính: Quyết định render kiểu nào
export default function VideoCard({ video, variant = "grid" }) {
  if (!video) return null; // Safety check

  switch (variant) {
    case "row":
      return <RowCard video={video} />;
    case "compact":
      return <CompactCard video={video} />;
    case "grid":
    default:
      return <GridCard video={video} />;
  }
}