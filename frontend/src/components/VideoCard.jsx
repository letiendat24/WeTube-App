import { useEffect, useState } from "react";
import { VideoGridSkeleton } from "./VideoSkeleton";
import { formatDateTime } from "../utils/formatDateTime";
export default function VideoCard() {
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
    <div className="grid gap-6 p-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <div
          key={video.id}
          className="transition-shadow duration-300 bg-white shadow cursor-pointer rounded-xl hover:shadow-lg"
        >
          <div className="relative w-full overflow-hidden aspect-video rounded-t-xl">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="flex p-3 mt-6 space-x-3">
            {/* Avatar kênh */}
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 font-bold text-gray-600 bg-gray-300 rounded-full">
              {video.channel?.[0]?.toUpperCase()}
            </div>

            {/* Thông tin video */}
            <div className="flex flex-col">
              <h3 className="font-semibold text-gray-900 line-clamp-2">{video.title}</h3>
              <p className="text-sm text-gray-500">{video.channel}</p>
              <p className="text-xs text-gray-400">
                {video.views.toLocaleString()} lượt xem • {formatDateTime(video.uploadedAt)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
