'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  return (
    <div className="min-h-screen bg-happ-dark flex items-center justify-center px-4">
      <div className="bg-happ-surface border border-happ-green/20 rounded-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-happ-yellow font-black text-3xl tracking-[6px] mb-2">HAPP</h1>
          <p className="text-gray-500 text-sm">Vinç Planlama Sistemine Giriş</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-happ-dark border border-happ-green/20 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-happ-yellow/50 transition-colors"
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-happ-dark border border-happ-green/20 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-happ-yellow/50 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-happ-yellow text-happ-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-happ-green/20" />
          <span className="text-xs text-gray-600">veya</span>
          <div className="flex-1 h-px bg-happ-green/20" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full py-3 border border-happ-green/30 text-gray-400 rounded-lg hover:border-happ-green/60 hover:text-white transition-colors text-sm font-medium"
        >
          Google ile Giriş
        </button>

        <p className="text-center text-gray-600 text-sm mt-8">
          Hesabın yok mu?{' '}
          <Link href="/auth/register" className="text-happ-yellow hover:underline">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  )
}
