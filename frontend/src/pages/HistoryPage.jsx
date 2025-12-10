import videoApi from "@/api/videoApi";
import VideoCard from "@/components/VideoCard";
import { VideoGridSkeleton } from "@/components/VideoSkeleton";
import { useEffect, useState } from "react";

function HistoryPage() {
 const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await videoApi.getHistoryVideos();
        console.log(res.data);
        setVideos(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


// useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const res = await videoApi.getDetail();

//         console.log(res.data);
//         setVideos(res.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);
     
  if (isLoading) {
    return <VideoGridSkeleton />;
  }
  return (
    <div className="">
      {/* <CategoryBar /> */}
      {videos.map((video) => (
        <VideoCard key={video.video._id} video={video.video} variant="row"/>
      ))}
    </div>
  );
}

export default HistoryPage