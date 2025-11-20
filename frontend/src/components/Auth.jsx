// src/components/Auth.jsx

import { Link } from "react-router";
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
import { User, Video, Settings, LogOut } from "lucide-react";

// fake
const loggedInUser = {
  name: "John Doe",
  email: "john.doe@email.com",
  avatarUrl: "https://i.pravatar.cc/40",
  initials: "JD",
};


function Auth() {
  

  const handleSignOut = () => {
    console.log("Đã đăng xuất!");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative rounded-full w-9 h-9"
        >
          <Avatar className="cursor-pointer w-9 h-9">
            <AvatarImage src={loggedInUser.avatarUrl} alt={loggedInUser.name} />
            <AvatarFallback>{loggedInUser.initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="border-none shadow-xl/20 w-60" align="end" forceMount>
        
        {/* info user */}
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={loggedInUser.avatarUrl} alt={loggedInUser.name} />
              <AvatarFallback>{loggedInUser.initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-foreground">
                {loggedInUser.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {loggedInUser.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="py-2 cursor-pointer focus:bg-secondary-foreground">
          <Link to="/profile">
            <User className="w-4 h-4 mr-2" />
            <span>My profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="py-2 cursor-pointer focus:bg-secondary-foreground">
          <Link to="/studio">
            <Video className="w-4 h-4 mr-2" />
            <span>My studio</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild className="py-2 cursor-pointer focus:bg-secondary-foreground">
          <Link to="/account/manage">
            <Settings className="w-4 h-4 mr-2" />
            <span>Manage account</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem 
          onClick={handleSignOut}
          className="py-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Sign out</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="py-2">
          <p className="text-xs text-center text-muted-foreground">
            from WeTube
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Auth;