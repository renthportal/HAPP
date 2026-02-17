'use client'
import { useState } from 'react'

const C = { dark: "#0A1F12", green: "#006838", greenLight: "#00A86B", yellow: "#FFC72C", g300: "#94A89A", g500: "#475950", white: "#F0F4F1", orange: "#FF6B35" }

const CRANES = [
  { id: "mobile", name: "Mobil Vinç", maxBoom: 60, maxCap: 100, pivotH: 2.5, cat: "mobile", desc: "Standart tekerlekli mobil vinç. Şehir içi ve endüstriyel operasyonlar." },
  { id: "truck", name: "Kamyon Vinç", maxBoom: 40, maxCap: 60, pivotH: 3, cat: "mobile", desc: "Kamyon şasisi üzeri vinç. Hızlı mobilizasyon, kısa süreli kaldırma." },
  { id: "crawler", name: "Paletli Vinç", maxBoom: 100, maxCap: 200, pivotH: 3.5, cat: "crawler", desc: "Yüksek kapasiteli paletli vinç. Ağır yük ve enerji projeleri." },
  { id: "tower", name: "Kule Vinç", maxBoom: 80, maxCap: 120, pivotH: 40, cat: "tower", desc: "Sabit kule vinç. İnşaat projeleri ve uzun süreli operasyonlar." },
  { id: "rough", name: "Arazi Vinç", maxBoom: 50, maxCap: 80, pivotH: 2.8, cat: "mobile", desc: "Zorlu arazi koşulları. 4x4 sürüş, düzensiz zemin." },
  { id: "allterrain", name: "All Terrain Vinç", maxBoom: 70, maxCap: 150, pivotH: 3, cat: "mobile", desc: "Yol ve arazi uyumlu. En çok yönlü mobil vinç tipi." },
  { id: "mini", name: "Mini/Örümcek Vinç", maxBoom: 20, maxCap: 10, pivotH: 1.5, cat: "spider", desc: "Dar alan vinçleri. İç mekan, çatı ve erişim kısıtlı alanlar." },
  { id: "telescopic", name: "Teleskopik Handler", maxBoom: 25, maxCap: 5, pivotH: 2, cat: "telescopic", desc: "Malzeme taşıma ve yerleştirme. İnşaat ve depolama." },
  { id: "knuckle", name: "Eklemli Vinç (Boom Truck)", maxBoom: 35, maxCap: 40, pivotH: 2, cat: "knuckle", desc: "Katlanır boom. Teslimat ve yerleştirme operasyonları." },
  { id: "franna", name: "Pick & Carry Vinç", maxBoom: 28, maxCap: 25, pivotH: 2.2, cat: "franna", desc: "Yük altında hareket edebilen vinç. Fabrika ve tesis içi." },
  { id: "floating", name: "Yüzer Vinç", maxBoom: 120, maxCap: 500, pivotH: 10, cat: "floating", desc: "Deniz ve liman operasyonları. Platform ve gemi kaldırma." },
  { id: "gantry", name: "Portal Vinç", maxBoom: 40, maxCap: 150, pivotH: 15, cat: "gantry", desc: "Ray üzerinde hareket. Liman, depo ve ağır endüstri." },
]

const CHARTS = [
  { id: "ltm500", name: "LTM 1500", cap: "500t", boom: "84m", type: "Mobil" },
  { id: "ltm250", name: "LTM 1250", cap: "250t", boom: "60m", type: "Mobil" },
  { id: "ltm100", name: "LTM 1100", cap: "100t", boom: "52m", type: "Mobil" },
  { id: "cc300", name: "CC 2800", cap: "300t", boom: "96m", type: "Paletli" },
  { id: "tc120", name: "1000EC", cap: "120t", boom: "60m", type: "Kule" },
]

const catColors: Record<string, string> = { mobile: "#00A86B", crawler: "#FF6B35", tower: "#00BCD4", spider: "#9C27B0", telescopic: "#FFC72C", knuckle: "#8BC34A", franna: "#FF9800", floating: "#2196F3", gantry: "#607D8B" }

export default function CranesPage() {
  const [selCat, setSelCat] = useState('all')
  const cats = ['all', ...Array.from(new Set(CRANES.map(c => c.cat)))]
  const filtered = selCat === 'all' ? CRANES : CRANES.filter(c => c.cat === selCat)

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: C.yellow, letterSpacing: 3, margin: '0 0 4px' }}>Vinç Kütüphanesi</h1>
      <p style={{ fontSize: 12, color: C.g300, margin: '0 0 20px' }}>Hangle'de kullanılabilir 12 vinç tipi ve {CHARTS.length} yük tablosu</p>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {cats.map(c => (
          <button key={c} onClick={() => setSelCat(c)} style={{ padding: '4px 12px', borderRadius: 20, border: `1px solid ${selCat === c ? C.yellow : C.g500}40`, background: selCat === c ? C.yellow + '15' : 'transparent', color: selCat === c ? C.yellow : C.g300, fontSize: 10, cursor: 'pointer' }}>
            {c === 'all' ? 'Tümü' : c}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
        {filtered.map(crane => (
          <div key={crane.id} style={{ background: C.dark + 'CC', border: `1px solid ${catColors[crane.cat]}25`, borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.white }}>{crane.name}</div>
                <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 10, background: catColors[crane.cat] + '20', color: catColors[crane.cat] }}>{crane.cat}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: C.yellow }}>{crane.maxCap}t</div>
            </div>
            <p style={{ fontSize: 10, color: C.g300, lineHeight: 1.5, margin: '8px 0' }}>{crane.desc}</p>
            <div style={{ display: 'flex', gap: 12, fontSize: 9, color: C.g500 }}>
              <span>Max Boom: {crane.maxBoom}m</span>
              <span>Pivot: {crane.pivotH}m</span>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 700, color: C.white, marginTop: 32, marginBottom: 12 }}>Yük Tabloları</h2>
      <p style={{ fontSize: 11, color: C.g300, marginBottom: 16 }}>Sistem içi yük tabloları. CSV ile özel tablo yüklemek için Menzil Şeması → Sol Panel → "CSV Tablo Yükle" butonunu kullanın.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
        {CHARTS.map(ch => (
          <div key={ch.id} style={{ background: C.dark + 'CC', border: `1px solid ${C.green}20`, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.greenLight }}>{ch.name}</div>
            <div style={{ fontSize: 10, color: C.g300, marginTop: 4 }}>Kapasite: {ch.cap} | Boom: {ch.boom}</div>
            <div style={{ fontSize: 9, color: C.g500, marginTop: 2 }}>Tip: {ch.type}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
