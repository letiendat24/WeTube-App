import Logo from "@/assets/logo.svg";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
function MenuLogo() {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full hover:bg-[#f2f2f2] text-[#0f0f0f] h-10 w-10"
      >
        <Menu className="w-5 h-5" />
      </Button>
      <div className="flex items-center gap-1 cursor-pointer select-none">
        <Link to="/">
          <div className="flex items-center gap-1 cursor-pointer select-none">
            <img src={Logo} alt="YouTube" className="h-5" />
            <span className="text-xl font-semibold tracking-tight">WeTube</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default MenuLogo;
