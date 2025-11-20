import { Menu, Search, Mic, Bell, Upload, User } from "lucide-react";
import { Button } from "@/components/ui/button";

import Auth from "./Auth";

import SearchBar from "./SearchBar";
import MenuLogo from "./MenuLogo";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 h-14 bg-white border-b border-[#d9d9d9] text-[#0f0f0f] sticky top-0 z-50">
      {/* LEFT: logo */}
      <MenuLogo />

      {/* CENTER: search bar */}
      <SearchBar />

      {/* RIGHT: avatar */}
      <Auth />
    </header>
  );
}
