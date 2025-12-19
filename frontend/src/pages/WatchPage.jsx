// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router";
// import {
//   ThumbsUp,
//   ThumbsDown,
//   Share2,
//   MoreHorizontal,
//   User,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";
// import { formatDateTime } from "@/utils/formatDateTime";

// // Import API và Context
// import videoApi from "@/api/videoApi";
// import channelApi from "@/api/channelApi";
// import { useAuth } from "@/context/AuthContext";
// import CommentSection from "@/components/CommentSection";
// import { useAddToHistoryMutation } from "@/features/videos/videoSlice";
// import RecommendVideos from "@/components/RecommendVideos";

// function WatchPage() {
//   const { videoId } = useParams();
//   const { user: currentUser, isAuthenticated } = useAuth();
//   const [addToHistory] = useAddToHistoryMutation();

//   const [videoData, setVideoData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // --- 1. THÊM STATE CHO DISLIKE ---
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [isLiked, setIsLiked] = useState(false);
//   const [isDisliked, setIsDisliked] = useState(false); // Trạng thái Dislike
//   const [likeCount, setLikeCount] = useState(0);
//   const [dislikeCount, setDislikeCount] = useState(0); // Số lượng Dislike
//   const [subCount, setSubCount] = useState(0);

//   // Fetch dữ liệu Video
//   useEffect(() => {
//     const fetchVideoDetail = async () => {
//       try {
//         setLoading(true);
//         const res = await videoApi.getDetail(videoId);
//         const data = res.data || res;

//         if (!data) throw new Error("Không nhận được dữ liệu video");

//         setVideoData(data);

//         // --- 2. CẬP NHẬT STATE TỪ DỮ LIỆU API ---
//         setLikeCount(data?.stats?.likes || 0);
//         setDislikeCount(data?.stats?.dislikes || 0); // Lấy số dislike
//         setSubCount(data?.ownerId?.subscribersCount || 0);

//         // Lấy Owner ID an toàn
//         const ownerId = data?.ownerId?._id || data?.ownerId?.id;

//         if (isAuthenticated && ownerId) {
//           checkUserInteractions(ownerId);
//         }
//       } catch (err) {
//         console.error("Lỗi tải video:", err);
//         setVideoData(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (videoId) {
//       fetchVideoDetail();
//     }
//   }, [videoId, isAuthenticated]);

//   useEffect(() => {
//     if (videoId) {
//       addToHistory(videoId);
//     }
//   }, [videoId, addToHistory]);

//   // Hàm kiểm tra trạng thái (Chỉ check Like và Sub, Dislike tạm để false)
//   const checkUserInteractions = async (channelId) => {
//     try {
//       const subRes = await channelApi.getMySubscriptions();
//       const mySubs = Array.isArray(subRes) ? subRes : subRes.data || [];
//       const isSub = mySubs.some((sub) => {
//         const subId = sub.channelId?._id || sub.channelId?.id || sub._id;
//         return subId?.toString() === channelId?.toString();
//       });
//       setIsSubscribed(isSub);

//       const likeRes = await videoApi.getLikedVideos();
//       const myLikes = Array.isArray(likeRes) ? likeRes : likeRes.data || [];
//       const isLike = myLikes.some((vid) => {
//         const vidId = vid._id || vid.id;
//         return vidId?.toString() === videoId?.toString();
//       });
//       setIsLiked(isLike);

//       // Hiện tại API chưa trả về danh sách Dislike nên mặc định là false
//       // setIsDisliked(...)
//     } catch (error) {
//       console.warn("Lỗi kiểm tra tương tác:", error);
//     }
//   };

//   // Xử lý SUBSCRIBE (Giữ nguyên)
//   const handleSubscribe = async () => {
//     if (!isAuthenticated) return alert("Vui lòng đăng nhập để đăng ký kênh!");
//     const prevSub = isSubscribed;
//     setIsSubscribed(!prevSub);
//     setSubCount((prev) => (!prevSub ? prev + 1 : prev - 1));

//     try {
//       const channel = videoData?.ownerId || {};
//       const channelId = channel._id || channel.id;
//       if (prevSub) await channelApi.unsubscribe(channelId);
//       else await channelApi.subscribe(channelId);
//     } catch (error) {
//       setIsSubscribed(prevSub);
//       setSubCount((prev) => (prevSub ? prev + 1 : prev - 1));
//       alert("Thao tác thất bại.");
//     }
//   };

//   // --- 3. XỬ LÝ LIKE (CÓ LOGIC BỎ DISLIKE) ---
//   const handleLike = async () => {
//     if (!isAuthenticated) return alert("Vui lòng đăng nhập!");

