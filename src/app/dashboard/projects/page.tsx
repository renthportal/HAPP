'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('id, name, status, updated_at, config')
      .order('updated_at', { ascending: false })
    setProjects(data || [])
    setLoading(false)
  }

  const createProject = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('projects')
      .insert({ user_id: user.id, name: 'Yeni Proje' })
      .select()
      .single()

    if (data) {
      setProjects([data, ...projects])
    }
  }

  const deleteProject = async (id: string) => {
    if (!confirm('Bu projeyi silmek istediğinize emin misiniz?')) return
    await supabase.from('projects').delete().eq('id', id)
    setProjects(projects.filter(p => p.id !== id))
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-500">Yükleniyor...</div>
    </div>
  )

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-white">Projeler</h1>
          <p className="text-sm text-gray-500">{projects.length} kayıtlı proje</p>
        </div>
        <button
          onClick={createProject}
          className="px-5 py-2.5 bg-happ-yellow text-happ-dark font-bold rounded-lg text-sm hover:bg-yellow-400"
        >
          + Yeni Proje
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📁</div>
          <p className="text-gray-400">Henüz proje yok</p>
          <p className="text-gray-600 text-sm mt-1">İlk projenizi oluşturun</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map(project => (
            <div
              key={project.id}
              className="bg-happ-surface border border-happ-green/15 rounded-xl p-5 flex items-center justify-between hover:border-happ-green/30 transition-colors"
            >
              <div className="flex-1">
                <h3 className="text-white font-medium">{project.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    project.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    project.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>{project.status}</span>
                  <span className="text-xs text-gray-600">
                    {new Date(project.updated_at).toLocaleDateString('tr-TR')}
                  </span>
                  {project.config?.craneType && (
                    <span className="text-xs text-gray-600">
                      {project.config.craneType} — {project.config.boomLength}m
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard?project=${project.id}`}
                  className="px-4 py-2 bg-happ-green/20 text-happ-green-light rounded-lg text-xs font-medium hover:bg-happ-green/30"
                >
                  Aç
                </Link>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="px-3 py-2 text-gray-600 hover:text-red-400 text-xs"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
