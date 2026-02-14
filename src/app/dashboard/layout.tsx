import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardShell from './DashboardShell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Profil bilgisi
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Takım bilgisi
  const { data: teamMemberships } = await supabase
    .from('team_members')
    .select('*, teams(*)')
    .eq('user_id', user.id)

  return (
    <DashboardShell 
      user={user} 
      profile={profile} 
      teams={teamMemberships?.map(tm => tm.teams).filter(Boolean) || []}
    >
      {children}
    </DashboardShell>
  )
}
