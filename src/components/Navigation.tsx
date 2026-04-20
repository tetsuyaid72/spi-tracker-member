"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, List, Settings, LayoutDashboard } from 'lucide-react';
import { useSession } from '@/lib/auth-client';

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) return null;

  const role = (user as any).role || 'USER';
  const isUser = role === 'USER';

  return (
    <>
      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#151827]/90 backdrop-blur-xl border-t border-gray-200/60 dark:border-white/[0.06] z-50 md:hidden safe-area-inset-bottom">
        <div className="flex justify-around items-center h-[60px] px-3">
          {isUser ? (
            <>
              <NavItemMobile href="/map" icon={<Map size={20} strokeWidth={1.8} />} label="Peta" active={pathname === '/map'} />
              <NavItemMobile href="/stores" icon={<List size={20} strokeWidth={1.8} />} label="Toko" active={pathname === '/stores'} />
            </>
          ) : (
            <NavItemMobile href="/admin" icon={<LayoutDashboard size={20} strokeWidth={1.8} />} label="Dashboard" active={pathname === '/admin'} />
          )}
          <NavItemMobile href="/settings" icon={<Settings size={20} strokeWidth={1.8} />} label="Pengaturan" active={pathname === '/settings'} />
        </div>
      </nav>

      {/* Desktop side navigation */}
      <nav className="hidden md:flex flex-col w-56 bg-white/70 dark:bg-[#151827]/70 backdrop-blur-2xl border-r border-gray-100 dark:border-white/[0.06] shrink-0">
        <div className="flex-1 p-3 pt-5 space-y-1">
          {isUser ? (
            <>
              <NavItemDesktop href="/map" icon={<Map size={17} strokeWidth={1.8} />} label="Peta" active={pathname === '/map'} />
              <NavItemDesktop href="/stores" icon={<List size={17} strokeWidth={1.8} />} label="Daftar Toko" active={pathname === '/stores'} />
            </>
          ) : (
            <NavItemDesktop href="/admin" icon={<LayoutDashboard size={17} strokeWidth={1.8} />} label="Dashboard" active={pathname === '/admin'} />
          )}
        </div>
        <div className="p-3 border-t border-gray-100 dark:border-white/[0.06]">
          <NavItemDesktop href="/settings" icon={<Settings size={17} strokeWidth={1.8} />} label="Pengaturan" active={pathname === '/settings'} />
        </div>
      </nav>
    </>
  );
}

function NavItemMobile({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-200 ${
        active
          ? "text-gray-900 dark:text-white"
          : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
      }`}
    >
      {icon}
      <span className={`text-[10px] font-medium ${active ? 'font-semibold' : ''}`}>{label}</span>
      {active && <span className="w-1 h-1 rounded-full bg-gray-900 dark:bg-white mt-0.5" />}
    </Link>
  );
}

function NavItemDesktop({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-300 ${
        active
          ? 'bg-gradient-to-r from-gray-900 to-gray-800 dark:from-indigo-600 dark:to-indigo-700 text-white shadow-md shadow-gray-900/15 dark:shadow-indigo-900/30'
          : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100/60 dark:hover:bg-white/[0.04]'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
