// // import { useEffect, useState } from "react";
// // import { useParams, Link } from "react-router";
// // import {
// //   ThumbsUp,
// //   ThumbsDown,
// //   Share2,
// //   MoreHorizontal,
// //   User,
// // } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import { Input } from "@/components/ui/input";
// // import { formatDateTime } from "@/utils/formatDateTime";

// // // Import API và Context
// // import videoApi from "@/api/videoApi";
// // import channelApi from "@/api/channelApi";
// // import { useAuth } from "@/context/AuthContext";
// // import CommentSection from "@/components/CommentSection";

// // function WatchPage() {
// //   const { videoId } = useParams();
// //   const { user: currentUser, isAuthenticated } = useAuth();

// //   const [videoData, setVideoData] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   // State cho tương tác
// //   const [isSubscribed, setIsSubscribed] = useState(false);
// //   const [isLiked, setIsLiked] = useState(false);
// //   const [likeCount, setLikeCount] = useState(0);
// //   const [subCount, setSubCount] = useState(0);

// //   // 1. Fetch dữ liệu Video
// //   useEffect(() => {
// //     const fetchVideoDetail = async () => {
// //       try {
// //         setLoading(true);
// //         console.log("Đang tải video ID:", videoId);

// //         // Gọi API lấy chi tiết video
// //         const res = await videoApi.getDetail(videoId);
// //         const data = res; // Dữ liệu trả về từ backend

// //         console.log("Dữ liệu video nhận được:", data);

// //         if (!data) {
// //           throw new Error("Không nhận được dữ liệu video");
// //         }

// //         setVideoData(data);

// //         // Cập nhật state đếm an toàn với toán tử ?.
// //         setLikeCount(data?.stats?.likes || 0);
// //         setSubCount(data?.ownerId?.subscribersCount || 0);

