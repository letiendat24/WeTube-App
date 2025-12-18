import VideoCard from "@/components/VideoCard";
import { VideoGridSkeleton } from "@/components/VideoSkeleton";
import { useGetSubscribedVideosQuery } from "@/features/videos/videoSlice";

function SubscribedPage() {
  const { data, isLoading } = useGetSubscribedVideosQuery();
  if (isLoading) {
    return <VideoGridSkeleton />;
  }
  return (
    <div className="grid grid-cols-1 p-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8">
      {/* <CategoryBar /> */}
      {data.map((video) => (
        <VideoCard key={video.id} video={video} variant="grid" />
      ))}
    </div>
  );
}
export default SubscribedPage;
