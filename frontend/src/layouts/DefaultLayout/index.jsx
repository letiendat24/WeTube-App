import { Outlet } from "react-router";
import Home from "../../pages/Home";
import Header from "./components/Header";

function DefaultLayout() {
    return (
        <>
            <Header />
            <div>
                <Outlet />
            </div>
        </>

    )
}
export default DefaultLayout;