// import { useEffect, useState } from "react";
// import { VideoGridSkeleton } from "./VideoSkeleton";
// import { formatDateTime } from "../utils/formatDateTime";
// import { Link } from "react-router";
// export default function VideoCard() {
//   const [videos, setVideos] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const res = await fetch("http://localhost:3001/videos");
//         if (!res.ok) throw new Error("Can not download videos");
//         const data = await res.json();
//         setVideos(data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (isLoading) {
//     return <VideoGridSkeleton />;
//   }

//   return (
//     <div className="grid gap-6 p-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
//       {videos.map((video) => (
//         <div
//           key={video.id}
//           className="flex flex-col transition-all duration-200 cursor-pointer group hover:bg-gray-300 hover:rounded-xl hover:shadow-lg hover:p-2 hover:-m-4 hover:z-10 hover:relative"
//         >
//           <div className="relative w-full overflow-hidden aspect-video rounded-t-xl">
//             <img
//               src={video.thumbnail}
//               alt={video.snippet.title}
//               className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
//             />
//           </div>
//           <Link to={`/video/${video.id}`}>
//             <div className="flex p-3 mt-6 space-x-3 bg-transparent">
//               {/* Avatar kênh */}
//               <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 font-bold text-gray-600 bg-gray-300 rounded-full">
//                 {video.channel?.[0]?.toUpperCase()}
//               </div>
//               {/* Thông tin video */}
//               <div className="flex flex-col">
//                 <h3 className="font-semibold text-gray-900 line-clamp-2">
//                   {video.snippet.title}
//                 </h3>
//                 <p className="text-sm text-gray-500">{video.channel}</p>
//                 <p className="text-xs text-gray-400">
//                   {video.views.toLocaleString()} lượt xem •{" "}
//                   {formatDateTime(video.publishedAt)}
//                 </p>
//               </div>
//             </div>
//           </Link>
//         </div>
//       ))}
//     </div>
//   );
// }
// src/components/VideoCard.jsx (File MỚI)

import { Link } from "react-router";
import { formatDateTime } from "@/utils/formatDateTime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical } from "lucide-react";

// 1. Component con cho kiểu "Grid" (Trang chủ)
function GridCard({ video }) {
  return (
    <div className="flex flex-col transition-all duration-200 cursor-pointer group hover:bg-secondary hover:rounded-xl hover:shadow-lg hover:p-2 hover:-m-2 hover:z-10 hover:relative"
    >
      <Link to={`/video/${video.id}`}>
        <div className="relative w-full overflow-hidden aspect-video rounded-xl">
          <img
            src={video.snippet.thumbnails.standard.url}
            alt={video.snippet.title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded-sm">
            {video.duration}
          </span>
        </div>
      </Link>

      <div className="flex gap-3 px-1 mt-3 group-hover:px-0">
        <Link to={`/channel/${video.channelId}`} className="flex-shrink-0">
          <Avatar className="w-9 h-9">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${video.channel}`} />
            <AvatarFallback>{video.channel?.[0]}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col flex-grow">
          <Link to={`/video/${video.id}`}>
            <h3 className="text-base font-medium leading-snug line-clamp-2 text-foreground">
              {video.snippet.title}
            </h3>
          </Link>
          <div className="mt-1 text-sm text-muted-foreground">
            <Link to={`/channel/${video.channelId}`} className="hover:text-foreground">
              <p>{video.channel}</p>
            </Link>
            <p>
              {video.statistics.viewCount.toLocaleString()} lượt xem • {formatDateTime(video.snippet.publishedAt)}
            </p>
          </div>
        </div>
        <button className="p-1 cursor-pointer">
          <MoreVertical size={20} className="text-foreground" />
        </button>
      </div>
    </div>
  );
}

// 2. Component con cho kiểu "Row" (Trang tìm kiếm)
function RowCard({ video }) {
  return (
    <Link to={`/video/${video.id}`}>
      <div className="flex flex-col gap-4 p-2 bg-transparent rounded-lg cursor-pointer sm:flex-row hover:bg-secondary">
        <img
          src={video.thumbnail}
          alt={video.snippet.title}
          className="object-cover w-full rounded-lg aspect-video sm:w-64 sm:h-36"
        />
        <div className="flex flex-col">
          <h3 className="text-lg font-medium line-clamp-2 text-foreground">
            {video.snippet.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {video.views.toLocaleString()} lượt xem • {formatDateTime(video.publishedAt)}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${video.channel}`} />
              <AvatarFallback>{video.channel?.[0]}</AvatarFallback>
            </Avatar>
            <p className="text-sm text-muted-foreground">{video.channel}</p>
          </div>
          <p className="hidden mt-2 text-sm text-muted-foreground line-clamp-2 sm:block">
            {video.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

// 3. Component con cho kiểu "Compact" (Video đề xuất)
function CompactCard({ video }) {
  return (
    <Link to={`/video/${video.id}`}>
      <div className="flex gap-3 p-2 bg-transparent rounded-lg cursor-pointer hover:bg-secondary">
        <img
          src={video.thumbnail}
          alt={video.snippet.title}
          className="object-cover w-40 h-24 rounded-lg"
        />
        <div className="flex flex-col">
          <h3 className="text-sm font-medium line-clamp-2 text-foreground">
            {video.snippet.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">{video.channel}</p>
          <p className="text-xs text-muted-foreground">
            {video.views.toLocaleString()} lượt xem • {formatDateTime(video.publishedAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}

// 4. Component chính: Quyết định render kiểu nào
export default function VideoCard({ video, variant = "grid" }) {
  // Mặc định là 'grid'
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