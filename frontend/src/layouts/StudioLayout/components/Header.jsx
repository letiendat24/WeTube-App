import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Link } from "react-router"
import Logo from "@/assets/logo.svg";

function Header() {
  return (
    <header className="flex items-center justify-between px-4 h-14 bg-white border-b border-[#d9d9d9] text-[#0f0f0f] sticky top-0 z-50">
        {/* LEFT: logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-[#f2f2f2] text-[#0f0f0f] h-10 w-10"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-1 cursor-pointer select-none">
            <Link to="/studio">
              <div className="flex items-center justify-between gap-2">
                <img src={Logo} alt="YouTube" className="h-5" />
                <span className="text-xl font-bold tracking-tight">Studio</span>
              </div>
            </Link>
          </div>
        </div>
      </header>
  )
}

export default Header