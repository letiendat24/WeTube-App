// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router";
// import {
//   ThumbsUp,
//   ThumbsDown,
//   Share2,
//   MoreHorizontal,
//   Send,
//   User,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";
// import { formatDateTime } from "@/utils/formatDateTime";

// // Import API và Context
// import axiosClient from "@/api/axiosClient";
// import { useAuth } from "@/context/AuthContext";

// function WatchPage() {
//   const { videoId } = useParams();
//   const { user: currentUser } = useAuth(); // Lấy user đang đăng nhập để xử lý like/comment

//   const [videoData, setVideoData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isSubscribed, setIsSubscribed] = useState(false); // State giả lập cho nút đăng ký

//   // Fetch dữ liệu video từ Backend
//   useEffect(() => {
//     const fetchVideoDetail = async () => {
//       try {
//         setLoading(true);
//         // Gọi API Backend: GET /api/videos/:videoId
//         // Backend sẽ tự động tăng view count
//         const res = await axiosClient.get(`/videos/${videoId}`);
//         setVideoData(res.data);

//         // TODO: Gọi thêm API check subscription status nếu cần
//         // const subRes = await axiosClient.get(`/channels/${res.data.ownerId._id}/subscription-status`);
//         // setIsSubscribed(subRes.data.isSubscribed);

//       } catch (err) {
//         console.error("Lỗi tải video:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (videoId) {
//       fetchVideoDetail();
//     }
//   }, [videoId]);

//   // Xử lý Like (Demo)
//   const handleLike = async () => {
//     if (!currentUser) return alert("Vui lòng đăng nhập để thích video!");
//     try {
//       await axiosClient.post(`/videos/${videoId}/like`);
//       // Cập nhật UI tạm thời
//       setVideoData(prev => ({
//         ...prev,
//         stats: { ...prev.stats, likes: prev.stats.likes + 1 }
//       }));
//     } catch (error) {
//       console.error("Lỗi like:", error);
//     }
//   };

//   // Xử lý Subscribe (Demo)
//   const handleSubscribe = async () => {
//     if (!currentUser) return alert("Vui lòng đăng nhập!");
//     try {
//         if (isSubscribed) {
//             await axiosClient.delete(`/channels/${videoData.ownerId._id}/subscribe`);
//             setIsSubscribed(false);
//         } else {
//             await axiosClient.post(`/channels/${videoData.ownerId._id}/subscribe`);
//             setIsSubscribed(true);
//         }
//     } catch (error) {
//         console.error("Lỗi subscribe:", error);
//     }
//   };

//   if (loading) return <div className="p-10 text-center">Đang tải video...</div>;
//   if (!videoData) return <div className="p-10 text-center">Video không tồn tại hoặc đã bị xóa.</div>;

//   // Dữ liệu từ Backend (videoData)
//   // Cấu trúc: { _id, title, description, videoUrl, ownerId: { channelName, avatarUrl, subscribersCount }, stats: { views, likes } }

//   const channel = videoData.ownerId || {}; // channelInfo đã được populate từ backend

//   return (
//     <>
//       {/* Video Player */}
//       <div className="w-full overflow-hidden bg-black rounded-xl aspect-video">
//         <video
//           src={videoData.videoUrl} // URL video từ Cloudinary/S3
//           poster={videoData.thumbnailUrl} // Thumbnail hiển thị trước khi play
//           controls
//           autoPlay
//           className="w-full h-full object-contain"
//         />
//         {/* Nếu muốn dùng iframe youtube cũ thì giữ lại đoạn này, nhưng backend của bạn trả về file mp4 nên dùng thẻ video */}
//       </div>

//       {/* Video Title */}
//       <div className="mt-4">
//         <h1 className="text-lg font-semibold md:text-xl line-clamp-2">{videoData.title}</h1>
//       </div>

//       {/* Video Info + Actions */}
//       <div className="flex flex-col justify-between py-3 border-b sm:flex-row sm:items-start border-border gap-4">

//         {/* Channel Info */}
//         <div className="flex items-center gap-3 w-full sm:w-auto">
//           <Link to={`/channel/${channel._id}`}>
//             <Avatar className="w-10 h-10 cursor-pointer">
//                 <AvatarImage src={channel.avatarUrl} />
//                 <AvatarFallback>{channel.channelName?.[0]?.toUpperCase()}</AvatarFallback>
//             </Avatar>
//           </Link>
//           <div className="flex flex-col">
//             <Link to={`/channel/${channel._id}`}>
//                 <p className="font-semibold text-sm hover:text-foreground cursor-pointer">
//                     {channel.channelName}
//                 </p>
//             </Link>
//             <p className="text-xs text-muted-foreground">
//               {channel.subscribersCount?.toLocaleString()} người đăng ký
//             </p>
//           </div>

