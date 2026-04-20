"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { useSession } from "@/lib/auth-client";

const PUBLIC_PATHS = ["/login"];

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isPublicPage = PUBLIC_PATHS.includes(pathname);
  const isLoggedIn = !!session?.user;

  // Redirect to login if not logged in and not on a public page
  useEffect(() => {
    if (!mounted || isPending) return;
    if (!isLoggedIn && !isPublicPage) {
      router.replace("/login");
    }
  }, [mounted, isPending, isLoggedIn, isPublicPage, router]);

  if (!mounted || isPending) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-[#0c0e1a] dark:to-[#151827]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white dark:bg-white/10 shadow-lg shadow-gray-200/30 dark:shadow-black/20 flex items-center justify-center p-2">
            <img src="/spi-logo.png" alt="SPI" className="h-full w-auto object-contain animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  // Show redirecting state
  if (!isLoggedIn && !isPublicPage) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-[#0c0e1a] dark:to-[#151827]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white dark:bg-white/10 shadow-lg shadow-gray-200/30 dark:shadow-black/20 flex items-center justify-center p-2">
            <img src="/spi-logo.png" alt="SPI" className="h-full w-auto object-contain animate-pulse" />
          </div>
          <div className="text-[10px] text-gray-300 dark:text-gray-500 font-medium tracking-widest uppercase">Redirecting</div>
        </div>
      </div>
    );
  }

  // On public pages (login) or when not logged in → render children fullscreen, no chrome
  if (isPublicPage || !isLoggedIn) {
    return <>{children}</>;
  }

  // Authenticated layout with Header + Navigation
  return (
    <>
      <Header />
      <div className="flex pt-14 flex-col md:flex-row h-[calc(100vh-3.5rem)]">
        <Navigation />
        <main className="flex-1 overflow-auto pb-16 md:pb-0 bg-gradient-to-br from-[#fafafa] to-[#f5f5f5] dark:from-[#0c0e1a] dark:to-[#101320]">
          {children}
        </main>
      </div>
    </>
  );
}
