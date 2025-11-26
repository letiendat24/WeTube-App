// import Header from "@/components/Header";
// import { Outlet } from "react-router";

// function WatchingLayout() {
//   return (
//     <div>
//       {/* Header */}
//       <div>
//         <Header />
//       </div>
//       {/* Content */}
//       <div className="">
//         {/* Left Side: Video, Info, CommentSection */}
//         <div className="">
//           {/* video */}
//           <div className="">
//             <Outlet />
//           </div>
//         </div>
//         {/* Recommend Videos */}
//         <div></div>
//       </div>
//     </div>
//   );
// }

// export default WatchingLayout;

// import Header from "@/components/Header";
// import { Outlet } from "react-router";
// import { useEffect, useState } from "react";
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
// import { Separator } from "@/components/ui/separator";
// import { Input } from "@/components/ui/input";

// function WatchingLayout() {
//   const [videos, setVideos] = useState([]);

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const res = await fetch("http://localhost:3001/videos");
//         const data = await res.json();
//         setVideos(data);
//       } catch (error) {
//         console.error("Error fetching videos:", error);
//         // Fake fallback data
//         setVideos([
//           {
//             id: 1,
//             title: "Học ReactJS từ cơ bản đến nâng cao",
//             channel: "F8 Official",
//             views: "2.3M lượt xem",
//             thumbnail: "https://i.ytimg.com/vi/Ke90Tje7VS0/hqdefault.jpg",
//           },
//           {
//             id: 2,
//             title: "Nhạc Lo-fi học bài siêu chill",
//             channel: "Lo-fi Beats",
//             views: "1.2M lượt xem",
//             thumbnail: "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg",
//           },
//           {
//             id: 3,
//             title: "Node.js cho người mới bắt đầu",
//             channel: "CodeX",
//             views: "850K lượt xem",
//             thumbnail: "https://i.ytimg.com/vi/TlB_eWDSMt4/hqdefault.jpg",
//           },
//         ]);
//       }
//     };
//     fetchVideos();
//   }, []);

//   return (
//     <div className="min-h-screen text-white bg-foreground">
//       {/* Header */}
//       <Header />

//       {/* Main Layout */}
//       <div className="flex flex-col md:flex-row justify-between max-w-[1600px] mx-auto px-4 md:px-6 pt-4">
//         {/* LEFT: Video + Info + Comments */}
//         <div className="w-full md:w-[70%] lg:w-[72%] space-y-4">
//           {/* Video Player */}
//           <Card className="overflow-hidden bg-white border-0 rounded-xl">
//             <video
//               src="https://www.w3schools.com/html/mov_bbb.mp4"
//               controls
//               className="object-cover w-full aspect-video"
//             />
//           </Card>

//           {/* Video Title */}
//           <h1 className="text-lg font-semibold md:text-xl">
//             Hướng dẫn sử dụng React Router v6 trong dự án thực tế
//           </h1>

//           {/* Video Info + Actions */}
//           <div className="flex flex-col justify-between pb-3 border-b border-gray-700 sm:flex-row sm:items-center">
//             {/* Channel Info */}
//             <div className="flex items-center gap-3">
//               <Avatar className="w-10 h-10">
//                 <AvatarImage src="https://yt3.googleusercontent.com/ytc/AIdro_lKO7P5YVdX4XbK98MufD_YkMXm_U7oxf6vg5Yl=s88-c-k-c0x00ffffff-no-rj" />
//                 <AvatarFallback>CX</AvatarFallback>
//               </Avatar>
//               <div>
//                 <p className="font-semibold text-white">CodeX Channel</p>
//                 <p className="text-xs text-gray-400">1.5M người đăng ký</p>
//               </div>
//               <Button className="ml-3 text-black bg-white rounded-full hover:bg-gray-200">
//                 Đăng ký
//               </Button>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex items-center gap-2 mt-3 sm:mt-0">
//               <Button
//                 variant="secondary"
//                 className="text-white bg-gray-800 rounded-full hover:bg-gray-700"
//               >
//                 <ThumbsUp className="w-4 h-4 mr-2" /> Thích
//               </Button>
//               <Button
//                 variant="secondary"
//                 className="text-white bg-gray-800 rounded-full hover:bg-gray-700"
//               >
//                 <ThumbsDown className="w-4 h-4 mr-2" /> Không thích
//               </Button>
//               <Button
//                 variant="secondary"
//                 className="text-white bg-gray-800 rounded-full hover:bg-gray-700"
//               >
//                 <Share2 className="w-4 h-4 mr-2" /> Chia sẻ
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="text-gray-300 rounded-full hover:bg-gray-700"
//               >
//                 <MoreHorizontal className="w-5 h-5" />
//               </Button>
//             </div>
//           </div>

