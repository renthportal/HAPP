'use client'

import { useState, useRef, useCallback } from 'react'

interface BeforeAfterViewerProps {
  beforeUrl?: string | null
  afterUrl?: string | null
  timeDiffLabel?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function BeforeAfterViewer({
  beforeUrl,
  afterUrl,
  timeDiffLabel,
  size = 'md',
}: BeforeAfterViewerProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const heightMap = {
    sm: 'h-40',
    md: 'h-64',
    lg: 'h-96',
  }

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current || !isDragging.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percent)
  }, [])

  const handleMouseDown = () => { isDragging.current = true }
  const handleMouseUp = () => { isDragging.current = false }
  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX)
  const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX)

  // Tek fotoğraf varsa basit göster
  if (!beforeUrl && !afterUrl) {
    return (
      <div className={`${heightMap[size]} bg-happ-surface rounded-lg flex items-center justify-center text-gray-600 text-sm`}>
        Henüz fotoğraf eklenmedi
      </div>
    )
  }

  if (!beforeUrl || !afterUrl) {
    const url = beforeUrl || afterUrl
    const label = beforeUrl ? 'Önce' : 'Sonra'
    return (
      <div className={`relative ${heightMap[size]} rounded-lg overflow-hidden`}>
        <img src={url!} alt={label} className="w-full h-full object-cover" />
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {label}
        </div>
      </div>
    )
  }

  // Before/After slider
  return (
    <div
      ref={containerRef}
      className={`relative ${heightMap[size]} rounded-lg overflow-hidden cursor-col-resize select-none`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onTouchMove={handleTouchMove}
    >
      {/* After (arka plan) */}
      <img
        src={afterUrl}
        alt="Sonra"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Before (kırpılmış) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeUrl}
          alt="Önce"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: containerRef.current?.offsetWidth || '100%' }}
          draggable={false}
        />
      </div>

      {/* Slider çizgisi */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Slider tutamağı */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 3L2 8L5 13" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 3L14 8L11 13" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Etiketler */}
      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-20">
        Önce
      </div>
      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-20">
        Sonra
      </div>

      {/* Zaman farkı etiketi */}
      {timeDiffLabel && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/80 text-happ-yellow text-xs font-medium px-3 py-1.5 rounded-full z-20">
          {timeDiffLabel}
        </div>
      )}
    </div>
  )
}
