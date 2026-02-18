'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  useEffect(() => { loadProfile() }, [])

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(data)
    setLoading(false)
  }

  const saveProfile = async () => {
    if (!profile) return
    setSaving(true)
    setMessage('')
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        company: profile.company,
        phone: profile.phone,
      })
      .eq('id', profile.id)

    setSaving(false)
    setMessage(error ? 'Hata: ' + error.message : 'Kaydedildi!')
    setTimeout(() => setMessage(''), 3000)
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Yükleniyor...</div>

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-white mb-6">Hesap Ayarları</h1>

      <div className="bg-happ-surface border border-happ-green/15 rounded-xl p-6 space-y-5">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Ad Soyad</label>
          <input
            type="text" value={profile?.full_name || ''}
            onChange={e => setProfile({ ...profile, full_name: e.target.value })}
            autoComplete="name"
            className="w-full px-4 py-2.5 bg-happ-dark border border-happ-green/20 rounded-lg text-white text-sm focus:outline-none focus:border-happ-yellow/50"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">E-posta</label>
          <input
            type="email" value={profile?.email || ''} disabled
            autoComplete="email"
            className="w-full px-4 py-2.5 bg-happ-dark/50 border border-happ-green/10 rounded-lg text-gray-500 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Firma</label>
          <input
            type="text" value={profile?.company || ''}
            onChange={e => setProfile({ ...profile, company: e.target.value })}
            autoComplete="organization"
            className="w-full px-4 py-2.5 bg-happ-dark border border-happ-green/20 rounded-lg text-white text-sm focus:outline-none focus:border-happ-yellow/50"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Telefon</label>
          <input
            type="tel" value={profile?.phone || ''}
            onChange={e => setProfile({ ...profile, phone: e.target.value })}
            autoComplete="tel" inputMode="tel"
            className="w-full px-4 py-2.5 bg-happ-dark border border-happ-green/20 rounded-lg text-white text-sm focus:outline-none focus:border-happ-yellow/50"
          />
        </div>

        <button
          onClick={saveProfile} disabled={saving}
          className="w-full py-3 bg-happ-yellow text-happ-dark font-bold rounded-lg hover:bg-yellow-400 disabled:opacity-50"
        >
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>

        {message && (
          <div className={`text-center text-sm ${message.startsWith('Hata') ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
