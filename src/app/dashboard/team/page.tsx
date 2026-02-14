'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TeamPage() {
  const [teams, setTeams] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [activeTeam, setActiveTeam] = useState<string | null>(null)
  const [newTeamName, setNewTeamName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => { loadTeams() }, [])

  const loadTeams = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: memberships } = await supabase
      .from('team_members')
      .select('*, teams(*)')
      .eq('user_id', user.id)

    const teamList = memberships?.map(m => ({ ...m.teams, myRole: m.role })) || []
    setTeams(teamList)
    if (teamList.length > 0 && !activeTeam) {
      setActiveTeam(teamList[0].id)
      loadMembers(teamList[0].id)
    }
    setLoading(false)
  }

  const loadMembers = async (teamId: string) => {
    const { data } = await supabase
      .from('team_members')
      .select('*, profiles(full_name, email, avatar_url)')
      .eq('team_id', teamId)
      .order('role')
    setMembers(data || [])
  }

  const createTeam = async () => {
    if (!newTeamName.trim()) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('teams')
      .insert({ name: newTeamName.trim(), owner_id: user.id })
      .select()
      .single()

    if (data) {
      setNewTeamName('')
      loadTeams()
    }
  }

  const inviteMember = async () => {
    if (!inviteEmail.trim() || !activeTeam) return

    // E-posta ile kullanıcı bul
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', inviteEmail.trim())
      .single()

    if (!profile) {
      alert('Bu e-posta ile kayıtlı kullanıcı bulunamadı')
      return
    }

    const { error } = await supabase
      .from('team_members')
      .insert({ team_id: activeTeam, user_id: profile.id, role: 'member' })

    if (error) {
      alert(error.message)
    } else {
      setInviteEmail('')
      loadMembers(activeTeam)
    }
  }

  const removeMember = async (memberId: string) => {
    if (!confirm('Bu üyeyi takımdan çıkarmak istediğinize emin misiniz?')) return
    await supabase.from('team_members').delete().eq('id', memberId)
    if (activeTeam) loadMembers(activeTeam)
  }

  const updateRole = async (memberId: string, newRole: string) => {
    await supabase.from('team_members').update({ role: newRole }).eq('id', memberId)
    if (activeTeam) loadMembers(activeTeam)
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Yükleniyor...</div>

  const currentTeam = teams.find(t => t.id === activeTeam)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold text-white mb-6">Takım Yönetimi</h1>

      {/* Takım oluştur */}
      <div className="bg-happ-surface border border-happ-green/15 rounded-xl p-5 mb-6">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Yeni Takım Oluştur</h3>
        <div className="flex gap-3">
          <input
            type="text" placeholder="Takım adı" value={newTeamName}
            onChange={e => setNewTeamName(e.target.value)}
            className="flex-1 px-4 py-2 bg-happ-dark border border-happ-green/20 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-happ-yellow/50"
          />
          <button onClick={createTeam} className="px-5 py-2 bg-happ-yellow text-happ-dark font-bold rounded-lg text-sm">
            Oluştur
          </button>
        </div>
      </div>

      {/* Takımlar listesi */}
      {teams.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">👥</div>
          <p className="text-gray-400">Henüz bir takımınız yok</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sol: Takım listesi */}
          <div className="space-y-2">
            {teams.map(team => (
              <button
                key={team.id}
                onClick={() => { setActiveTeam(team.id); loadMembers(team.id) }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors ${
                  activeTeam === team.id
                    ? 'bg-happ-yellow/10 border border-happ-yellow/30 text-happ-yellow'
                    : 'bg-happ-surface border border-happ-green/15 text-gray-400 hover:text-white'
                }`}
              >
                <div className="font-medium">{team.name}</div>
                <div className="text-xs opacity-60 mt-0.5">Rol: {team.myRole}</div>
              </button>
            ))}
          </div>

          {/* Sağ: Üyeler */}
          <div className="lg:col-span-2">
            {currentTeam && (
              <div className="bg-happ-surface border border-happ-green/15 rounded-xl p-5">
                <h3 className="text-white font-medium mb-4">{currentTeam.name} — Üyeler</h3>

                {/* Davet */}
                {(currentTeam.myRole === 'owner' || currentTeam.myRole === 'admin') && (
                  <div className="flex gap-3 mb-5">
                    <input
                      type="email" placeholder="E-posta ile davet et" value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      className="flex-1 px-4 py-2 bg-happ-dark border border-happ-green/20 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none"
                    />
                    <button onClick={inviteMember} className="px-4 py-2 bg-happ-green text-white rounded-lg text-sm font-medium">
                      Davet Et
                    </button>
                  </div>
                )}

                {/* Üye listesi */}
                <div className="space-y-2">
                  {members.map(member => (
                    <div key={member.id} className="flex items-center justify-between py-3 px-3 bg-happ-dark/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-happ-green/20 flex items-center justify-center text-xs font-bold text-happ-green-light">
                          {(member.profiles?.full_name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm text-white">{member.profiles?.full_name || 'İsimsiz'}</div>
                          <div className="text-xs text-gray-600">{member.profiles?.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {currentTeam.myRole === 'owner' && member.role !== 'owner' ? (
                          <>
                            <select
                              value={member.role}
                              onChange={e => updateRole(member.id, e.target.value)}
                              className="bg-happ-dark border border-happ-green/20 text-gray-300 text-xs rounded-lg px-2 py-1"
                            >
                              <option value="admin">Admin</option>
                              <option value="member">Üye</option>
                              <option value="viewer">İzleyici</option>
                            </select>
                            <button onClick={() => removeMember(member.id)} className="text-xs text-gray-600 hover:text-red-400">
                              Çıkar
                            </button>
                          </>
                        ) : (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            member.role === 'owner' ? 'bg-happ-yellow/20 text-happ-yellow' :
                            member.role === 'admin' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>{member.role}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
