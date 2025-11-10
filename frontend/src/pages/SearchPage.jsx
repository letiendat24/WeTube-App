import { Card } from "@/components/ui/card";
// import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";

function SearchPage() {
  // const [searchParams] = useSearchParams();
  // const searchQuery = searchParams.get("query");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if (!searchQuery) return;
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          // `http://localhost:3001/videos?q=${searchQuery}`
          "http://localhost:3001/videos"
        );
        const data = await res.json();
        setResults(data);
        console.log(data);
      } catch (error) {
        console.error("Searching Error....", error);
      }
      setLoading(false);
    };
    fetchResults();
  }, []); //searchQuery

  return (
    <>
      {loading ? (
        <div>Loading</div>
      ) : (
        <div className="">
          {results.map((video) => (
            // <Link to = {`/video/${video.id}`} key={video.id}>
            <Card className="border-none shadow-transparent bg-transparent mb-[20px] p-3">
              <div className="flex justify-start items-start gap-3">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="object-cover w-100 h-60 rounded-lg"
                />
                <div className="flex-1 items-start"> 
                  <h1 className="text-lg font-bold">{video.title}</h1>
                  <p className="text-xs text-muted-foreground my-4">
                    {video.views} - {video.likes}
                  </p>
                  <div className="flex gap-3 items-center justify-start">
                    <img
                      src={video.thumbnail}
                      alt=""
                      className="object-cover w-12 h-12 rounded-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      {video.channel}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    {video.description}
                  </p>
                </div>
              </div>
            </Card>
            // </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default SearchPage;
