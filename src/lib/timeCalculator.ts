/**
 * Zaman İzleyici - Hassas Zaman Hesaplama Fonksiyonları
 */

export interface TimeDiff {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
  totalDays: number
  isPast: boolean // geçmişe mi yoksa geleceğe mi bakıyoruz
}

/**
 * İki tarih arasındaki farkı yıl, ay, gün, saat, dakika, saniye olarak hesaplar.
 * Negatif fark = gelecekteki bir tarih (geri sayım)
 */
export function calculateTimeDiff(from: Date, to: Date): TimeDiff {
  const isPast = from <= to
  const [start, end] = isPast ? [from, to] : [to, from]

  let years = end.getFullYear() - start.getFullYear()
  let months = end.getMonth() - start.getMonth()
  let days = end.getDate() - start.getDate()
  let hours = end.getHours() - start.getHours()
  let minutes = end.getMinutes() - start.getMinutes()
  let seconds = end.getSeconds() - start.getSeconds()

  if (seconds < 0) {
    seconds += 60
    minutes--
  }
  if (minutes < 0) {
    minutes += 60
    hours--
  }
  if (hours < 0) {
    hours += 24
    days--
  }
  if (days < 0) {
    // Önceki ayın gün sayısını al
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0)
    days += prevMonth.getDate()
    months--
  }
  if (months < 0) {
    months += 12
    years--
  }

  const diffMs = Math.abs(end.getTime() - start.getTime())
  const totalSeconds = Math.floor(diffMs / 1000)
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    totalDays,
    isPast,
  }
}

/**
 * Sayaç tipi bir event için şu anki zamanla arasındaki farkı hesaplar
 */
export function getEventTimeDiff(
  startDate: string | Date,
  eventType: 'countup' | 'countdown',
  endDate?: string | Date | null
): TimeDiff {
  const now = new Date()
  const start = new Date(startDate)

  if (eventType === 'countup') {
    return calculateTimeDiff(start, now)
  } else {
    const end = endDate ? new Date(endDate) : now
    return calculateTimeDiff(now, end)
  }
}

/**
 * Zaman farkını okunabilir Türkçe string'e çevirir
 */
export function formatTimeDiff(diff: TimeDiff): string {
  const parts: string[] = []
  if (diff.years > 0) parts.push(`${diff.years} yıl`)
  if (diff.months > 0) parts.push(`${diff.months} ay`)
  if (diff.days > 0) parts.push(`${diff.days} gün`)
  if (diff.hours > 0) parts.push(`${diff.hours} saat`)
  if (diff.minutes > 0) parts.push(`${diff.minutes} dk`)
  if (diff.seconds >= 0) parts.push(`${diff.seconds} sn`)
  return parts.join(' ')
}

/**
 * Zaman farkını kompakt formatta gösterir
 */
export function formatTimeDiffCompact(diff: TimeDiff): string {
  if (diff.years > 0) {
    return `${diff.years}y ${diff.months}a ${diff.days}g`
  }
  if (diff.months > 0) {
    return `${diff.months}a ${diff.days}g ${diff.hours}s`
  }
  if (diff.days > 0) {
    return `${diff.days}g ${diff.hours}s ${diff.minutes}dk`
  }
  return `${String(diff.hours).padStart(2, '0')}:${String(diff.minutes).padStart(2, '0')}:${String(diff.seconds).padStart(2, '0')}`
}

/**
 * Toplam saniyeyi formatlar (Örn: "1,234,567 saniye")
 */
export function formatTotalSeconds(totalSeconds: number): string {
  return totalSeconds.toLocaleString('tr-TR') + ' saniye'
}

/**
 * Önemli eşikleri kontrol eder
 */
export function checkMilestones(totalSeconds: number): string[] {
  const milestones: string[] = []
  const totalDays = Math.floor(totalSeconds / 86400)

  // Gün eşikleri
  const dayMilestones = [1, 7, 30, 100, 365, 500, 1000, 1825, 3650]
  for (const d of dayMilestones) {
    if (totalDays === d) milestones.push(`${d} gün`)
  }

  // Saniye eşikleri
  const secondMilestones = [1_000_000, 10_000_000, 100_000_000, 1_000_000_000]
  for (const s of secondMilestones) {
    if (totalSeconds >= s && totalSeconds < s + 1) {
      milestones.push(`${(s / 1_000_000).toFixed(0)}M saniye`)
    }
  }

  return milestones
}

/**
 * Kategorilerin Türkçe karşılıkları ve ikonları
 */
export const CATEGORIES: Record<string, { label: string; icon: string }> = {
  general: { label: 'Genel', icon: '📌' },
  health: { label: 'Sağlık', icon: '❤️' },
  fitness: { label: 'Fitness', icon: '💪' },
  education: { label: 'Eğitim', icon: '📚' },
  career: { label: 'Kariyer', icon: '💼' },
  relationship: { label: 'İlişki', icon: '💑' },
  hobby: { label: 'Hobi', icon: '🎨' },
  travel: { label: 'Seyahat', icon: '✈️' },
  milestone: { label: 'Dönüm Noktası', icon: '🏆' },
  other: { label: 'Diğer', icon: '📎' },
}

/**
 * Renk seçenekleri
 */
export const COLOR_OPTIONS = [
  { value: '#00A86B', label: 'Yeşil' },
  { value: '#FFC72C', label: 'Sarı' },
  { value: '#FF6B35', label: 'Turuncu' },
  { value: '#00BCD4', label: 'Cyan' },
  { value: '#DC2626', label: 'Kırmızı' },
  { value: '#8B5CF6', label: 'Mor' },
  { value: '#EC4899', label: 'Pembe' },
  { value: '#3B82F6', label: 'Mavi' },
]
