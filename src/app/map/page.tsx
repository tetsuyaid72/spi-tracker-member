"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAppStore, REGIONS, Region } from "@/store/useAppStore";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Layers, MapPin, Plus, Navigation, Phone, ImagePlus, X, Store, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MapComponent = dynamic(() => import("@/components/MapComponent"), { ssr: false });

export default function MapPage() {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isAddingStore, setIsAddingStore] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: -3.3605, lng: 114.8226 });
  const [successMessage, setSuccessMessage] = useState("");

  // Form state
  const [storeName, setStoreName] = useState("");
  const [region, setRegion] = useState<Region | "">("");
  const [whatsapp, setWhatsapp] = useState("");
  const [imageData, setImageData] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addStore = useAppStore(state => state.addStore);
  const deleteStore = useAppStore(state => state.deleteStore);
  const fetchStores = useAppStore(state => state.fetchStores);
  const stores = useAppStore(state => state.stores);

  const { data: session, isPending } = useSession();
  const currentUser = session?.user;

  // Fetch stores after session is ready
  useEffect(() => {
    if (!isPending && session?.user) {
      fetchStores();
    }
  }, [fetchStores, isPending, session]);

  // Show all approved stores on the map (from all users)
  const approvedStores = stores.filter(store => store.status === "APPROVED");

  const handleCenterChange = useCallback((lat: number, lng: number) => {
    setMapCenter(prev => {
      if (prev.lat === lat && prev.lng === lng) return prev;
      return { lat, lng };
    });
  }, []);

  const resetForm = () => {
    setStoreName("");
    setRegion("");
    setWhatsapp("");
    setImageData("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit to 5MB raw
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5MB");
      return;
    }

    // Resize image to max 800px to keep DB manageable
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_SIZE = 800;
      let w = img.width;
      let h = img.height;
      if (w > MAX_SIZE || h > MAX_SIZE) {
        if (w > h) { h = (h / w) * MAX_SIZE; w = MAX_SIZE; }
        else { w = (w / h) * MAX_SIZE; h = MAX_SIZE; }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
      setImageData(dataUrl);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !currentUser) return;

    await addStore({
      name: storeName,
      region,
      whatsapp,
      imageData,
      lat: mapCenter.lat,
      lng: mapCenter.lng,
      userId: currentUser.id,
      userName: currentUser.name,
    });

    resetForm();
    setIsAddingStore(false);
    setSuccessMessage("Toko berhasil diajukan! Menunggu persetujuan admin.");
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) resetForm();
    setIsAddingStore(open);
  };

  return (
    <div className="relative h-full w-full">
      <MapComponent
        stores={approvedStores}
        showHeatmap={showHeatmap}
        onCenterChange={handleCenterChange}
        onDeleteStore={deleteStore}
        interactiveOptions={true}
      />

      {/* Success toast */}
      {successMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1100] animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-[13px] font-medium">
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage("")}
              className="ml-1 text-white/40 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Top right controls */}
      {!isAddingStore && (
        <div className="absolute top-4 right-4 z-[1000]">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className="bg-white/90 dark:bg-[#151827]/90 backdrop-blur-md border border-gray-200/60 dark:border-white/[0.06] shadow-lg shadow-black/5 p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-[#1c2035] transition-all duration-200"
            title={showHeatmap ? "Tampilkan Marker" : "Tampilkan Heatmap"}
          >
            {showHeatmap ? <MapPin size={18} strokeWidth={1.8} /> : <Layers size={18} strokeWidth={1.8} />}
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      {!isAddingStore && (
        <button
          onClick={() => setIsAddingStore(true)}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[1000] bg-gray-900 dark:bg-indigo-600 text-white px-5 py-3 rounded-full font-semibold text-[13px] shadow-xl shadow-gray-900/20 dark:shadow-indigo-900/30 flex items-center gap-2 hover:bg-gray-800 dark:hover:bg-indigo-500 transition-all duration-200 active:scale-[0.97]"
        >
          <Plus size={17} strokeWidth={2} />
          <span>Tandai Toko</span>
        </button>
      )}

      {/* Add Store Dialog */}
      <Dialog open={isAddingStore} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[440px] p-0 gap-0 max-h-[90vh] overflow-y-auto rounded-2xl">
          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-3">
            <div>
              <DialogTitle className="text-[15px] font-semibold text-gray-900">Tambah Toko Baru</DialogTitle>
              <DialogDescription className="text-xs text-gray-400 mt-0.5">
                Tandai lokasi toko baru di peta
              </DialogDescription>
            </div>
          </DialogHeader>

          <form onSubmit={handleAddStore} className="px-6 pb-6">
            <div className="space-y-5">

              {/* Nama Toko */}
              <div className="space-y-1.5">
                <Label htmlFor="store-name" className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                  Nama Toko <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="store-name"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Cth: Toko Berkah Jaya"
                  className="h-10 bg-gray-50/50 border-gray-200/60 focus:bg-white rounded-xl text-[13px] transition-colors"
                  autoFocus
                  required
                />
              </div>

              {/* Wilayah / Area */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                  Wilayah
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {REGIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRegion(region === r ? "" : r)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all duration-200 ${
                        region === r
                          ? "bg-gray-900 dark:bg-indigo-600 text-white border-gray-900 dark:border-indigo-600"
                          : "bg-white dark:bg-[#1c2035] text-gray-500 dark:text-gray-400 border-gray-200/60 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/[0.12]"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nomor WhatsApp */}
              <div className="space-y-1.5">
                <Label htmlFor="whatsapp" className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                  WhatsApp <span className="text-gray-300 normal-case">(opsional)</span>
                </Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="08123456789"
                  className="h-10 bg-gray-50/50 border-gray-200/60 focus:bg-white rounded-xl text-[13px] transition-colors"
                />
              </div>

              {/* Tambahkan Gambar */}
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                  Foto <span className="text-gray-300 normal-case">(opsional)</span>
                </Label>
                <input
                  ref={fileInputRef}
                  key={imageData ? "has-image" : "no-image"}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imageData ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200/60 bg-gray-50">
                    <img
                      src={imageData}
                      alt="Preview"
                      className="w-full h-28 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImageData("")}
                      className="absolute top-2 right-2 bg-black/40 text-white p-1 rounded-lg hover:bg-black/60 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-20 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center gap-1 text-gray-300 hover:border-gray-300 hover:text-gray-400 transition-all cursor-pointer"
                  >
                    <ImagePlus size={18} />
                    <span className="text-[10px] font-medium">Ketuk untuk foto</span>
                  </button>
                )}
              </div>

              {/* Koordinat GPS */}
              <div className="bg-gray-50/50 rounded-xl p-3 flex items-center gap-3 border border-gray-100/60">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
                  <Navigation size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-gray-500">Koordinat GPS</p>
                  <p className="text-xs text-gray-400 font-mono">
                    {mapCenter.lat.toFixed(6)}, {mapCenter.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2.5 mt-6">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-10 rounded-xl text-[13px] border-gray-200/60"
                onClick={() => handleDialogClose(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 h-10 bg-gray-900 text-white hover:bg-gray-800 font-semibold rounded-xl text-[13px]"
              >
                Simpan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
