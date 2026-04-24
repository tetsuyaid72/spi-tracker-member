"use client";

import { useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { StoreLocation, REGION_COLORS, Region } from "@/store/useAppStore";
import { useTheme } from "./ThemeProvider";
import { LocateFixed } from "lucide-react";

// Fix for default Leaflet icon paths in Webpack/Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function HeatmapLayer({ points, show }: { points: StoreLocation[], show: boolean }) {
  const map = useMap();
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    // Clean up previous layer first
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    if (show && points.length > 0) {
      const heatPoints = points.map(p => [p.lat, p.lng, 1] as [number, number, number]);
      heatLayerRef.current = (L as any).heatLayer(heatPoints, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: { 0.4: 'blue', 0.6: 'lime', 0.8: 'yellow', 1: 'red' }
      }).addTo(map);
    }

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [map, points, show]);

  return null;
}

function LocationMarker() {
  const map = useMap();
  const hasLocated = useRef(false);

  useEffect(() => {
    if (hasLocated.current) return;
    hasLocated.current = true;

    map.locate({ setView: true, maxZoom: 16 });
    map.once("locationfound", (e) => {
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  return null;
}

function CenterObserver({ onCenterChanged }: { onCenterChanged: (lat: number, lng: number) => void }) {
  const map = useMapEvents({
    moveend() {
      const c = map.getCenter();
      onCenterChanged(c.lat, c.lng);
    },
  });

  // Set initial center only once
  const didInit = useRef(false);
  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      const c = map.getCenter();
      onCenterChanged(c.lat, c.lng);
    }
  }, [map, onCenterChanged]);

  return null;
}

// Helpers for the popup
function getRegionColor(region: string): string {
  return REGION_COLORS[region as Region] || '#6b7280';
}

interface MapComponentProps {
  stores: StoreLocation[];
  showHeatmap: boolean;
  onCenterChange?: (lat: number, lng: number) => void;
  onDeleteStore?: (id: string) => void;
  interactiveOptions?: boolean;
  showLocateButton?: boolean;
}

export default function MapComponent({ stores, showHeatmap, onCenterChange, onDeleteStore, interactiveOptions = true, showLocateButton = false }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const { theme } = useTheme();

  const handleCenterChanged = useCallback((lat: number, lng: number) => {
    if (onCenterChange) {
      onCenterChange(lat, lng);
    }
  }, [onCenterChange]);

  const locateUser = () => {
    if (mapRef.current) {
      mapRef.current.locate({ setView: true, maxZoom: 16 });
    }
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[-6.2088, 106.8456]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          attribution='© 2026 SPI Tracker'
          url={theme === "dark" ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"}
        />

        {(interactiveOptions || showLocateButton) && <LocationMarker />}
        {interactiveOptions && <CenterObserver onCenterChanged={handleCenterChanged} />}

        {!showHeatmap && stores.map((store) => {
          const regionColor = getRegionColor(store.region);

          return (
            <Marker key={store.id} position={[store.lat, store.lng]}>
              <Popup maxWidth={280} minWidth={240} className="store-detail-popup" closeButton={false}>
                <div style={{ margin: '-14px -20px', overflow: 'hidden', fontFamily: "'Inter', -apple-system, sans-serif" }}>
                  {/* Store image hero */}
                  {store.imageData && (
                    <div style={{ position: 'relative' }}>
                      <img
                        src={store.imageData}
                        alt={store.name}
                        style={{
                          width: '100%',
                          height: '120px',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '50px',
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.25))',
                      }} />
                    </div>
                  )}

                  <div style={{ padding: '14px 16px 14px' }}>
                    {/* Store name */}
                    <div style={{
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#111827',
                      marginBottom: '6px',
                      lineHeight: '1.3',
                      letterSpacing: '-0.01em',
                    }}>
                      {store.name}
                    </div>

                    {/* Region badge — minimal pill */}
                    {store.region && (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: '#f9fafb',
                        color: '#6b7280',
                        fontSize: '10px',
                        fontWeight: 500,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        marginBottom: '10px',
                        border: '1px solid #f3f4f6',
                      }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: regionColor,
                          display: 'inline-block',
                          flexShrink: 0,
                        }} />
                        {store.region}
                      </div>
                    )}

                    {/* WhatsApp number — subtle */}
                    {store.whatsapp && (
                      <a
                        href={`https://wa.me/${store.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#059669',
                          fontSize: '12px',
                          fontWeight: 500,
                          padding: '7px 10px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          marginBottom: '8px',
                          background: '#f0fdf4',
                          border: '1px solid #dcfce7',
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="#059669">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        {store.whatsapp}
                      </a>
                    )}

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          background: '#111827',
                          color: '#ffffff',
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '8px 8px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          letterSpacing: '0.01em',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                        </svg>
                        Navigasi
                      </a>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          background: '#ffffff',
                          color: '#374151',
                          fontSize: '11px',
                          fontWeight: 500,
                          padding: '8px 8px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          border: '1px solid #e5e7eb',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        Maps
                      </a>
                      <button
                        onClick={async () => {
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
                        }}
                        style={{
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#f9fafb',
                          color: '#6b7280',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                        </svg>
                      </button>
                    </div>

                    {/* Meta info */}
                    <div style={{
                      fontSize: '10px',
                      color: '#d1d5db',
                      marginTop: '8px',
                      paddingTop: '8px',
                      borderTop: '1px solid #f3f4f6',
                      letterSpacing: '0.02em',
                    }}>
                      {store.userName} · {new Date(store.recordedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <HeatmapLayer points={stores} show={showHeatmap} />
      </MapContainer>

      {(interactiveOptions || showLocateButton) && (
        <button
          onClick={locateUser}
          className="absolute z-[1000] bottom-24 right-4 bg-white/90 dark:bg-[#1e2035]/90 backdrop-blur-md p-2.5 rounded-xl shadow-lg shadow-black/5 dark:shadow-black/20 text-gray-600 dark:text-gray-300 border border-gray-200/60 dark:border-white/[0.08] hover:bg-white dark:hover:bg-[#282a45] hover:text-gray-900 dark:hover:text-white transition-all duration-200"
        >
          <LocateFixed size={20} strokeWidth={1.8} />
        </button>
      )}

      {/* Target reticle for adding store in the center */}
      {interactiveOptions && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[400] pointer-events-none">
          <div className="w-7 h-7 rounded-full border-[3px] border-gray-900/80 dark:border-white/80 bg-gray-900/10 dark:bg-white/10 shadow-[0_0_2px_rgba(255,255,255,0.9)] dark:shadow-[0_0_0_2px_rgba(0,0,0,0.5)]"></div>
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-gray-900 dark:bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      )}
    </div>
  );
}