//           {/* Description */}
//           <Card className="bg-[#1e1e1e] border-0">
//             <CardContent className="p-4 text-sm text-gray-300">
//               <p>
//                 Trong video này, mình hướng dẫn bạn cách dùng React Router v6
//                 để điều hướng trong ứng dụng React một cách hiệu quả.
//               </p>
//               <p className="mt-2 text-xs text-gray-500">
//                 200,324 lượt xem • 2 tuần trước
//               </p>
//             </CardContent>
//           </Card>

//           {/* Comment Section */}
//           <div>
//             <h2 className="mb-3 text-lg font-semibold">3 Bình luận</h2>

//             <div className="flex items-center gap-2 mb-4">
//               <Avatar className="w-9 h-9">
//                 <AvatarFallback>
//                   <User className="w-4 h-4" />
//                 </AvatarFallback>
//               </Avatar>
//               <div className="flex flex-1 gap-2">
//                 <Input
//                   placeholder="Thêm bình luận..."
//                   className="bg-[#1e1e1e] border-none text-white placeholder:text-gray-500"
//                 />
//                 <Button
//                   size="icon"
//                   className="bg-blue-600 rounded-full hover:bg-blue-500"
//                 >
//                   <Send className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>

//             <div className="space-y-3">
//               {[
//                 {
//                   name: "Nguyễn Văn A",
//                   comment: "Video rất dễ hiểu, cảm ơn bạn nhiều!",
//                   avatar: "https://i.pravatar.cc/40",
//                 },
//                 {
//                   name: "Trần Thị B",
//                   comment: "Mong bạn làm thêm về Redux Toolkit ❤️",
//                   avatar: "https://i.pravatar.cc/41",
//                 },
//               ].map((cmt, index) => (
//                 <div key={index} className="flex gap-3">
//                   <Avatar>
//                     <AvatarImage src={cmt.avatar} />
//                     <AvatarFallback>{cmt.name[0]}</AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <p className="font-medium">{cmt.name}</p>
//                     <p className="text-sm text-gray-300">{cmt.comment}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* RIGHT: Recommended Videos */}
//         <div className="w-full md:w-[28%] lg:w-[26%] mt-6 md:mt-0 md:pl-4 space-y-4">
//           {videos.map((video) => (
//             <Card
//               key={video.id}
//               className="flex gap-3 bg-transparent border-0 hover:bg-[#1e1e1e] transition p-2 cursor-pointer"
//             >
//               <img
//                 src={video.thumbnail}
//                 alt={video.title}
//                 className="object-cover w-40 h-24 rounded-lg"
//               />
//               <div className="flex flex-col">
//                 <h3 className="text-sm font-medium line-clamp-2">
//                   {video.title}
//                 </h3>
//                 <p className="text-xs text-gray-400">{video.channel}</p>
//                 <p className="text-xs text-gray-500">{video.views}</p>
//               </div>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default WatchingLayout;

// import Header from "@/components/Header";
// import { Outlet } from "react-router";
// import { useEffect, useState } from "react";
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

