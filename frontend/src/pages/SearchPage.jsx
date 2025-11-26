import { searchYoutube } from "@/api/youtube";
import { Card } from "@/components/ui/card";
// import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";

function SearchPage() {
  // // const [searchParams] = useSearchParams();
  // // const searchQuery = searchParams.get("query");

  // const [results, setResults] = useState([]);
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   // if (!searchQuery) return;
  //   const fetchResults = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await fetch(
  //         // `http://localhost:3001/videos?q=${searchQuery}`
  //         "http://localhost:3001/videos"
  //       );
  //       const data = await res.json();
  //       setResults(data);
  //       console.log(data);
  //     } catch (error) {
  //       console.error("Searching Error....", error);
  //     }
  //     setLoading(false);
  //   };
  //   fetchResults();
  // }, []); //searchQuery

  const [params] = useSearchParams();
  const loading = false;
  const query = params.get("query");

  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;

    const load = async () => {
      const data = await searchYoutube(query);
      setResults(data.items);
      console.log(data.items);
    };

    load();
  }, [query]);
  return (
    <>
      {loading ? (
        <div>Loading</div>
      ) : (
        <div className="">
          {results.map((video) => (
            <Link to = {`/video/${video.id.videoId}`} key={video.id}>
            <Card className="border-none shadow-transparent bg-transparent mb-[20px] p-3">
              <div className="flex items-start justify-start gap-3">
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  className="object-cover rounded-lg w-100 h-60"
                />
                <div className="items-start flex-1">
                  <h1 className="text-lg font-bold">{video.snippet.title}</h1>
                  <p className="my-4 text-xs text-muted-foreground">
                    {video.views} - {video.likes}
                  </p>
                  <div className="flex items-center justify-start gap-3">
                    <img
                      src={video.snippet.thumbnails.medium.url}
                      alt=""
                      className="object-cover w-12 h-12 rounded-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      {video.snippet.channelTitle}
                    </p>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    {video.snippet.description}
                  </p>
                </div>
              </div>
            </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default SearchPage;
