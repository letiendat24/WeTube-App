import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  MoreHorizontal,
  Send,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

function WatchingPage() {
  const API_KEY = "AIzaSyA_dcjfpUea9NFtvsIzfQ0I6B52P-7aNsk";

    const { videoId } = useParams();
  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
    const fetchVideoDetail = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`
        );
        const data = await res.json();
        setVideoData(data.items[0]);
      } catch (err) {
        console.error("Lỗi tải video:", err);
      }
    };

    fetchVideoDetail();
  }, [videoId]);

  if (!videoData) return <p>Đang tải video...</p>;

  const { snippet, statistics } = videoData;


  return (
    <>
      {/* Video Player */}
      <div className="w-full overflow-hidden bg-black rounded-xl aspect-video">
        {/* <video
          src={videoData.videoUrl}
          controls
          autoPlay 
          className="w-full h-full"
        /> */}
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>

      {/* Video Title */}
      <h1 className="text-lg font-semibold md:text-xl">{snippet.title}</h1>

      {/* Video Info + Actions */}
      <div className="flex flex-col justify-between pb-3 border-b sm:flex-row sm:items-center border-border">
        {/* Channel Info */}
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={snippet.thumbnails.default} />
            <AvatarFallback>CX</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{snippet.channelTitle}</p>
            <p className="text-xs text-muted-foreground">
              {videoData.subscribers} người đăng ký
            </p>
          </div>
          <Button className="ml-3 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Đăng ký
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-3 sm:mt-0">
          <Button variant="secondary" className="rounded-full ...">
            <ThumbsUp className="w-4 h-4 mr-2" /> Thích
          </Button>
          <Button variant="secondary" className="rounded-full ...">
            <ThumbsDown className="w-4 h-4 mr-2" /> Không thích
          </Button>
          <Button variant="secondary" className="rounded-full ...">
            <Share2 className="w-4 h-4 mr-2" /> Chia sẻ
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full ...">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Description */}
      <Card className="border-0 bg-secondary rounded-xl">
        <CardContent className="p-4 text-sm text-foreground">
          <p>{snippet.description}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {statistics.viewCount} lượt xem • {videoData.uploaded}
          </p>
        </CardContent>
      </Card>

      {/* Comment Section */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">
          {statistics.commentCount} Bình luận
        </h2>
        {/* Comment Input */}
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="w-9 h-9">
            <AvatarFallback>
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 gap-2">
            <Input
              placeholder="Thêm bình luận..."
              className="bg-transparent border-0 border-b ..."
            />
            <Button size="icon" className="rounded-full bg-primary ...">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Comment List */}
        {/* <div className="space-y-3">
          {comments.map((cmt, index) => (
            <div key={index} className="flex gap-3">
              <Avatar>
                <AvatarImage src={cmt.avatar} />
                <AvatarFallback>{cmt.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{cmt.name}</p>
                <p className="text-sm">{cmt.comment}</p>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </>
  );
}

export default WatchingPage;
