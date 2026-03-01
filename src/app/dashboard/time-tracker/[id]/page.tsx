'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CATEGORIES, formatTimeDiff, getEventTimeDiff } from '@/lib/timeCalculator'
import LiveCounter from '@/components/time-tracker/LiveCounter'
import BeforeAfterViewer from '@/components/time-tracker/BeforeAfterViewer'
import Link from 'next/link'

export default function TimeEventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const eventId = params.id as string

  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [liked, setLiked] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadEvent()
  }, [eventId])

  const loadEvent = async () => {
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('time_events')
      .select('*')
      .eq('id', eventId)
      .single()

    if (error || !data) {
      router.push('/dashboard/time-tracker')
      return
    }

    setEvent(data)
    setIsOwner(user?.id === data.user_id)

    // Beğeni kontrolü
    if (user) {
      const { data: likeData } = await supabase
        .from('time_event_likes')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .single()
      setLiked(!!likeData)
    }

    // Görüntülenme sayısı artır
    if (user?.id !== data.user_id) {
      await supabase
        .from('time_events')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', eventId)
    }

    setLoading(false)
  }

  const handleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (liked) {
      await supabase
        .from('time_event_likes')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id)

      await supabase
        .from('time_events')
        .update({ like_count: Math.max(0, (event.like_count || 0) - 1) })
        .eq('id', eventId)

      setEvent((prev: any) => ({ ...prev, like_count: Math.max(0, (prev.like_count || 0) - 1) }))
      setLiked(false)
    } else {
      await supabase
        .from('time_event_likes')
        .insert({ event_id: eventId, user_id: user.id })

      await supabase
        .from('time_events')
        .update({ like_count: (event.like_count || 0) + 1 })
        .eq('id', eventId)

      setEvent((prev: any) => ({ ...prev, like_count: (prev.like_count || 0) + 1 }))
      setLiked(true)
    }
  }

  const handleAfterImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}_after.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('time-tracker-media')
      .upload(fileName, file)

    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from('time-tracker-media')
        .getPublicUrl(fileName)

      await supabase
        .from('time_events')
        .update({ after_image_url: urlData.publicUrl })
        .eq('id', eventId)

      setEvent((prev: any) => ({ ...prev, after_image_url: urlData.publicUrl }))
    }

    setUploading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Bu olayı silmek istediğinize emin misiniz?')) return
    setDeleting(true)

    await supabase.from('time_events').delete().eq('id', eventId)
    router.push('/dashboard/time-tracker')
    router.refresh()
  }

  const handleTogglePublic = async () => {
    const newValue = !event.is_public
    await supabase
      .from('time_events')
      .update({ is_public: newValue })
      .eq('id', eventId)
    setEvent((prev: any) => ({ ...prev, is_public: newValue }))
  }

  const generateShareText = useCallback(() => {
    if (!event) return ''
    const diff = getEventTimeDiff(event.start_date, event.event_type, event.end_date)
    const timeText = formatTimeDiff(diff)
    if (event.event_type === 'countup') {
      return `${event.title} - ${timeText} oldu!`
    }
    return `${event.title} - ${timeText} kaldı!`
  }, [event])

  const handleShare = async () => {
    const text = generateShareText()
    if (navigator.share) {
      await navigator.share({ title: event.title, text })
    } else {
      await navigator.clipboard.writeText(text)
      alert('Panoya kopyalandı!')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-happ-greenLight border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!event) return null

  const category = CATEGORIES[event.category] || CATEGORIES.general

  return (
    <div className="max-w-3xl mx-auto p-4 lg:p-8">
      {/* Geri düğmesi */}
      <Link
        href="/dashboard/time-tracker"
        className="inline-flex items-center text-gray-500 hover:text-white text-sm mb-6 transition-colors"
      >
        ← Geri
      </Link>

      {/* Ana kart */}
      <div className="bg-happ-surface border border-white/5 rounded-2xl overflow-hidden">
        {/* Before/After görseli */}
        {(event.before_image_url || event.after_image_url) && (
          <BeforeAfterViewer
            beforeUrl={event.before_image_url}
            afterUrl={event.after_image_url}
            timeDiffLabel={formatTimeDiff(getEventTimeDiff(event.start_date, event.event_type, event.end_date))}
            size="lg"
          />
        )}

        <div className="p-6">
          {/* Meta bilgiler */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">{category.icon}</span>
            <span className="text-xs text-gray-500">{category.label}</span>
            <span className="text-gray-700">·</span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded"
              style={{
                color: event.event_type === 'countup' ? '#00A86B' : '#FFC72C',
                backgroundColor: event.event_type === 'countup' ? 'rgba(0,168,107,0.1)' : 'rgba(255,199,44,0.1)',
              }}
            >
              {event.event_type === 'countup' ? '▲ Sayaç' : '▼ Geri Sayım'}
            </span>
            {event.is_public ? (
              <span className="text-xs text-happ-greenLight bg-happ-greenLight/10 px-2 py-0.5 rounded ml-auto">
                Herkese Açık
              </span>
            ) : (
              <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded ml-auto">
                Gizli
              </span>
            )}
          </div>

          {/* Başlık ve açıklama */}
          <h1 className="text-2xl font-bold text-white mb-2">{event.title}</h1>
          {event.description && (
            <p className="text-gray-400 text-sm mb-6">{event.description}</p>
          )}

          {/* Canlı Sayaç - Büyük */}
          <div className="bg-happ-dark rounded-xl p-6 mb-6">
            <div className="text-center mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                {event.event_type === 'countup' ? 'Geçen Süre' : 'Kalan Süre'}
              </span>
            </div>
            <LiveCounter
              startDate={event.start_date}
              endDate={event.end_date}
              eventType={event.event_type}
              color={event.color}
              size="lg"
              showTotal
            />
            <div className="text-center mt-3">
              <span className="text-xs text-gray-600">
                Başlangıç: {new Date(event.start_date).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              {event.end_date && (
                <span className="text-xs text-gray-600 ml-4">
                  Bitiş: {new Date(event.end_date).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
            </div>
          </div>

          {/* After fotoğraf yükleme (sadece sahip görebilir) */}
          {isOwner && !event.after_image_url && (
            <div className="mb-6">
              <label className="flex flex-col items-center justify-center h-24 bg-happ-dark border border-dashed border-white/15 rounded-xl cursor-pointer hover:border-happ-greenLight/50 transition-colors">
                <span className="text-sm text-gray-500 mb-1">
                  {uploading ? 'Yükleniyor...' : '"Sonra" Fotoğrafı Ekle'}
                </span>
                <span className="text-xs text-gray-600">
                  İlerlemenizi görsel olarak karşılaştırın
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAfterImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          )}

          {/* Aksiyon butonları */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors ${
                liked
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-white/5 text-gray-400 border border-white/5 hover:text-red-400'
              }`}
            >
              {liked ? '❤️' : '🤍'} {event.like_count || 0}
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-white/5 text-gray-400 border border-white/5 hover:text-white transition-colors"
            >
              📤 Paylaş
            </button>

            <span className="text-xs text-gray-600 ml-auto">
              👁 {event.view_count || 0} görüntülenme
            </span>
          </div>

          {/* Sahip ayarları */}
          {isOwner && (
            <div className="flex items-center gap-3 pt-4 mt-4 border-t border-white/5">
              <button
                onClick={handleTogglePublic}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-white/5 text-gray-400 border border-white/5 hover:text-white transition-colors"
              >
                {event.is_public ? '🔒 Gizli Yap' : '🌍 Herkese Aç'}
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors ml-auto"
              >
                🗑️ {deleting ? 'Siliniyor...' : 'Sil'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
