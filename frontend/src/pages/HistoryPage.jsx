import VideoCard from "@/components/VideoCard";
import { VideoGridSkeleton } from "@/components/VideoSkeleton";
import { useGetHistoryQuery } from "@/features/videos/videoSlice";

function HistoryPage() {
  const {data, isLoading} = useGetHistoryQuery();
  console.log(data)
  if (isLoading) {
    return <VideoGridSkeleton />;
  }
  return (
    <div className="">
      {/* <CategoryBar /> */}
      {data.map((video) => (
        <VideoCard key={video._id} video={video} variant="row"/>
      ))}
    </div>
  );
}

export default HistoryPage