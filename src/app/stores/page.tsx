"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useAppStore, REGIONS, REGION_COLORS, type Region, type StoreStatus } from "@/store/useAppStore";
import { useSession } from "@/lib/auth-client";
import {
  MapPin, Phone, Search, Share2, Pencil, Trash2,
  Navigation as NavIcon, ImageIcon, X, ArrowUpDown,
  Store, ImagePlus, Loader2, CheckCircle2,
  Globe2, CheckCircle, Clock,
  MessageCircle
} from "lucide-react";

type SortMode = "terbaru" | "nama";
type FilterRegion = "Semua" | Region;

function timeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months} bulan lalu`;
  if (weeks > 0) return `${weeks} minggu lalu`;
  if (days > 0) return `${days} hari lalu`;
  if (hours > 0) return `${hours} jam lalu`;
  if (minutes > 0) return `${minutes} menit lalu`;
  return "Baru saja";
}

interface EditStoreData {
  name: string;
  region: Region | "";
  whatsapp: string;
  imageData: string;
}

export default function StoresPage() {
  const { data: session, isPending } = useSession();
  const currentUser = session?.user;
  const isAdmin = (currentUser as any)?.role === "ADMIN";

  const stores = useAppStore(state => state.stores);
  const fetchStores = useAppStore(state => state.fetchStores);
  const deleteStore = useAppStore(state => state.deleteStore);
  const updateStore = useAppStore(state => state.updateStore);
  const isLoading = useAppStore(state => state.isLoading);

  useEffect(() => {
    if (!isPending && session?.user) {
      fetchStores();
    }
  }, [fetchStores, isPending, session]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState<FilterRegion>("Semua");
  const [sortMode, setSortMode] = useState<SortMode>("terbaru");
  const [imagePreview, setImagePreview] = useState<{ url: string; name: string } | null>(null);

  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [editData, setEditData] = useState<EditStoreData>({ name: "", region: "", whatsapp: "", imageData: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const editFileRef = useRef<HTMLInputElement>(null);

  const visibleStores = stores.filter(
    store => store.status === "APPROVED" || store.userId === currentUser?.id
  );

  const stats = useMemo(() => ({
    total: visibleStores.length,
    regions: new Set(visibleStores.map(s => s.region).filter(Boolean)).size,
    approved: visibleStores.filter(s => s.status === "APPROVED").length,
    pending: visibleStores.filter(s => s.status === "PENDING").length,
  }), [visibleStores]);

  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = { Semua: visibleStores.length };
    REGIONS.forEach(r => { counts[r] = visibleStores.filter(s => s.region === r).length; });
    return counts;
  }, [visibleStores]);

  const filteredStores = useMemo(() => {
    let result = [...visibleStores];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        (s.region && s.region.toLowerCase().includes(q)) ||
        (s.whatsapp && s.whatsapp.includes(q))
      );
    }
    if (activeRegion !== "Semua") {
      result = result.filter(s => s.region === activeRegion);
    }
    if (sortMode === "terbaru") {
      result.sort((a, b) => b.recordedAt - a.recordedAt);
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [visibleStores, searchQuery, activeRegion, sortMode]);

  const handleShare = async (store: typeof filteredStores[0]) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`;
    const text = `📍 ${store.name}${store.region ? ` (${store.region})` : ''}\n${url}`;
    try {
      let files: File[] = [];
      if (store.imageData && store.imageData.startsWith('data:')) {
        const res = await fetch(store.imageData);
        const blob = await res.blob();
        const file = new File([blob], `${store.name.replace(/\s+/g, '_')}.jpg`, { type: 'image/jpeg' });
        files = [file];
      }
      if (navigator.share) {
        const shareData: ShareData = { title: store.name, text, url };
        if (files.length > 0 && navigator.canShare && navigator.canShare({ files })) {
          shareData.files = files;
        }
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(text);
        alert('Link lokasi berhasil disalin!');
      }
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        navigator.clipboard.writeText(text).then(() => alert('Link lokasi berhasil disalin!')).catch(() => {});
      }
    }
  };

  const openEdit = (store: typeof filteredStores[0]) => {
    setEditData({ name: store.name, region: store.region, whatsapp: store.whatsapp, imageData: store.imageData });
    setEditingStoreId(store.id);
    setSaveSuccess(false);
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
      setEditData(d => ({ ...d, imageData: canvas.toDataURL("image/jpeg", 0.7) }));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleSaveEdit = async () => {
    if (!editingStoreId || !editData.name.trim()) return;
    setIsSaving(true);
    try {
      await updateStore(editingStoreId, {
        name: editData.name.trim(),
        region: editData.region,
        whatsapp: editData.whatsapp.trim(),
        imageData: editData.imageData,
      });
      setSaveSuccess(true);
      setTimeout(() => { setEditingStoreId(null); setSaveSuccess(false); }, 800);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Hapus toko "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      await deleteStore(id);
    }
  };

  const allRegions: FilterRegion[] = ["Semua", ...REGIONS];

  // Scroll hide/show header
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const [headerVisible, setHeaderVisible] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const currentY = el.scrollTop;
      if (currentY <= 10) {
        setHeaderVisible(true);
      } else {
        setHeaderVisible(false);
      }
      lastScrollY.current = currentY;
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto">
      {/* ── Header Section ── */}
      {/* ── Collapsible Header (judul + stat cards) ── */}
      <div className={`overflow-hidden transition-all duration-500 ease-out ${headerVisible ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-5 md:px-8 pt-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Daftar Toko</h1>
              <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-0.5">Kelola semua toko yang terdaftar</p>
            </div>
            <button
              onClick={() => setSortMode(sortMode === "terbaru" ? "nama" : "terbaru")}
              className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-white/[0.06] border-gray-200/60 dark:border-white/[0.08] rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-all"
            >
              <ArrowUpDown size={12} />
              {sortMode === "terbaru" ? "Terbaru" : "A–Z"}
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <StatCard icon={<Store size={15} />} label="Toko Member" value={stats.total} color="blue" />
            <StatCard icon={<MapPin size={15} />} label="Wilayah" value={stats.regions} color="purple" />
            <StatCard icon={<CheckCircle size={15} />} label="Approved" value={stats.approved} color="green" />
            <StatCard icon={<Clock size={15} />} label="Pending" value={stats.pending} color="amber" />
          </div>
        </div>
      </div>

      {/* ── Sticky Search + Filter ── */}
      <div className="sticky top-0 z-10 bg-[#fafafa] dark:bg-[#0c0e1a] pb-3 pt-3">
        <div className="px-5 md:px-8">
          <div className="relative mb-3">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Cari nama toko, wilayah, atau nomor..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white dark:bg-[#151827] border border-gray-200/60 dark:border-white/[0.08] rounded-2xl text-[13px] text-gray-700 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-indigo-500/30 focus:border-blue-300 dark:focus:border-indigo-500/40 shadow-sm shadow-gray-100/50 dark:shadow-black/10 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors">
                <X size={10} />
              </button>
            )}
          </div>

          {/* ── Region Filter Chips ── */}
          <div className="-mx-5 px-5 md:-mx-8 md:px-8">
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {allRegions.map(region => {
                const isActive = activeRegion === region;
                const count = regionCounts[region] || 0;
                const regionColor = region !== "Semua" ? REGION_COLORS[region as Region] : undefined;
                return (
                  <button
                    key={region}
                    onClick={() => setActiveRegion(region)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-semibold transition-all duration-300 whitespace-nowrap shrink-0 ${
                      isActive
                        ? "text-white shadow-lg"
                        : "bg-white dark:bg-white/[0.06] text-gray-500 dark:text-gray-400 border border-gray-200/60 dark:border-white/[0.08] hover:border-gray-300 dark:hover:border-white/[0.15] hover:shadow-sm"
                    }`}
                style={isActive ? {
                      background: regionColor || '#1f2937',
                      boxShadow: `0 4px 14px ${regionColor || '#1f2937'}40`,
                    } : undefined}
                  >
                    {region !== "Semua" && !isActive && (
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: regionColor }} />
                    )}
                    {region}
                    <span className={`${isActive ? "text-white/60" : "text-gray-300 dark:text-gray-600"}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-5 md:px-8 pb-24">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
            {filteredStores.length} toko ditemukan
          </span>
        </div>

        {/* Loading Skeleton */}
        {isLoading && visibleStores.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white dark:bg-[#151827] border border-gray-100 dark:border-white/[0.06] overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-100 dark:bg-white/[0.04]" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-100 dark:bg-white/[0.06] rounded-lg w-3/4" />
                  <div className="h-3 bg-gray-100 dark:bg-white/[0.04] rounded-lg w-1/2" />
                <div className="h-3 bg-gray-100 dark:bg-white/[0.04] rounded-lg w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredStores.length === 0 ? (
          /* ── Empty State ── */
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-white/[0.06] dark:to-white/[0.02] flex items-center justify-center mx-auto mb-5 shadow-inner">
              <MapPin size={32} className="text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="font-bold text-gray-700 dark:text-gray-300 text-base mb-1.5">
              {visibleStores.length === 0 ? "Belum ada toko" : "Tidak ditemukan"}
            </h3>
            <p className="text-[13px] text-gray-400 dark:text-gray-500 max-w-[260px] mx-auto leading-relaxed">
              {visibleStores.length === 0
                ? "Tambahkan toko pertamu dari halaman Peta dengan menekan tombol Tandai Toko"
                : "Coba ubah filter wilayah atau kata kunci pencarian"}
            </p>
          </div>
        ) : (
          /* ── Store Cards Grid ── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStores.map(store => (
              <StoreCard
                key={store.id}
                store={store}
                isOwner={isAdmin || store.userId === currentUser?.id}
                onShare={() => handleShare(store)}
                onViewImage={() => setImagePreview({ url: store.imageData || "", name: store.name })}
                onEdit={() => openEdit(store)}
                onDelete={() => handleDelete(store.id, store.name)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Image Preview Modal ── */}
      {imagePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => setImagePreview(null)}>
          <div className="relative max-w-xl w-full bg-white dark:bg-[#1a1c2e] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border-gray-100 dark:border-white/[0.08]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-white/[0.06]">
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{imagePreview.name}</span>
              <button onClick={() => setImagePreview(null)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.08] text-gray-400 dark:text-gray-500 transition-colors">
                <X size={16} />
              </button>
            </div>
            {imagePreview.url ? (
              <img src={imagePreview.url} alt={imagePreview.name} className="w-full max-h-[70vh] object-contain bg-gray-50 dark:bg-[#0c0e1a]" />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-[#0c0e1a]">
                <ImageIcon size={32} className="text-gray-200 dark:text-gray-700 mb-3" />
                <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">Tidak ada gambar</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Edit Store Modal ── */}
      {editingStoreId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4" onClick={() => { if (!isSaving) setEditingStoreId(null); }}>
          <div className="relative w-full max-w-[440px] bg-white dark:bg-[#1a1c2e] rounded-2xl shadow-2xl border-gray-100 dark:border-white/[0.08] overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100 dark:border-white/[0.06]">
              <div>
                <h3 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">Edit Toko</h3>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Perbarui informasi toko</p>
              </div>
              <button onClick={() => setEditingStoreId(null)} disabled={isSaving} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.08] text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Nama Toko <span className="text-red-400">*</span></label>
                <input type="text" value={editData.name} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))} className="w-full h-11 px-4 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-[13px] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40 transition-all" placeholder="Nama toko" autoFocus />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Wilayah</label>
                <div className="flex flex-wrap gap-1.5">
                  {REGIONS.map(r => (
                    <button key={r} type="button" onClick={() => setEditData(d => ({ ...d, region: d.region === r ? "" : r }))}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${editData.region === r ? "text-white border-transparent" : "bg-white dark:bg-[#151827] text-gray-500 dark:text-gray-400 border-gray-200/60 dark:border-white/[0.06] hover:border-gray-300"}`}
                      style={editData.region === r ? { background: REGION_COLORS[r], boxShadow: `0 2px 8px ${REGION_COLORS[r]}40` } : undefined}
                    >{r}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">WhatsApp</label>
                <input type="tel" value={editData.whatsapp} onChange={e => setEditData(d => ({ ...d, whatsapp: e.target.value }))} placeholder="08123456789" className="w-full h-11 px-4 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-[13px] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Foto</label>
                <input ref={editFileRef} type="file" accept="image/*" onChange={handleEditImage} className="hidden" />
                {editData.imageData ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200/60 dark:border-white/[0.06]">
                <img src={editData.imageData} alt="Preview" className="w-full h-36 object-cover" />
                <button type="button" onClick={() => setEditData(d => ({ ...d, imageData: "" }))} className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-lg hover:bg-black/70 transition-colors"><X size={12} /></button>
                    <button type="button" onClick={() => editFileRef.current?.click()} className="absolute bottom-2 right-2 bg-white/90 dark:bg-black/50 text-gray-700 dark:text-white px-3 py-1 rounded-lg text-[10px] font-semibold hover:bg-white dark:hover:bg-black/70 shadow-sm transition-colors">Ganti</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => editFileRef.current?.click()} className="w-full h-24 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.02] flex-col items-center justify-center gap-1.5 text-gray-300 dark:text-gray-600 hover:border-gray-300 dark:hover:border-white/[0.15] hover:text-gray-400 dark:hover:text-gray-500 transition-all cursor-pointer">
                    <ImagePlus size={20} />
                <span className="text-[11px] font-medium">Tambah foto</span>
                  </button>
                )}
              </div>
            </div>

            <div className="px-6 pb-5 flex gap-2.5 border-t border-gray-100 dark:border-white/[0.06] pt-4">
              <button onClick={() => setEditingStoreId(null)} disabled={isSaving} className="flex-1 h-11 rounded-xl border-gray-200 dark:border-white/[0.08] text-gray-500 dark:text-gray-400 text-[13px] font-semibold hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors disabled:opacity-50">Batal</button>
              <button onClick={handleSaveEdit} disabled={isSaving || !editData.name.trim()} className="flex-1 h-11 bg-gray-900 dark:bg-indigo-600 hover:bg-gray-800 dark:hover:bg-indigo-500 text-white text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-gray-900/10 dark:shadow-indigo-900/20">
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : saveSuccess ? <><CheckCircle2 size={14} /> Tersimpan!</> : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Stat Card ────────────────────────────

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: "blue" | "purple" | "green" | "amber" }) {
  const colors = {
    blue: "from-blue-500/10 to-blue-500/5 dark:from-blue-500/15 dark:to-blue-500/5 text-blue-600 dark:text-blue-400",
    purple: "from-purple-500/10 to-purple-500/5 dark:from-purple-500/15 dark:to-purple-500/5 text-purple-600 dark:text-purple-400",
    green: "from-emerald-500/10 to-emerald-500/5 dark:from-emerald-500/15 dark:to-emerald-500/5 text-emerald-600 dark:text-emerald-400",
    amber: "from-amber-500/10 to-amber-500/5 dark:from-amber-500/15 dark:to-amber-500/5 text-amber-600 dark:text-amber-400",
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl p-3 border-white/60 dark:border-white/[0.06]`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
      </div>
      <p className="text-lg font-bold leading-none">{value}</p>
      <p className="text-[9px] font-medium opacity-60 uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}

// ── Store Card ────────────────────────────

function StoreCard({
  store, isOwner, onShare, onViewImage, onEdit, onDelete,
}: {
  store: { id: string; name: string; region: Region | ""; whatsapp: string; imageData: string; lat: number; lng: number; recordedAt: number; status: StoreStatus; };
  isOwner: boolean;
  onShare: () => void;
  onViewImage: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const regionColor = store.region ? REGION_COLORS[store.region as Region] : '#9ca3af';

  return (
    <div className="group rounded-2xl bg-white dark:bg-[#151827] border-gray-100 dark:border-white/[0.06] overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-300">
      {/* ── Image Hero ── */}
      <button onClick={onViewImage} className="relative w-full h-44 bg-gray-100 dark:bg-white/[0.04] overflow-hidden block">
        {store.imageData ? (
          <>
            <img src={store.imageData} alt={store.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-200 dark:text-gray-700">
            <Store size={28} strokeWidth={1.5} />
            <span className="text-[10px] font-medium mt-1.5">Tidak ada foto</span>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <StatusBadge status={store.status} />
        </div>

        {store.region && (
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-white bg-black/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full" style={{ background: regionColor }} />
            {store.region}
          </div>
        )}
      </button>

      {/* ── Content ── */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-[14px] leading-tight mb-1.5 line-clamp-1">{store.name}</h3>

        <div className="flex items-center gap-3 mb-3">
          {store.whatsapp && (
            <a href={`https://wa.me/${store.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
              <Phone size={10} />
              {store.whatsapp}
            </a>
          )}
          <span className="text-[10px] text-gray-300 dark:text-gray-600 ml-auto">{timeAgo(store.recordedAt)}</span>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex gap-1.5">
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-semibold bg-gray-900 dark:bg-indigo-600 text-white hover:bg-gray-800 dark:hover:bg-indigo-500 shadow-sm transition-all">
            <NavIcon size={12} /> Maps
          </a>
          {store.whatsapp && (
            <a href={`https://wa.me/${store.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all">
              <MessageCircle size={12} />
            </a>
          )}
          <button onClick={onShare}
            className="flex items-center justify-center px-3 py-2.5 rounded-xl text-[11px] font-semibold bg-gray-50 dark:bg-white/[0.06] text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.1] transition-all">
            <Share2 size={12} />
          </button>
          {isOwner && (
            <>
              <button onClick={onEdit}
                className="flex items-center justify-center px-3 py-2.5 rounded-xl text-[11px] font-semibold bg-gray-50 dark:bg-white/[0.06] text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all">
                <Pencil size={12} />
              </button>
              <button onClick={onDelete}
                className="flex items-center justify-center px-3 py-2.5 rounded-xl text-[11px] font-semibold bg-gray-50 dark:bg-white/[0.06] text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                <Trash2 size={12} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Status Badge ────────────────────────

function StatusBadge({ status }: { status: StoreStatus }) {
  const config: Record<StoreStatus, { label: string; bg: string; text: string }> = {
    APPROVED: { label: "Approved", bg: "bg-emerald-500/90 backdrop-blur-md", text: "text-white" },
    PENDING: { label: "Pending", bg: "bg-amber-500/90 backdrop-blur-md", text: "text-white" },
    REJECTED: { label: "Rejected", bg: "bg-red-500/90 backdrop-blur-md", text: "text-white" },
  };
  const c = config[status] || config.PENDING;
  return (
    <span className={`text-[9px] font-bold px-2 py-1 rounded-lg ${c.bg} ${c.text} uppercase tracking-wider shadow-sm`}>
      {c.label}
    </span>
  );
}