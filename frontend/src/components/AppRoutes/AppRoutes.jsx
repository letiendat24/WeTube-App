import { BrowserRouter as Router, Routes, Route } from "react-router";
import DefaultLayout from "../../layouts/DefaultLayout";
import Home from "../../pages/Home";
import SubscribedPage from "@/pages/SubscribedPage";
import WatchingLayout from "@/layouts/WatchingLayout";
import WatchPage from "@/pages/WatchPage";
import SearchPage from "@/pages/SearchPage";

function AppRoutes() {
    return (

        <Router>
            <Routes>
                {/* DefaultLayout */}
                <Route element={<DefaultLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/subscriptions" element={<SubscribedPage />} />
                    <Route path="/search" element={<SearchPage />} />
                </Route>
                <Route element={<WatchingLayout />}>
                    <Route path="/video/:videoId" element={<WatchPage />} />
                </Route>
            </Routes>
        </Router>
    )

}

export default AppRoutes;