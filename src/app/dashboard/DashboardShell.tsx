'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

interface Props {
  user: User
  profile: any
  teams: any[]
  children: React.ReactNode
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Menzil Şeması', icon: '📐', desc: 'Range Chart' },
  { href: '/dashboard/projects', label: 'Projeler', icon: '📁', desc: 'Kayıtlı planlar' },
  { href: '/dashboard/cranes', label: 'Vinçler', icon: '🏗️', desc: 'Vinç & yük tablosu' },
  { href: '/dashboard/team', label: 'Takım', icon: '👥', desc: 'Takım yönetimi' },
  { href: '/dashboard/settings', label: 'Ayarlar', icon: '⚙️', desc: 'Hesap ayarları' },
]

export default function DashboardShell({ user, profile, teams, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Kullanıcı'

  return (
    <div className="min-h-screen bg-happ-dark flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-56 bg-happ-surface border-r border-happ-green/15 fixed h-full">
        {/* Logo only - no text, branding is in the app header */}
        <div className="px-5 py-4 border-b border-happ-green/15 flex items-center justify-center">
          <img src="/logo-hareket.png" alt="VecH" className="w-10 h-10 rounded-lg" />
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3">
          {NAV_ITEMS.map(item => {
            const active = item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                  active
                    ? 'text-happ-yellow bg-happ-yellow/5 border-r-2 border-happ-yellow'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{item.icon}</span>
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-600">{item.desc}</div>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-happ-green/15">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-happ-green/30 flex items-center justify-center text-xs font-bold text-happ-green-light">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{displayName}</div>
              <div className="text-xs text-gray-600 truncate">{user.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left text-xs text-gray-500 hover:text-red-400 transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Mobile Header - just logo, no text */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-happ-surface border-b border-happ-green/15 z-50 flex items-center justify-between px-4 h-14">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white text-xl">☰</button>
        <img src="/logo-hareket.png" alt="VecH" className="w-8 h-8 rounded" />
        <button onClick={handleLogout} className="text-xs text-gray-500">Çıkış</button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-happ-surface border-r border-happ-green/15 flex flex-col">
            <div className="px-5 py-4 border-b border-happ-green/15 flex items-center justify-between">
              <img src="/logo-hareket.png" alt="VecH" className="w-9 h-9 rounded-lg" />
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            <nav className="flex-1 py-3">
              {NAV_ITEMS.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-5 py-3 text-sm ${
                    pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                      ? 'text-happ-yellow bg-happ-yellow/5'
                      : 'text-gray-400'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-56 pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  )
}
