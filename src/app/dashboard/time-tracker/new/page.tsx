'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CATEGORIES, COLOR_OPTIONS } from '@/lib/timeCalculator'
import Link from 'next/link'

export default function NewTimeEventPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('general')
  const [eventType, setEventType] = useState<'countup' | 'countdown'>('countup')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [color, setColor] = useState('#00A86B')
  const [beforeImage, setBeforeImage] = useState<File | null>(null)
  const [beforePreview, setBeforePreview] = useState('')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBeforeImage(file)
      const reader = new FileReader()
      reader.onloadend = () => setBeforePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Oturum bulunamadı')

      // Tarih oluştur
      const startDateTime = new Date(`${startDate}T${startTime || '00:00'}`)
      let endDateTime: Date | null = null
      if (eventType === 'countdown' && endDate) {
        endDateTime = new Date(`${endDate}T${endTime || '00:00'}`)
      }

      // Doğrulama
      if (!title.trim()) throw new Error('Başlık gerekli')
      if (!startDate) throw new Error('Başlangıç tarihi gerekli')
      if (eventType === 'countdown' && !endDate) throw new Error('Geri sayım için bitiş tarihi gerekli')

      // Fotoğraf yükle
      let beforeImageUrl: string | null = null
      if (beforeImage) {
        const fileExt = beforeImage.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}_before.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('time-tracker-media')
          .upload(fileName, beforeImage)

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('time-tracker-media')
            .getPublicUrl(fileName)
          beforeImageUrl = urlData.publicUrl
        }
      }

      // Kaydet
      const { error: insertError } = await supabase
        .from('time_events')
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          category,
          event_type: eventType,
          start_date: startDateTime.toISOString(),
          end_date: endDateTime?.toISOString() || null,
          before_image_url: beforeImageUrl,
          is_public: isPublic,
          color,
        })

      if (insertError) throw insertError

      router.push('/dashboard/time-tracker')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard/time-tracker"
          className="text-gray-500 hover:text-white transition-colors text-sm"
        >
          ← Geri
        </Link>
        <h1 className="text-xl font-bold text-white">Yeni Zaman Olayı</h1>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Olay Tipi */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Olay Tipi</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setEventType('countup')}
              className={`p-4 rounded-xl border text-left transition-all ${
                eventType === 'countup'
                  ? 'border-happ-greenLight bg-happ-greenLight/10 text-white'
                  : 'border-white/10 bg-happ-surface text-gray-400 hover:border-white/20'
              }`}
            >
              <div className="text-lg mb-1">▲ Sayaç</div>
              <div className="text-xs opacity-70">Geçmişten bugüne ne kadar süre geçti?</div>
              <div className="text-[10px] mt-2 opacity-50">Örn: Sigarayı bırakalı, spor başlayalı...</div>
            </button>
            <button
              type="button"
              onClick={() => setEventType('countdown')}
              className={`p-4 rounded-xl border text-left transition-all ${
                eventType === 'countdown'
                  ? 'border-happ-yellow bg-happ-yellow/10 text-white'
                  : 'border-white/10 bg-happ-surface text-gray-400 hover:border-white/20'
              }`}
            >
              <div className="text-lg mb-1">▼ Geri Sayım</div>
              <div className="text-xs opacity-70">Bir hedefe ne kadar süre kaldı?</div>
              <div className="text-[10px] mt-2 opacity-50">Örn: Mezuniyet, düğün, tatil...</div>
            </button>
          </div>
        </div>

        {/* Başlık */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Başlık *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Örn: Sigarayı bıraktığım gün"
            className="w-full bg-happ-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-happ-greenLight transition-colors"
            maxLength={100}
            required
          />
        </div>

        {/* Açıklama */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Açıklama</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Bu olay hakkında bir not..."
            rows={3}
            className="w-full bg-happ-dark border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-happ-greenLight transition-colors resize-none"
            maxLength={500}
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Kategori</label>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <button
                type="button"
                key={key}
                onClick={() => setCategory(key)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-all ${
                  category === key
                    ? 'border-happ-greenLight bg-happ-greenLight/10 text-white'
                    : 'border-white/5 bg-happ-surface text-gray-500 hover:border-white/15'
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span className="truncate w-full text-center">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tarihler */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {eventType === 'countup' ? 'Başlangıç Tarihi *' : 'Başlangıç Tarihi *'}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-happ-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-happ-greenLight transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Saat</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-happ-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-happ-greenLight transition-colors"
            />
          </div>
        </div>

        {eventType === 'countdown' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Bitiş Tarihi *</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-happ-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-happ-greenLight transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Saat</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-happ-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-happ-greenLight transition-colors"
              />
            </div>
          </div>
        )}

        {/* Renk */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Sayaç Rengi</label>
          <div className="flex gap-2">
            {COLOR_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setColor(opt.value)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  color === opt.value ? 'border-white scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: opt.value }}
                title={opt.label}
              />
            ))}
          </div>
        </div>

        {/* Before Fotoğraf */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            {eventType === 'countup' ? '"Önce" Fotoğrafı' : 'Başlangıç Fotoğrafı'}
          </label>
          {beforePreview ? (
            <div className="relative rounded-lg overflow-hidden h-48">
              <img src={beforePreview} alt="Önizleme" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => { setBeforeImage(null); setBeforePreview('') }}
                className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded hover:bg-black/90"
              >
                Kaldır
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-32 bg-happ-dark border border-dashed border-white/15 rounded-lg cursor-pointer hover:border-white/30 transition-colors">
              <span className="text-2xl text-gray-600 mb-1">📷</span>
              <span className="text-xs text-gray-600">Fotoğraf seç veya sürükle</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Görünürlük */}
        <div className="flex items-center justify-between bg-happ-dark border border-white/10 rounded-lg px-4 py-3">
          <div>
            <div className="text-sm text-white">Herkese Açık</div>
            <div className="text-xs text-gray-600">Diğer kullanıcılar görebilir ve beğenebilir</div>
          </div>
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className={`w-12 h-6 rounded-full transition-colors ${
              isPublic ? 'bg-happ-greenLight' : 'bg-gray-700'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
              isPublic ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-happ-greenLight hover:bg-happ-green text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Kaydediliyor...' : 'Olay Oluştur'}
        </button>
      </form>
    </div>
  )
}
