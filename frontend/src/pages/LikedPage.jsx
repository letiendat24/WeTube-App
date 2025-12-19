import VideoCard from "@/components/VideoCard";
import { VideoGridSkeleton } from "@/components/VideoSkeleton";
import { useGetLikedVideosQuery } from "@/features/videos/videoSlice";


function LikedPage() {
  const { data, isLoading } = useGetLikedVideosQuery();
  console.log(data);
  if (isLoading) {
    return <VideoGridSkeleton />;
  }
  return (
    <div className="">
      {/* <CategoryBar /> */}
      {data.map((video) => (
        <VideoCard key={video.id} video={video} variant="row"/>
      ))}
    </div>
  );
}

export default LikedPage