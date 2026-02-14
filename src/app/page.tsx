import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-happ-dark flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-happ-green/20">
        <div className="flex items-center gap-3">
          <img src="/logo-hareket.png" alt="Hangel" className="w-8 h-8 rounded" />
          <span className="text-happ-yellow font-black text-2xl tracking-[6px]">Hangel</span>
          <span className="text-xs text-gray-500 hidden sm:block">Crane Lift Planning</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
            Giriş Yap
          </Link>
          <Link href="/auth/register" className="text-sm bg-happ-yellow text-happ-dark font-bold px-5 py-2 rounded-lg hover:bg-yellow-400 transition-colors">
            Ücretsiz Başla
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-3xl">
          <div className="flex justify-center mb-6">
            <img src="/logo-hareket.png" alt="Hareket" className="w-20 h-20 rounded-xl" />
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-white mb-6 leading-tight">
            Vinç Planlaması
            <br />
            <span className="text-happ-yellow">Artık Kolay</span>
          </h1>
          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
            Menzil diyagramı çiz, yük tablosu kontrolü yap, kaldırma planı oluştur.
            Sahada ve ofiste — web tarayıcınından, her cihazda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="bg-happ-yellow text-happ-dark font-bold text-lg px-8 py-4 rounded-xl hover:bg-yellow-400 transition-colors">
              Ücretsiz Hesap Oluştur
            </Link>
            <Link href="/dashboard" className="border border-happ-green/40 text-gray-300 font-semibold text-lg px-8 py-4 rounded-xl hover:border-happ-green hover:text-white transition-colors">
              Demo Dene →
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-4xl w-full">
          {[
            { icon: '📐', title: 'Menzil Diyagramı', desc: '12 vinç tipi, boom/jib drag, gerçekçi vinç görselleri' },
            { icon: '📊', title: 'Gerçek Yük Tablosu', desc: 'Bilineer interpolasyonla hassas kapasite hesabı' },
            { icon: '📋', title: 'Kaldırma Planı PDF', desc: 'Saha onayına hazır profesyonel dokümantasyon' },
          ].map(f => (
            <div key={f.title} className="bg-happ-surface border border-happ-green/15 rounded-xl p-6 text-left">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-white font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-happ-green/10 text-center text-xs text-gray-600">
        Hangel © {new Date().getFullYear()} — Hareket Group — Vinç planlaması için geliştirilmiştir
      </footer>
    </div>
  )
}
