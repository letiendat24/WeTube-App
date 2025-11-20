// src/components/studio/StudioSidebar.jsx

import { NavLink, Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutGrid,
  BarChart3,
  MessageSquare,
  LogOut,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import avatar from "@/assets/react.svg";
// (Hàm render StudioNavLink giữ nguyên)
const StudioNavLink = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:bg-secondary",
        isActive && "bg-secondary font-semibold"
      )
    }
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </NavLink>
);

export default function StudioSidebar() {
  const user = {
    name: "Antonio Codes",
    avatar,
  };

  return (
    <aside className="flex flex-col flex-shrink-0 h-full p-4 overflow-y-auto border-r w-60 bg-background border-border">
      <div className="flex flex-col items-center justify-center gap-3 mb-6 text-center">
        <Avatar className="w-15 h-15 ring-4 ring-primary ring-offset-4 ring-offset-background">
          <AvatarImage src={user.avatar} />
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-muted-foreground">
            Your profile
          </p>
          <p className="font-semibold text-foreground">{user.name}</p>
        </div>
      </div>

      {/* Menu (flex-1 để đẩy nút Exit xuống) */}
      <nav className="flex flex-col gap-2">
        <StudioNavLink to="/studio/content" icon={Video} label="Content" />
      </nav>

      {/* Nút Exit (luôn ở dưới cùng) */}
      <div className="">
        <hr className="my-1" />
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 transition-all rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <LogOut className="w-5 h-5" />
          Exit studio
        </Link>
      </div>
    </aside>
  );
}
