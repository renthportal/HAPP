'use client'

import Link from 'next/link'
import LiveCounter from './LiveCounter'
import { CATEGORIES } from '@/lib/timeCalculator'

interface TimeEvent {
  id: string
  title: string
  description?: string | null
  category: string
  event_type: 'countup' | 'countdown'
  start_date: string
  end_date?: string | null
  before_image_url?: string | null
  after_image_url?: string | null
  is_public: boolean
  color: string
  like_count: number
  view_count: number
  created_at: string
}

interface TimeCardProps {
  event: TimeEvent
  showActions?: boolean
}

export default function TimeCard({ event, showActions = true }: TimeCardProps) {
  const category = CATEGORIES[event.category] || CATEGORIES.general

  const hasImage = event.before_image_url || event.after_image_url
  const coverImage = event.after_image_url || event.before_image_url

  return (
    <Link
      href={`/dashboard/time-tracker/${event.id}`}
      className="group block bg-happ-surface border border-white/5 rounded-xl overflow-hidden hover:border-white/15 transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
    >
      {/* Görsel */}
      {hasImage && (
        <div className="relative h-36 overflow-hidden">
          <img
            src={coverImage!}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-happ-surface via-transparent to-transparent" />

          {/* Before/After badge */}
          {event.before_image_url && event.after_image_url && (
            <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-medium px-2 py-0.5 rounded">
              Önce / Sonra
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        {/* Üst bilgi satırı */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{category.icon}</span>
            <span className="text-xs text-gray-500">{category.label}</span>
          </div>
          <div className="flex items-center gap-2">
            {event.is_public ? (
              <span className="text-[10px] text-happ-greenLight bg-happ-greenLight/10 px-1.5 py-0.5 rounded">Herkese Açık</span>
            ) : (
              <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">Gizli</span>
            )}
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{
                color: event.event_type === 'countup' ? '#00A86B' : '#FFC72C',
                backgroundColor: event.event_type === 'countup' ? 'rgba(0,168,107,0.1)' : 'rgba(255,199,44,0.1)',
              }}
            >
              {event.event_type === 'countup' ? '▲ Sayaç' : '▼ Geri Sayım'}
            </span>
          </div>
        </div>

        {/* Başlık */}
        <h3 className="text-white font-semibold text-sm mb-1 truncate group-hover:text-happ-yellow transition-colors">
          {event.title}
        </h3>

        {/* Açıklama */}
        {event.description && (
          <p className="text-gray-500 text-xs mb-3 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Canlı sayaç */}
        <div className="py-2">
          <LiveCounter
            startDate={event.start_date}
            endDate={event.end_date}
            eventType={event.event_type}
            color={event.color}
            size="sm"
          />
        </div>

        {/* Alt bilgi */}
        {showActions && (
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5 text-xs text-gray-600">
            <div className="flex items-center gap-3">
              <span>❤️ {event.like_count}</span>
              <span>👁 {event.view_count}</span>
            </div>
            <span>
              {new Date(event.created_at).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
