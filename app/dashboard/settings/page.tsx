'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const C = { dark: "#0A1F12", green: "#006838", greenLight: "#00A86B", yellow: "#FFC72C", g300: "#94A89A", g500: "#475950", white: "#F0F4F1", orange: "#FF6B35" }

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ full_name: '', phone: '', department: '' })
  const supabase = createClient()

  useEffect(() => { loadProfile() }, [])

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (data) {
      setProfile(data)
      setForm({ full_name: data.full_name || '', phone: data.phone || '', department: data.department || '' })
    }
    setLoading(false)
  }

  const saveProfile = async () => {
    if (!profile) return
    setSaving(true)
    await supabase.from('profiles').update({ full_name: form.full_name, phone: form.phone, department: form.department }).eq('id', profile.id)
    setSaving(false)
    alert('Profil güncellendi')
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: C.g300 }}>Yükleniyor...</div>

  const inputStyle = { width: '100%', padding: '8px 12px', background: C.dark, border: `1px solid ${C.green}30`, borderRadius: 6, color: C.white, fontSize: 12, boxSizing: 'border-box' as const }

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: C.yellow, letterSpacing: 3, margin: '0 0 24px' }}>Ayarlar</h1>

      <div style={{ background: C.dark + 'CC', border: `1px solid ${C.green}20`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: C.white, marginTop: 0, marginBottom: 16 }}>Profil Bilgileri</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <label style={{ fontSize: 10, color: C.g300, display: 'block', marginBottom: 4 }}>Ad Soyad</label>
            <input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 10, color: C.g300, display: 'block', marginBottom: 4 }}>Telefon</label>
            <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 10, color: C.g300, display: 'block', marginBottom: 4 }}>Departman</label>
            <input value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 10, color: C.g300, display: 'block', marginBottom: 4 }}>E-posta</label>
            <input value={profile?.email || ''} disabled style={{ ...inputStyle, opacity: 0.5 }} />
          </div>
          <div>
            <label style={{ fontSize: 10, color: C.g300, display: 'block', marginBottom: 4 }}>Rol</label>
            <input value={profile?.role || 'viewer'} disabled style={{ ...inputStyle, opacity: 0.5 }} />
            <div style={{ fontSize: 9, color: C.g500, marginTop: 2 }}>Rol değişikliği için Admin ile iletişime geçin</div>
          </div>
        </div>
        <button onClick={saveProfile} disabled={saving} style={{ marginTop: 16, padding: '8px 20px', background: C.yellow, border: 'none', borderRadius: 8, color: C.dark, fontWeight: 700, fontSize: 12, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>

      <div style={{ background: C.dark + 'CC', border: `1px solid ${C.green}20`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: C.white, marginTop: 0, marginBottom: 12 }}>Sistem Bilgileri</h2>
        <div style={{ display: 'grid', gap: 8 }}>
          {[
            ['Versiyon', 'Hangle v5.3'],
            ['Platform', 'Next.js + Supabase'],
            ['Vinç Tipleri', '12 tip destekleniyor'],
            ['Yük Tabloları', '5 dahili + CSV import'],
            ['Destek', 'IT Departmanı'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${C.green}10` }}>
              <span style={{ fontSize: 11, color: C.g300 }}>{k}</span>
              <span style={{ fontSize: 11, color: C.white, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: C.dark + 'CC', border: `1px solid ${C.orange}20`, borderRadius: 12, padding: 20 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: C.orange, marginTop: 0, marginBottom: 8 }}>Veri Yönetimi</h2>
        <p style={{ fontSize: 10, color: C.g300, margin: '0 0 12px' }}>Proje verilerinizi JSON olarak dışa aktarabilirsiniz. Her projede Dışa Aktar → JSON butonunu kullanın.</p>
        <p style={{ fontSize: 9, color: C.g500, margin: 0 }}>
          Toplu veri silme, veri tabanı yedekleme ve geri yükleme işlemleri Supabase Dashboard üzerinden yapılabilir.
        </p>
      </div>
    </div>
  )
}
