import { BrowserRouter as Router, Routes, Route } from "react-router";
import DefaultLayout from "../../layouts/DefaultLayout";
import Home from "../../pages/Home";
import ChannelSubscribes from "../../pages/ChannelSubscribe";

function AppRoutes() {
    return (

        <Router>
            <Routes>
                {/* DefaultLayout */}
                <Route element={<DefaultLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/subscriptions" element={<ChannelSubscribes />} />
                </Route>
            </Routes>
        </Router>
    )

}

export default AppRoutes;