// function WatchingLayout() {
//   const [videos, setVideos] = useState([]);

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const res = await fetch("http://localhost:3001/videos");
//         const data = await res.json();
//         setVideos(data);
//       } catch (error) {
//         console.error("Error fetching videos:", error);
//         // Fake fallback data
//         setVideos([
//           {
//             id: 1,
//             title: "Học ReactJS từ cơ bản đến nâng cao",
//             channel: "F8 Official",
//             views: "2.3M lượt xem",
//             thumbnail: "https://i.ytimg.com/vi/Ke90Tje7VS0/hqdefault.jpg",
//           },
//           {
//             id: 2,
//             title: "Nhạc Lo-fi học bài siêu chill",
//             channel: "Lo-fi Beats",
//             views: "1.2M lượt xem",
//             thumbnail: "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg",
//           },
//           {
//             id: 3,
//             title: "Node.js cho người mới bắt đầu",
//             channel: "CodeX",
//             views: "850K lượt xem",
//             thumbnail: "https://i.ytimg.com/vi/TlB_eWDSMt4/hqdefault.jpg",
//           },
//         ]);
//       }
//     };
//     fetchVideos();
//   }, []);

//   return (
//     <div className="min-h-screen text-foreground bg-background">
//       {/* Header */}
//       <Header />

//       {/* Main Layout */}
//       <div className="flex flex-col md:flex-row justify-between max-w-[1600px] mx-auto px-4 md:px-6 pt-4">
//         {/* LEFT: Video + Info + Comments */}
//         <div className="w-full md:w-[70%] lg:w-[72%] space-y-4">
//           {/* Video Player */}
//           <div className="w-full overflow-hidden bg-black rounded-xl aspect-video">
//             <video
//               src="https://www.w3schools.com/html/mov_bbb.mp4"
//               controls
//               className="w-full h-full"
//             />
//           </div>

//           {/* Video Title*/}
//           <h1 className="text-lg font-semibold md:text-xl">
//             Hướng dẫn sử dụng React Router v6 trong dự án thực tế
//           </h1>

//           {/* Video Info + Actions*/}
//           <div className="flex flex-col justify-between pb-3 border-b sm:flex-row sm:items-center border-border">
//             {/* Channel Info */}
//             <div className="flex items-center gap-3">
//               <Avatar className="w-10 h-10">
//                 <AvatarImage src="https://yt3.googleusercontent.com/ytc/AIdro_lKO7P5YVdX4XbK98MufD_YkMXm_U7oxf6vg5Yl=s88-c-k-c0x00ffffff-no-rj" />
//                 <AvatarFallback>CX</AvatarFallback>
//               </Avatar>
//               <div>
//                 <p className="font-semibold">CodeX Channel</p>
//                 <p className="text-xs text-muted-foreground">
//                   1.5M người đăng ký
//                 </p>
//               </div>
//               {/* Nút Đăng ký */}
//               <Button className="ml-3 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
//                 Đăng ký
//               </Button>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex items-center gap-2 mt-3 sm:mt-0">
//               <Button
//                 variant="secondary"
//                 className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
//               >
//                 <ThumbsUp className="w-4 h-4 mr-2" /> Thích
//               </Button>
//               <Button
//                 variant="secondary"
//                 className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
//               >
//                 <ThumbsDown className="w-4 h-4 mr-2" /> Không thích
//               </Button>
//               <Button
//                 variant="secondary"
//                 className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
//               >
//                 <Share2 className="w-4 h-4 mr-2" /> Chia sẻ
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="rounded-full text-foreground hover:bg-secondary"
//               >
//                 <MoreHorizontal className="w-5 h-5" />
//               </Button>
//             </div>
//           </div>

