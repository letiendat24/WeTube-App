import { Menu, Search, Mic, Bell, Upload, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

export default function Header() {

    const [isExpanding, setIsExpanding] = useState(false);
    const toggleSidebar = () => setIsExpanded(!isExpanded);
  return (
    <header className="flex items-center justify-between px-4 h-14 bg-white border-b border-[#d9d9d9] text-[#0f0f0f] sticky top-0 z-50">
      {/* LEFT: logo */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-[#f2f2f2] text-[#0f0f0f] h-10 w-10"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-1 cursor-pointer select-none">
          <img src="/youtube-logo.svg" alt="YouTube" className="h-5" />
          <span className="text-xl font-semibold tracking-tight">YouTube</span>
        </div>
      </div>

      {/* CENTER: search bar */}
      <div className="flex flex-1 max-w-xl items-center justify-center px-4">
        <div className="flex w-full max-w-[600px]">
          <Input
            type="text"
            placeholder="Tìm kiếm"
            className="flex-1 h-10 rounded-l-full border border-[#ccc] bg-white placeholder:text-[#606060] text-[#0f0f0f] focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            size="icon"
            variant="secondary"
            className="rounded-r-full border border-l-0 border-[#ccc] bg-[#f8f8f8] hover:bg-[#e5e5e5] h-10 w-16 flex items-center justify-center"
          >
            <Search className="h-5 w-5 text-[#0f0f0f]" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-3 rounded-full hover:bg-[#f2f2f2] h-10 w-10"
        >
          <Mic className="h-5 w-5 text-[#0f0f0f]" />
        </Button>
      </div>

      {/* RIGHT: upload, notification, avatar */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-[#f2f2f2] h-10 w-10"
        >
          <Upload className="h-5 w-5 text-[#0f0f0f]" />
        </Button>

        {/* Notification dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-[#f2f2f2] h-10 w-10"
            >
              <Bell className="h-5 w-5 text-[#0f0f0f]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 p-0 bg-white border border-[#d9d9d9] text-[#0f0f0f] shadow-lg"
          >
            <DropdownMenuLabel className="px-4 py-2 text-sm font-semibold border-b border-[#e5e5e5]">
              Thông báo
            </DropdownMenuLabel>
            <div className="max-h-60 overflow-y-auto">
              {[1, 2, 3].map((i) => (
                <DropdownMenuItem
                  key={i}
                  className="text-sm py-2 hover:bg-[#f2f2f2] cursor-pointer"
                >
                  🔔 Thông báo mẫu {i}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-9 h-9 rounded-full bg-[#f2f2f2] flex items-center justify-center hover:ring-2 hover:ring-[#065fd4] transition-all">
              <User className="h-5 w-5 text-[#606060]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-52 bg-white text-[#0f0f0f] border border-[#d9d9d9] shadow-md"
          >
            <DropdownMenuLabel className="text-sm font-semibold border-b border-[#e5e5e5]">
              Tài khoản
            </DropdownMenuLabel>
            <DropdownMenuItem className="hover:bg-[#f2f2f2]">Hồ sơ</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#f2f2f2]">Cài đặt</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 hover:bg-[#f2f2f2]">
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
