import Header from "@/components/Header";
import { Outlet } from "react-router";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/SideBar";
import RecommendVideos from "@/components/RecommendVideos";

function WatchingLayout() {
  return (
    <div className="min-h-screen text-foreground bg-background">
      <Header />
      {/* <div className="flex flex-col md:flex-row justify-between max-w-[1600px] mx-auto px-4 md:px-6 pt-4">
        <div className="w-full md:w-[60%] lg:w-[62%] space-y-4">
          <Outlet />
        </div>
        <div className="w-full md:w-[38%] lg:w-[36%] mt-6 md:mt-0 md:pl-4 space-y-4">
          <RecommendVideos />
        </div>
      </div> */}
      <div>
        <Outlet/>
      </div>
    </div>
  );
}

export default WatchingLayout;
