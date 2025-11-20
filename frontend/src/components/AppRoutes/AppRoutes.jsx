import { BrowserRouter as Router, Routes, Route } from "react-router";
import DefaultLayout from "../../layouts/DefaultLayout";
import Home from "../../pages/Home";
import SubscribedPage from "@/pages/SubscribedPage";
import WatchingLayout from "@/layouts/WatchingLayout";
import WatchPage from "@/pages/WatchPage";
import SearchPage from "@/pages/SearchPage";
import TrendingPage from "@/pages/TrendingPage";
import LikedPage from "@/pages/LikedPage";
import AllPlaylistPage from "@/pages/AllPlaylistPage";
import AllSubscriptionsPage from "@/pages/AllSubscriptionsPage";
import HistoryPage from "@/pages/HistoryPage";
import Studio from "@/pages/Studio";
import StudioLayout from "@/layouts/StudioLayout";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* DefaultLayout */}
        <Route element={<DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path="/subscribed" element={<SubscribedPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/liked" element={<LikedPage />} />
          <Route path="/playlists" element={<AllPlaylistPage />} />
          <Route path="/subscriptions" element={<AllSubscriptionsPage />} />
        </Route>
        <Route element={<WatchingLayout />}>
          <Route path="/video/:videoId" element={<WatchPage />} />
        </Route>

        <Route element={<StudioLayout />}>
          <Route path="/studio" element={<Studio />} />
          <Route path="/studio/content" element={<Studio />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default AppRoutes;