//     // Lưu trạng thái cũ để revert nếu lỗi API
//     const prevLiked = isLiked;
//     const prevDisliked = isDisliked;

//     // Cập nhật State UI ngay lập tức
//     if (prevLiked) {
//       // Đang Like -> Bấm phát nữa -> Hủy Like
//       setIsLiked(false);
//       setLikeCount((prev) => Math.max(0, prev - 1)); // Tránh số âm
//       try {
//         await videoApi.removeInteraction(videoId);
//       } catch (e) {}
//     } else {
//       // Chưa Like -> Bấm -> Like
//       setIsLiked(true);
//       setLikeCount((prev) => prev + 1);

//       // Nếu đang Dislike thì phải bỏ Dislike đi
//       if (prevDisliked) {
//         setIsDisliked(false);
//         setDislikeCount((prev) => Math.max(0, prev - 1));
//       }
//       try {
//         await videoApi.like(videoId);
//       } catch (e) {}
//     }
//   };

//   // --- 4. XỬ LÝ DISLIKE (CÓ LOGIC BỎ LIKE) ---
//   const handleDislike = async () => {
//     if (!isAuthenticated) return alert("Vui lòng đăng nhập!");

//     const prevDisliked = isDisliked;
//     const prevLiked = isLiked;

//     // Cập nhật State UI ngay lập tức
//     if (prevDisliked) {
//       // Đang Dislike -> Bấm phát nữa -> Hủy Dislike
//       setIsDisliked(false);
//       setDislikeCount((prev) => Math.max(0, prev - 1));
//       try {
//         await videoApi.removeInteraction(videoId);
//       } catch (e) {}
//     } else {
//       // Chưa Dislike -> Bấm -> Dislike
//       setIsDisliked(true);
//       setDislikeCount((prev) => prev + 1);

//       // Nếu đang Like thì phải bỏ Like đi
//       if (prevLiked) {
//         setIsLiked(false);
//         setLikeCount((prev) => Math.max(0, prev - 1));
//       }
//       try {
//         await videoApi.dislike(videoId);
//       } catch (e) {}
//     }
//   };

//   // --- RENDER ---
//   if (loading) return <div className="p-10 text-center">Đang tải video...</div>;
//   if (!videoData)
//     return <div className="p-10 text-center">Video không tồn tại.</div>;

//   const channel = videoData.ownerId || {};
//   const currentUserId = currentUser?._id || currentUser?.id;
//   const channelOwnerId = channel._id || channel.id;
//   const isOwner =
//     currentUserId &&
//     channelOwnerId &&
//     currentUserId.toString() === channelOwnerId.toString();
//   const showSubscribeButton = !isOwner;

//   const getChannelId = (owner) => {
//     if (!owner) return null;
//     return owner._id || owner.id || owner.channelId?._id || owner.channelId?.id;
//   };

//   return (
//     <>
//       <div className = "flex flex-col md:flex-row justify-between max-w-[1600px] mx-auto px-4 md:px-6 pt-4">
//         <div className="w-full md:w-[60%] lg:w-[62%] space-y-4">
//         <div className="relative w-full overflow-hidden bg-black rounded-xl aspect-video group">
//           <video
//             src={videoData.videoUrl}
//             poster={videoData.thumbnailUrl}
//             controls
//             autoPlay
//             className="object-contain w-full h-full"
//           />
//         </div>

//         <div className="mt-4">
//           <h1 className="text-lg font-semibold md:text-xl line-clamp-2">
//             {videoData.title}
//           </h1>
//         </div>

//         <div className="flex flex-col justify-between gap-4 py-3 border-b sm:flex-row sm:items-start border-border">
//           <div className="flex items-center w-full gap-3 sm:w-auto">
//             <Link to={`/channel/${channelOwnerId}`}>
//               <Avatar className="w-10 h-10 cursor-pointer">
//                 <AvatarImage src={channel.avatarUrl} />
//                 <AvatarFallback>
//                   {channel.channelName?.[0]?.toUpperCase() || "U"}
//                 </AvatarFallback>
//               </Avatar>
//             </Link>
//             <div className="flex flex-col">
//               <Link to={`/channel/${channelOwnerId}`}>
//                 <p className="text-sm font-semibold cursor-pointer hover:text-foreground">
//                   {channel.channelName || "Unknown Channel"}
//                 </p>
//               </Link>
//               <p className="text-xs text-muted-foreground">
//                 {subCount.toLocaleString()} người đăng ký
//               </p>
//             </div>