//           <Button
//             onClick={handleSubscribe}
//             className={`ml-6 rounded-full h-9 px-4 font-medium text-sm transition-colors ${
//                 isSubscribed
//                 ? "bg-secondary text-foreground hover:bg-secondary/80"
//                 : "bg-foreground text-background hover:bg-foreground/90"
//             }`}
//           >
//             {isSubscribed ? "Đã đăng ký" : "Đăng ký"}
//           </Button>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
//           <div className="flex items-center bg-secondary rounded-full h-9">
//             <Button
//                 variant="ghost"
//                 size="sm"
//                 className="rounded-l-full h-full px-3 hover:bg-secondary-foreground/10 border-r border-secondary-foreground/20 gap-2"
//                 onClick={handleLike}
//             >
//               <ThumbsUp className="w-4 h-4" />
//               <span className="text-sm font-medium">{videoData.stats?.likes?.toLocaleString() || 0}</span>
//             </Button>
//             <Button
//                 variant="ghost"
//                 size="sm"
//                 className="rounded-r-full h-full px-3 hover:bg-secondary-foreground/10"
//             >
//               <ThumbsDown className="w-4 h-4" />
//             </Button>
//           </div>

//           <Button variant="secondary" size="sm" className="rounded-full h-9 px-3 gap-2">
//             <Share2 className="w-4 h-4" /> Chia sẻ
//           </Button>

//           <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 bg-secondary hover:bg-secondary/80">
//             <MoreHorizontal className="w-5 h-5" />
//           </Button>
//         </div>
//       </div>

//       {/* Description */}
//       <div className="mt-4">
//         <Card className="border-0 bg-secondary/50 rounded-xl hover:bg-secondary/70 transition-colors cursor-pointer">
//             <CardContent className="p-3 text-sm text-foreground">
//             <div className="flex gap-2 font-medium mb-1">
//                 <span>{videoData.stats?.views?.toLocaleString()} lượt xem</span>
//                 <span>•</span>
//                 <span>{formatDateTime(videoData.createdAt)}</span>
//             </div>

//             <p className="whitespace-pre-wrap leading-relaxed text-sm">
//                 {videoData.description || "Không có mô tả cho video này."}
//             </p>

//             {/* Tags */}
//             {videoData.tags && videoData.tags.length > 0 && (
//                 <div className="mt-3 flex flex-wrap gap-1">
//                     {videoData.tags.map((tag, i) => (
//                         <span key={i} className="text-blue-500 text-xs hover:underline">#{tag}</span>
//                     ))}
//                 </div>
//             )}
//             </CardContent>
//         </Card>
//       </div>

//       {/* Comment Section (Placeholder) */}
//       <div className="mt-6">
//         <div className="flex items-center gap-8 mb-4">
//              <h2 className="text-lg font-bold">
//             {videoData.stats?.comments || 0} Bình luận
//             </h2>
//             {/* Sort options could go here */}
//         </div>

//         {/* Comment Input */}
//         <div className="flex gap-3 mb-6">
//           <Avatar className="w-10 h-10">
//             <AvatarImage src={currentUser?.avatarUrl} />
//             <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
//           </Avatar>
//           <div className="flex flex-1 flex-col gap-2">
//             <Input
//               placeholder="Viết bình luận..."
//               className="bg-transparent border-0 border-b border-muted-foreground/30 rounded-none px-0 py-1 focus-visible:ring-0 focus-visible:border-foreground transition-colors placeholder:text-sm"
//             />
//             <div className="flex justify-end gap-2 mt-1">
//                  <Button variant="ghost" size="sm" className="rounded-full">Hủy</Button>
//                  <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-secondary disabled:text-muted-foreground">
//                     Bình luận
//                 </Button>
//             </div>
//           </div>
//         </div>

//         {/* Comment List Placeholder */}
//         <div className="text-center py-10 text-muted-foreground text-sm">
//             Tính năng bình luận đang được phát triển...
//         </div>
//       </div>
//     </>
//   );
// }

// export default WatchPage;

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  MoreHorizontal,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/utils/formatDateTime";

// Import API và Context
import videoApi from "@/api/videoApi";
import channelApi from "@/api/channelApi";
import { useAuth } from "@/context/AuthContext";

