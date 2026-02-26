'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'

const HappApp = dynamic(() => import('@/components/happ/HappApp'), { ssr: false })

function DashboardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()
  const projectId = searchParams.get('project')
  const [projectData, setProjectData] = useState<any>(null)
  const [projectName, setProjectName] = useState('')
  const [loading, setLoading] = useState(true)
  const [appliedCraneConfig, setAppliedCraneConfig] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    if (projectId) {
      loadProject(projectId)
    } else {
      loadProjects()
    }
  }, [projectId])

  // Check if returning from crane-finder with applied config
  useEffect(() => {
    const applied = localStorage.getItem('happ_crane_finder_apply')
    if (applied) {
      localStorage.removeItem('happ_crane_finder_apply')
      try {
        const applyConfig = JSON.parse(applied)
        setAppliedCraneConfig(applyConfig)
      } catch { /* ignore */ }
    }
  }, [])

  const loadProject = async (id: string) => {
    const { data } = await supabase.from('projects').select('*').eq('id', id).single()
    if (data) { setProjectData(data); setProjectName(data.name); }
    setLoading(false)
  }

  const loadProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('id, name, status, updated_at, config')
      .order('updated_at', { ascending: false })
      .limit(20)
    setProjects(data || [])
    setLoading(false)
  }

  const handleSave = async (state: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    if (projectId && projectData) {
      await supabase.from('projects').update({
        config: state.config, objects: state.objects, rulers: state.rulers,
        lift_plan: state.lift_plan, updated_at: new Date().toISOString()
      }).eq('id', projectId)
    } else {
      const name = prompt('Proje adı:', 'Yeni Proje')
      if (!name) return
      const { data } = await supabase.from('projects').insert({
        user_id: user.id, name, config: state.config, objects: state.objects,
        rulers: state.rulers, lift_plan: state.lift_plan, status: 'active'
      }).select().single()
      if (data) router.push(`/dashboard?project=${data.id}`)
    }
  }

  const createNewProject = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('projects').insert({
      user_id: user.id, name: 'Yeni Proje', status: 'active'
    }).select().single()
    if (data) router.push(`/dashboard?project=${data.id}`)
  }

  const deleteProject = async (id: string) => {
    if (!confirm('Bu projeyi silmek istediğinize emin misiniz?')) return
    await supabase.from('projects').delete().eq('id', id)
    setProjects(projects.filter(p => p.id !== id))
  }

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}>
      <div style={{color:'#94A89A'}}>Yükleniyor...</div>
    </div>
  )

  // If a project is loaded, show HappApp
  if (projectId) {
    const effectiveInitialData = (() => {
      if (appliedCraneConfig && projectData) {
        return {
          config: { ...projectData.config, ...appliedCraneConfig },
          objects: projectData.objects,
          rulers: projectData.rulers,
          lift_plan: projectData.lift_plan,
        }
      }
      if (appliedCraneConfig && !projectData) {
        return { config: appliedCraneConfig }
      }
      if (projectData) {
        return { config: projectData.config, objects: projectData.objects, rulers: projectData.rulers, lift_plan: projectData.lift_plan }
      }
      return undefined
    })()

    return <HappApp onSave={handleSave} initialData={effectiveInitialData} projectName={projectName} />
  }

  // No project loaded — show project launcher
  return (
    <div style={{minHeight:'100vh',background:'#0A1F12',padding:'24px 16px'}}>
      <div style={{maxWidth:700,margin:'0 auto'}}>
        {/* Header */}
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{fontSize:36,marginBottom:8}}>📐</div>
          <h1 style={{color:'#FFDC00',fontSize:22,fontWeight:800,letterSpacing:4,marginBottom:4}}>Hangel</h1>
          <p style={{color:'#6B7E70',fontSize:13}}>Vinç Planlama Sistemi</p>
        </div>

        {/* New Project Button */}
        <button
          onClick={createNewProject}
          style={{
            width:'100%',padding:'16px',marginBottom:24,
            background:'linear-gradient(135deg,#004D2A,#00873E)',
            border:'2px solid #FFDC0040',borderRadius:12,
            color:'#FFDC00',fontSize:15,fontWeight:700,
            cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,
          }}
        >
          <span style={{fontSize:20}}>+</span> Yeni Menzil Şeması
        </button>

        {/* Projects List */}
        {projects.length > 0 && (
          <>
            <div style={{color:'#94A89A',fontSize:12,fontWeight:600,marginBottom:12,textTransform:'uppercase',letterSpacing:1}}>
              Kayıtlı Projeler ({projects.length})
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {projects.map(project => (
                <div
                  key={project.id}
                  style={{
                    background:'#0D2B16',border:'1px solid #00873E25',borderRadius:10,
                    padding:'14px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',
                    cursor:'pointer',transition:'border-color 0.2s',
                  }}
                  onClick={() => router.push(`/dashboard?project=${project.id}`)}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#00873E60')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#00873E25')}
                >
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{color:'white',fontSize:14,fontWeight:600,marginBottom:4,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {project.name}
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                      <span style={{
                        fontSize:10,padding:'2px 8px',borderRadius:10,
                        background: project.status === 'active' ? '#00873E30' : '#6B7E7030',
                        color: project.status === 'active' ? '#00D46A' : '#6B7E70',
                      }}>
                        {project.status === 'active' ? 'Aktif' : project.status === 'completed' ? 'Tamamlandı' : project.status}
                      </span>
                      <span style={{fontSize:11,color:'#6B7E70'}}>
                        {new Date(project.updated_at).toLocaleDateString('tr-TR', { day:'numeric', month:'short', year:'numeric' })}
                      </span>
                      {project.config?.craneType && (
                        <span style={{fontSize:11,color:'#6B7E70'}}>
                          {project.config.craneType} — {project.config.boomLength}m
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:6,marginLeft:8}}>
                    <span style={{color:'#00873E',fontSize:18}}>→</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                      style={{
                        background:'transparent',border:'none',color:'#6B7E70',fontSize:14,
                        cursor:'pointer',padding:'4px 6px',borderRadius:6,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#FF4444')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#6B7E70')}
                      title="Projeyi sil"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {projects.length === 0 && (
          <div style={{textAlign:'center',padding:'40px 0'}}>
            <div style={{fontSize:40,marginBottom:12}}>📁</div>
            <p style={{color:'#6B7E70',fontSize:14}}>Henüz proje yok</p>
            <p style={{color:'#4A5E50',fontSize:12,marginTop:4}}>Yukarıdaki butona tıklayarak ilk projenizi oluşturun</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}><div style={{color:'#94A89A'}}>Yükleniyor...</div></div>}>
      <DashboardContent />
    </Suspense>
  )
}
