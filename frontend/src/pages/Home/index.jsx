// import CategoryBar from "../components/CategoryBar";
import VideoCard from "../../components/VideoCard";
import { VideoGridSkeleton } from "../../components/VideoSkeleton";
// import { useEffect, useState } from "react";

function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* <CategoryBar /> */}
      <VideoCard />
    </div>
  );
}
export default Home;