//             {showSubscribeButton && (
//               <Button
//                 onClick={handleSubscribe}
//                 className={`ml-6 rounded-full h-9 px-4 font-medium text-sm transition-colors ${
//                   isSubscribed
//                     ? "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
//                     : "bg-foreground text-background hover:bg-foreground/90"
//                 }`}
//               >
//                 {isSubscribed ? "Đã đăng ký" : "Đăng ký"}
//               </Button>
//             )}
//           </div>

//           <div className="flex items-center gap-2 pb-1 overflow-x-auto no-scrollbar sm:pb-0">
//             <div className="flex items-center rounded-full bg-secondary h-9">
//               {/* NÚT LIKE */}
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className={`rounded-l-full h-full px-3 hover:bg-secondary-foreground/10 border-r border-secondary-foreground/20 gap-2 ${
//                   isLiked ? "text-blue-600" : ""
//                 }`}
//                 onClick={handleLike}
//               >
//                 <ThumbsUp
//                   className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
//                 />
//                 <span className="text-sm font-medium">
//                   {likeCount.toLocaleString()}
//                 </span>
//               </Button>

//               {/* NÚT DISLIKE */}
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className={`h-full px-3 rounded-r-full hover:bg-secondary-foreground/10 gap-2 ${
//                   isDisliked ? "text-blue-600" : ""
//                 }`}
//                 onClick={handleDislike}
//               >
//                 <ThumbsDown
//                   className={`w-4 h-4 ${isDisliked ? "fill-current" : ""}`}
//                 />
//                 {/* Hiển thị số lượng Dislike */}
//                 <span className="text-sm font-medium">
//                   {dislikeCount > 0 ? dislikeCount.toLocaleString() : ""}
//                 </span>
//               </Button>
//             </div>

//             <Button
//               variant="secondary"
//               size="sm"
//               className="gap-2 px-3 rounded-full h-9"
//             >
//               <Share2 className="w-4 h-4" /> Chia sẻ
//             </Button>

//             <Button
//               variant="ghost"
//               size="icon"
//               className="rounded-full w-9 h-9 bg-secondary hover:bg-secondary/80"
//             >
//               <MoreHorizontal className="w-5 h-5" />
//             </Button>
//           </div>
//         </div>

//         <div className="mt-4">
//           <Card className="transition-colors border-0 cursor-pointer bg-secondary/50 rounded-xl hover:bg-secondary/70">
//             <CardContent className="p-3 text-sm text-foreground">
//               <div className="flex gap-2 mb-1 font-medium">
//                 <span>
//                   {videoData.stats?.views?.toLocaleString() || 0} lượt xem
//                 </span>
//                 <span>•</span>
//                 <span>{formatDateTime(videoData.createdAt)}</span>
//               </div>
//               <p className="text-sm leading-relaxed whitespace-pre-wrap">
//                 {videoData.description || "Không có mô tả cho video này."}
//               </p>
//               {videoData.tags && videoData.tags.length > 0 && (
//                 <div className="flex flex-wrap gap-1 mt-3">
//                   {videoData.tags.map((tag, i) => (
//                     <span
//                       key={i}
//                       className="text-xs text-blue-500 hover:underline"
//                     >
//                       #{tag}
//                     </span>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         <CommentSection videoId={videoId} />
//         </div>
//         <div className="w-full md:w-[38%] lg:w-[36%] mt-6 md:mt-0 space-y-2">
//             <RecommendVideos tags={ videoData.tags }/>
//         </div>
//       </div>
//     </>
//   );
// }

// export default WatchPage;


import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Sửa lại import từ 'react-router-dom' cho chuẩn
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDateTime } from "@/utils/formatDateTime";

// Import API và Context
import videoApi from "@/api/videoApi";
import channelApi from "@/api/channelApi";
import { useAuth } from "@/context/AuthContext";
import CommentSection from "@/components/CommentSection";
import RecommendVideos from "@/components/RecommendVideos";

// Import Hooks RTK Query
// Lưu ý: Đảm bảo đường dẫn import đúng file bạn đã cấu hình (videosApi.js hoặc videoSlice.js)
import { 
  useAddToHistoryMutation, 
  useDislikeVideoMutation, 
  useGetAuthStatusQuery, 
  useLikeVideoMutation, 
  useRemoveInteractionMutation 
} from "@/features/videos/videoSlice"; 

