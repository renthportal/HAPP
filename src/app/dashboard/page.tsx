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
  const [loading, setLoading] = useState(!!projectId)
  const [appliedCraneConfig, setAppliedCraneConfig] = useState<any>(null)

  useEffect(() => {
    if (projectId) loadProject(projectId)
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

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}><div style={{color:'#94A89A'}}>Yükleniyor...</div></div>

  // Merge applied crane config into initial data
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

export default function DashboardPage() {
  return <Suspense fallback={<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}><div style={{color:'#94A89A'}}>Yükleniyor...</div></div>}><DashboardContent /></Suspense>
}
