import { BrowserRouter as Router, Routes, Route } from "react-router";
import DefaultLayout from "../../layouts/DefaultLayout";
import Home from "../../pages/Home";
import ChannelSubscribes from "../../pages/ChannelSubscribe";
import WatchingLayout from "@/layouts/WatchingLayout";
import WatchPage from "@/pages/WatchPage";

function AppRoutes() {
    return (

        <Router>
            <Routes>
                {/* DefaultLayout */}
                <Route element={<DefaultLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/subscriptions" element={<ChannelSubscribes />} />
                </Route>
                <Route element={<WatchingLayout />}>
                    <Route path="/video/:videoId" element={<WatchPage />} />
                   
                </Route>
            </Routes>
        </Router>
    )

}

export default AppRoutes;