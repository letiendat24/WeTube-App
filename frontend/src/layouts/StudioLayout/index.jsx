import { Outlet } from "react-router";
import SidebarStudio from "./components/SidebarStudio";
import Header from "./components/Header"; 

export default function StudioLayout() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header /> 
      <div className="flex flex-1 overflow-hidden"> 
        <SidebarStudio /> 
        <main className="flex-1 overflow-y-auto"> 
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}