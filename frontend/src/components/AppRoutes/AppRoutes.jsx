import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router";
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
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { useAuth } from "@/context/AuthContext";

function AppRoutes() {
  // Component bảo vệ route (Chỉ cho phép truy cập nếu đã login)
  const PrivateRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div>Loading...</div>; // Hoặc component Loading spinner

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
  };

  // Component ngăn user đã login truy cập lại trang login/register
  const PublicRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
  };
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

       {/* PROTECTED ROUTES (Chỉ dành cho Studio như yêu cầu) */}
        <Route element={<PrivateRoute />}>
          <Route element={<StudioLayout />}>
            <Route path="/studio" element={<Studio />} />
            <Route path="/studio/content" element={<Studio />} />
          </Route>
        </Route>

        <Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default AppRoutes;
