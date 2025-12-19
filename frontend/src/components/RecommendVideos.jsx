import { useGetRelatedVideosQuery } from "@/features/videos/videoSlice";
import VideoCard from "./VideoCard";

function RecommendVideos({ tags }) {
  const safeTags = Array.isArray(tags) ? tags : [];
  const { data, isLoading } = useGetRelatedVideosQuery(safeTags);
  console.log(data);
  return (
    <>
      {data?.map((video) => (
        <VideoCard video={video} variant="compact"/>
      ))}
    </>
  );
}

export default RecommendVideos;
