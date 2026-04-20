"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { LogOut, User, Mail, Shield, ChevronRight } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const role = (user as any)?.role || "USER";
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  const roleLabel = role === "ADMIN" ? "Administrator" : "Deliman";

  return (
    <div className="p-5 md:p-8 max-w-lg mx-auto">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-1">Pengaturan</h2>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-8">Kelola profil dan preferensi akun Anda</p>

      {/* Profile Card */}
      <div className="bg-white dark:bg-[#151827] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden mb-6 shadow-sm shadow-gray-100/50 dark:shadow-black/10">
        <div className="p-5 flex items-center gap-4">
          <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 dark:from-indigo-600 dark:to-indigo-800 text-white flex items-center justify-center text-lg font-bold shrink-0 shadow-md shadow-gray-900/10 dark:shadow-indigo-900/20" style={{ width: '52px', height: '52px' }}>
            {user?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-[15px] truncate">{user?.name || "—"}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{user?.email || "—"}</p>
          </div>
          <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/[0.06] px-2.5 py-1 rounded-lg uppercase tracking-widest shrink-0">
            {roleLabel}
          </span>
        </div>

        <div className="border-t border-gray-50 dark:border-white/[0.04]">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center">
              <User size={14} className="text-gray-400 dark:text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-300 dark:text-gray-500 font-semibold uppercase tracking-wider">Nama</p>
              <p className="text-sm text-gray-700 dark:text-gray-200 font-medium truncate">{user?.name || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3.5 border-t border-gray-50 dark:border-white/[0.04]">
            <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center">
              <Mail size={14} className="text-gray-400 dark:text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-300 dark:text-gray-500 font-semibold uppercase tracking-wider">Email</p>
              <p className="text-sm text-gray-700 dark:text-gray-200 font-medium truncate">{user?.email || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3.5 border-t border-gray-50 dark:border-white/[0.04]">
            <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center">
              <Shield size={14} className="text-gray-400 dark:text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-300 dark:text-gray-500 font-semibold uppercase tracking-wider">Peran</p>
              <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">{roleLabel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-between px-5 py-4 bg-white dark:bg-[#151827] rounded-2xl border border-gray-100 dark:border-white/[0.06] text-red-500 dark:text-red-400 hover:bg-red-50/30 dark:hover:bg-red-500/5 hover:border-red-100 dark:hover:border-red-500/20 transition-all duration-300 group shadow-sm shadow-gray-100/50 dark:shadow-black/10"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-500/20 transition-colors">
            <LogOut size={14} strokeWidth={1.8} />
          </div>
          <span className="text-sm font-semibold">Keluar dari akun</span>
        </div>
        <ChevronRight size={14} className="text-gray-200 dark:text-gray-600 group-hover:text-red-300 group-hover:translate-x-0.5 transition-all" />
      </button>

      {/* Footer */}
      <p className="text-center text-[10px] text-gray-300 dark:text-gray-600 mt-12 font-medium tracking-wide">
        SPI Tracker v1.0 · Hasbuna
      </p>
    </div>
  );
}