function WatchPage() {
  const { videoId } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();

  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);

  // State cho tương tác
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [subCount, setSubCount] = useState(0);

  // 1. Fetch dữ liệu Video
  useEffect(() => {
    const fetchVideoDetail = async () => {
      try {
        setLoading(true);
        console.log("Đang tải video ID:", videoId);

        // Gọi API lấy chi tiết video
        const res = await videoApi.getDetail(videoId);
        const data = res; // Dữ liệu trả về từ backend

        console.log("Dữ liệu video nhận được:", data);

        if (!data) {
          throw new Error("Không nhận được dữ liệu video");
        }

        setVideoData(data);

        // Cập nhật state đếm an toàn với toán tử ?.
        setLikeCount(data?.stats?.likes || 0);
        setSubCount(data?.ownerId?.subscribersCount || 0);

        // Nếu đã đăng nhập, kiểm tra trạng thái Like/Sub
        if (isAuthenticated && data?.ownerId?._id) {
          checkUserInteractions(data.ownerId._id);
        }
      } catch (err) {
        console.error("Lỗi tải video:", err);
        setVideoData(null); // Set null để hiển thị giao diện lỗi
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideoDetail();
    }
  }, [videoId, isAuthenticated]);

  // 2. Hàm kiểm tra trạng thái Like/Sub
  const checkUserInteractions = async (channelId) => {
    try {
      // Kiểm tra Subscribe
      const subRes = await channelApi.getMySubscriptions();
      const isSub = subRes.data.some((sub) => sub.channelId?._id === channelId);
      setIsSubscribed(isSub);

      // Kiểm tra Like
      const likeRes = await videoApi.getLikedVideos();
      const isLike = likeRes.data.some((vid) => vid._id === videoId);
      setIsLiked(isLike);
    } catch (error) {
      console.warn(
        "Không thể kiểm tra trạng thái tương tác (có thể do chưa login):",
        error
      );
    }
  };

  // 3. Xử lý SUBSCRIBE / UNSUBSCRIBE
 const handleSubscribe = async () => {
    if (!isAuthenticated) return alert("Vui lòng đăng nhập để đăng ký kênh!");
    
    // Optimistic Update
    const previousState = isSubscribed;
    const previousCount = subCount;

    setIsSubscribed(!isSubscribed);
    setSubCount(prev => isSubscribed ? prev - 1 : prev + 1);

    try {
        // --- SỬA LẠI ĐOẠN NÀY ---
        // Lấy đúng trường .id từ dữ liệu ownerId
        const channel = videoData?.ownerId || {};
        const channelId = channel._id || channel.id; 

        if (!channelId) {
            throw new Error("Không tìm thấy Channel ID (dữ liệu bị thiếu id)");
        }
        // ------------------------

        if (isSubscribed) {
            await channelApi.unsubscribe(channelId);
        } else {
            await channelApi.subscribe(channelId);
        }
    } catch (error) {
        console.error("Lỗi subscribe:", error);
        setIsSubscribed(previousState);
        setSubCount(previousCount);
        alert("Thao tác thất bại.");
    }
  };

  // 4. Xử lý LIKE / UNLIKE
  const handleLike = async () => {
    if (!isAuthenticated) return alert("Vui lòng đăng nhập để thích video!");

    // Optimistic Update
    const previousLiked = isLiked;
    const previousCount = likeCount;

    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      if (isLiked) {
        await videoApi.removeLike(videoId);
      } else {
        await videoApi.like(videoId);
      }
    } catch (error) {
      console.error("Lỗi like:", error);
      // Revert nếu lỗi
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
    }
  };

  // --- RENDER GIAO DIỆN ---

  if (loading) return <div className="p-10 text-center">Đang tải video...</div>;

  // Nếu videoData vẫn null sau khi load xong -> Hiển thị lỗi
  if (!videoData)
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
        <p className="text-xl font-semibold">Video không tồn tại.</p>
        <p className="text-muted-foreground text-sm">
          Đường dẫn có thể bị sai hoặc video đã bị xóa.
        </p>
        <Link to="/">
          <Button variant="outline">Quay về trang chủ</Button>
        </Link>
      </div>
    );

  const channel = videoData.ownerId || {};


  const currentUserId = currentUser?._id || currentUser?.id;
  const channelOwnerId = channel?._id || channel?.id;

  // 2. Log để kiểm tra (Bạn sẽ thấy ID hiện ra thay vì undefined)
  console.log("Debug ID:", { myID: currentUserId, ownerID: channelOwnerId });

  // 3. So sánh (Chỉ coi là Owner nếu CẢ 2 ID đều tồn tại và giống nhau)
  const isOwner = currentUserId && channelOwnerId && (currentUserId.toString() === channelOwnerId.toString());
  
  // 4. Quyết định hiển thị: Chỉ hiện khi KHÔNG PHẢI là chủ kênh
  const showSubscribeButton = !isOwner;

  return (
    <>
      {/* Video Player */}
      <div className="w-full overflow-hidden bg-black rounded-xl aspect-video relative group">
        <video
          src={videoData.videoUrl}
          poster={videoData.thumbnailUrl}
          controls
          autoPlay
          className="w-full h-full object-contain"
        />
      </div>

      {/* Video Title */}
      <div className="mt-4">
        <h1 className="text-lg font-semibold md:text-xl line-clamp-2">
          {videoData.title}
        </h1>
      </div>

      {/* Info & Actions */}
      <div className="flex flex-col justify-between py-3 border-b sm:flex-row sm:items-start border-border gap-4">
        {/* Channel Info */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link to={`/channel/${channel._id}`}>
            <Avatar className="w-10 h-10 cursor-pointer">
              <AvatarImage src={channel.avatarUrl} />
              <AvatarFallback>
                {channel.channelName?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-col">
            <Link to={`/channel/${channel._id}`}>
              <p className="font-semibold text-sm hover:text-foreground cursor-pointer">
                {channel.channelName || "Unknown Channel"}
              </p>
            </Link>
            <p className="text-xs text-muted-foreground">
              {subCount.toLocaleString()} người đăng ký
            </p>
          </div>

          {/* Nút Đăng ký (Ẩn nếu là chính mình) */}
          {showSubscribeButton && (
            <Button
              onClick={handleSubscribe}
              className={`ml-6 rounded-full h-9 px-4 font-medium text-sm transition-colors ${
                isSubscribed
                  ? "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                  : "bg-foreground text-background hover:bg-foreground/90"
              }`}
            >
              {isSubscribed ? "Đã đăng ký" : "Đăng ký"}
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <div className="flex items-center bg-secondary rounded-full h-9">
            {/* Nút Like */}
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-l-full h-full px-3 hover:bg-secondary-foreground/10 border-r border-secondary-foreground/20 gap-2 ${
                isLiked ? "text-blue-600" : ""
              }`}
              onClick={handleLike}
            >
              <ThumbsUp
                className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
              />
              <span className="text-sm font-medium">
                {likeCount.toLocaleString()}
              </span>
            </Button>

            {/* Nút Dislike */}
            <Button
              variant="ghost"
              size="sm"
              className="rounded-r-full h-full px-3 hover:bg-secondary-foreground/10"
            >
              <ThumbsDown className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="rounded-full h-9 px-3 gap-2"
          >
            <Share2 className="w-4 h-4" /> Chia sẻ
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-9 h-9 bg-secondary hover:bg-secondary/80"
          >
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Description */}
      <div className="mt-4">
        <Card className="border-0 bg-secondary/50 rounded-xl hover:bg-secondary/70 transition-colors cursor-pointer">
          <CardContent className="p-3 text-sm text-foreground">
            <div className="flex gap-2 font-medium mb-1">
              {/* Sử dụng ?. ở đây để tránh lỗi undefined */}
              <span>
                {videoData.stats?.views?.toLocaleString() || 0} lượt xem
              </span>
              <span>•</span>
              <span>{formatDateTime(videoData.createdAt)}</span>
            </div>

            <p className="whitespace-pre-wrap leading-relaxed text-sm">
              {videoData.description || "Không có mô tả cho video này."}
            </p>

            {videoData.tags && videoData.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {videoData.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-blue-500 text-xs hover:underline"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comment Section */}
      <div className="mt-6">
        <div className="flex items-center gap-8 mb-4">
          <h2 className="text-lg font-bold">
            {videoData.stats?.comments || 0} Bình luận
          </h2>
        </div>

        <div className="flex gap-3 mb-6">
          <Avatar className="w-10 h-10">
            <AvatarImage src={currentUser?.avatarUrl} />
            <AvatarFallback>
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col gap-2">
            <Input
              placeholder="Viết bình luận..."
              className="bg-transparent border-0 border-b border-muted-foreground/30 rounded-none px-0 py-1 focus-visible:ring-0 focus-visible:border-foreground transition-colors placeholder:text-sm"
            />
            <div className="flex justify-end gap-2 mt-1">
              <Button variant="ghost" size="sm" className="rounded-full">
                Hủy
              </Button>
              <Button
                size="sm"
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-secondary disabled:text-muted-foreground"
              >
                Bình luận
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WatchPage;
