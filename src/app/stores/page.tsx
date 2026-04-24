"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useAppStore, REGIONS, REGION_COLORS, type Region, type StoreStatus } from "@/store/useAppStore";
import { useSession } from "@/lib/auth-client";
import {
  MapPin, Phone, Search,
  Share2, Pencil, Trash2,
  Navigation as NavIcon, ImageIcon, X,
  ChevronDown, ChevronUp, ArrowUpDown, Store,
  ImagePlus, Loader2, CheckCircle2
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

  if (weeks > 0) return `${weeks}w`;
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return "Now";
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

  useEffect(() => {
    if (!isPending && session?.user) {
      fetchStores();
    }
  }, [fetchStores, isPending, session]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState<FilterRegion>("Semua");
  const [sortMode, setSortMode] = useState<SortMode>("terbaru");
  const [collapsedRegions, setCollapsedRegions] = useState<Set<string>>(new Set());
  const [imagePreview, setImagePreview] = useState<{ url: string; name: string } | null>(null);

  // Edit dialog state
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [editData, setEditData] = useState<EditStoreData>({ name: "", region: "", whatsapp: "", imageData: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const editFileRef = useRef<HTMLInputElement>(null);

  // Visible stores: all approved + user's own
  const visibleStores = stores.filter(
    store => store.status === "APPROVED" || store.userId === currentUser?.id
  );

  // Region counts
  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = { Semua: visibleStores.length };
    REGIONS.forEach(r => { counts[r] = visibleStores.filter(s => s.region === r).length; });
    return counts;
  }, [visibleStores]);

  // Filter & sort
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

  // Group by region
  const groupedStores = useMemo(() => {
    const groups: Record<string, typeof filteredStores> = {};
    filteredStores.forEach(store => {
      const region = store.region || "Lainnya";
      if (!groups[region]) groups[region] = [];
      groups[region].push(store);
    });
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      const idxA = REGIONS.indexOf(a as Region);
      const idxB = REGIONS.indexOf(b as Region);
      if (idxA >= 0 && idxB >= 0) return idxA - idxB;
      if (idxA >= 0) return -1;
      if (idxB >= 0) return 1;
      return a.localeCompare(b);
    });
    return sortedKeys.map(key => ({ region: key, stores: groups[key] }));
  }, [filteredStores]);

  const toggleCollapse = (region: string) => {
    setCollapsedRegions(prev => {
      const next = new Set(prev);
      next.has(region) ? next.delete(region) : next.add(region);
      return next;
    });
  };

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
    setEditData({
      name: store.name,
      region: store.region,
      whatsapp: store.whatsapp,
      imageData: store.imageData,
    });
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
      setTimeout(() => {
        setEditingStoreId(null);
        setSaveSuccess(false);
      }, 800);
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

  return (
    <div className="p-5 md:p-8 h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight">Daftar Toko</h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          {visibleStores.length} toko · {new Set(visibleStores.map(s => s.region).filter(Boolean)).size} wilayah
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Cari toko..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#151827] border border-gray-100 dark:border-white/[0.06] rounded-xl text-[13px] text-gray-700 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900/8 dark:focus:ring-indigo-500/20 focus:border-gray-200 dark:focus:border-indigo-500/30 shadow-sm shadow-gray-100/50 dark:shadow-black/10 transition-all"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Region filter — horizontal scroll */}
      <div className="mb-4 -mx-5 px-5 md:-mx-8 md:px-8">
        <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {allRegions.map(region => {
            const isActive = activeRegion === region;
            const count = regionCounts[region] || 0;
            return (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-gray-900 dark:bg-indigo-600 text-white"
                    : "bg-white dark:bg-[#151827] text-gray-500 dark:text-gray-400 border border-gray-200/60 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/[0.12]"
                }`}
              >
                {region !== "Semua" && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: REGION_COLORS[region as Region] }} />
                )}
                {region}
                <span className={isActive ? "text-white/50" : "text-gray-300 dark:text-gray-600"}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort toggle */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] text-gray-300 dark:text-gray-500 font-medium">{filteredStores.length} toko</span>
        <button
          onClick={() => setSortMode(sortMode === "terbaru" ? "nama" : "terbaru")}
          className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 font-medium transition-colors"
        >
          <ArrowUpDown size={11} />
          {sortMode === "terbaru" ? "Terbaru" : "A–Z"}
        </button>
      </div>

      {/* Empty state */}
      {filteredStores.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center mx-auto mb-3">
            <MapPin size={20} className="text-gray-300 dark:text-gray-600" />
          </div>
          <p className="font-medium text-gray-500 dark:text-gray-400 text-sm mb-1">
            {visibleStores.length === 0 ? "Belum ada toko" : "Tidak ditemukan"}
          </p>
          <p className="text-xs text-gray-300 dark:text-gray-600">
            {visibleStores.length === 0
              ? "Tambahkan toko pertamamu dari halaman Peta"
              : "Coba ubah filter atau kata kunci"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {groupedStores.map(group => {
            const isCollapsed = collapsedRegions.has(group.region);

            return (
              <div key={group.region} className="rounded-2xl bg-white dark:bg-[#151827] border border-gray-100 dark:border-white/[0.06] overflow-hidden shadow-sm shadow-gray-100/30 dark:shadow-black/10">
                {/* Region header */}
                <button
                  onClick={() => toggleCollapse(group.region)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50/30 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: REGION_COLORS[group.region as Region] || '#9ca3af' }} />
                    <span className="font-medium text-gray-800 dark:text-gray-200 text-[13px]">{group.region}</span>
                    <span className="text-[10px] font-medium text-gray-300 dark:text-gray-500 bg-gray-50 dark:bg-white/[0.04] px-1.5 py-0.5 rounded-md">
                      {group.stores.length}
                    </span>
                  </div>
                  {isCollapsed
                    ? <ChevronDown size={14} className="text-gray-300 dark:text-gray-500" />
                    : <ChevronUp size={14} className="text-gray-300 dark:text-gray-500" />
                  }
                </button>

                {/* Store cards */}
                {!isCollapsed && (
                  <div className="px-3 pb-3 flex flex-col gap-2">
                    {group.stores.map(store => (
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
            );
          })}
        </div>
      )}

      {/* Image Preview Modal */}
      {imagePreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setImagePreview(null)}
        >
          <div
            className="relative max-w-xl w-full bg-white dark:bg-[#1c2035] rounded-2xl shadow-2xl shadow-black/10 overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-white/[0.06]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-white/[0.06]">
              <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{imagePreview.name}</span>
              <button
                onClick={() => setImagePreview(null)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
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

      {/* Edit Store Modal */}
      {editingStoreId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => { if (!isSaving) setEditingStoreId(null); }}
        >
          <div
            className="relative w-full max-w-[420px] bg-white dark:bg-[#1c2035] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100 dark:border-white/[0.06]">
              <div>
                <h3 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">Edit Toko</h3>
                <p className="text-xs text-gray-400 mt-0.5">Perbarui informasi toko</p>
              </div>
              <button
                onClick={() => setEditingStoreId(null)}
                disabled={isSaving}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Nama */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                  Nama Toko <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={e => setEditData(d => ({ ...d, name: e.target.value }))}
                  className="w-full h-10 px-3 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-[13px] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/40 transition-all"
                  placeholder="Nama toko"
                  autoFocus
                />
              </div>

              {/* Wilayah */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Wilayah</label>
                <div className="flex flex-wrap gap-1.5">
                  {REGIONS.map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setEditData(d => ({ ...d, region: d.region === r ? "" : r }))}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
                        editData.region === r
                          ? "bg-gray-900 dark:bg-indigo-600 text-white border-gray-900 dark:border-indigo-600"
                          : "bg-white dark:bg-[#151827] text-gray-500 dark:text-gray-400 border-gray-200/60 dark:border-white/[0.06] hover:border-gray-300"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* WhatsApp */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">WhatsApp</label>
                <input
                  type="tel"
                  value={editData.whatsapp}
                  onChange={e => setEditData(d => ({ ...d, whatsapp: e.target.value }))}
                  placeholder="08123456789"
                  className="w-full h-10 px-3 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.08] rounded-xl text-[13px] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                />
              </div>

              {/* Foto */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Foto</label>
                <input ref={editFileRef} type="file" accept="image/*" onChange={handleEditImage} className="hidden" />
                {editData.imageData ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200/60 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.02]">
                    <img src={editData.imageData} alt="Preview" className="w-full h-32 object-cover" />
                    <button
                      type="button"
                      onClick={() => setEditData(d => ({ ...d, imageData: "" }))}
                      className="absolute top-2 right-2 bg-black/40 text-white p-1 rounded-lg hover:bg-black/60"
                    >
                      <X size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => editFileRef.current?.click()}
                      className="absolute bottom-2 right-2 bg-white/90 text-gray-700 px-2.5 py-1 rounded-lg text-[10px] font-medium hover:bg-white shadow-sm"
                    >
                      Ganti
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => editFileRef.current?.click()}
                    className="w-full h-20 rounded-xl border border-dashed border-gray-200 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.02] flex flex-col items-center justify-center gap-1 text-gray-300 dark:text-gray-600 hover:border-gray-300 hover:text-gray-400 transition-all cursor-pointer"
                  >
                    <ImagePlus size={18} />
                    <span className="text-[10px] font-medium">Tambah foto</span>
                  </button>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-5 flex gap-2.5">
              <button
                onClick={() => setEditingStoreId(null)}
                disabled={isSaving}
                className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-white/[0.08] text-gray-500 dark:text-gray-400 text-[13px] font-medium hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving || !editData.name.trim()}
                className="flex-1 h-10 bg-gray-900 dark:bg-indigo-600 hover:bg-gray-800 dark:hover:bg-indigo-500 text-white text-[13px] font-semibold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : saveSuccess ? (
                  <><CheckCircle2 size={14} /> Tersimpan!</>
                ) : (
                  "Simpan"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Store Card Component ────────────────────────────────────────────────────

function StoreCard({
  store,
  isOwner,
  onShare,
  onViewImage,
  onEdit,
  onDelete,
}: {
  store: {
    id: string;
    name: string;
    region: Region | "";
    whatsapp: string;
    imageData: string;
    lat: number;
    lng: number;
    recordedAt: number;
    status: StoreStatus;
  };
  isOwner: boolean;
  onShare: () => void;
  onViewImage: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group rounded-xl border border-gray-100 dark:border-white/[0.06] hover:border-gray-200 dark:hover:border-white/[0.12] bg-white dark:bg-[#1c2035] hover:shadow-md hover:shadow-gray-100/50 dark:hover:shadow-black/20 transition-all duration-300 overflow-hidden">
      {/* Top row: image + info */}
      <div className="flex gap-3 p-3">
        {/* Thumbnail */}
        <button
          onClick={onViewImage}
          className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-white/[0.04] flex-shrink-0 overflow-hidden"
        >
          {store.imageData ? (
            <img src={store.imageData} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200 dark:text-gray-600">
              <Store size={16} />
            </div>
          )}
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-[13px] truncate leading-tight">{store.name}</h3>
            <StatusBadge status={store.status} />
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            {store.region && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-400 dark:text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: REGION_COLORS[store.region as Region] }} />
                {store.region}
              </span>
            )}
            <span className="text-[10px] text-gray-300 dark:text-gray-600">
              {timeAgo(store.recordedAt)}
            </span>
          </div>

          {/* WhatsApp inline */}
          {store.whatsapp && (
            <a
              href={`https://wa.me/${store.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 mt-1"
            >
              <Phone size={9} />
              {store.whatsapp}
            </a>
          )}
        </div>
      </div>

      {/* Action bar */}
      <div className="flex border-t border-gray-50 dark:border-white/[0.04] divide-x divide-gray-50 dark:divide-white/[0.04]">
        <button
          onClick={onViewImage}
          className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors"
        >
          <ImageIcon size={11} />
          Gambar
        </button>
        <button
          onClick={onShare}
          className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors"
        >
          <Share2 size={11} />
          Bagikan
        </button>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors"
        >
          <NavIcon size={11} />
          Navigasi
        </a>

        {/* Owner-only actions */}
        {isOwner && (
          <>
            <button
              onClick={onEdit}
              title="Edit toko"
              className="flex items-center justify-center px-2.5 py-2 text-[10px] font-medium text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 transition-colors"
            >
              <Pencil size={11} />
            </button>
            <button
              onClick={onDelete}
              title="Hapus toko"
              className="flex items-center justify-center px-2.5 py-2 text-[10px] font-medium text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={11} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: StoreStatus }) {
  const config: Record<StoreStatus, { label: string; className: string }> = {
    PENDING:  { label: "Pending",   className: "bg-amber-50 dark:bg-amber-500/10 text-amber-500" },
    APPROVED: { label: "Approved",  className: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500" },
    REJECTED: { label: "Rejected",  className: "bg-red-50 dark:bg-red-500/10 text-red-400" },
  };
  const c = config[status] || config.PENDING;
  return (
    <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-md shrink-0 uppercase tracking-wider ${c.className}`}>
      {c.label}
    </span>
  );
}
