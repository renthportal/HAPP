'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import TimeCard from '@/components/time-tracker/TimeCard'
import Link from 'next/link'

export default function ExploreTimeEventsPage() {
  const supabase = createClient()
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPublicEvents()
  }, [])

  const loadPublicEvents = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('time_events')
      .select('*')
      .eq('is_public', true)
      .order('like_count', { ascending: false })
      .limit(50)

    if (!error && data) {
      setEvents(data)
    }
    setLoading(false)
  }

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Keşfet</h1>
          <p className="text-sm text-gray-500 mt-1">
            Diğer kullanıcıların herkese açık zaman olayları
          </p>
        </div>
        <Link
          href="/dashboard/time-tracker"
          className="text-sm text-gray-500 hover:text-white transition-colors"
        >
          ← Olaylarım
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-happ-greenLight border-t-transparent rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🌍</div>
          <h3 className="text-lg font-semibold text-white mb-2">Henüz paylaşılan olay yok</h3>
          <p className="text-sm text-gray-500">
            İlk herkese açık olayı sen oluştur!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <TimeCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
