// import CategoryBar from "../components/CategoryBar";
import { useCallback, useEffect, useState } from "react";
import VideoCard from "../../components/VideoCard";
import { VideoGridSkeleton } from "../../components/VideoSkeleton";
import axios from "axios";
import { fetchHomeVideos } from "@/api/youtube";
import useInfiniteScroll from "@/hooks/useInfinityScroll";
// import { useEffect, useState } from "react";

function Home() {
  // const API_KEY = "AIzaSyA_dcjfpUea9NFtvsIzfQ0I6B52P-7aNsk";
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState("");
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);
    const [showSkeleton, setShowSkeleton] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setIsLoading(true);
  //       const res = await axios.get(
  //         `https://www.googleapis.com/youtube/v3/videos`,
  //         {
  //           params: {
  //           part: "snippet,statistics",
  //           chart: "mostPopular",
  //           maxResults: 10,
  //           regionCode: "VN",
  //           key: API_KEY,
  //         },
  //         }
  //       );
  //       // if (!res.ok) throw new Error("Can not download videos");
  //       console.log(res.data.items)
  //       console.log(res.data.items.snippet)
  //       setVideos(res.data.items);
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

   const loadMore = useCallback(async () => {
    if (isLoadingAPI) return;

    setIsLoadingAPI(true);
    setShowSkeleton(true);

    const MIN_DELAY = 500; // skeleton tối thiểu 500ms
    const startTime = Date.now();

    const data = await fetchHomeVideos(nextPageToken);

    const elapsed = Date.now() - startTime;
    if (elapsed < MIN_DELAY) {
      await new Promise(res => setTimeout(res, MIN_DELAY - elapsed));
    }

    setVideos(prev => [...prev, ...data.items]);
    setNextPageToken(data.nextPageToken || "");
    setIsLoadingAPI(false);

    // delay 100ms nữa để skeleton mượt biến mất
    setTimeout(() => setShowSkeleton(false), 100);
  }, [nextPageToken, isLoadingAPI]);

  // Load lần đầu
  useEffect(() => {
    loadMore();
  }, []);

  // Infinity scroll
  useInfiniteScroll(loadMore);

  // if (isLoading) {
  //   return <VideoGridSkeleton />;
  // }
  return (
    <>
      <div className="grid grid-cols-1 p-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8">
        {/* <CategoryBar /> */}
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} variant="grid" />
        ))}
      </div>
      {showSkeleton && (
        <div className="mt-6">
          <VideoGridSkeleton />
        </div>
      )}
    </>
  );
}
export default Home;