function WatchPage() {
  const { videoId } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();

  // --- 1. KHAI BÁO HOOKS RTK QUERY (PHẢI Ở TRONG COMPONENT) ---
  const [addToHistory] = useAddToHistoryMutation();
  const [likeVideo] = useLikeVideoMutation();
  const [dislikeVideo] = useDislikeVideoMutation();
  const [removeInteraction] = useRemoveInteractionMutation();

  // Hook lấy trạng thái Like/Dislike/Sub (Tự động chạy khi có videoId và User)
  const { data: authStatus } = useGetAuthStatusQuery(videoId, { 
      skip: !videoId || !isAuthenticated 
  });

  // --- 2. LOCAL STATE ---
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);

  // State tương tác UI
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subCount, setSubCount] = useState(0);
  
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);

  // --- 3. FETCH DỮ LIỆU VIDEO (Main Content) ---
  useEffect(() => {
    const fetchVideoDetail = async () => {
      try {
        setLoading(true);
        const res = await videoApi.getDetail(videoId);
        const data = res.data || res;

        if (!data) throw new Error("Không nhận được dữ liệu video");

        setVideoData(data);
        
        // Cập nhật số liệu ban đầu từ Video Data
        setLikeCount(data.stats?.likes || 0);
        setDislikeCount(data.stats?.dislikes || 0);
        setSubCount(data.ownerId?.subscribersCount || 0);

      } catch (err) {
        console.error("Lỗi tải video:", err);
        setVideoData(null);
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideoDetail();
    }
  }, [videoId]); // Bỏ isAuthenticated để khách cũng xem được video

  // --- 4. ĐỒNG BỘ TRẠNG THÁI TỪ RTK QUERY ---
  useEffect(() => {
    if (authStatus) {
       // Cập nhật nút xanh/xám dựa trên API auth-status
       setIsLiked(authStatus.status === 'like');
       setIsDisliked(authStatus.status === 'dislike');
       setIsSubscribed(authStatus.isSubscribed); // Đồng bộ cả Sub nếu API trả về
    }
  }, [authStatus]);

  // --- 5. LƯU LỊCH SỬ ---
  useEffect(() => {
    if (videoId && isAuthenticated) {
      addToHistory(videoId);
    }
  }, [videoId, isAuthenticated, addToHistory]);


  // --- 6. CÁC HÀM XỬ LÝ SỰ KIỆN ---

  // Xử lý SUBSCRIBE (Giữ nguyên logic cũ của bạn)
  const handleSubscribe = async () => {
    if (!isAuthenticated) return alert("Vui lòng đăng nhập để đăng ký kênh!");
    const prevSub = isSubscribed;
    setIsSubscribed(!prevSub);
    setSubCount((prev) => (!prevSub ? prev + 1 : prev - 1));

    try {
      const channel = videoData?.ownerId || {};
      const channelId = channel._id || channel.id;
      if (prevSub) await channelApi.unsubscribe(channelId);
      else await channelApi.subscribe(channelId);
    } catch (error) {
      setIsSubscribed(prevSub); // Revert nếu lỗi
      setSubCount((prev) => (prevSub ? prev + 1 : prev - 1));
      alert("Thao tác thất bại.");
    }
  };

  // Xử lý LIKE (Optimistic UI + RTK Mutation)
  const handleLike = async () => {
    if (!isAuthenticated) return alert("Vui lòng đăng nhập!");

    const prevLiked = isLiked;
    const prevDisliked = isDisliked;

    if (prevLiked) {
      // Đang Like -> Hủy Like
      setIsLiked(false);
      setLikeCount(prev => Math.max(0, prev - 1));
      removeInteraction(videoId); // Gọi API ngầm
    } else {
      // Chưa Like -> Like
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
      
      // Nếu đang Dislike thì tắt Dislike
      if (prevDisliked) {
         setIsDisliked(false);
         setDislikeCount(prev => Math.max(0, prev - 1));
      }
      likeVideo(videoId); // Gọi API ngầm
    }
  };

  // Xử lý DISLIKE (Optimistic UI + RTK Mutation)
  const handleDislike = async () => {
    if (!isAuthenticated) return alert("Vui lòng đăng nhập!");

    const prevDisliked = isDisliked;
    const prevLiked = isLiked;

    if (prevDisliked) {
      // Đang Dislike -> Hủy Dislike
      setIsDisliked(false);
      setDislikeCount(prev => Math.max(0, prev - 1));
      removeInteraction(videoId);
    } else {
      // Chưa Dislike -> Dislike
      setIsDisliked(true);
      setDislikeCount(prev => prev + 1);

      // Nếu đang Like thì tắt Like
      if (prevLiked) {
         setIsLiked(false);
         setLikeCount(prev => Math.max(0, prev - 1));
      }
      dislikeVideo(videoId);
    }
  };


  // --- 7. RENDER ---
  if (loading) return <div className="p-10 text-center">Đang tải video...</div>;
  if (!videoData) return <div className="p-10 text-center">Video không tồn tại.</div>;

  const channel = videoData.ownerId || {};
  const currentUserId = currentUser?._id || currentUser?.id;
  const channelOwnerId = channel._id || channel.id;
  const isOwner = currentUserId && channelOwnerId && currentUserId.toString() === channelOwnerId.toString();
  const showSubscribeButton = !isOwner;

  return (
    <div className="flex flex-col md:flex-row justify-between max-w-[1600px] mx-auto px-4 md:px-6 pt-4">
      {/* CỘT TRÁI: Player, Info, Comment */}
      <div className="w-full md:w-[60%] lg:w-[62%] space-y-4">
        
        {/* Video Player */}
        <div className="relative w-full overflow-hidden bg-black rounded-xl aspect-video group">
          <video
            src={videoData.videoUrl}
            poster={videoData.thumbnailUrl}
            controls
            autoPlay
            className="object-contain w-full h-full"
          />
        </div>

        {/* Title */}
        <div className="mt-4">
          <h1 className="text-lg font-semibold md:text-xl line-clamp-2">
            {videoData.title}
          </h1>
        </div>

        {/* Channel Info & Actions */}
        <div className="flex flex-col justify-between gap-4 py-3 border-b sm:flex-row sm:items-start border-border">
          <div className="flex items-center w-full gap-3 sm:w-auto">
            <Link to={`/channel/${channelOwnerId}`}>
              <Avatar className="w-10 h-10 cursor-pointer">
                <AvatarImage src={channel.avatarUrl} />
                <AvatarFallback>
                  {channel.channelName?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex flex-col">
              <Link to={`/channel/${channelOwnerId}`}>
                <p className="text-sm font-semibold cursor-pointer hover:text-foreground">
                  {channel.channelName || "Unknown Channel"}
                </p>
              </Link>
              <p className="text-xs text-muted-foreground">
                {subCount.toLocaleString()} người đăng ký
              </p>
            </div>

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

          <div className="flex items-center gap-2 pb-1 overflow-x-auto no-scrollbar sm:pb-0">
            <div className="flex items-center rounded-full bg-secondary h-9">
              {/* NÚT LIKE */}
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-l-full h-full px-3 hover:bg-secondary-foreground/10 border-r border-secondary-foreground/20 gap-2 ${
                  isLiked ? "text-blue-600" : ""
                }`}
                onClick={handleLike}
              >
                <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                <span className="text-sm font-medium">
                  {likeCount.toLocaleString()}
                </span>
              </Button>

              {/* NÚT DISLIKE */}
              <Button
                variant="ghost"
                size="sm"
                className={`h-full px-3 rounded-r-full hover:bg-secondary-foreground/10 gap-2 ${
                  isDisliked ? "text-blue-600" : ""
                }`}
                onClick={handleDislike}
              >
                <ThumbsDown className={`w-4 h-4 ${isDisliked ? "fill-current" : ""}`} />
                <span className="text-sm font-medium">
                  {dislikeCount > 0 ? dislikeCount.toLocaleString() : ""}
                </span>
              </Button>
            </div>

            <Button variant="secondary" size="sm" className="gap-2 px-3 rounded-full h-9">
              <Share2 className="w-4 h-4" /> Chia sẻ
            </Button>

            <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 bg-secondary hover:bg-secondary/80">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Description Box */}
        <div className="mt-4">
          <Card className="transition-colors border-0 cursor-pointer bg-secondary/50 rounded-xl hover:bg-secondary/70">
            <CardContent className="p-3 text-sm text-foreground">
              <div className="flex gap-2 mb-1 font-medium">
                <span>
                  {videoData.stats?.views?.toLocaleString() || 0} lượt xem
                </span>
                <span>•</span>
                <span>{formatDateTime(videoData.createdAt)}</span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {videoData.description || "Không có mô tả cho video này."}
              </p>
              {videoData.tags && videoData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {videoData.tags.map((tag, i) => (
                    <span key={i} className="text-xs text-blue-500 hover:underline">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Comments */}
        <CommentSection videoId={videoId} />
      </div>

      {/* CỘT PHẢI: Video Gợi ý */}
      <div className="w-full md:w-[38%] lg:w-[36%] mt-6 md:mt-0 space-y-2">
          {/* Truyền tags vào để lấy video liên quan chuẩn xác */}
          <RecommendVideos tags={videoData.tags} />
      </div>
    </div>
  );
}

export default WatchPage;