'use client'

// ★ BU DOSYAYA HAPP v3 ANA BİLEŞENİ GELİR
// happ-v3-final.jsx'i burada import ederek kullanacaksın.
// Şimdilik placeholder:

export default function DashboardPage() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">📐</div>
        <h1 className="text-happ-yellow font-black text-3xl tracking-[5px] mb-3">HAPP</h1>
        <p className="text-gray-400 text-sm mb-6">
          HAPP v3 bileşeni buraya yerleştirilecek.
        </p>
        <div className="bg-happ-surface border border-happ-green/20 rounded-xl p-6 max-w-md mx-auto text-left text-xs text-gray-500 space-y-2">
          <p><strong className="text-gray-300">Sonraki adım:</strong></p>
          <p>1. <code className="text-happ-yellow">happ-v3-final.jsx</code> dosyasını <code className="text-happ-yellow">src/components/happ/</code> altına kopyala</p>
          <p>2. Modüllere ayır (types, constants, calculations, RangeChart)</p>
          <p>3. Bu sayfada import et ve render et</p>
          <p>4. Supabase ile proje kayıt/yükleme bağla</p>
        </div>
      </div>
    </div>
  )
}
