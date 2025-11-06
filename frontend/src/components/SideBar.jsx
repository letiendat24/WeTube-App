

import { NavLink } from "react-router"
import { Home, Clapperboard, PlaySquare, User } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: Home, label: "Trang chủ", to: "/" },
  { icon: Clapperboard, label: "Shorts", to: "/shorts" },
  { icon: PlaySquare, label: "Kênh đăng ký", to: "/subscriptions" },
  { icon: User, label: "Bạn", to: "/you" },
]

export default function Sidebar({ className }) {
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 flex flex-col items-center gap-2 w-[72px] h-screen pt-16",
        className
      )}
    >
      <nav className="flex flex-col items-center w-full gap-1">
        {menuItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={label}
            to={to}
            end
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full py-3 text-[12px] font-medium rounded-xl transition-colors",
                isActive
                  ? "text-[var(--accent-color)] bg-[var(--surface-active)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="mb-1"
                />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
