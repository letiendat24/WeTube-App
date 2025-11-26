// import CategoryBar from "../components/CategoryBar";
import { useCallback, useEffect, useState } from "react";
import VideoCard from "../../components/VideoCard";
import { VideoGridSkeleton } from "../../components/VideoSkeleton";
import useInfiniteScroll from "@/hooks/useInfinityScroll";
import videoApi from "@/api/videoApi";


function Home() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1); // Backend dùng page (số), không dùng token
  const [hasMore, setHasMore] = useState(true); // Kiểm tra còn dữ liệu để load không
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  
  // Reset state khi component mount
  useEffect(() => {
    setVideos([]);
    setPage(1);
    setHasMore(true);
    // Gọi loadMore ngay lần đầu tiên
    loadMore(1); 
  }, []);

  const loadMore = useCallback(async (currentPage = page) => {
    // Nếu đang load hoặc hết dữ liệu thì dừng
    if (isLoadingAPI || !hasMore) return;

    setIsLoadingAPI(true);
    setShowSkeleton(true);

    const MIN_DELAY = 500; // Giữ nguyên hiệu ứng skeleton mượt mà
    const startTime = Date.now();

    try {
      // Gọi API từ Backend của bạn
      const data = await videoApi.getAll({
        page: currentPage,
        limit: 12, // Load 12 video mỗi lần cho đẹp grid
        sort: 'latest'
      });

      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_DELAY) {
        await new Promise((res) => setTimeout(res, MIN_DELAY - elapsed));
      }

      if (data.length === 0) {
        setHasMore(false); // Hết video để load
      } else {
        setVideos((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1); // Tăng số trang lên cho lần load sau
      }

    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setIsLoadingAPI(false);
      // Delay nhẹ để skeleton biến mất mượt
      setTimeout(() => setShowSkeleton(false), 100);
    }
  }, [page, hasMore, isLoadingAPI]);

  // Hook Infinity Scroll (kích hoạt khi cuộn xuống đáy)
  useInfiniteScroll(() => loadMore(page));
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
