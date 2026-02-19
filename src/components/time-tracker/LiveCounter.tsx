'use client'

import { useState, useEffect, useRef } from 'react'
import { calculateTimeDiff, type TimeDiff } from '@/lib/timeCalculator'

interface LiveCounterProps {
  startDate: string | Date
  endDate?: string | Date | null
  eventType: 'countup' | 'countdown'
  color?: string
  size?: 'sm' | 'md' | 'lg'
  showTotal?: boolean
}

function TimeUnit({ value, label, color, size }: {
  value: number
  label: string
  color: string
  size: 'sm' | 'md' | 'lg'
}) {
  const sizeClasses = {
    sm: 'text-lg font-bold min-w-[2rem]',
    md: 'text-2xl font-bold min-w-[3rem]',
    lg: 'text-4xl font-bold min-w-[4rem]',
  }

  const labelClasses = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  }

  return (
    <div className="flex flex-col items-center">
      <span
        className={`${sizeClasses[size]} tabular-nums`}
        style={{ color }}
      >
        {String(value).padStart(2, '0')}
      </span>
      <span className={`${labelClasses[size]} text-gray-500 uppercase tracking-wider`}>
        {label}
      </span>
    </div>
  )
}

function Separator({ size, color }: { size: 'sm' | 'md' | 'lg'; color: string }) {
  const sizeClass = size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-xl' : 'text-base'
  return (
    <span className={`${sizeClass} font-light mx-0.5 self-start mt-0.5`} style={{ color, opacity: 0.4 }}>
      :
    </span>
  )
}

export default function LiveCounter({
  startDate,
  endDate,
  eventType,
  color = '#00A86B',
  size = 'md',
  showTotal = false,
}: LiveCounterProps) {
  const [diff, setDiff] = useState<TimeDiff | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const start = new Date(startDate)

      if (eventType === 'countup') {
        setDiff(calculateTimeDiff(start, now))
      } else {
        const end = endDate ? new Date(endDate) : now
        setDiff(calculateTimeDiff(now, end))
      }
    }

    update()
    intervalRef.current = setInterval(update, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [startDate, endDate, eventType])

  if (!diff) return null

  // Countdown bittiyse
  if (eventType === 'countdown' && diff.totalSeconds <= 0) {
    return (
      <div className="text-center">
        <span className="text-2xl font-bold" style={{ color }}>
          Tamamlandı!
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Ana sayaç */}
      <div className="flex items-start gap-1">
        {diff.years > 0 && (
          <>
            <TimeUnit value={diff.years} label="Yıl" color={color} size={size} />
            <Separator size={size} color={color} />
          </>
        )}
        {(diff.years > 0 || diff.months > 0) && (
          <>
            <TimeUnit value={diff.months} label="Ay" color={color} size={size} />
            <Separator size={size} color={color} />
          </>
        )}
        <TimeUnit value={diff.days} label="Gün" color={color} size={size} />
        <Separator size={size} color={color} />
        <TimeUnit value={diff.hours} label="Saat" color={color} size={size} />
        <Separator size={size} color={color} />
        <TimeUnit value={diff.minutes} label="Dk" color={color} size={size} />
        <Separator size={size} color={color} />
        <TimeUnit value={diff.seconds} label="Sn" color={color} size={size} />
      </div>

      {/* Toplam saniye */}
      {showTotal && (
        <div className="text-xs text-gray-500 tabular-nums">
          Toplam {diff.totalSeconds.toLocaleString('tr-TR')} saniye
          {diff.totalDays > 0 && ` · ${diff.totalDays.toLocaleString('tr-TR')} gün`}
        </div>
      )}
    </div>
  )
}