//           <Card className="border-0 bg-secondary rounded-xl">
//             <CardContent className="p-4 text-sm text-foreground">
//               <p>
//                 Trong video này, mình hướng dẫn bạn cách dùng React Router v6 để
//                 điều hướng trong ứng dụng React một cách hiệu quả.
//               </p>
//               <p className="mt-2 text-xs text-muted-foreground">
//                 200,324 lượt xem • 2 tuần trước
//               </p>
//             </CardContent>
//           </Card>

//           {/* Comment Section */}
//           <div>
//             <h2 className="mb-3 text-lg font-semibold">3 Bình luận</h2>

//             <div className="flex items-center gap-2 mb-4">
//               <Avatar className="w-9 h-9">
//                 <AvatarFallback>
//                   <User className="w-4 h-4" />
//                 </AvatarFallback>
//               </Avatar>
//               <div className="flex flex-1 gap-2">
//                 <Input
//                   placeholder="Thêm bình luận..."
//                   className="bg-transparent border-0 border-b rounded-none border-border focus:border-primary text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
//                 />
//                 {/* Nút Gửi (Dùng màu primary) */}
//                 <Button
//                   size="icon"
//                   className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
//                 >
//                   <Send className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>

//             <div className="space-y-3">
//               {[
//                 {
//                   name: "Nguyễn Văn A",
//                   comment: "Video rất dễ hiểu, cảm ơn bạn nhiều!",
//                   avatar: "https://i.pravatar.cc/40",
//                 },
//                 {
//                   name: "Trần Thị B",
//                   comment: "Mong bạn làm thêm về Redux Toolkit ❤️",
//                   avatar: "https://i.pravatar.cc/41",
//                 },
//               ].map((cmt, index) => (
//                 <div key={index} className="flex gap-3">
//                   <Avatar>
//                     <AvatarImage src={cmt.avatar} />
//                     <AvatarFallback>{cmt.name[0]}</AvatarFallback>
//                   </Avatar>
//                   <div>
//                     <p className="font-medium">{cmt.name}</p>
//                     {/* Tự động dùng text-foreground */}
//                     <p className="text-sm">{cmt.comment}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* RIGHT: Recommended Videos */}
//         <div className="w-full md:w-[28%] lg:w-[26%] mt-6 md:mt-0 md:pl-4 space-y-4">
//           {videos.map((video) => (
//             <Card
//               key={video.id}
//               className="flex gap-3 p-2 transition bg-transparent border-0 rounded-lg cursor-pointer hover:bg-secondary"
//             >
//               <img
//                 src={video.thumbnail}
//                 alt={video.title}
//                 className="object-cover w-40 h-24 rounded-lg"
//                 _
//               />
//               <div className="flex flex-col">
//                 <h3 className="text-sm font-medium line-clamp-2">
//                   {video.title}
//                 </h3>
//                 <p className="text-xs text-muted-foreground">{video.channel}</p>
//                 <p className="text-xs text-muted-foreground">{video.views}</p>
//               </div>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import Header from "@/components/Header";
import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/SideBar";

function WatchingLayout() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("http://localhost:3001/videos");
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen text-foreground bg-background">
      <Header />
      {/* Content */}
      <div className="flex flex-col md:flex-row justify-between max-w-[1600px] mx-auto px-4 md:px-6 pt-4">
        {/* Left: video,info, comment */}
        <div className="w-full md:w-[60%] lg:w-[62%] space-y-4">
          <Outlet />
        </div>

        {/*Right: Video đề xuất */}
        <div className="w-full md:w-[38%] lg:w-[36%] mt-6 md:mt-0 md:pl-4 space-y-4">
          {videos.map((video) => (
            <Card
              key={video.id}
              className="p-2 transition bg-transparent border-0 rounded-lg cursor-pointer  hover:bg-secondary"
            >
              <div className="flex items-start gap-3 justify-baseline">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="object-cover w-40 h-24 rounded-lg"
                />
                <div className="flex flex-col">
                  <h3 className="text-sm font-medium line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {video.channel}
                  </p>
                  <p className="text-xs text-muted-foreground">{video.views}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WatchingLayout;
