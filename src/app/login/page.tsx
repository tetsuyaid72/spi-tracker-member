"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp, useSession } from "@/lib/auth-client";
import { MapPin, Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  // Redirect if already logged in
  useEffect(() => {
    if (session?.user) {
      const role = (session.user as any).role || "USER";
      if (role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/map");
      }
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (isSignUp && !name) return;

    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        const result = await signUp.email({
          name,
          email,
          password,
        });

        if (result.error) {
          setError(result.error.message || "Gagal mendaftar. Coba lagi.");
          setLoading(false);
          return;
        }
      } else {
        const result = await signIn.email({
          email,
          password,
        });

        if (result.error) {
          setError("Akun anda belum terdaftar");
          setLoading(false);
          return;
        }
      }

      // Small delay to let session update
      setTimeout(() => {
        setLoading(false);
        router.push("/");
        router.refresh();
      }, 300);
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a1a]">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-yellow-500/10 blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating decorative dots */}
      <div className="absolute top-20 left-[15%] w-2 h-2 rounded-full bg-blue-400/40 animate-bounce" style={{ animationDuration: "3s" }} />
      <div className="absolute top-40 right-[20%] w-1.5 h-1.5 rounded-full bg-yellow-400/40 animate-bounce" style={{ animationDuration: "4s", animationDelay: "0.5s" }} />
      <div className="absolute bottom-32 left-[25%] w-1.5 h-1.5 rounded-full bg-indigo-400/40 animate-bounce" style={{ animationDuration: "3.5s", animationDelay: "1s" }} />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-[420px] mx-4">
        {/* Logo + Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg shadow-white/15 mb-5 p-2.5">
            <img src="/spi-logo.png" alt="SPI" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-white">Aplikasi Tracker Toko</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {isSignUp ? "Buat akun baru untuk memulai" : "Sistem pelacakan lokasi member"}
          </p>
        </div>

        {/* Card */}
        <div className="backdrop-blur-xl bg-white/[0.07] border border-white/[0.08] rounded-2xl p-7 shadow-2xl shadow-black/20">
          {/* Tab switcher */}
          <div className="flex bg-white/[0.05] rounded-xl p-1 mb-7">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                !isSignUp
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                isSignUp
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Daftar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field (sign-up only) */}
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Nama Anda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isSignUp}
                    className="w-full h-12 pl-10 pr-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 pl-10 pr-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 pl-10 pr-12 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 text-center animate-in fade-in slide-in-from-top-1 duration-200">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Buat Akun" : "Masuk"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-6">
          © 2026 SPI Tracker • Developed by Hasbuna
        </p>
      </div>
    </div>
  );
}
