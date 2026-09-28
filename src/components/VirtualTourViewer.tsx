import React, { useState, useRef, useEffect } from 'react';
import { VirtualTourRoom } from '../types/property';
import { Maximize2, Minimize2, Play, Pause, ChevronLeft, ChevronRight, X, Compass } from 'lucide-react';

interface VirtualTourViewerProps {
  rooms: VirtualTourRoom[];
  initialRoomId?: string;
  onClose?: () => void;
  propertyTitle: string;
}

export const VirtualTourViewer: React.FC<VirtualTourViewerProps> = ({
  rooms,
  initialRoomId,
  onClose,
  propertyTitle,
}) => {
  const [currentRoomIndex, setCurrentRoomIndex] = useState(() => {
    const idx = rooms.findIndex((r) => r.id === initialRoomId);
    return idx !== -1 ? idx : 0;
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [panX, setPanX] = useState(50); // percentage 0-100
  const [panY, setPanY] = useState(50); // percentage 0-100
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; initialPanX: number; initialPanY: number }>({
    x: 0,
    y: 0,
    initialPanX: 50,
    initialPanY: 50,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const activeRoom = rooms[currentRoomIndex] || rooms[0];

  // Auto rotation effect
  useEffect(() => {
    if (!isAutoRotating || isDragging) return;
    const interval = setInterval(() => {
      setPanX((prev) => (prev + 0.15) % 100);
    }, 40);
    return () => clearInterval(interval);
  }, [isAutoRotating, isDragging]);

  // Pointer drag to look around
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialPanX: panX,
      initialPanY: panY,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    // 1px approx 0.1% pan
    let nextPanX = dragStartRef.current.initialPanX - deltaX * 0.1;
    let nextPanY = dragStartRef.current.initialPanY - deltaY * 0.08;

    nextPanX = ((nextPanX % 100) + 100) % 100;
    nextPanY = Math.max(20, Math.min(80, nextPanY)); // clamp vertical

    setPanX(nextPanX);
    setPanY(nextPanY);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.warn(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.warn(err));
      setIsFullscreen(false);
    }
  };

  // Switch to room by id
  const handleGoToRoom = (roomId: string) => {
    const idx = rooms.findIndex((r) => r.id === roomId);
    if (idx !== -1) {
      setCurrentRoomIndex(idx);
      setPanX(50);
      setPanY(50);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[520px] bg-neutral-950 rounded-xl overflow-hidden select-none flex flex-col justify-between ${
        isFullscreen ? 'h-screen rounded-none' : ''
      }`}
    >
      {/* 360 Panorama Viewport */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="absolute inset-0 cursor-grab active:cursor-grabbing overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        <div
          className="w-[300%] h-[160%] -left-[100%] -top-[30%] absolute bg-cover bg-center transition-transform duration-75 ease-out"
          style={{
            backgroundImage: `url(${activeRoom.image})`,
            transform: `translate3d(${-panX * 1.5}px, ${-(panY - 50) * 1.5}px, 0) scale(1.1)`,
            filter: 'brightness(0.95) contrast(1.05)',
          }}
        />

        {/* Hotspots overlay inside room */}
        {activeRoom.hotspots && activeRoom.hotspots.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {activeRoom.hotspots.map((hs, idx) => {
              // Calculate screen position relative to pan
              const normalizedYaw = ((hs.yaw - panX * 3.6) % 360 + 360) % 360;
              const isVisible = normalizedYaw > 120 && normalizedYaw < 240;
              if (!isVisible) return null;

              const screenX = ((normalizedYaw - 120) / 120) * 100;
              const screenY = 50 + hs.pitch * 0.8;

              return (
                <div
                  key={idx}
                  style={{
                    left: `${screenX}%`,
                    top: `${screenY}%`,
                  }}
                  className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGoToRoom(hs.targetRoomId);
                  }}
                >
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-8 h-8 rounded-full bg-amber-400/40 animate-ping" />
                    <div className="w-6 h-6 rounded-full bg-amber-500 border-2 border-white shadow-xl flex items-center justify-center text-white text-[10px] font-bold">
                      ➔
                    </div>
                  </div>
                  <div className="mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900/90 text-white text-xs px-2.5 py-1 rounded shadow-lg whitespace-nowrap -translate-x-1/4">
                    {hs.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top Bar Controls */}
      <div className="relative z-10 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 rounded bg-amber-500/90 text-neutral-950 text-xs font-bold flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>تور مجازی ۳۶۰ درجه</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white drop-shadow-sm line-clamp-1">
              {activeRoom.name}
            </h3>
            <p className="text-[11px] text-neutral-300 drop-shadow-sm hidden sm:block">
              {propertyTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto-rotation */}
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className="p-2 rounded-lg bg-black/40 hover:bg-black/60 text-neutral-200 transition-colors"
            title={isAutoRotating ? 'توقف چرخش خودکار' : 'فعال‌سازی چرخش خودکار'}
          >
            {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-black/40 hover:bg-black/60 text-neutral-200 transition-colors"
            title="حالت تمام‌صفحه"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close button if provided */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-black/40 hover:bg-black/60 text-neutral-200 transition-colors"
              title="بستن تور"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Center Drag Guide Hint */}
      <div className="relative z-0 pointer-events-none self-center text-center opacity-60 text-xs text-white/80 drop-shadow flex items-center gap-2 py-1 px-3 rounded-full bg-black/30 backdrop-blur-xs">
        <Compass className="w-3 h-3 text-amber-400" />
        <span>برای چرخش در فضا ماوس را بکشید یا لمس کنید</span>
      </div>

      {/* Bottom Bar: Room Thumbnails & Selector */}
      <div className="relative z-10 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <div className="flex items-center justify-between gap-3 max-w-2xl mx-auto">
          {/* Prev Room */}
          <button
            onClick={() =>
              setCurrentRoomIndex((prev) => (prev > 0 ? prev - 1 : rooms.length - 1))
            }
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="اتاق قبلی"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Rooms Thumbnails */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 px-1 max-w-full">
            {rooms.map((room, idx) => {
              const isSelected = idx === currentRoomIndex;
              return (
                <button
                  key={room.id}
                  onClick={() => {
                    setCurrentRoomIndex(idx);
                    setPanX(50);
                    setPanY(50);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md font-bold'
                      : 'bg-black/50 text-white/90 border-white/20 hover:bg-black/70'
                  }`}
                >
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-5 h-5 rounded object-cover"
                  />
                  <span>{room.name}</span>
                </button>
              );
            })}
          </div>

          {/* Next Room */}
          <button
            onClick={() =>
              setCurrentRoomIndex((prev) => (prev < rooms.length - 1 ? prev + 1 : 0))
            }
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="اتاق بعدی"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Room Description */}
        {activeRoom.description && (
          <p className="text-center text-[11px] text-neutral-300 mt-2 max-w-lg mx-auto line-clamp-1">
            {activeRoom.description}
          </p>
        )}
      </div>
    </div>
  );
};
