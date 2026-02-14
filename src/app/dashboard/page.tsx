'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'

const HappApp = dynamic(() => import('@/components/happ/HappApp'), { 
  ssr: false,
  loading: () => (
    <div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0A1F12'}}>
      <div style={{textAlign:'center'}}>
        <div style={{color:'#FFC72C',fontWeight:900,fontSize:32,letterSpacing:6}}>HAPP</div>
        <div style={{color:'#6B7E70',fontSize:12,marginTop:8}}>Yükleniyor...</div>
      </div>
    </div>
  )
})

export default function DashboardPage() {
  const [projectId, setProjectId] = useState<string|null>(null)
  const [projectName, setProjectName] = useState('')
  const [initialData, setInitialData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const pid = searchParams.get('project')
    if (pid) loadProject(pid)
  }, [searchParams])

  const loadProject = async (pid: string) => {
    setLoading(true)
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('id', pid)
      .single()

    if (data) {
      setProjectId(data.id)
      setProjectName(data.name)
      setInitialData({
        config: data.config,
        objects: data.objects || [],
        rulers: data.rulers || [],
        lift_plan: data.lift_plan || {}
      })
    }
    setLoading(false)
  }

  const handleSave = useCallback(async (data: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Giriş yapılmamış')

    if (projectId) {
      const { error } = await supabase
        .from('projects')
        .update({
          config: data.config,
          objects: data.objects,
          rulers: data.rulers,
          lift_plan: data.lift_plan,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
      if (error) throw error
    } else {
      const name = prompt('Proje adı:') || 'Yeni Proje'
      const { data: newProject, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name,
          config: data.config,
          objects: data.objects,
          rulers: data.rulers,
          lift_plan: data.lift_plan,
          status: 'active'
        })
        .select()
        .single()

      if (error) throw error
      if (newProject) {
        setProjectId(newProject.id)
        setProjectName(name)
        window.history.replaceState(null, '', `/dashboard?project=${newProject.id}`)
      }
    }
  }, [projectId, supabase])

  if (loading) return (
    <div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0A1F12'}}>
      <div style={{color:'#FFC72C',fontWeight:900,fontSize:32,letterSpacing:6}}>HAPP</div>
    </div>
  )

  return <HappApp onSave={handleSave} initialData={initialData} projectName={projectName} />
}
