import VideoCard from "@/components/VideoCard";
import { VideoGridSkeleton } from "@/components/VideoSkeleton";
import { useEffect, useState } from "react";

function LikedPage() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:3001/videos");
        if (!res.ok) throw new Error("Can not download videos");
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <VideoGridSkeleton />;
  }
  return (
    <div className="">
      {/* <CategoryBar /> */}
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} variant="row"/>
      ))}
    </div>
  );
}

export default LikedPage