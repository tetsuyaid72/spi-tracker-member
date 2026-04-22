"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAppStore, REGIONS, REGION_COLORS, Region, type StoreStatus } from "@/store/useAppStore";
import { useSession } from "@/lib/auth-client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Download, Users, MapPinned, TrendingUp, Clock,
  Trash2, Pencil, Search, ExternalLink,
  Store, Phone, Navigation, ImagePlus, X, Eye,
  MapPin, LayoutGrid, ChevronRight, CheckCircle2, XCircle, Hourglass, Plus,
  BarChart3, Activity, Shield, ChevronDown
} from "lucide-react";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface EditStoreData {
  name: string;
  region: Region | "";
  whatsapp: string;
  imageData: string;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
export default function AdminPage() {
  // Store
  const stores = useAppStore((s) => s.stores);
  const users = useAppStore((s) => s.users);
  const addStore = useAppStore((s) => s.addStore);
  const deleteStore = useAppStore((s) => s.deleteStore);
  const updateStore = useAppStore((s) => s.updateStore);
  const fetchStores = useAppStore((s) => s.fetchStores);
  const fetchUsers = useAppStore((s) => s.fetchUsers);
  const approveStore = useAppStore((s) => s.approveStore);
  const rejectStore = useAppStore((s) => s.rejectStore);
  const deleteUser = useAppStore((s) => s.deleteUser);

  const { data: session } = useSession();

  // Fetch data on mount
  useEffect(() => {
    fetchStores();
    fetchUsers();
  }, [fetchStores, fetchUsers]);

  const delimanUsers = users.filter((u) => u.role === "USER");

  // Tab state
  const [activeTab, setActiveTab] = useState("overview");

  // Map tab state
  const [mapFilter, setMapFilter] = useState<string>("all");
  const [mapRegionFilter, setMapRegionFilter] = useState<string>("all");
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Toko tab state
  const [storeSearch, setStoreSearch] = useState("");
  const [storeRegionFilter, setStoreRegionFilter] = useState<string>("all");
  const [storeUserFilter, setStoreUserFilter] = useState<string>("all");

  // Edit store dialog
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [editData, setEditData] = useState<EditStoreData>({ name: "", region: "", whatsapp: "", imageData: "" });
  const editFileRef = useRef<HTMLInputElement>(null);

  // View store detail dialog
  const [viewingStoreId, setViewingStoreId] = useState<string | null>(null);

  // Add store dialog
  const [isAddingStore, setIsAddingStore] = useState(false);
  const [addData, setAddData] = useState({ name: "", lat: "", lng: "", region: "" as Region | "", whatsapp: "", imageData: "" });
  const addFileRef = useRef<HTMLInputElement>(null);
  const [addSuccess, setAddSuccess] = useState("");

  // Google Maps link resolver
  const [gmapsUrl, setGmapsUrl] = useState("");
  const [gmapsLoading, setGmapsLoading] = useState(false);
  const [gmapsError, setGmapsError] = useState("");

  // ---------------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------------
  const mapFilteredStores = stores.filter((s) => {
    if (mapFilter !== "all" && s.userId !== mapFilter) return false;
    if (mapRegionFilter !== "all" && s.region !== mapRegionFilter) return false;
    return true;
  });

  const tokoFilteredStores = stores
    .filter((s) => {
      if (storeUserFilter !== "all" && s.userId !== storeUserFilter) return false;
      if (storeRegionFilter !== "all" && s.region !== storeRegionFilter) return false;
      if (storeSearch) {
        const q = storeSearch.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.userName.toLowerCase().includes(q) || s.whatsapp.includes(q);
      }
      return true;
    })
    .sort((a, b) => b.recordedAt - a.recordedAt);

  const delimanStats = delimanUsers.map((user) => {
    const userStores = stores.filter((s) => s.userId === user.id);
    const lastActive = userStores.length > 0 ? Math.max(...userStores.map((s) => s.recordedAt)) : null;
    return { ...user, totalStores: userStores.length, lastActive };
  });

  const approvedStores = stores.filter((s) => s.status === "APPROVED");
  const pendingStores = stores.filter((s) => s.status === "PENDING");

  const regionStats = REGIONS.map((r) => ({
    name: r,
    count: approvedStores.filter((s) => s.region === r).length,
    color: REGION_COLORS[r],
  }));
  const maxRegionCount = Math.max(...regionStats.map((r) => r.count), 1);

  const recentStores = [...stores].sort((a, b) => b.recordedAt - a.recordedAt).slice(0, 8);
  const thisWeek = stores.filter((s) => s.recordedAt > Date.now() - 7 * 24 * 60 * 60 * 1000).length;
  const topRegion = regionStats.reduce((a, b) => (a.count >= b.count ? a : b), regionStats[0]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleDeleteStore = async (id: string, name: string) => {
    if (confirm(`Hapus toko "${name}"?`)) {
      await deleteStore(id);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (confirm(`Hapus akun "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      await deleteUser(id);
    }
  };

  const openEditDialog = (storeId: string) => {
    const store = stores.find((s) => s.id === storeId);
    if (!store) return;
    setEditData({
      name: store.name,
      region: store.region,
      whatsapp: store.whatsapp,
      imageData: store.imageData,
    });
    setEditingStoreId(storeId);
  };

  const handleEditImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Ukuran gambar maksimal 5MB"); return; }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX = 800;
      let w = img.width, h = img.height;
      if (w > MAX || h > MAX) {
        if (w > h) { h = (h / w) * MAX; w = MAX; } else { w = (w / h) * MAX; h = MAX; }
      }
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
      setEditData((d) => ({ ...d, imageData: canvas.toDataURL("image/jpeg", 0.7) }));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleSaveEdit = async () => {
    if (!editingStoreId || !editData.name.trim()) return;
    await updateStore(editingStoreId, {
      name: editData.name.trim(),
      region: editData.region,
      whatsapp: editData.whatsapp.trim(),
      imageData: editData.imageData,
    });
    setEditingStoreId(null);
  };

  const exportCSV = () => {
    const rows = tokoFilteredStores.map((e) =>
      [e.id, e.name, e.region, e.whatsapp, e.lat, e.lng, e.userName, new Date(e.recordedAt).toISOString()].join(",")
    );
    const csv = "ID,Nama Toko,Wilayah,WhatsApp,Lat,Lng,Deliman,Waktu\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data_toko_spi.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const viewingStore = viewingStoreId ? stores.find((s) => s.id === viewingStoreId) : null;

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Ukuran gambar maksimal 5MB"); return; }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX = 800;
      let w = img.width, h = img.height;
      if (w > MAX || h > MAX) {
        if (w > h) { h = (h / w) * MAX; w = MAX; } else { w = (w / h) * MAX; h = MAX; }
      }
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
      setAddData((d) => ({ ...d, imageData: canvas.toDataURL("image/jpeg", 0.7) }));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleResolveGmaps = async (urlToResolve?: string) => {
    const targetUrl = urlToResolve || gmapsUrl.trim();
    if (!targetUrl) return;
    setGmapsLoading(true);
    setGmapsError("");
    try {
      const res = await fetch("/api/stores/resolve-gmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGmapsError(data.error || "Gagal memproses URL");
        return;
      }
      setAddData((d) => ({
        ...d,
        name: data.name || d.name,
        lat: String(data.lat),
        lng: String(data.lng),
      }));
      setGmapsUrl("");
    } catch {
      setGmapsError("Gagal menghubungi server");
    } finally {
      setGmapsLoading(false);
    }
  };

  const handleGmapsPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text");
    if (
      pasted.includes("maps.app.goo.gl") ||
      pasted.includes("goo.gl/maps") ||
      pasted.includes("google.com/maps") ||
      pasted.includes("maps.google.com")
    ) {
      e.preventDefault();
      setGmapsUrl(pasted);
      setTimeout(() => handleResolveGmaps(pasted), 100);
    }
  };
  const handleAddStore = async () => {
    const lat = parseFloat(addData.lat);
    const lng = parseFloat(addData.lng);
    if (!addData.name.trim() || isNaN(lat) || isNaN(lng)) {
      alert("Nama toko dan koordinat (lat/lng) wajib diisi!");
      return;
    }
    await addStore({
      name: addData.name.trim(),
      region: addData.region,
      whatsapp: addData.whatsapp.trim(),
      imageData: addData.imageData,
      lat,
      lng,
      userId: session?.user?.id || "",
      userName: session?.user?.name || "Admin",
    });
    setAddData({ name: "", lat: "", lng: "", region: "", whatsapp: "", imageData: "" });
    setIsAddingStore(false);
    setAddSuccess("Toko berhasil ditambahkan!");
    setTimeout(() => setAddSuccess(""), 4000);
  };

  const tabs = [
    { id: "overview", label: "Ringkasan" },
    { id: "approval", label: "Persetujuan", badge: pendingStores.length },
    { id: "map", label: "Peta" },
    { id: "users", label: "Deliman" },
    { id: "stores", label: "Semua Toko" },
  ];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="h-full flex flex-col bg-[#fafafa] dark:bg-[#0c0e1a]">
      {/* ─── Top Bar ─────────────────────────────────────────────────── */}
      <div className="shrink-0 bg-white/90 dark:bg-[#151827]/90 backdrop-blur-xl border-b border-gray-100 dark:border-white/[0.06] px-5 md:px-8 pt-6 pb-0">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Dashboard</h1>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{stores.length} toko · {delimanUsers.length} deliman</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingStore(true)}
              className="h-8 px-3.5 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-indigo-600 dark:to-indigo-700 hover:from-gray-800 hover:to-gray-700 dark:hover:from-indigo-500 dark:hover:to-indigo-600 text-white text-[11px] font-semibold rounded-lg flex items-center gap-1.5 transition-all duration-300 shadow-sm shadow-gray-900/10 dark:shadow-indigo-900/20 active:scale-[0.97]"
            >
              <Plus size={13} strokeWidth={2.2} /> Tambah
            </button>
            <button
              onClick={exportCSV}
              className="h-8 px-3 text-[11px] font-medium rounded-lg flex items-center gap-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 border border-gray-200/60 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/[0.12] bg-white dark:bg-[#1c2035] hover:shadow-sm transition-all duration-200"
            >
              <Download size={13} /> Export
            </button>
          </div>
        </div>

        {/* Tab nav */}
        <div className="flex gap-0.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-1.5 px-3.5 pb-3 text-[12px] font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-gray-900 dark:text-gray-100"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
              {tab.badge && tab.badge > 0 ? (
                <span className="bg-red-500 text-white text-[8px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center animate-pulse">
                  {tab.badge}
                </span>
              ) : null}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gray-900 dark:bg-indigo-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-5 md:p-8">

        {/* ==================== TAB: RINGKASAN ==================== */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <StatCard value={approvedStores.length} label="Disetujui" icon={<CheckCircle2 size={15} />} accent="emerald" />
              <StatCard value={pendingStores.length} label="Menunggu" icon={<Hourglass size={15} />} accent="amber" />
              <StatCard value={delimanUsers.length} label="Deliman" icon={<Users size={15} />} accent="blue" />
              <StatCard value={thisWeek} label="Minggu Ini" icon={<TrendingUp size={15} />} accent="violet" />
              <StatCard value={topRegion?.name || "—"} label="Top Region" icon={<MapPin size={15} />} accent="gray" />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
              {/* Region chart */}
              <div className="lg:col-span-3 bg-white dark:bg-[#151827] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[13px] font-semibold text-gray-800 dark:text-gray-200">Distribusi Wilayah</h3>
                  <span className="text-[10px] text-gray-300 dark:text-gray-500 font-medium bg-gray-50 dark:bg-white/[0.04] px-2 py-0.5 rounded-md">{approvedStores.length} toko</span>
                </div>
                <div className="space-y-3">
                  {regionStats.map((r) => (
                    <div key={r.name} className="group flex items-center gap-3">
                      <div className="flex items-center gap-2 w-28 shrink-0">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: r.color }} />
                        <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate">{r.name}</span>
                      </div>
                      <div className="flex-1 bg-gray-50 dark:bg-white/[0.04] rounded-full h-5 overflow-hidden relative">
                        {r.count > 0 && (
                          <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{
                              width: `${Math.max((r.count / maxRegionCount) * 100, 15)}%`,
                              background: `linear-gradient(90deg, ${r.color}cc, ${r.color}99)`,
                              minWidth: '28px',
                            }}
                          />
                        )}
                      </div>
                      <span className={`text-[11px] font-semibold tabular-nums w-6 text-right ${r.count > 0 ? 'text-gray-600 dark:text-gray-300' : 'text-gray-200 dark:text-gray-600'}`}>{r.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent activity */}
              <div className="lg:col-span-2 bg-white dark:bg-[#151827] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-5">
                <h3 className="text-[13px] font-semibold text-gray-800 dark:text-gray-200 mb-4">Aktivitas Terbaru</h3>
                {recentStores.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-2">
                      <Activity size={16} className="text-gray-200" />
                    </div>
                    <p className="text-xs text-gray-300 font-medium">Belum ada aktivitas</p>
                  </div>
                ) : (
                  <div className="space-y-0.5 max-h-[300px] overflow-y-auto">
                    {recentStores.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setViewingStoreId(s.id)}
                        className="flex items-center gap-3 w-full text-left hover:bg-gray-50/60 dark:hover:bg-white/[0.03] rounded-xl p-2 transition-all duration-200 group"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white text-[10px] font-bold shadow-sm"
                          style={{ background: s.region ? REGION_COLORS[s.region as Region] || '#94a3b8' : '#94a3b8' }}
                        >
                          {s.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-semibold text-gray-700 dark:text-gray-200 truncate">{s.name}</p>
                          <p className="text-[10px] text-gray-300 dark:text-gray-500">{s.userName} · {timeAgo(s.recordedAt)}</p>
                        </div>
                        <ChevronRight size={12} className="text-gray-200 group-hover:text-gray-400 transition-colors shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: PERSETUJUAN ==================== */}
        {activeTab === "approval" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-semibold text-gray-800 dark:text-gray-200">Menunggu Persetujuan</h3>
              <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/[0.06] px-2 py-0.5 rounded-md">
                {pendingStores.length}
              </span>
            </div>

            {pendingStores.length === 0 ? (
              <div className="bg-white dark:bg-[#151827] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-16 text-center shadow-sm shadow-gray-100/30 dark:shadow-black/10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={20} className="text-emerald-400" />
                </div>
                <p className="font-medium text-gray-600 text-sm mb-1">Semua sudah diproses</p>
                <p className="text-xs text-gray-300">Tidak ada toko yang menunggu persetujuan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {pendingStores.map((store) => (
                  <div key={store.id} className="bg-white dark:bg-[#151827] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-black/20 transition-all duration-300">
                    <div className="flex">
                      {/* Image */}
                      <div className="w-28 shrink-0">
                        {store.imageData ? (
                          <img src={store.imageData} alt={store.name} className="w-full h-full object-cover min-h-[140px]" />
                        ) : (
                          <div className="w-full h-full bg-gray-50 flex items-center justify-center min-h-[140px]">
                            <Store size={24} className="text-gray-200" />
                          </div>
                        )}
                      </div>

                      {/* Detail */}
                      <div className="flex-1 p-4 flex flex-col">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="font-bold text-gray-800 dark:text-gray-200 text-[13px]">{store.name}</h4>
                            <p className="text-[10px] text-gray-300 dark:text-gray-500 mt-0.5">
                              {store.userName} · {timeAgo(store.recordedAt)}
                            </p>
                          </div>
                          <span className="bg-amber-50 text-amber-500 text-[8px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0">
                            Pending
                          </span>
                        </div>

                        <div className="space-y-1 mb-3 flex-1">
                          {store.region && (
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: REGION_COLORS[store.region as Region] }} />
                              <span className="text-[10px] font-medium text-gray-400">{store.region}</span>
                            </div>
                          )}
                          {store.whatsapp && (
                            <div className="flex items-center gap-1.5">
                              <Phone size={9} className="text-emerald-500 shrink-0" />
                              <span className="text-[10px] text-emerald-600 font-medium">{store.whatsapp}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <MapPin size={9} className="text-gray-300 shrink-0" />
                            <span className="text-[9px] font-mono text-gray-300">{store.lat.toFixed(4)}, {store.lng.toFixed(4)}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveStore(store.id)}
                            className="flex-1 h-7 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-indigo-600 dark:to-indigo-700 hover:from-gray-800 hover:to-gray-700 dark:hover:from-indigo-500 dark:hover:to-indigo-600 text-white text-[10px] font-semibold rounded-lg flex items-center justify-center gap-1 transition-all duration-200 shadow-sm shadow-gray-900/10 dark:shadow-indigo-900/20"
                          >
                            <CheckCircle2 size={11} /> Setujui
                          </button>
                          <button
                            onClick={() => { if (confirm(`Tolak toko "${store.name}"?`)) rejectStore(store.id); }}
                            className="flex-1 h-7 bg-white dark:bg-[#1c2035] border border-gray-100 dark:border-white/[0.06] text-gray-500 dark:text-gray-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-500/30 hover:bg-red-50/30 dark:hover:bg-red-500/5 text-[10px] font-semibold rounded-lg flex items-center justify-center gap-1 transition-all duration-200"
                          >
                            <XCircle size={11} /> Tolak
                          </button>
                          <button
                            onClick={() => setViewingStoreId(store.id)}
                            className="h-7 w-7 bg-white dark:bg-[#1c2035] border border-gray-100 dark:border-white/[0.06] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.04] rounded-lg flex items-center justify-center transition-all duration-200 shrink-0"
                          >
                            <Eye size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB: PETA ==================== */}
        {activeTab === "map" && (
          <div className="space-y-3 h-full flex flex-col">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white dark:bg-[#151827] border border-gray-200/60 dark:border-white/[0.06] rounded-lg px-2.5 py-1.5">
                <Users size={11} className="text-gray-300" />
                <select
                  className="text-[11px] bg-transparent outline-none text-gray-600 dark:text-gray-300 font-medium pr-4 cursor-pointer"
                  value={mapFilter}
                  onChange={(e) => setMapFilter(e.target.value)}
                >
                  <option value="all">Semua Deliman</option>
                  {delimanUsers.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1.5 bg-white dark:bg-[#151827] border border-gray-200/60 dark:border-white/[0.06] rounded-lg px-2.5 py-1.5">
                <MapPin size={11} className="text-gray-300" />
                <select
                  className="text-[11px] bg-transparent outline-none text-gray-600 dark:text-gray-300 font-medium pr-4 cursor-pointer"
                  value={mapRegionFilter}
                  onChange={(e) => setMapRegionFilter(e.target.value)}
                >
                  <option value="all">Semua Wilayah</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`text-[11px] font-medium px-3 py-1.5 rounded-lg border transition-all ${
                  showHeatmap
                    ? 'bg-gray-900 dark:bg-indigo-600 text-white border-gray-900 dark:border-indigo-600'
                    : 'bg-white dark:bg-[#151827] text-gray-500 dark:text-gray-400 border-gray-200/60 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/[0.12]'
                }`}
              >
                {showHeatmap ? "Heatmap" : "Marker"}
              </button>
            </div>

            <div className="flex-1 bg-white dark:bg-[#151827] rounded-2xl border border-gray-200/60 dark:border-white/[0.06] overflow-hidden" style={{ minHeight: "450px" }}>
              <MapComponent
                stores={mapFilteredStores}
                showHeatmap={showHeatmap}
                onDeleteStore={deleteStore}
                interactiveOptions={false}
                showLocateButton={true}
              />
            </div>
          </div>
        )}

        {/* ==================== TAB: DELIMAN ==================== */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-semibold text-gray-800 dark:text-gray-200">Daftar Deliman</h3>
              <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/[0.06] px-2 py-0.5 rounded-md">{delimanUsers.length}</span>
            </div>

            <div className="bg-white dark:bg-[#151827] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden shadow-sm shadow-gray-100/30 dark:shadow-black/10">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/40 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.06]">
                    <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Nama</TableHead>
                    <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Email</TableHead>
                    <TableHead className="text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Toko</TableHead>
                    <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Terakhir Aktif</TableHead>
                    <TableHead className="text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {delimanStats.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50/40 dark:hover:bg-white/[0.02] border-b border-gray-100/60 dark:border-white/[0.04] group">
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gray-900 text-white flex items-center justify-center font-semibold text-[9px]">
                            {user.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-700 dark:text-gray-200 text-[13px]">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-400 dark:text-gray-500 text-xs">{user.email}</TableCell>
                      <TableCell className="text-center">
                        <span className="bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                          {user.totalStores}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-400 text-[11px]">
                        {user.lastActive ? timeAgo(user.lastActive) : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          title="Hapus user"
                          className="p-1.5 text-gray-300 dark:text-gray-500 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-500/10 rounded-lg transition-all duration-200"
                        >
                          <Trash2 size={13} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {delimanStats.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-gray-300 text-sm">
                        Belum ada deliman terdaftar.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* ==================== TAB: SEMUA TOKO ==================== */}
        {activeTab === "stores" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="relative flex-1 max-w-md">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="text"
                  placeholder="Cari toko, deliman, atau nomor..."
                  value={storeSearch}
                  onChange={(e) => setStoreSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200/60 dark:border-white/[0.06] rounded-lg focus:ring-2 focus:ring-gray-900/8 dark:focus:ring-indigo-500/20 focus:border-gray-300 dark:focus:border-indigo-500/30 outline-none bg-white dark:bg-[#151827] dark:text-gray-200 dark:placeholder-gray-600 transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-white border border-gray-200/60 rounded-lg px-2.5 py-1.5">
                  <MapPin size={10} className="text-gray-300" />
                  <select
                    className="text-[11px] bg-transparent outline-none text-gray-600 font-medium pr-3 cursor-pointer"
                    value={storeRegionFilter}
                    onChange={(e) => setStoreRegionFilter(e.target.value)}
                  >
                    <option value="all">Semua Wilayah</option>
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-gray-200/60 rounded-lg px-2.5 py-1.5">
                  <Users size={10} className="text-gray-300" />
                  <select
                    className="text-[11px] bg-transparent outline-none text-gray-600 font-medium pr-3 cursor-pointer"
                    value={storeUserFilter}
                    onChange={(e) => setStoreUserFilter(e.target.value)}
                  >
                    <option value="all">Semua Deliman</option>
                    {delimanUsers.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <span className="text-[10px] text-gray-300 font-medium">{tokoFilteredStores.length}</span>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#151827] rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden shadow-sm shadow-gray-100/30 dark:shadow-black/10">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/40 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/[0.06]">
                      <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Toko</TableHead>
                      <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</TableHead>
                      <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Wilayah</TableHead>
                      <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">WhatsApp</TableHead>
                      <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Deliman</TableHead>
                      <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Waktu</TableHead>
                      <TableHead className="text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tokoFilteredStores.map((store) => (
                      <TableRow key={store.id} className="hover:bg-gray-50/40 dark:hover:bg-white/[0.02] group border-b border-gray-100/60 dark:border-white/[0.04]">
                        <TableCell>
                          <button
                            onClick={() => setViewingStoreId(store.id)}
                            className="flex items-center gap-2.5 text-left hover:opacity-80 transition-opacity"
                          >
                            {store.imageData ? (
                              <img src={store.imageData} alt="" className="w-7 h-7 rounded-lg object-cover shrink-0" />
                            ) : (
                              <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                <Store size={12} className="text-gray-200" />
                              </div>
                            )}
                            <span className="font-medium text-gray-700 dark:text-gray-200 text-[12px]">{store.name}</span>
                          </button>
                        </TableCell>
                        <TableCell>
                          <AdminStatusBadge status={store.status} />
                        </TableCell>
                        <TableCell>
                          {store.region ? (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-gray-400">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: REGION_COLORS[store.region as Region] }} />
                              {store.region}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-200">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {store.whatsapp ? (
                            <a href={`https://wa.me/${store.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                              className="text-[11px] text-emerald-600 hover:underline flex items-center gap-1"
                            >
                              <Phone size={9} /> {store.whatsapp}
                            </a>
                          ) : (
                            <span className="text-xs text-gray-200">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-gray-400 dark:text-gray-500">{store.userName}</TableCell>
                        <TableCell className="text-[11px] text-gray-300 dark:text-gray-500">{timeAgo(store.recordedAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-0.5">
                            <button onClick={() => setViewingStoreId(store.id)} className="p-1.5 text-gray-300 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.04] rounded-lg transition-colors" title="Detail">
                              <Eye size={13} />
                            </button>
                            <button onClick={() => openEditDialog(store.id)} className="p-1.5 text-gray-300 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.04] rounded-lg transition-colors" title="Edit">
                              <Pencil size={13} />
                            </button>
                            <a href={`https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`} target="_blank" rel="noopener noreferrer"
                              className="p-1.5 text-gray-300 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.04] rounded-lg transition-colors" title="Maps"
                            >
                              <ExternalLink size={13} />
                            </a>
                            <button onClick={() => handleDeleteStore(store.id, store.name)} className="p-1.5 text-gray-300 dark:text-gray-500 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Hapus">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {tokoFilteredStores.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-gray-300 text-sm">
                          {storeSearch ? "Tidak ada toko yang cocok." : "Belum ada toko terdaftar."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== DIALOG: EDIT STORE ==================== */}
      <Dialog open={!!editingStoreId} onOpenChange={(open) => { if (!open) setEditingStoreId(null); }}>
        <DialogContent className="sm:max-w-[440px] p-0 gap-0 max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-3">
            <DialogTitle className="text-[15px] font-semibold text-gray-900">Edit Detail Toko</DialogTitle>
            <DialogDescription className="text-xs text-gray-400">Perbarui informasi toko</DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6 space-y-5">
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Nama Toko <span className="text-red-400">*</span></Label>
              <Input value={editData.name} onChange={(e) => setEditData((d) => ({ ...d, name: e.target.value }))} className="h-10 bg-gray-50/50 border-gray-200/60 rounded-xl text-[13px]" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Wilayah</Label>
              <div className="flex flex-wrap gap-1.5">
                {REGIONS.map((r) => (
                  <button key={r} type="button" onClick={() => setEditData((d) => ({ ...d, region: d.region === r ? "" : r }))}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${editData.region === r ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200/60 hover:border-gray-300"}`}
                  >{r}</button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">WhatsApp</Label>
              <Input type="tel" value={editData.whatsapp} onChange={(e) => setEditData((d) => ({ ...d, whatsapp: e.target.value }))} placeholder="08123456789" className="h-10 bg-gray-50/50 border-gray-200/60 rounded-xl text-[13px]" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Foto</Label>
              <input ref={editFileRef} type="file" accept="image/*" onChange={handleEditImage} className="hidden" />
              {editData.imageData ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200/60 bg-gray-50">
                  <img src={editData.imageData} alt="Preview" className="w-full h-32 object-cover" />
                  <button type="button" onClick={() => setEditData((d) => ({ ...d, imageData: "" }))} className="absolute top-2 right-2 bg-black/40 text-white p-1 rounded-lg hover:bg-black/60"><X size={12} /></button>
                  <button type="button" onClick={() => editFileRef.current?.click()} className="absolute bottom-2 right-2 bg-white/90 text-gray-700 px-2.5 py-1 rounded-lg text-[10px] font-medium hover:bg-white shadow-sm">Ganti</button>
                </div>
              ) : (
                <button type="button" onClick={() => editFileRef.current?.click()} className="w-full h-20 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center gap-1 text-gray-300 hover:border-gray-300 hover:text-gray-400 transition-all cursor-pointer">
                  <ImagePlus size={18} /><span className="text-[10px] font-medium">Tambah foto</span>
                </button>
              )}
            </div>
            <div className="flex gap-2.5 pt-2">
              <Button variant="outline" className="flex-1 h-10 rounded-xl text-[13px] border-gray-200/60" onClick={() => setEditingStoreId(null)}>Batal</Button>
              <Button className="flex-1 h-10 bg-gray-900 text-white hover:bg-gray-800 font-semibold rounded-xl text-[13px]" onClick={handleSaveEdit} disabled={!editData.name.trim()}>Simpan</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ==================== DIALOG: VIEW STORE ==================== */}
      <Dialog open={!!viewingStoreId} onOpenChange={(open) => { if (!open) setViewingStoreId(null); }}>
        <DialogContent className="sm:max-w-[440px] p-0 gap-0 max-h-[90vh] overflow-y-auto rounded-2xl">
          {viewingStore && (
            <>
              {viewingStore.imageData && (
                <div className="relative">
                  <img src={viewingStore.imageData} alt={viewingStore.name} className="w-full h-44 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              )}
              <div className="p-5 space-y-4">
                <div>
                  <DialogHeader className="p-0">
                    <DialogTitle className="text-[15px] font-semibold text-gray-900">{viewingStore.name}</DialogTitle>
                    <DialogDescription className="sr-only">Detail toko</DialogDescription>
                  </DialogHeader>
                  {viewingStore.region && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-gray-400 mt-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: REGION_COLORS[viewingStore.region as Region] }} />
                      {viewingStore.region}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {viewingStore.whatsapp && (
                    <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/60">
                      <Phone size={14} className="text-emerald-600 shrink-0" />
                      <a href={`https://wa.me/${viewingStore.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-[13px] font-medium text-emerald-700 hover:underline">{viewingStore.whatsapp}</a>
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100/60">
                    <Navigation size={14} className="text-gray-400 shrink-0" />
                    <span className="text-[13px] font-mono text-gray-500">{viewingStore.lat.toFixed(6)}, {viewingStore.lng.toFixed(6)}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100/60">
                    <Users size={14} className="text-gray-400 shrink-0" />
                    <div>
                      <p className="text-[13px] font-medium text-gray-600">{viewingStore.userName}</p>
                      <p className="text-[10px] text-gray-300">{new Date(viewingStore.recordedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" className="flex-1 gap-1.5 rounded-xl text-[13px] h-10 border-gray-200/60" onClick={() => { setViewingStoreId(null); setTimeout(() => openEditDialog(viewingStore.id), 150); }}>
                    <Pencil size={13} /> Edit
                  </Button>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${viewingStore.lat},${viewingStore.lng}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white gap-1.5 rounded-xl text-[13px] h-10"><Navigation size={13} /> Navigasi</Button>
                  </a>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ==================== DIALOG: ADD STORE ==================== */}
      <Dialog open={isAddingStore} onOpenChange={(open) => { if (!open) { setIsAddingStore(false); setGmapsUrl(""); setGmapsError(""); setAddData({ name: "", lat: "", lng: "", region: "", whatsapp: "", imageData: "" }); } }}>
        <DialogContent className="sm:max-w-[440px] p-0 gap-0 max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-3">
            <DialogTitle className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">Tambah Toko</DialogTitle>
            <DialogDescription className="text-xs text-gray-400">Paste link Google Maps atau isi manual</DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6 space-y-5">
            {/* Google Maps Link Input */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={11} className="text-blue-500" />
                Link Google Maps
              </Label>
              <p className="text-[10px] text-gray-300 dark:text-gray-500">
                Paste link dari Google Maps untuk auto-fill nama dan koordinat
              </p>
              <div className="flex gap-2">
                <Input
                  value={gmapsUrl}
                  onChange={(e) => { setGmapsUrl(e.target.value); setGmapsError(""); }}
                  onPaste={handleGmapsPaste}
                  placeholder="https://maps.app.goo.gl/..."
                  className="h-9 bg-gray-50/50 dark:bg-white/[0.04] border-gray-200/60 dark:border-white/[0.06] rounded-xl text-[12px] flex-1"
                />
                <Button
                  type="button"
                  onClick={() => handleResolveGmaps()}
                  disabled={!gmapsUrl.trim() || gmapsLoading}
                  className="h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-xl shrink-0 disabled:opacity-50"
                >
                {gmapsLoading ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Proses
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> Extract
                    </span>
                  )}
                </Button>
              </div>
              {gmapsError && (
                <p className="text-[10px] text-red-500 font-medium flex items-center gap-1">
                  <XCircle size={10} /> {gmapsError}
                </p>
              )}
              {gmapsLoading && (
                <div className="flex items-center gap-2 text-[10px] text-blue-500 font-medium">
                  <span className="w-3 h-3 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
                  Mengambil data dari Google Maps..
                </div>
              )}
            </div>
            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100 dark:bg-white/[0.06]" />
              <span className="text-[9px] text-gray-300 dark:text-gray-500 font-medium uppercase tracking-wider">atau isi manual</span>
              <div className="flex-1 h-px bg-gray-100 dark:bg-white/[0.06]" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Nama Toko <span className="text-red-400">*</span></Label>
              <Input value={addData.name} onChange={(e) => setAddData((d) => ({ ...d, name: e.target.value }))} placeholder="Cth: Toko Berkah Jaya" className="h-10 bg-gray-50/50 dark:bg-white/[0.04] border-gray-200/60 dark:border-white/[0.06] rounded-xl text-[13px]" autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Koordinat GPS <span className="text-red-400">*</span></Label>
              <p className="text-[10px] text-gray-300">Gunakan tanda minus (-) untuk latitude selatan</p>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[9px] text-gray-300 font-medium uppercase tracking-wider mb-1 block">Latitude</label>
                  <Input value={addData.lat} onChange={(e) => setAddData((d) => ({ ...d, lat: e.target.value }))} placeholder="-3.3605" className="h-9 bg-gray-50/50 border-gray-200/60 font-mono text-xs rounded-xl" />
                </div>
                <div>
                  <label className="text-[9px] text-gray-300 font-medium uppercase tracking-wider mb-1 block">Longitude</label>
                  <Input value={addData.lng} onChange={(e) => setAddData((d) => ({ ...d, lng: e.target.value }))} placeholder="114.8226" className="h-9 bg-gray-50/50 border-gray-200/60 font-mono text-xs rounded-xl" />
                </div>
              </div>
              {addData.lat && addData.lng && !isNaN(parseFloat(addData.lat)) && !isNaN(parseFloat(addData.lng)) && (
                <a href={`https://www.google.com/maps/search/?api=1&query=${addData.lat},${addData.lng}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-1 mt-1 underline underline-offset-2">
                  <ExternalLink size={10} /> Verifikasi di Maps
                </a>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Wilayah</Label>
              <div className="flex flex-wrap gap-1.5">
                {REGIONS.map((r) => (
                  <button key={r} type="button" onClick={() => setAddData((d) => ({ ...d, region: d.region === r ? "" : r }))}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${addData.region === r ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200/60 hover:border-gray-300"}`}
                  >{r}</button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">WhatsApp <span className="text-gray-300 normal-case">(opsional)</span></Label>
              <Input type="tel" value={addData.whatsapp} onChange={(e) => setAddData((d) => ({ ...d, whatsapp: e.target.value }))} placeholder="08123456789" className="h-10 bg-gray-50/50 border-gray-200/60 rounded-xl text-[13px]" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Foto <span className="text-gray-300 normal-case">(opsional)</span></Label>
              <input ref={addFileRef} type="file" accept="image/*" onChange={handleAddImage} className="hidden" />
              {addData.imageData ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200/60 bg-gray-50">
                  <img src={addData.imageData} alt="Preview" className="w-full h-32 object-cover" />
                  <button type="button" onClick={() => setAddData((d) => ({ ...d, imageData: "" }))} className="absolute top-2 right-2 bg-black/40 text-white p-1 rounded-lg hover:bg-black/60"><X size={12} /></button>
                  <button type="button" onClick={() => addFileRef.current?.click()} className="absolute bottom-2 right-2 bg-white/90 text-gray-700 px-2.5 py-1 rounded-lg text-[10px] font-medium hover:bg-white shadow-sm">Ganti</button>
                </div>
              ) : (
                <button type="button" onClick={() => addFileRef.current?.click()} className="w-full h-20 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center gap-1 text-gray-300 hover:border-gray-300 hover:text-gray-400 transition-all cursor-pointer">
                  <ImagePlus size={18} /><span className="text-[10px] font-medium">Tambah foto</span>
                </button>
              )}
            </div>
            {addData.lat && addData.lng && !isNaN(parseFloat(addData.lat)) && !isNaN(parseFloat(addData.lng)) && (
              <div className="bg-gray-50/50 rounded-xl p-3 flex items-center gap-3 border border-gray-100/60">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
                  <Navigation size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-gray-500">Koordinat Toko</p>
                  <p className="text-xs text-gray-400 font-mono">{parseFloat(addData.lat).toFixed(6)}, {parseFloat(addData.lng).toFixed(6)}</p>
                </div>
              </div>
            )}
            <div className="flex gap-2.5 pt-2">
              <Button variant="outline" className="flex-1 h-10 rounded-xl text-[13px] border-gray-200/60" onClick={() => { setIsAddingStore(false); setGmapsUrl(""); setGmapsError(""); setAddData({ name: "", lat: "", lng: "", region: "", whatsapp: "", imageData: "" }); }}>Batal</Button>
              <Button className="flex-1 h-10 bg-gray-900 text-white hover:bg-gray-800 font-semibold rounded-xl text-[13px]" onClick={handleAddStore} disabled={!addData.name.trim() || !addData.lat || !addData.lng}>
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success toast */}
      {addSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-[13px] font-medium">
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
            <span>{addSuccess}</span>
            <button onClick={() => setAddSuccess("")} className="ml-1 text-white/40 hover:text-white transition-colors"><X size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------
function StatCard({ value, label, icon, accent = 'gray' }: { value: string | number; label: string; icon?: React.ReactNode; accent?: string }) {
  const accentMap: Record<string, string> = {
    emerald: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10',
    amber: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10',
    blue: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10',
    violet: 'text-violet-500 bg-violet-50 dark:bg-violet-500/10',
    gray: 'text-gray-500 bg-gray-50 dark:bg-white/[0.04]',
  };
  const accentClass = accentMap[accent] || accentMap.gray;

  return (
    <div className="bg-white dark:bg-[#151827] rounded-2xl border border-gray-100 dark:border-white/[0.06] p-4 hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-2.5">
        {icon && (
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${accentClass} transition-transform duration-300 group-hover:scale-110`}>
            {icon}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-none">{value}</p>
      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 font-medium uppercase tracking-wider">{label}</p>
    </div>
  );
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Baru saja";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(ts).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function AdminStatusBadge({ status }: { status: StoreStatus }) {
  const config: Record<StoreStatus, { label: string; className: string }> = {
    PENDING: { label: "Pending", className: "bg-amber-50 dark:bg-amber-500/10 text-amber-500" },
    APPROVED: { label: "Approved", className: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500" },
    REJECTED: { label: "Rejected", className: "bg-red-50 dark:bg-red-500/10 text-red-400" },
  };
  const c = config[status] || config.PENDING;
  return (
    <span className={`inline-flex items-center text-[8px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${c.className}`}>
      {c.label}
    </span>
  );
}
