import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Property } from '../types/property';
import { formatShortPriceBadge, toPersianDigits } from '../utils/formatters';
import { Locate, Layers, ZoomIn, ZoomOut, Compass } from 'lucide-react';

interface InteractiveMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  onOpenQuickDetail: (property: Property) => void;
  userCoords?: { lat: number; lng: number } | null;
  onUserLocationFound?: (coords: { lat: number; lng: number }) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  onOpenQuickDetail,
  onUserLocationFound,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center: Tehran (Vanak/Tajrish area)
    const map = L.map(mapContainerRef.current, {
      center: [35.78, 51.41],
      zoom: 12,
      zoomControl: false,
    });

    // Street tiles
    const streetTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle tile switch (streets vs satellite)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    if (mapType === 'satellite') {
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18,
      }).addTo(map);
    } else {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);
    }
  }, [mapType]);

  // Update markers when properties or selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    properties.forEach((prop) => {
      const isSelected = selectedProperty?.id === prop.id;
      const priceText = prop.dealType === 'buy'
        ? formatShortPriceBadge(prop.price)
        : `${formatShortPriceBadge(prop.deposit)} رهن`;

      const markerHtml = `
        <div class="group cursor-pointer transform transition-all duration-200 ${isSelected ? 'scale-110 z-50' : 'hover:scale-105'}">
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-md border ${
            isSelected
              ? 'bg-neutral-900 text-white border-amber-400 ring-2 ring-amber-400/40'
              : 'bg-white text-neutral-900 border-neutral-200 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white'
          }">
            <span class="w-2 h-2 rounded-full ${prop.dealType === 'buy' ? 'bg-amber-500' : 'bg-emerald-500'}"></span>
            <span class="tabular-nums">${priceText}</span>
            ${prop.hasVirtualTour ? '<span class="text-[10px] text-amber-500 font-bold">360°</span>' : ''}
          </div>
          <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] ${
            isSelected ? 'border-t-neutral-900' : 'border-t-white'
          } mx-auto -mt-[1px]"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-property-pin',
        html: markerHtml,
        iconSize: [110, 36],
        iconAnchor: [55, 36],
      });

      const marker = L.marker([prop.coordinates.lat, prop.coordinates.lng], { icon: customIcon });

      marker.on('click', () => {
        onSelectProperty(prop);
      });

      markersGroup.addLayer(marker);
    });

    // If a property is selected, pan smoothly to it
    if (selectedProperty) {
      map.panTo([selectedProperty.coordinates.lat, selectedProperty.coordinates.lng], {
        animate: true,
        duration: 0.8,
      });
    }
  }, [properties, selectedProperty, onSelectProperty]);

  // User location finder
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      setLocationError('مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const map = mapInstanceRef.current;
        if (!map) return;

        // Pan to location
        map.setView([latitude, longitude], 14, { animate: true });

        // Add or update pulse marker
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng([latitude, longitude]);
        } else {
          const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `
              <div class="relative flex items-center justify-center">
                <div class="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></div>
                <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg"></div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon }).addTo(map);
        }

        if (onUserLocationFound) {
          onUserLocationFound({ lat: latitude, lng: longitude });
        }

        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        // Fallback gracefully to Tehran center if denied
        const map = mapInstanceRef.current;
        if (map) {
          map.setView([35.77, 51.41], 13, { animate: true });
        }
        setLocationError('امکان دریافت دقیق لوکیشن وجود نداشت. نقشه روی مرکز شهر تنظیم شد.');
        setIsLocating(false);
        setTimeout(() => setLocationError(null), 4000);
      },
      { timeout: 7000 }
    );
  };

  return (
    <div className="relative w-full h-full min-h-[480px] bg-neutral-100 overflow-hidden">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Controls (Top Left in RTL) */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {/* Layer toggle */}
        <button
          onClick={() => setMapType((prev) => (prev === 'streets' ? 'satellite' : 'streets'))}
          className="p-2.5 bg-white/95 backdrop-blur-sm text-neutral-700 hover:text-neutral-900 rounded-lg shadow-sm border border-neutral-200 transition-colors flex items-center gap-1.5 text-xs font-medium"
          title="تغییر لایه نقشه (خیابان / ماهواره)"
        >
          <Layers className="w-4 h-4" />
          <span className="hidden sm:inline">{mapType === 'streets' ? 'ماهواره' : 'خیابان'}</span>
        </button>

        {/* Locate Me */}
        <button
          onClick={handleLocateUser}
          disabled={isLocating}
          className={`p-2.5 rounded-lg shadow-sm border transition-colors flex items-center gap-1.5 text-xs font-medium ${
            isLocating
              ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
              : 'bg-white/95 backdrop-blur-sm text-neutral-700 hover:text-neutral-900 border-neutral-200'
          }`}
          title="املاک اطراف من"
        >
          <Locate className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">اطراف من</span>
        </button>

        {/* Zoom In/Out */}
        <div className="flex flex-col bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 transition-colors border-b border-neutral-100"
            title="بزرگ‌نمایی"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
            title="کوچک‌نمایی"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Properties count badge on map */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-neutral-200 text-xs font-medium text-neutral-700 flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-amber-600" />
          <span>نمایش {toPersianDigits(properties.length)} ملک در این محدوده</span>
        </div>
      </div>

      {/* Geolocation Notice Banner */}
      {locationError && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-neutral-900/90 text-white text-xs px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm transition-opacity">
          {locationError}
        </div>
      )}

      {/* Selected Property Preview Popup Card on Map */}
      {selectedProperty && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-20">
          <div className="bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden p-3 transition-all">
            <div className="flex gap-3">
              <div className="w-28 h-24 rounded-lg overflow-hidden shrink-0 relative bg-neutral-100">
                <img
                  src={selectedProperty.images[0]}
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover"
                />
                {selectedProperty.hasVirtualTour && (
                  <span className="absolute bottom-1 right-1 bg-neutral-900/80 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    تور ۳۶۰°
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900 line-clamp-1">
                    {selectedProperty.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5 truncate">
                    {selectedProperty.neighborhood} · {toPersianDigits(selectedProperty.meterage)} متر · {toPersianDigits(selectedProperty.rooms)} خواب
                  </p>
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900 tabular-nums">
                    {selectedProperty.dealType === 'buy'
                      ? formatShortPriceBadge(selectedProperty.price) + ' تومان'
                      : `ودیعه: ${formatShortPriceBadge(selectedProperty.deposit)} تومان`}
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenQuickDetail(selectedProperty)}
                      className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      مشاهده کامل جزئیات ←
                    </button>
                    <span className="text-[11px] text-neutral-400">
                      {selectedProperty.createdAt}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
