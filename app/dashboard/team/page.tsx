'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const C = { dark: "#0A1F12", green: "#006838", greenLight: "#00A86B", yellow: "#FFC72C", red: "#DC2626", g300: "#94A89A", g500: "#475950", white: "#F0F4F1", orange: "#FF6B35" }

const ROLES = [
  { id: 'admin', label: 'Admin', desc: 'Tam yetki — kullanıcı yönetimi, ayarlar', color: '#DC2626' },
  { id: 'engineer', label: 'Vinç Mühendisi', desc: 'Proje oluştur, düzenle, onayla', color: '#FFC72C' },
  { id: 'planner', label: 'Planlayıcı', desc: 'Proje oluştur, düzenle', color: '#00A86B' },
  { id: 'viewer', label: 'İzleyici', desc: 'Sadece görüntüleme', color: '#94A89A' },
]

export default function TeamPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentRole, setCurrentRole] = useState('')
  const supabase = createClient()

  useEffect(() => { loadTeam() }, [])

  const loadTeam = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setCurrentRole(profile?.role || 'viewer')
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: true })
    setUsers(data || [])
    setLoading(false)
  }

  const updateRole = async (userId: string, newRole: string) => {
    if (currentRole !== 'admin') { alert('Yetkiniz yok'); return }
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
    setUsers(p => p.map(u => u.id === userId ? { ...u, role: newRole } : u))
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: C.g300 }}>Yükleniyor...</div>

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: C.yellow, letterSpacing: 3, margin: '0 0 4px' }}>Ekip Yönetimi</h1>
      <p style={{ fontSize: 12, color: C.g300, margin: '0 0 24px' }}>{users.length} kayıtlı kullanıcı</p>

      {currentRole !== 'admin' && (
        <div style={{ padding: 12, background: C.orange + '15', border: `1px solid ${C.orange}30`, borderRadius: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 11, color: C.orange }}>⚠ Kullanıcı rollerini değiştirmek için Admin yetkisi gereklidir. IT departmanı ile iletişime geçin.</span>
        </div>
      )}

      <div style={{ display: 'grid', gap: 8, marginBottom: 32 }}>
        {users.map(u => {
          const role = ROLES.find(r => r.id === u.role) || ROLES[3]
          return (
            <div key={u.id} style={{ background: C.dark + 'CC', border: `1px solid ${C.green}20`, borderRadius: 10, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: role.color + '25', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: role.color }}>
                  {(u.full_name || u.email || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.white }}>{u.full_name || 'İsimsiz'}</div>
                  <div style={{ fontSize: 10, color: C.g500 }}>{u.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 9, padding: '3px 10px', borderRadius: 12, background: role.color + '15', color: role.color, fontWeight: 600 }}>{role.label}</span>
                {currentRole === 'admin' && (
                  <select value={u.role || 'viewer'} onChange={e => updateRole(u.id, e.target.value)} style={{ padding: '4px 8px', background: C.dark, border: `1px solid ${C.g500}40`, borderRadius: 6, color: C.g300, fontSize: 10 }}>
                    {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                  </select>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 12 }}>Rol Tanımları</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
        {ROLES.map(r => (
          <div key={r.id} style={{ background: C.dark + 'CC', border: `1px solid ${r.color}20`, borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: r.color }}>{r.label}</div>
            <div style={{ fontSize: 10, color: C.g300, marginTop: 4 }}>{r.desc}</div>
          </div>
        ))}
      </div>

      {currentRole === 'admin' && (
        <div style={{ marginTop: 24, padding: 16, background: C.dark + 'CC', border: `1px solid ${C.green}20`, borderRadius: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 8 }}>Yeni Kullanıcı Ekleme</div>
          <p style={{ fontSize: 10, color: C.g300, margin: 0 }}>
            Yeni kullanıcı eklemek için Supabase Dashboard → Authentication → Users bölümünden "Create User" ile oluşturun. 
            Kullanıcı ilk girişte profiles tablosuna otomatik eklenir.
          </p>
        </div>
      )}
    </div>
  )
}
