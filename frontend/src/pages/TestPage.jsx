import { fetchHomeVideos } from "@/api/youtube";
import { useEffect, useState } from "react";

function TestPage() {
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState("");
  const [loading, setLoading] = useState(false);

  const loadVideos = async (pageToken = "") => {
    try {
      setLoading(true);
      const res = await fetchHomeVideos(pageToken);

      setVideos(prev => [...prev, ...res.items]); // nối thêm video
      setNextPageToken(res.nextPageToken);
    } catch (err) {
      console.log("Error load home videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos(); // lần đầu load
  }, []);

  return (
    <div className="home-page">
      <h1>Trang chủ</h1>

      <div className="video-grid">
        {videos.map(video => (
          <div key={video.id} className="video-card">
            <img
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
            />
            <h3>{video.snippet.title}</h3>
          </div>
        ))}
      </div>

      {nextPageToken && (
        <button onClick={() => loadVideos(nextPageToken)}>
          Load More
        </button>
      )}

      {loading && <p>Đang tải...</p>}
    </div>
  );
}

export default TestPage;