// //         // Nếu đã đăng nhập, kiểm tra trạng thái Like/Sub
// //         if (isAuthenticated && data?.ownerId?._id) {
// //           checkUserInteractions(data.ownerId._id);
// //         }
// //       } catch (err) {
// //         console.error("Lỗi tải video:", err);
// //         setVideoData(null); // Set null để hiển thị giao diện lỗi
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     if (videoId) {
// //       fetchVideoDetail();
// //     }
// //   }, [videoId, isAuthenticated]);

// //   // 2. Hàm kiểm tra trạng thái Like/Sub
// //   const checkUserInteractions = async (channelId) => {
// //     try {
// //       // Kiểm tra Subscribe
// //       const subRes = await channelApi.getMySubscriptions();
// //       const isSub = subRes.data.some((sub) => sub.channelId?._id === channelId);
// //       setIsSubscribed(isSub);

// //       // Kiểm tra Like
// //       const likeRes = await videoApi.getLikedVideos();
// //       const isLike = likeRes.data.some((vid) => vid._id === videoId);
// //       setIsLiked(isLike);
// //     } catch (error) {
// //       console.warn(
// //         "Không thể kiểm tra trạng thái tương tác (có thể do chưa login):",
// //         error
// //       );
// //     }
// //   };

// //   // 3. Xử lý SUBSCRIBE / UNSUBSCRIBE
// //  const handleSubscribe = async () => {
// //     if (!isAuthenticated) return alert("Vui lòng đăng nhập để đăng ký kênh!");
    
// //     // Optimistic Update
// //     const previousState = isSubscribed;
// //     const previousCount = subCount;

// //     setIsSubscribed(!isSubscribed);
// //     setSubCount(prev => isSubscribed ? prev - 1 : prev + 1);

// //     try {
// //         // --- SỬA LẠI ĐOẠN NÀY ---
// //         // Lấy đúng trường .id từ dữ liệu ownerId
// //         const channel = videoData?.ownerId || {};
// //         const channelId = channel._id || channel.id; 

// //         if (!channelId) {
// //             throw new Error("Không tìm thấy Channel ID (dữ liệu bị thiếu id)");
// //         }
// //         // ------------------------

// //         if (isSubscribed) {
// //             await channelApi.unsubscribe(channelId);
// //         } else {
// //             await channelApi.subscribe(channelId);
// //         }
// //     } catch (error) {
// //         console.error("Lỗi subscribe:", error);
// //         setIsSubscribed(previousState);
// //         setSubCount(previousCount);
// //         alert("Thao tác thất bại.");
// //     }
// //   };

// //   // 4. Xử lý LIKE / UNLIKE
// //   const handleLike = async () => {
// //     if (!isAuthenticated) return alert("Vui lòng đăng nhập để thích video!");

// //     // Optimistic Update
// //     const previousLiked = isLiked;
// //     const previousCount = likeCount;

// //     setIsLiked(!isLiked);
// //     setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

// //     try {
// //       if (isLiked) {
// //         await videoApi.removeLike(videoId);
// //       } else {
// //         await videoApi.like(videoId);
// //       }
// //     } catch (error) {
// //       console.error("Lỗi like:", error);
// //       // Revert nếu lỗi
// //       setIsLiked(previousLiked);
// //       setLikeCount(previousCount);
// //     }
// //   };

// //   // --- RENDER GIAO DIỆN ---

// //   if (loading) return <div className="p-10 text-center">Đang tải video...</div>;

// //   // Nếu videoData vẫn null sau khi load xong -> Hiển thị lỗi
// //   if (!videoData)
// //     return (
// //       <div className="flex flex-col items-center justify-center p-10 space-y-4 text-center">
// //         <p className="text-xl font-semibold">Video không tồn tại.</p>
// //         <p className="text-sm text-muted-foreground">
// //           Đường dẫn có thể bị sai hoặc video đã bị xóa.
// //         </p>
// //         <Link to="/">
// //           <Button variant="outline">Quay về trang chủ</Button>
// //         </Link>
// //       </div>
// //     );

// //   const channel = videoData.ownerId || {};


// //   const currentUserId = currentUser?._id || currentUser?.id;
// //   const channelOwnerId = channel?._id || channel?.id;

// //   // 2. Log để kiểm tra (Bạn sẽ thấy ID hiện ra thay vì undefined)
// //   console.log("Debug ID:", { myID: currentUserId, ownerID: channelOwnerId });

// //   // 3. So sánh (Chỉ coi là Owner nếu CẢ 2 ID đều tồn tại và giống nhau)
// //   const isOwner = currentUserId && channelOwnerId && (currentUserId.toString() === channelOwnerId.toString());
  
// //   // 4. Quyết định hiển thị: Chỉ hiện khi KHÔNG PHẢI là chủ kênh
// //   const showSubscribeButton = !isOwner;

// //   return (
// //     <>
// //       {/* Video Player */}
// //       <div className="relative w-full overflow-hidden bg-black rounded-xl aspect-video group">
// //         <video
// //           src={videoData.videoUrl}
// //           poster={videoData.thumbnailUrl}
// //           controls
// //           autoPlay
// //           className="object-contain w-full h-full"
// //         />
// //       </div>

// //       {/* Video Title */}
// //       <div className="mt-4">
// //         <h1 className="text-lg font-semibold md:text-xl line-clamp-2">
// //           {videoData.title}
// //         </h1>
// //       </div>

// //       {/* Info & Actions */}
// //       <div className="flex flex-col justify-between gap-4 py-3 border-b sm:flex-row sm:items-start border-border">
// //         {/* Channel Info */}
// //         <div className="flex items-center w-full gap-3 sm:w-auto">
// //           <Link to={`/channel/${channel._id}`}>
// //             <Avatar className="w-10 h-10 cursor-pointer">
// //               <AvatarImage src={channel.avatarUrl} />
// //               <AvatarFallback>
// //                 {channel.channelName?.[0]?.toUpperCase() || "U"}
// //               </AvatarFallback>
// //             </Avatar>
// //           </Link>
// //           <div className="flex flex-col">
// //             <Link to={`/channel/${channel._id}`}>
// //               <p className="text-sm font-semibold cursor-pointer hover:text-foreground">
// //                 {channel.channelName || "Unknown Channel"}
// //               </p>
// //             </Link>
// //             <p className="text-xs text-muted-foreground">
// //               {subCount.toLocaleString()} người đăng ký
// //             </p>
// //           </div>

// //           {/* Nút Đăng ký (Ẩn nếu là chính mình) */}
// //           {showSubscribeButton && (
// //             <Button
// //               onClick={handleSubscribe}
// //               className={`ml-6 rounded-full h-9 px-4 font-medium text-sm transition-colors ${
// //                 isSubscribed
// //                   ? "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
// //                   : "bg-foreground text-background hover:bg-foreground/90"
// //               }`}
// //             >
// //               {isSubscribed ? "Đã đăng ký" : "Đăng ký"}
// //             </Button>
// //           )}
// //         </div>

// //         {/* Action Buttons */}
// //         <div className="flex items-center gap-2 pb-1 overflow-x-auto no-scrollbar sm:pb-0">
// //           <div className="flex items-center rounded-full bg-secondary h-9">
// //             {/* Nút Like */}
// //             <Button
// //               variant="ghost"
// //               size="sm"
// //               className={`rounded-l-full h-full px-3 hover:bg-secondary-foreground/10 border-r border-secondary-foreground/20 gap-2 ${
// //                 isLiked ? "text-blue-600" : ""
// //               }`}
// //               onClick={handleLike}
// //             >
// //               <ThumbsUp
// //                 className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
// //               />
// //               <span className="text-sm font-medium">
// //                 {likeCount.toLocaleString()}
// //               </span>
// //             </Button>

// //             {/* Nút Dislike */}
// //             <Button
// //               variant="ghost"
// //               size="sm"
// //               className="h-full px-3 rounded-r-full hover:bg-secondary-foreground/10"
// //             >
// //               <ThumbsDown className="w-4 h-4" />
// //             </Button>
// //           </div>

// //           <Button
// //             variant="secondary"
// //             size="sm"
// //             className="gap-2 px-3 rounded-full h-9"
// //           >
// //             <Share2 className="w-4 h-4" /> Chia sẻ
// //           </Button>

// //           <Button
// //             variant="ghost"
// //             size="icon"
// //             className="rounded-full w-9 h-9 bg-secondary hover:bg-secondary/80"
// //           >
// //             <MoreHorizontal className="w-5 h-5" />
// //           </Button>
// //         </div>
// //       </div>

// //       {/* Description */}
// //       <div className="mt-4">
// //         <Card className="transition-colors border-0 cursor-pointer bg-secondary/50 rounded-xl hover:bg-secondary/70">
// //           <CardContent className="p-3 text-sm text-foreground">
// //             <div className="flex gap-2 mb-1 font-medium">
// //               {/* Sử dụng ?. ở đây để tránh lỗi undefined */}
// //               <span>
// //                 {videoData.stats?.views?.toLocaleString() || 0} lượt xem
// //               </span>
// //               <span>•</span>
// //               <span>{formatDateTime(videoData.createdAt)}</span>
// //             </div>

// //             <p className="text-sm leading-relaxed whitespace-pre-wrap">
// //               {videoData.description || "Không có mô tả cho video này."}
// //             </p>

// //             {videoData.tags && videoData.tags.length > 0 && (
// //               <div className="flex flex-wrap gap-1 mt-3">
// //                 {videoData.tags.map((tag, i) => (
// //                   <span
// //                     key={i}
// //                     className="text-xs text-blue-500 hover:underline"
// //                   >
// //                     #{tag}
// //                   </span>
// //                 ))}
// //               </div>
// //             )}
// //           </CardContent>
// //         </Card>
// //       </div>

// //       {/* Comment Section */}
// //       <CommentSection videoId={videoId}/>
// //     </>
// //   );
// // }

// // export default WatchPage;


// // import { useEffect, useState } from "react";
// // import { useParams, Link } from "react-router"; // Sửa 'react-router' thành 'react-router-dom' nếu cần
// // import {
// //   ThumbsUp,
// //   ThumbsDown,
// //   Share2,
// //   MoreHorizontal,
// //   User,
// // } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import { Input } from "@/components/ui/input";
// // import { formatDateTime } from "@/utils/formatDateTime";

// // // Import API và Context
// // import videoApi from "@/api/videoApi";
// // import channelApi from "@/api/channelApi";
// // import { useAuth } from "@/context/AuthContext";
// // import CommentSection from "@/components/CommentSection";

// // function WatchPage() {
// //   const { videoId } = useParams();
// //   const { user: currentUser, isAuthenticated } = useAuth();

// //   const [videoData, setVideoData] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   // State cho tương tác
// //   const [isSubscribed, setIsSubscribed] = useState(false);
// //   const [isLiked, setIsLiked] = useState(false);
// //   const [isDisliked, setIsDisliked] = useState(false); // Thêm state Dislike
// //   const [likeCount, setLikeCount] = useState(0);
// //   const [subCount, setSubCount] = useState(0);

// //   // 1. Fetch dữ liệu Video
// //   useEffect(() => {
// //     const fetchVideoDetail = async () => {
// //       try {
// //         setLoading(true);
// //         // Gọi API lấy chi tiết video
// //         // Lưu ý: api getDetail trả về data trực tiếp hoặc res.data tùy cấu hình axiosClient
// //         const res = await videoApi.getDetail(videoId);
// //         const data = res.data || res; 

// //         if (!data) throw new Error("Không nhận được dữ liệu video");

// //         setVideoData(data);

// //         // Cập nhật state đếm
// //         setLikeCount(data?.stats?.likes || 0);
// //         setSubCount(data?.ownerId?.subscribersCount || 0);

// //         // Lấy Owner ID an toàn
// //         const ownerId = data?.ownerId?._id || data?.ownerId?.id;

// //         // Nếu đã đăng nhập, kiểm tra trạng thái
// //         if (isAuthenticated && ownerId) {
// //           checkUserInteractions(ownerId);
// //         }
// //       } catch (err) {
// //         console.error("Lỗi tải video:", err);
// //         setVideoData(null);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     if (videoId) {
// //       fetchVideoDetail();
// //     }
// //   }, [videoId, isAuthenticated]);

// //   // 2. Hàm kiểm tra trạng thái (Đã Sửa Logic So Sánh)
// //   const checkUserInteractions = async (channelId) => {
// //     try {
// //       // --- Kiểm tra Subscribe ---
// //       const subRes = await channelApi.getMySubscriptions();
// //       const mySubs = Array.isArray(subRes) ? subRes : (subRes.data || []);
      
// //       const isSub = mySubs.some((sub) => {
// //         // Lấy ID kênh từ danh sách sub
// //         const subId = sub.channelId?._id || sub.channelId?.id || sub._id;
// //         // So sánh chuỗi
// //         return subId?.toString() === channelId?.toString();
// //       });
// //       setIsSubscribed(isSub);

// //       // --- Kiểm tra Like ---
// //       const likeRes = await videoApi.getLikedVideos();
// //       const myLikes = Array.isArray(likeRes) ? likeRes : (likeRes.data || []);
      
// //       const isLike = myLikes.some((vid) => {
// //         const vidId = vid._id || vid.id;
// //         return vidId?.toString() === videoId?.toString();
// //       });
// //       setIsLiked(isLike);
      
// //       // (Hiện tại chưa có API getDislikedVideos nên mặc định isDisliked = false khi load trang)

// //     } catch (error) {
// //       console.warn("Lỗi kiểm tra tương tác:", error);
// //     }
// //   };

// //   // 3. Xử lý SUBSCRIBE
// //   const handleSubscribe = async () => {
// //     if (!isAuthenticated) return alert("Vui lòng đăng nhập để đăng ký kênh!");
    
// //     // Lưu trạng thái cũ để revert nếu lỗi
// //     const prevSub = isSubscribed;
// //     const prevCount = subCount;

// //     // Optimistic Update
// //     setIsSubscribed(!prevSub);
// //     setSubCount(prev => (!prevSub ? prev + 1 : prev - 1));

// //     try {
// //         const owner = videoData?.ownerId || {};
// //         const channelId = owner._id || owner.id;

// //         if (!channelId) throw new Error("Thiếu ID kênh");

// //         if (prevSub) {
// //             // Đang Sub -> Hủy Sub
// //             await channelApi.unsubscribe(channelId);
// //         } else {
// //             // Chưa Sub -> Đăng ký
// //             await channelApi.subscribe(channelId);
// //         }
// //     } catch (error) {
// //         console.error("Lỗi subscribe:", error);
// //         // Hoàn tác UI nếu lỗi
// //         setIsSubscribed(prevSub);
// //         setSubCount(prevCount);
// //         alert("Thao tác thất bại.");
// //     }
// //   };

// //   // 4. Xử lý LIKE
// //   const handleLike = async () => {
// //     if (!isAuthenticated) return alert("Vui lòng đăng nhập!");

// //     const prevLiked = isLiked;
// //     const prevDisliked = isDisliked;

// //     // Logic: 
// //     // - Nếu đang Like -> Bỏ Like (về neutral)
// //     // - Nếu chưa Like -> Like (Nếu đang Dislike thì bỏ Dislike)
    
// //     if (prevLiked) {
// //         setIsLiked(false);
// //         setLikeCount(prev => prev - 1);
// //         await videoApi.removeInteraction(videoId); // DELETE /like
// //     } else {
// //         setIsLiked(true);
// //         setLikeCount(prev => prev + 1);
        
// //         if (prevDisliked) {
// //             setIsDisliked(false);
// //             // Cập nhật count dislike nếu có (Backend bạn chưa trả về dislikeCount realtime nên chỉ update UI state)
// //         }
// //         await videoApi.like(videoId); // POST /like
// //     }
// //   };

// //   // 5. Xử lý DISLIKE (MỚI)
// //   const handleDislike = async () => {
// //     if (!isAuthenticated) return alert("Vui lòng đăng nhập!");

// //     const prevLiked = isLiked;
// //     const prevDisliked = isDisliked;

// //     if (prevDisliked) {
// //         // Đang Dislike -> Bỏ Dislike (về neutral)
// //         setIsDisliked(false);
// //         await videoApi.removeInteraction(videoId); // DELETE /like (Backend xử lý xóa mọi interaction)
// //     } else {
// //         // Chưa Dislike -> Dislike
// //         setIsDisliked(true);
        
// //         if (prevLiked) {
// //             setIsLiked(false);
// //             setLikeCount(prev => prev - 1);
// //         }
// //         await videoApi.dislike(videoId); // POST /dislike
// //     }
// //   };

// //   // --- RENDER ---

// //   if (loading) return <div className="p-10 text-center">Đang tải video...</div>;

// //   if (!videoData) return (
// //       <div className="flex flex-col items-center justify-center p-10 space-y-4 text-center">
// //         <p className="text-xl font-semibold">Video không tồn tại.</p>
// //         <Link to="/"><Button variant="outline">Quay về trang chủ</Button></Link>
// //       </div>
// //   );

// //   const channel = videoData.ownerId || {};
  
// //   // Logic hiển thị nút Sub
// //   const currentUserId = currentUser?._id || currentUser?.id;
// //   const channelOwnerId = channel._id || channel.id;
// //   const isOwner = currentUserId && channelOwnerId && (currentUserId.toString() === channelOwnerId.toString());
// //   const showSubscribeButton = !isOwner;

// //   return (
// //     <>
// //       {/* Video Player */}
// //       <div className="relative w-full overflow-hidden bg-black rounded-xl aspect-video group">
// //         <video
// //           src={videoData.videoUrl}
// //           poster={videoData.thumbnailUrl}
// //           controls
// //           autoPlay
// //           className="object-contain w-full h-full"
// //         />
// //       </div>

// //       {/* Title */}
// //       <div className="mt-4">
// //         <h1 className="text-lg font-semibold md:text-xl line-clamp-2">
// //           {videoData.title}
// //         </h1>
// //       </div>

// //       {/* Info & Actions */}
// //       <div className="flex flex-col justify-between gap-4 py-3 border-b sm:flex-row sm:items-start border-border">
// //         {/* Channel Info */}
// //         <div className="flex items-center w-full gap-3 sm:w-auto">
// //           <Link to={`/channel/${channelOwnerId}`}>
// //             <Avatar className="w-10 h-10 cursor-pointer">
// //               <AvatarImage src={channel.avatarUrl} />
// //               <AvatarFallback>{channel.channelName?.[0]?.toUpperCase() || "U"}</AvatarFallback>
// //             </Avatar>
// //           </Link>
// //           <div className="flex flex-col">
// //             <Link to={`/channel/${channelOwnerId}`}>
// //               <p className="text-sm font-semibold cursor-pointer hover:text-foreground">
// //                 {channel.channelName || "Unknown Channel"}
// //               </p>
// //             </Link>
// //             <p className="text-xs text-muted-foreground">
// //               {subCount.toLocaleString()} người đăng ký
// //             </p>
// //           </div>

// //           {/* Nút Đăng ký */}
// //           {showSubscribeButton && (
// //             <Button
// //               onClick={handleSubscribe}
// //               className={`ml-6 rounded-full h-9 px-4 font-medium text-sm transition-colors ${
// //                 isSubscribed
// //                   ? "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
// //                   : "bg-foreground text-background hover:bg-foreground/90"
// //               }`}
// //             >
// //               {isSubscribed ? "Đã đăng ký" : "Đăng ký"}
// //             </Button>
// //           )}
// //         </div>

// //         {/* Action Buttons */}
// //         <div className="flex items-center gap-2 pb-1 overflow-x-auto no-scrollbar sm:pb-0">
// //           <div className="flex items-center rounded-full bg-secondary h-9">
// //             {/* Nút Like */}
// //             <Button
// //               variant="ghost"
// //               size="sm"
// //               className={`rounded-l-full h-full px-3 hover:bg-secondary-foreground/10 border-r border-secondary-foreground/20 gap-2 ${
// //                 isLiked ? "text-blue-600" : ""
// //               }`}
// //               onClick={handleLike}
// //             >
// //               <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
// //               <span className="text-sm font-medium">
// //                 {likeCount.toLocaleString()}
// //               </span>
// //             </Button>

// //             {/* Nút Dislike */}
// //             <Button
// //               variant="ghost"
// //               size="sm"
// //               className={`h-full px-3 rounded-r-full hover:bg-secondary-foreground/10 ${
// //                 isDisliked ? "text-blue-600" : ""
// //               }`}
// //               onClick={handleDislike}
// //             >
// //               <ThumbsDown className={`w-4 h-4 ${isDisliked ? "fill-current" : ""}`} />
// //             </Button>
// //           </div>

// //           <Button variant="secondary" size="sm" className="gap-2 px-3 rounded-full h-9">
// //             <Share2 className="w-4 h-4" /> Chia sẻ
// //           </Button>

// //           <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 bg-secondary hover:bg-secondary/80">
// //             <MoreHorizontal className="w-5 h-5" />
// //           </Button>
// //         </div>
// //       </div>

// //       {/* Description */}
// //       <div className="mt-4">
// //         <Card className="transition-colors border-0 cursor-pointer bg-secondary/50 rounded-xl hover:bg-secondary/70">
// //           <CardContent className="p-3 text-sm text-foreground">
// //             <div className="flex gap-2 mb-1 font-medium">
// //               <span>{videoData.stats?.views?.toLocaleString() || 0} lượt xem</span>
// //               <span>•</span>
// //               <span>{formatDateTime(videoData.createdAt)}</span>
// //             </div>

// //             <p className="text-sm leading-relaxed whitespace-pre-wrap">
// //               {videoData.description || "Không có mô tả cho video này."}
// //             </p>

// //             {videoData.tags && videoData.tags.length > 0 && (
// //               <div className="flex flex-wrap gap-1 mt-3">
// //                 {videoData.tags.map((tag, i) => (
// //                   <span key={i} className="text-xs text-blue-500 hover:underline">#{tag}</span>
// //                 ))}
// //               </div>
// //             )}
// //           </CardContent>
// //         </Card>
// //       </div>

// //       {/* Comment Section */}
// //       <CommentSection videoId={videoId}/>
// //     </>
// //   );
// // }

// // export default WatchPage;


// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router";
// import {
//   ThumbsUp,
//   ThumbsDown,
//   Share2,
//   MoreHorizontal,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { formatDateTime } from "@/utils/formatDateTime";

// // Import API và Context
// import videoApi from "@/api/videoApi";
// import channelApi from "@/api/channelApi";
// import { useAuth } from "@/context/AuthContext";
// import CommentSection from "@/components/CommentSection";

// function WatchPage() {
//   const { videoId } = useParams();
//   const { user: currentUser, isAuthenticated } = useAuth();

//   const [videoData, setVideoData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // State cho tương tác
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [isLiked, setIsLiked] = useState(false);
//   const [isDisliked, setIsDisliked] = useState(false);
//   const [likeCount, setLikeCount] = useState(0);
//   const [subCount, setSubCount] = useState(0);
//   const [dislikeCount, setDislikeCount] = useState(0); // Tạm thời để 0 hoặc lấy từ API nếu có

//   // 1. Fetch dữ liệu Video
//   useEffect(() => {
//     const fetchVideoDetail = async () => {
//       try {
//         setLoading(true);
//         // Gọi API lấy chi tiết video
//         const res = await videoApi.getDetail(videoId);
//         const data = res.data || res; // Xử lý trường hợp axios trả về data trực tiếp

//         if (!data) throw new Error("Không nhận được dữ liệu video");

//         setVideoData(data);

//         // Cập nhật state đếm
//         setLikeCount(data?.stats?.likes || 0);
//         setDislikeCount(data?.stats?.dislikes || 0);
//         setSubCount(data?.ownerId?.subscribersCount || 0);

//         // Lấy Owner ID an toàn để check tương tác
//         const ownerId = data?.ownerId?._id || data?.ownerId?.id;

//         // Nếu đã đăng nhập, kiểm tra trạng thái Like/Sub
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

//   // 2. Hàm kiểm tra trạng thái Like/Sub
//   const checkUserInteractions = async (channelId) => {
//     try {
//       // --- Kiểm tra Subscribe ---
//       const subRes = await channelApi.getMySubscriptions();
//       const mySubs = Array.isArray(subRes) ? subRes : (subRes.data || []);
      
//       // So sánh ID (chuyển về string để chính xác)
//       const isSub = mySubs.some((sub) => {
//         const subId = sub.channelId?._id || sub.channelId?.id || sub._id;
//         return subId?.toString() === channelId?.toString();
//       });
//       setIsSubscribed(isSub);

//       // --- Kiểm tra Like ---
//       const likeRes = await videoApi.getLikedVideos();
//       const myLikes = Array.isArray(likeRes) ? likeRes : (likeRes.data || []);
      
//       const isLike = myLikes.some((vid) => {
//         const vidId = vid._id || vid.id;
//         return vidId?.toString() === videoId?.toString();
//       });
//       setIsLiked(isLike);
      
//       // (Lưu ý: Hiện tại chưa có API check danh sách Dislike, nên mặc định vào trang là false)

//     } catch (error) {
//       console.warn("Lỗi kiểm tra tương tác:", error);
//     }
//   };

//   // 3. Xử lý SUBSCRIBE
//   const handleSubscribe = async () => {
//     if (!isAuthenticated) return alert("Vui lòng đăng nhập để đăng ký kênh!");
    
//     const prevSub = isSubscribed;
    
//     // Optimistic Update (Cập nhật giao diện ngay lập tức)
//     setIsSubscribed(!prevSub);
//     setSubCount(prev => (!prevSub ? prev + 1 : prev - 1));

//     try {
//         const owner = videoData?.ownerId || {};
//         const channelId = owner._id || owner.id;

//         if (!channelId) throw new Error("Thiếu ID kênh");

//         if (prevSub) {
//             await channelApi.unsubscribe(channelId);
//         } else {
//             await channelApi.subscribe(channelId);
//         }
//     } catch (error) {
//         console.error("Lỗi subscribe:", error);
//         // Hoàn tác nếu lỗi
//         setIsSubscribed(prevSub);
//         setSubCount(prev => (prevSub ? prev + 1 : prev - 1));
//         alert("Thao tác thất bại.");
//     }
//   };

//   // 4. Xử lý LIKE
//   const handleLike = async () => {
//     if (!isAuthenticated) return alert("Vui lòng đăng nhập!");

//     const prevLiked = isLiked;
//     const prevDisliked = isDisliked;

//     // Cập nhật State Like
//     setIsLiked(!prevLiked);
//     if (prevDisliked) setIsDisliked(false);

//     // Cập nhật UI
//     if (prevLiked) {
//         setLikeCount(prev => Math.max(0, prev - 1));
//         await videoApi.removeInteraction(videoId);
//     } else {
//         setLikeCount(prev => prev + 1);
//         if (prevDisliked) {
//             setDislikeCount(prev => Math.max(0, prev - 1));
//         }
//         await videoApi.like(videoId);
//     }
//   };

//   // 5. Xử lý DISLIKE
//   const handleDislike = async () => {
//     if (!isAuthenticated) return alert("Vui lòng đăng nhập!");

//     const prevLiked = isLiked;
//     const prevDisliked = isDisliked;

//     // Cập nhật State Dislike
//     setIsDisliked(!prevDisliked);
//     if (prevLiked) setIsLiked(false);

//     // Cập nhật UI
//     if (prevDisliked) {
//         setDislikeCount(prev => Math.max(0, prev - 1));
//         await videoApi.removeInteraction(videoId);
//     } else {
//         setDislikeCount(prev => prev + 1);
//         if (prevLiked) {
//             setLikeCount(prev => Math.max(0, prev - 1));
//         }
//         await videoApi.dislike(videoId);
//     }
//   };

//   // --- RENDER ---

//   if (loading) return <div className="p-10 text-center">Đang tải video...</div>;

//   if (!videoData) return (
//       <div className="flex flex-col items-center justify-center p-10 space-y-4 text-center">
//         <p className="text-xl font-semibold">Video không tồn tại.</p>
//         <Link to="/"><Button variant="outline">Quay về trang chủ</Button></Link>
//       </div>
//   );

//   const channel = videoData.ownerId || {};
  
//   // Logic hiển thị nút Sub (An toàn với cả .id và ._id)
//   const currentUserId = currentUser?._id || currentUser?.id;
//   const channelOwnerId = channel._id || channel.id;
  
//   // So sánh chuỗi để tránh lỗi object !== string
//   const isOwner = currentUserId && channelOwnerId && (currentUserId.toString() === channelOwnerId.toString());
//   const showSubscribeButton = !isOwner;

//   return (
//     <>
//       {/* Video Player */}
//       <div className="relative w-full overflow-hidden bg-black rounded-xl aspect-video group">
//         <video
//           src={videoData.videoUrl}
//           poster={videoData.thumbnailUrl}
//           controls
//           autoPlay
//           className="object-contain w-full h-full"
//         />
//       </div>

//       {/* Title */}
//       <div className="mt-4">
//         <h1 className="text-lg font-semibold md:text-xl line-clamp-2">
//           {videoData.title}
//         </h1>
//       </div>

//       {/* Info & Actions */}
//       <div className="flex flex-col justify-between gap-4 py-3 border-b sm:flex-row sm:items-start border-border">
//         {/* Channel Info */}
//         <div className="flex items-center w-full gap-3 sm:w-auto">
//           <Link to={`/channel/${channelOwnerId}`}>
//             <Avatar className="w-10 h-10 cursor-pointer">
//               <AvatarImage src={channel.avatarUrl} />
//               <AvatarFallback>{channel.channelName?.[0]?.toUpperCase() || "U"}</AvatarFallback>
//             </Avatar>
//           </Link>
//           <div className="flex flex-col">
//             <Link to={`/channel/${channelOwnerId}`}>
//               <p className="text-sm font-semibold cursor-pointer hover:text-foreground">
//                 {channel.channelName || "Unknown Channel"}
//               </p>
//             </Link>
//             <p className="text-xs text-muted-foreground">
//               {subCount.toLocaleString()} người đăng ký
//             </p>
//           </div>

//           {/* Nút Đăng ký */}
//           {showSubscribeButton && (
//             <Button
//               onClick={handleSubscribe}
//               className={`ml-6 rounded-full h-9 px-4 font-medium text-sm transition-colors ${
//                 isSubscribed
//                   ? "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
//                   : "bg-foreground text-background hover:bg-foreground/90"
//               }`}
//             >
//               {isSubscribed ? "Đã đăng ký" : "Đăng ký"}
//             </Button>
//           )}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex items-center gap-2 pb-1 overflow-x-auto no-scrollbar sm:pb-0">
//           <div className="flex items-center rounded-full bg-secondary h-9">
//             {/* Nút Like */}
//             <Button
//               variant="ghost"
//               size="sm"
//               className={`rounded-l-full h-full px-3 hover:bg-secondary-foreground/10 border-r border-secondary-foreground/20 gap-2 ${
//                 isLiked ? "text-blue-600" : ""
//               }`}
//               onClick={handleLike}
//             >
//               <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
//               <span className="text-sm font-medium">
//                 {likeCount.toLocaleString()}
//               </span>
//             </Button>

//             {/* Nút Dislike */}
//             <Button
//               variant="ghost"
//               size="sm"
//               className={`h-full px-3 rounded-r-full hover:bg-secondary-foreground/10 ${
//                 isDisliked ? "text-blue-600" : ""
//               }`}
//               onClick={handleDislike}
//             >
//               <ThumbsDown className={`w-4 h-4 ${isDisliked ? "fill-current" : ""}`} />
//               {/* Hiển thị số Dislike */}
//               <span className="ml-2 text-sm font-medium">{dislikeCount.toLocaleString()}</span>
//             </Button>
//           </div>

//           <Button variant="secondary" size="sm" className="gap-2 px-3 rounded-full h-9">
//             <Share2 className="w-4 h-4" /> Chia sẻ
//           </Button>

//           <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 bg-secondary hover:bg-secondary/80">
//             <MoreHorizontal className="w-5 h-5" />
//           </Button>
//         </div>
//       </div>

//       {/* Description */}
//       <div className="mt-4">
//         <Card className="transition-colors border-0 cursor-pointer bg-secondary/50 rounded-xl hover:bg-secondary/70">
//           <CardContent className="p-3 text-sm text-foreground">
//             <div className="flex gap-2 mb-1 font-medium">
//               <span>{videoData.stats?.views?.toLocaleString() || 0} lượt xem</span>
//               <span>•</span>
//               <span>{formatDateTime(videoData.createdAt)}</span>
//             </div>

//             <p className="text-sm leading-relaxed whitespace-pre-wrap">
//               {videoData.description || "Không có mô tả cho video này."}
//             </p>

//             {videoData.tags && videoData.tags.length > 0 && (
//               <div className="flex flex-wrap gap-1 mt-3">
//                 {videoData.tags.map((tag, i) => (
//                   <span key={i} className="text-xs text-blue-500 hover:underline">#{tag}</span>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Comment Section */}
//       <CommentSection videoId={videoId}/>
//     </>
//   );
// }

// export default WatchPage;


import { useEffect, useState } from "react";
import { useParams, Link } from "react-router"; // Sửa lại import đúng thư viện
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
import CommentSection from "@/components/CommentSection";

function WatchPage() {
  const { videoId } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();

  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- 1. THÊM STATE CHO DISLIKE ---
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false); // Trạng thái Dislike
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0); // Số lượng Dislike
  const [subCount, setSubCount] = useState(0);

  // Fetch dữ liệu Video
  useEffect(() => {
    const fetchVideoDetail = async () => {
      try {
        setLoading(true);
        const res = await videoApi.getDetail(videoId);
        const data = res.data || res;

        if (!data) throw new Error("Không nhận được dữ liệu video");

        setVideoData(data);

        // --- 2. CẬP NHẬT STATE TỪ DỮ LIỆU API ---
        setLikeCount(data?.stats?.likes || 0);
        setDislikeCount(data?.stats?.dislikes || 0); // Lấy số dislike
        setSubCount(data?.ownerId?.subscribersCount || 0);

        // Lấy Owner ID an toàn
        const ownerId = data?.ownerId?._id || data?.ownerId?.id;

        if (isAuthenticated && ownerId) {
          checkUserInteractions(ownerId);
        }
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
  }, [videoId, isAuthenticated]);

  // Hàm kiểm tra trạng thái (Chỉ check Like và Sub, Dislike tạm để false)
  const checkUserInteractions = async (channelId) => {
    try {
      const subRes = await channelApi.getMySubscriptions();
      const mySubs = Array.isArray(subRes) ? subRes : (subRes.data || []);
      const isSub = mySubs.some((sub) => {
        const subId = sub.channelId?._id || sub.channelId?.id || sub._id;
        return subId?.toString() === channelId?.toString();
      });
      setIsSubscribed(isSub);

      const likeRes = await videoApi.getLikedVideos();
      const myLikes = Array.isArray(likeRes) ? likeRes : (likeRes.data || []);
      const isLike = myLikes.some((vid) => {
        const vidId = vid._id || vid.id;
        return vidId?.toString() === videoId?.toString();
      });
      setIsLiked(isLike);
      
      // Hiện tại API chưa trả về danh sách Dislike nên mặc định là false
      // setIsDisliked(...) 
    } catch (error) {
      console.warn("Lỗi kiểm tra tương tác:", error);
    }
  };

  // Xử lý SUBSCRIBE (Giữ nguyên)
  const handleSubscribe = async () => {
    if (!isAuthenticated) return alert("Vui lòng đăng nhập để đăng ký kênh!");
    const prevSub = isSubscribed;
    setIsSubscribed(!prevSub);
    setSubCount(prev => (!prevSub ? prev + 1 : prev - 1));

    try {
        const channel = videoData?.ownerId || {};
        const channelId = channel._id || channel.id; 
        if (prevSub) await channelApi.unsubscribe(channelId);
        else await channelApi.subscribe(channelId);
    } catch (error) {
        setIsSubscribed(prevSub);
        setSubCount(prev => (prevSub ? prev + 1 : prev - 1));
        alert("Thao tác thất bại.");
    }
  };

  // --- 3. XỬ LÝ LIKE (CÓ LOGIC BỎ DISLIKE) ---
  const handleLike = async () => {
    if (!isAuthenticated) return alert("Vui lòng đăng nhập!");

    // Lưu trạng thái cũ để revert nếu lỗi API
    const prevLiked = isLiked;
    const prevDisliked = isDisliked;

    // Cập nhật State UI ngay lập tức
    if (prevLiked) {
        // Đang Like -> Bấm phát nữa -> Hủy Like
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1)); // Tránh số âm
        try { await videoApi.removeInteraction(videoId); } catch (e) {}
    } else {
        // Chưa Like -> Bấm -> Like
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        
        // Nếu đang Dislike thì phải bỏ Dislike đi
        if (prevDisliked) {
            setIsDisliked(false);
            setDislikeCount(prev => Math.max(0, prev - 1));
        }
        try { await videoApi.like(videoId); } catch (e) {}
    }
  };

  // --- 4. XỬ LÝ DISLIKE (CÓ LOGIC BỎ LIKE) ---
  const handleDislike = async () => {
    if (!isAuthenticated) return alert("Vui lòng đăng nhập!");

    const prevDisliked = isDisliked;
    const prevLiked = isLiked;

    // Cập nhật State UI ngay lập tức
    if (prevDisliked) {
        // Đang Dislike -> Bấm phát nữa -> Hủy Dislike
        setIsDisliked(false);
        setDislikeCount(prev => Math.max(0, prev - 1));
        try { await videoApi.removeInteraction(videoId); } catch (e) {}
    } else {
        // Chưa Dislike -> Bấm -> Dislike
        setIsDisliked(true);
        setDislikeCount(prev => prev + 1);

        // Nếu đang Like thì phải bỏ Like đi
        if (prevLiked) {
            setIsLiked(false);
            setLikeCount(prev => Math.max(0, prev - 1));
        }
        try { await videoApi.dislike(videoId); } catch (e) {}
    }
  };

  // --- RENDER ---
  if (loading) return <div className="p-10 text-center">Đang tải video...</div>;
  if (!videoData) return <div className="p-10 text-center">Video không tồn tại.</div>;

  const channel = videoData.ownerId || {};
  const currentUserId = currentUser?._id || currentUser?.id;
  const channelOwnerId = channel._id || channel.id;
  const isOwner = currentUserId && channelOwnerId && (currentUserId.toString() === channelOwnerId.toString());
  const showSubscribeButton = !isOwner;

  const getChannelId = (owner) => {
    if (!owner) return null;
    return owner._id || owner.id || owner.channelId?._id || owner.channelId?.id;
  };

  return (
    <>
      <div className="relative w-full overflow-hidden bg-black rounded-xl aspect-video group">
        <video
          src={videoData.videoUrl}
          poster={videoData.thumbnailUrl}
          controls
          autoPlay
          className="object-contain w-full h-full"
        />
      </div>

      <div className="mt-4">
        <h1 className="text-lg font-semibold md:text-xl line-clamp-2">
          {videoData.title}
        </h1>
      </div>

      <div className="flex flex-col justify-between gap-4 py-3 border-b sm:flex-row sm:items-start border-border">
        <div className="flex items-center w-full gap-3 sm:w-auto">
          <Link to={`/channel/${channelOwnerId}`}>
            <Avatar className="w-10 h-10 cursor-pointer">
              <AvatarImage src={channel.avatarUrl} />
              <AvatarFallback>{channel.channelName?.[0]?.toUpperCase() || "U"}</AvatarFallback>
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
              {/* Hiển thị số lượng Dislike */}
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

      <div className="mt-4">
        <Card className="transition-colors border-0 cursor-pointer bg-secondary/50 rounded-xl hover:bg-secondary/70">
          <CardContent className="p-3 text-sm text-foreground">
            <div className="flex gap-2 mb-1 font-medium">
              <span>{videoData.stats?.views?.toLocaleString() || 0} lượt xem</span>
              <span>•</span>
              <span>{formatDateTime(videoData.createdAt)}</span>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {videoData.description || "Không có mô tả cho video này."}
            </p>
            {videoData.tags && videoData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {videoData.tags.map((tag, i) => (
                  <span key={i} className="text-xs text-blue-500 hover:underline">#{tag}</span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CommentSection videoId={videoId}/>
    </>
  );
}

export default WatchPage;