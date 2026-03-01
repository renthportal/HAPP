'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import TimeCard from '@/components/time-tracker/TimeCard'

type FilterType = 'all' | 'countup' | 'countdown'
type SortType = 'newest' | 'oldest' | 'popular'

export default function TimeTrackerPage() {
  const supabase = createClient()

  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [sort, setSort] = useState<SortType>('newest')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadEvents()
  }, [filter, sort])

  const loadEvents = async () => {
    setLoading(true)

    let query = supabase
      .from('time_events')
      .select('*')

    // Filtre
    if (filter !== 'all') {
      query = query.eq('event_type', filter)
    }

    // Sıralama
    switch (sort) {
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'popular':
        query = query.order('like_count', { ascending: false })
        break
    }

    const { data, error } = await query

    if (!error && data) {
      setEvents(data)
    }
    setLoading(false)
  }

  // Arama filtresi (client-side)
  const filteredEvents = events.filter((event) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      event.title.toLowerCase().includes(q) ||
      (event.description && event.description.toLowerCase().includes(q))
    )
  })

  const countupCount = events.filter((e) => e.event_type === 'countup').length
  const countdownCount = events.filter((e) => e.event_type === 'countdown').length

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Zaman İzleyici</h1>
          <p className="text-sm text-gray-500 mt-1">
            Hayatındaki önemli anları ve hedefleri takip et
          </p>
        </div>
        <Link
          href="/dashboard/time-tracker/new"
          className="inline-flex items-center justify-center gap-2 bg-happ-greenLight hover:bg-happ-green text-white font-medium px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          <span className="text-lg">+</span>
          Yeni Olay
        </Link>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-happ-surface border border-white/5 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{events.length}</div>
          <div className="text-xs text-gray-500 mt-1">Toplam</div>
        </div>
        <div className="bg-happ-surface border border-white/5 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-happ-greenLight">{countupCount}</div>
          <div className="text-xs text-gray-500 mt-1">Sayaç ▲</div>
        </div>
        <div className="bg-happ-surface border border-white/5 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-happ-yellow">{countdownCount}</div>
          <div className="text-xs text-gray-500 mt-1">Geri Sayım ▼</div>
        </div>
      </div>

      {/* Arama ve Filtreler */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Arama */}
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Olay ara..."
            className="w-full bg-happ-dark border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-happ-greenLight transition-colors"
          />
        </div>

        {/* Filtre */}
        <div className="flex gap-2">
          {([
            { key: 'all', label: 'Tümü' },
            { key: 'countup', label: '▲ Sayaç' },
            { key: 'countdown', label: '▼ Geri Sayım' },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                filter === key
                  ? 'bg-happ-greenLight/20 text-happ-greenLight border border-happ-greenLight/30'
                  : 'bg-happ-surface text-gray-500 border border-white/5 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sıralama */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortType)}
          className="bg-happ-surface border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-400 focus:outline-none"
        >
          <option value="newest">En Yeni</option>
          <option value="oldest">En Eski</option>
          <option value="popular">Popüler</option>
        </select>
      </div>

      {/* Event Listesi */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-happ-greenLight border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">⏱️</div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {searchQuery ? 'Sonuç bulunamadı' : 'Henüz olay eklenmemiş'}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {searchQuery
              ? 'Farklı bir arama terimi deneyin'
              : 'Hayatındaki önemli anları ve hedefleri takip etmeye başla'}
          </p>
          {!searchQuery && (
            <Link
              href="/dashboard/time-tracker/new"
              className="inline-flex items-center gap-2 bg-happ-greenLight hover:bg-happ-green text-white font-medium px-6 py-3 rounded-xl transition-colors text-sm"
            >
              İlk Olayını Oluştur
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <TimeCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
