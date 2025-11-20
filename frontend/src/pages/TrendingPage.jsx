import VideoCard from "@/components/VideoCard";
import { VideoGridSkeleton } from "@/components/VideoSkeleton";
import { useEffect, useState } from "react";

function TrendingPage() {
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
    <>
    <div className="">
      <h1 className="bold">Trending</h1>
      <p>Most popular videos at the moment</p>
    </div>
    <div className="grid grid-cols-1 p-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8">
      {/* <CategoryBar /> */}
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} variant="grid" />
      ))}
    </div>
    </>
  );
}

export default TrendingPage;