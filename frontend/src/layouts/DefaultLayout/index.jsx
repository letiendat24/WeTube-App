// // import { Outlet } from "react-router"
// // import Header from "@/components/Header"
// // import SideBar from "@/components/SideBar"

// // export default function DefaultLayout() {
// //   return (
// //     <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
// //       {/* HEADER */}
// //       <Header />

// //       <div className="flex">
// //         {/* SIDEBAR (cố định bên trái, nằm dưới header) */}
// //         <aside
// //           className="fixed top-[56px] left-0 w-[72px] h-[calc(100vh-56px)]
// //           bg-[var(--surface)] border-r border-[var(--border-color)] overflow-y-auto
// //           flex flex-col items-center py-3"
// //         >
// //           <SideBar />
// //         </aside>

// //         {/* MAIN CONTENT */}
// //         <main
// //           className="flex-1 ml-[72px] mt-[56px] p-6
// //           bg-[var(--background)] text-[var(--text-primary)]"
// //         >
// //           <Outlet />
// //         </main>
// //       </div>
// //     </div>
// //   )
// // }
// import { Outlet } from "react-router"
// import Header from "@/components/Header"
// import SideBar from "@/components/SideBar"

// export default function DefaultLayout() {
//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       {/* HEADER */}
//       <Header />

//       <div className="flex">
//         {/* SIDEBAR */}
//         <aside
//           className="fixed top-[56px] left-0 w-[72px] h-[calc(100vh-56px)]
//                      bg-background border-r border-border overflow-y-auto
//                      flex flex-col items-center py-3"
//         >
//           {/* Component Sidebar (chứa menu) được đặt bên trong */}
//           <SideBar />
//         </aside>

//         {/* MAIN CONTENT */}
//         <main
//           className="flex-1 ml-[72px] mt-[56px] p-6
//                      bg-background text-foreground"
//         >
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   )
// }

// src/layouts/DefaultLayout.jsx

import { Outlet } from "react-router";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";

export default function DefaultLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="flex">
        {/* SIDEBAR */}
        <aside
          className="fixed top-[56px] left-0 h-[calc(100vh-56px)] 
                     bg-background  border-border overflow-y-auto 
                     w-60" // SỬA: Tăng độ rộng từ w-[72px] lên w-60 (240px)
          // XÓA: 'flex', 'items-center' (Sidebar.jsx tự xử lý)
        >
          <SideBar />
        </aside>

        {/* MAIN CONTENT */}
        <main
          className="flex-1 mt-[56px] p-6 
                     bg-transparent text-foreground
                     
                     ml-60" // SỬA: Tăng margin-left từ ml-[72px] lên ml-60
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
