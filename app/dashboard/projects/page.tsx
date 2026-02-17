'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const C = { dark: "#0A1F12", green: "#006838", greenLight: "#00A86B", yellow: "#FFC72C", red: "#DC2626", g300: "#94A89A", g500: "#475950", white: "#F0F4F1" }

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => { loadProjects() }, [])

  const loadProjects = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }
    const { data } = await supabase.from('projects').select('*').eq('user_id', user.id).order('updated_at', { ascending: false })
    setProjects(data || [])
    setLoading(false)
  }

  const deleteProject = async (id: string, name: string) => {
    if (!confirm(`"${name}" projesini silmek istediğinize emin misiniz?`)) return
    await supabase.from('projects').delete().eq('id', id)
    setProjects(p => p.filter(x => x.id !== id))
  }

  const duplicateProject = async (proj: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('projects').insert({
      user_id: user.id, name: proj.name + ' (Kopya)',
      config: proj.config, objects: proj.objects, rulers: proj.rulers,
      lift_plan: proj.lift_plan, status: 'active'
    }).select().single()
    if (data) setProjects(p => [data, ...p])
  }

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter)

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: C.g300 }}>Yükleniyor...</div>

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.yellow, letterSpacing: 3, margin: 0 }}>Projeler</h1>
          <p style={{ fontSize: 12, color: C.g300, margin: '4px 0 0' }}>{projects.length} proje kayıtlı</p>
        </div>
        <button onClick={() => router.push('/dashboard')} style={{ padding: '8px 16px', background: C.yellow, border: 'none', borderRadius: 8, color: C.dark, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
          + Yeni Proje
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['all', 'active', 'completed', 'archived'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '4px 12px', borderRadius: 6, border: `1px solid ${filter === f ? C.yellow : C.g500}40`, background: filter === f ? C.yellow + '15' : 'transparent', color: filter === f ? C.yellow : C.g300, fontSize: 10, cursor: 'pointer', fontWeight: 600 }}>
            {f === 'all' ? 'Tümü' : f === 'active' ? 'Aktif' : f === 'completed' ? 'Tamamlanan' : 'Arşiv'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: C.g500 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
          <div style={{ fontSize: 14 }}>Henüz proje yok</div>
          <div style={{ fontSize: 11, marginTop: 4 }}>Menzil Şeması'nda "Kaydet" ile yeni proje oluşturun</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {filtered.map(p => (
            <div key={p.id} style={{ background: C.dark + 'CC', border: `1px solid ${C.green}20`, borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = C.yellow + '60')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = C.green + '20')}>
              <div onClick={() => router.push(`/dashboard?project=${p.id}`)} style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.white }}>{p.name || 'İsimsiz Proje'}</div>
                <div style={{ fontSize: 10, color: C.g300, marginTop: 4 }}>
                  {p.config?.craneType && `Vinç: ${p.config.craneType}`}
                  {p.config?.boomLength && ` | Boom: ${p.config.boomLength}m`}
                  {p.lift_plan?.client && ` | Müşteri: ${p.lift_plan.client}`}
                </div>
                <div style={{ fontSize: 9, color: C.g500, marginTop: 4 }}>
                  Son güncelleme: {p.updated_at ? new Date(p.updated_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button onClick={() => router.push(`/dashboard?project=${p.id}`)} style={{ padding: '4px 10px', background: C.green + '25', border: `1px solid ${C.green}40`, borderRadius: 6, color: C.greenLight, fontSize: 9, cursor: 'pointer' }}>Aç</button>
                <button onClick={() => duplicateProject(p)} style={{ padding: '4px 10px', background: C.g500 + '25', border: `1px solid ${C.g500}40`, borderRadius: 6, color: C.g300, fontSize: 9, cursor: 'pointer' }}>Kopya</button>
                <button onClick={() => deleteProject(p.id, p.name)} style={{ padding: '4px 10px', background: C.red + '15', border: `1px solid ${C.red}30`, borderRadius: 6, color: C.red, fontSize: 9, cursor: 'pointer' }}>Sil</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
