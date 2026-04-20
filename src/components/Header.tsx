"use client";

import { useSession } from "@/lib/auth-client";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const user = session?.user;

  if (!user) return null;

  const role = (user as any).role || "USER";
  const roleLabel = role === "ADMIN" ? "Admin" : "Deliman";

  return (
    <header className="fixed top-0 w-full h-14 bg-white/85 dark:bg-[#151827]/90 backdrop-blur-2xl border-b border-gray-100 dark:border-white/[0.06] z-50 flex items-center justify-between px-5 md:pl-[15.5rem]">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-white shadow-sm border border-gray-100/50 dark:border-white/10 flex items-center justify-center p-1.5">
          <img src="/spi-logo.png" alt="SPI" className="w-full h-full object-contain" />
        </div>
        <div className="block border-l border-gray-200 dark:border-white/10 pl-2.5">
          <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-100 leading-tight tracking-tight">Tracker Toko</p>
          <p className="text-[9px] text-gray-300 dark:text-gray-500 font-medium tracking-wider uppercase">Store Management</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all duration-200"
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {theme === "dark" ? <Sun size={16} strokeWidth={1.8} /> : <Moon size={16} strokeWidth={1.8} />}
        </button>
        <div className="text-right hidden md:block">
          <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-100 leading-tight">{user.name}</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-wide uppercase">{roleLabel}</p>
        </div>
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 dark:from-indigo-600 dark:to-indigo-800 text-white flex items-center justify-center text-[11px] font-bold tracking-tight ring-2 ring-white dark:ring-[#151827] shadow-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white dark:ring-[#151827]" />
        </div>
      </div>
    </header>
  );
}
