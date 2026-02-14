'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { full_name: fullName, company },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) { setError(error.message); setLoading(false) }
    else { setSuccess(true) }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-happ-dark flex items-center justify-center px-4">
        <div className="bg-happ-surface border border-happ-green/20 rounded-2xl p-10 w-full max-w-md text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-white text-xl font-bold mb-3">E-posta Doğrulama</h2>
          <p className="text-gray-400 text-sm mb-6">
            <strong className="text-white">{email}</strong> adresine doğrulama linki gönderdik.
            Lütfen e-postanızı kontrol edin.
          </p>
          <Link href="/auth/login" className="text-happ-yellow hover:underline text-sm">Giriş sayfasına dön</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-happ-dark flex items-center justify-center px-4">
      <div className="bg-happ-surface border border-happ-green/20 rounded-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <img src="/logo-hareket.png" alt="Hangel" className="w-14 h-14 rounded-lg" />
          </div>
          <h1 className="text-happ-yellow font-black text-3xl tracking-[6px] mb-2">Hangel</h1>
          <p className="text-gray-500 text-sm">Yeni Hesap Oluştur</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" placeholder="Ad Soyad" value={fullName}
            onChange={e => setFullName(e.target.value)} required
            className="w-full px-4 py-3 bg-happ-dark border border-happ-green/20 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-happ-yellow/50" />
          <input type="text" placeholder="Firma (opsiyonel)" value={company}
            onChange={e => setCompany(e.target.value)}
            className="w-full px-4 py-3 bg-happ-dark border border-happ-green/20 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-happ-yellow/50" />
          <input type="email" placeholder="E-posta" value={email}
            onChange={e => setEmail(e.target.value)} required
            className="w-full px-4 py-3 bg-happ-dark border border-happ-green/20 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-happ-yellow/50" />
          <input type="password" placeholder="Şifre (min 6 karakter)" value={password}
            onChange={e => setPassword(e.target.value)} required minLength={6}
            className="w-full px-4 py-3 bg-happ-dark border border-happ-green/20 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-happ-yellow/50" />
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-happ-yellow text-happ-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50">
            {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-8">
          Zaten hesabın var mı?{' '}
          <Link href="/auth/login" className="text-happ-yellow hover:underline">Giriş Yap</Link>
        </p>
      </div>
    </div>
  )
}
