// // src/components/Auth.jsx

// import { Link } from "react-router";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { User, Video, Settings, LogOut } from "lucide-react";

// // fake
// const loggedInUser = {
//   name: "John Doe",
//   email: "john.doe@email.com",
//   avatarUrl: "https://i.pravatar.cc/40",
//   initials: "JD",
// };


// function Auth() {
  

//   const handleSignOut = () => {
//     console.log("Đã đăng xuất!");
//   };

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button 
//           variant="ghost" 
//           className="relative rounded-full w-9 h-9"
//         >
//           <Avatar className="cursor-pointer w-9 h-9">
//             <AvatarImage src={loggedInUser.avatarUrl} alt={loggedInUser.name} />
//             <AvatarFallback>{loggedInUser.initials}</AvatarFallback>
//           </Avatar>
//         </Button>
//       </DropdownMenuTrigger>
      
//       <DropdownMenuContent className="border-none shadow-xl/20 w-60" align="end" forceMount>
        
//         {/* info user */}
//         <DropdownMenuLabel className="p-2 font-normal">
//           <div className="flex items-center gap-3">
//             <Avatar className="w-10 h-10">
//               <AvatarImage src={loggedInUser.avatarUrl} alt={loggedInUser.name} />
//               <AvatarFallback>{loggedInUser.initials}</AvatarFallback>
//             </Avatar>
//             <div className="flex flex-col space-y-1">
//               <p className="text-sm font-medium leading-none text-foreground">
//                 {loggedInUser.name}
//               </p>
//               <p className="text-xs leading-none text-muted-foreground">
//                 {loggedInUser.email}
//               </p>
//             </div>
//           </div>
//         </DropdownMenuLabel>
        
//         <DropdownMenuSeparator />

//         <DropdownMenuItem asChild className="py-2 cursor-pointer focus:bg-secondary-foreground">
//           <Link to="/profile">
//             <User className="w-4 h-4 mr-2" />
//             <span>My profile</span>
//           </Link>
//         </DropdownMenuItem>

//         <DropdownMenuItem asChild className="py-2 cursor-pointer focus:bg-secondary-foreground">
//           <Link to="/studio">
//             <Video className="w-4 h-4 mr-2" />
//             <span>My studio</span>
//           </Link>
//         </DropdownMenuItem>
        
//         <DropdownMenuItem asChild className="py-2 cursor-pointer focus:bg-secondary-foreground">
//           <Link to="/account/manage">
//             <Settings className="w-4 h-4 mr-2" />
//             <span>Manage account</span>
//           </Link>
//         </DropdownMenuItem>

//         <DropdownMenuSeparator />

//         <DropdownMenuItem 
//           onClick={handleSignOut}
//           className="py-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
//         >
//           <LogOut className="w-4 h-4 mr-2" />
//           <span>Sign out</span>
//         </DropdownMenuItem>

//         <DropdownMenuSeparator />

//         <div className="py-2">
//           <p className="text-xs text-center text-muted-foreground">
//             from WeTube
//           </p>
//         </div>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

// export default Auth;

// src/components/Header/Auth.jsx
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext"; // Kết nối với Context
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User as UserIcon, Video, Settings, LogOut, UserCircle2 } from "lucide-react";

function Auth() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/"); // Về trang chủ sau khi logout
  };

  // Trạng thái: CHƯA ĐĂNG NHẬP
  if (!isAuthenticated) {
    return (
      <Link to="/login">
        <Button 
          variant="outline" 
          className="rounded-full border-[#ccc] text-[#065fd4] hover:bg-[#def1ff] hover:border-[#def1ff] font-medium gap-2 px-4"
        >
          <UserCircle2 className="w-5 h-5" />
          Sign in
        </Button>
      </Link>
    );
  }

  // Trạng thái: ĐÃ ĐĂNG NHẬP
  // Lấy ký tự đầu của tên để làm fallback avatar
  const initials = user?.username ? user.username.charAt(0).toUpperCase() : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative rounded-full w-9 h-9 p-0 overflow-hidden"
        >
          <Avatar className="cursor-pointer w-9 h-9">
            {/* Ưu tiên avatarUrl từ user, nếu không có thì dùng fallback */}
            <AvatarImage src={user?.avatarUrl} alt={user?.username} objectFit="cover" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="border-none shadow-xl w-72 bg-white" align="end" forceMount>
        
        {/* User Info Header */}
        <DropdownMenuLabel className="p-3 font-normal">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.avatarUrl} alt={user?.username} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1 overflow-hidden">
              <p className="text-sm font-semibold leading-none text-foreground truncate">
                {user?.channelName || user?.username}
              </p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user?.email}
              </p>
              <Link to="/studio" className="text-xs text-blue-600 mt-1 hover:underline">
                View your channel
              </Link>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem asChild className="py-2 cursor-pointer hover:bg-gray-100">
          <Link to="/studio">
            <UserIcon className="w-5 h-5 mr-3 text-gray-600" />
            <span>Your channel</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="py-2 cursor-pointer hover:bg-gray-100">
          <Link to="/studio">
            <Video className="w-5 h-5 mr-3 text-gray-600" />
            <span>YouTube Studio</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="py-2 cursor-pointer hover:bg-gray-100">
          <Link to="/account">
            <Settings className="w-5 h-5 mr-3 text-gray-600" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem 
          onClick={handleSignOut}
          className="py-2 cursor-pointer hover:bg-gray-100"
        >
          <LogOut className="w-5 h-5 mr-3 text-gray-600" />
          <span>Sign out</span>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Auth;