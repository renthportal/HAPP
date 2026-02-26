'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

// Colors matching HappApp theme
const C = {
  dark: "#0A1F12", darkSurf: "#132E1C", greenBg: "#0D2818",
  greenDark: "#004D2A", green: "#006838", greenLight: "#00A86B",
  yellow: "#FFC72C", yellowDark: "#B8860B", orange: "#FF6B35",
  cyan: "#00BCD4", red: "#DC2626", white: "#F0F4F1",
  g100: "#D9E5DD", g200: "#B8C9BE", g300: "#94A89A",
  g400: "#6B7E70", g500: "#475950", g600: "#2A3B30",
}
const F = "'Fira Code','SF Mono',monospace"
const FB = "'Inter','SF Pro',-apple-system,sans-serif"

const toRad = (d: number) => d * Math.PI / 180
const toDeg = (r: number) => r * 180 / Math.PI

interface CraneConfig {
  craneType: string
  boomLength: number
  boomAngle: number
  jibEnabled: boolean
  jibLength: number
  jibAngle: number
  loadWeight: number
  radius: number
  hookHeight: number
  boomTipHeight: number
  pivotHeight: number
  chartId: string
  outriggerSpread: string
  cwConfig: string
}

interface FleetCrane {
  id: string
  name: string
  manufacturer?: string
  model?: string
  serial_number?: string
  crane_type?: string
  configs: CraneConfigEntry[]
}

interface CraneConfigEntry {
  id: string
  crane_id: string
  name: string
  load_chart_id?: string
  counterweight?: string
  outrigger?: string
  boom_length_max?: number
  sort_order?: number
}

interface LoadChart {
  id: string
  name: string
  max_capacity?: number
  max_boom?: number
  pivot_height?: number
  boom_lengths: number[]
  chart_data: { r: number; caps: (number | null)[] }[]
}

interface SearchResult {
  craneId: string
  craneName: string
  configId: string
  configName: string
  chartId: string
  chartName: string
  boomLength: number
  angle: number
  capacity: number
  utilization: number
  tipHeight: number
  sufficient: boolean
  counterweight?: string
  outrigger?: string
}

// Bilinear interpolation for load chart lookup
function lookupChart(chart: LoadChart, boom: number, radius: number): number | null {
  if (!chart.chart_data || !chart.boom_lengths || chart.chart_data.length === 0) return null
  const bls = chart.boom_lengths
  const rows = chart.chart_data

  // Find boom length bracket
  let bi = -1
  for (let i = 0; i < bls.length; i++) {
    if (bls[i] >= boom) { bi = i; break }
  }
  if (bi === -1) bi = bls.length - 1

  // Find radius bracket
  let ri = -1
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].r >= radius) { ri = i; break }
  }
  if (ri === -1) return null

  // Exact or interpolate
  const getCap = (bIdx: number, rIdx: number): number | null => {
    if (bIdx < 0 || bIdx >= bls.length || rIdx < 0 || rIdx >= rows.length) return null
    return rows[rIdx].caps[bIdx] ?? null
  }

  // Try exact boom index first
  const cap = getCap(bi, ri)
  if (cap !== null) return cap

  // Fallback: try interpolation between boom lengths
  if (bi > 0) {
    const capLo = getCap(bi - 1, ri)
    const capHi = getCap(bi, ri)
    if (capLo !== null && capHi !== null) {
      const t = (boom - bls[bi - 1]) / (bls[bi] - bls[bi - 1])
      return capLo + (capHi - capLo) * t
    }
    if (capLo !== null) return capLo
  }
  return null
}

export default function CraneFinderPage() {
  const supabase = createClient()
  const [config, setConfig] = useState<CraneConfig | null>(null)
  const [fleetCranes, setFleetCranes] = useState<FleetCrane[]>([])
  const [loadCharts, setLoadCharts] = useState<Record<string, LoadChart>>({})
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  // Load config from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('happ_crane_finder_config')
    if (stored) {
      try {
        setConfig(JSON.parse(stored))
      } catch { /* ignore */ }
    }
  }, [])

  // Load fleet cranes and their configs + load charts
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Load fleet cranes
        const { data: cranes } = await supabase
          .from('fleet_cranes')
          .select('*')
          .order('created_at', { ascending: false })

        // Load all crane configs
        const { data: configs } = await supabase
          .from('crane_configs')
          .select('*')
          .order('sort_order')

        // Load all load charts (full data for search)
        const { data: charts } = await supabase
          .from('load_charts')
          .select('*')

        // Map configs to cranes
        const configMap = new Map<string, CraneConfigEntry[]>()
        ;(configs || []).forEach((cf: any) => {
          const existing = configMap.get(cf.crane_id) || []
          configMap.set(cf.crane_id, [...existing, cf])
        })

        setFleetCranes((cranes || []).map((c: any) => ({
          ...c,
          configs: configMap.get(c.id) || []
        })))

        // Build load chart map
        const chartMap: Record<string, LoadChart> = {}
        ;(charts || []).forEach((ch: any) => {
          chartMap[ch.id] = {
            id: ch.id,
            name: ch.name,
            max_capacity: ch.max_capacity,
            max_boom: ch.max_boom,
            pivot_height: ch.pivot_height,
            boom_lengths: ch.boom_lengths || [],
            chart_data: ch.chart_data || [],
          }
        })
        setLoadCharts(chartMap)
      } catch (e) {
        console.error('Data load error:', e)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  // Search fleet cranes against current config
  const handleSearch = () => {
    if (!config) return
    setSearching(true)
    setHasSearched(true)

    const searchResults: SearchResult[] = []
    const { loadWeight, radius, boomTipHeight, pivotHeight } = config

    for (const crane of fleetCranes) {
      for (const cfg of crane.configs) {
        if (!cfg.load_chart_id) continue
        const chart = loadCharts[cfg.load_chart_id]
        if (!chart || !chart.boom_lengths || chart.boom_lengths.length === 0) continue

        const hNet = Math.max(0, boomTipHeight - (chart.pivot_height || pivotHeight || 2.5))
        const minBoom = Math.sqrt(radius * radius + hNet * hNet)

        let bestMatch: SearchResult | null = null

        // Try each boom length, shortest first
        for (const bl of chart.boom_lengths) {
          if (bl < minBoom * 0.95) continue

          const cosA = radius / bl
          if (cosA > 1 || cosA < 0) continue
          const angle = toDeg(Math.acos(cosA))
          const tipH = (chart.pivot_height || pivotHeight || 2.5) + Math.sqrt(Math.max(0, bl * bl - radius * radius))

          if (tipH < boomTipHeight * 0.95) continue

          const cap = lookupChart(chart, bl, radius)
          if (cap === null) continue

          const util = loadWeight / cap * 100
          const result: SearchResult = {
            craneId: crane.id,
            craneName: crane.name,
            configId: cfg.id,
            configName: cfg.name,
            chartId: chart.id,
            chartName: chart.name,
            boomLength: bl,
            angle: Math.round(angle),
            capacity: Math.round(cap * 10) / 10,
            utilization: Math.round(util),
            tipHeight: Math.round(tipH * 10) / 10,
            sufficient: cap >= loadWeight,
            counterweight: cfg.counterweight,
            outrigger: cfg.outrigger,
          }

          if (cap >= loadWeight) {
            if (!bestMatch || bl < bestMatch.boomLength) {
              bestMatch = result
            }
          } else if (!bestMatch) {
            bestMatch = result
          }
        }

        if (bestMatch) searchResults.push(bestMatch)
      }
    }

    // Sort: sufficient first, then by utilization (lower = better margin)
    searchResults.sort((a, b) => {
      if (a.sufficient && !b.sufficient) return -1
      if (!a.sufficient && b.sufficient) return 1
      return a.utilization - b.utilization
    })

    setResults(searchResults)
    setSearching(false)
  }

  // Apply a result back to the main app
  const applyResult = (result: SearchResult) => {
    const applyConfig = {
      chartId: result.chartId,
      boomLength: result.boomLength,
      boomAngle: result.angle,
      loadWeight: config?.loadWeight || 0,
    }
    localStorage.setItem('happ_crane_finder_apply', JSON.stringify(applyConfig))
    window.location.href = '/dashboard'
  }

  const sufficientCount = results.filter(r => r.sufficient).length
  const insufficientCount = results.filter(r => !r.sufficient).length

  return (
    <div style={{ fontFamily: FB, background: `linear-gradient(135deg,${C.dark} 0%,${C.greenBg} 40%,${C.dark} 100%)`, color: C.white, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(90deg,${C.greenDark},${C.green})`, borderBottom: `2px solid ${C.yellow}`, padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/dashboard" style={{ padding: '8px 16px', background: C.g500 + '80', border: `1px solid ${C.g400}40`, borderRadius: 8, color: C.g200, fontWeight: 600, fontSize: 12, textDecoration: 'none', fontFamily: F }}>
              ← Menzil Şemasına Dön
            </Link>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: C.yellow, fontFamily: F }}>Vinç Bul</div>
              <div style={{ fontSize: 10, color: C.greenLight, fontFamily: F }}>Filo vinçlerinizde menzil şemanıza uygun vinç arayın</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px' }}>
        {/* Config Summary */}
        {config && (
          <div style={{ background: C.darkSurf, borderRadius: 12, padding: 20, border: `1px solid ${C.green}20`, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.yellow, fontFamily: F, marginBottom: 12 }}>Menzil Şemasından Gelen Parametreler</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
              {[
                { label: 'Yük Ağırlığı', value: `${config.loadWeight} t`, color: C.yellow },
                { label: 'Menzil (Yarıçap)', value: `${config.radius?.toFixed(1)} m`, color: C.greenLight },
                { label: 'Kaldırma Yüksekliği', value: `${config.boomTipHeight?.toFixed(1)} m`, color: C.cyan },
                { label: 'Boom Uzunluğu', value: `${config.boomLength} m`, color: C.g200 },
                { label: 'Boom Açısı', value: `${config.boomAngle}°`, color: C.g200 },
                { label: 'Vinç Tipi', value: config.craneType, color: C.g200 },
              ].map((item, i) => (
                <div key={i} style={{ padding: '10px 12px', background: C.dark, borderRadius: 8, border: `1px solid ${C.green}15` }}>
                  <div style={{ fontSize: 10, color: C.g400, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: item.color, fontFamily: F }}>{item.value}</div>
                </div>
              ))}
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || searching}
              style={{
                width: '100%', marginTop: 16, padding: '14px',
                background: loading || searching ? C.g500 : `linear-gradient(135deg,${C.green},${C.greenLight})`,
                border: 'none', borderRadius: 10, color: 'white',
                fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: F, letterSpacing: 1,
              }}>
              {loading ? '⏳ Filo vinçleri yükleniyor...' :
                searching ? '⏳ Aranıyor...' :
                  `🔍 FİLO VİNÇLERİNDE ARA — ${fleetCranes.length} vinç, ${fleetCranes.reduce((s, c) => s + c.configs.length, 0)} konfigürasyon`}
            </button>
          </div>
        )}

        {/* No config warning */}
        {!config && (
          <div style={{ textAlign: 'center', padding: 40, color: C.g400 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Menzil şeması parametreleri bulunamadı</div>
            <div style={{ fontSize: 12, marginBottom: 20 }}>Lütfen önce menzil şemasında boom, yük ve nesneleri ayarlayın</div>
            <Link href="/dashboard" style={{ padding: '12px 24px', background: C.yellow, color: C.greenDark, borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none', fontFamily: F }}>
              Menzil Şemasına Git
            </Link>
          </div>
        )}

        {/* No fleet cranes */}
        {!loading && fleetCranes.length === 0 && config && (
          <div style={{ background: C.darkSurf, borderRadius: 12, padding: 24, border: `1px solid ${C.orange}30`, textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🏗️</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.orange, marginBottom: 8 }}>Filo vinciniz bulunmuyor</div>
            <div style={{ fontSize: 12, color: C.g400, marginBottom: 16 }}>Vinç aramak için önce Vinç Yönetimi sayfasından filo vinçlerinizi ekleyin</div>
            <Link href="/dashboard/cranes" style={{ padding: '10px 20px', background: C.yellow, color: C.greenDark, borderRadius: 8, fontWeight: 700, fontSize: 12, textDecoration: 'none', fontFamily: F }}>
              Vinç Yönetimi'ne Git
            </Link>
          </div>
        )}

        {/* Results */}
        {hasSearched && results.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.g200 }}>
                Sonuçlar
              </div>
              <div style={{ fontSize: 12, color: C.g400 }}>
                <span style={{ color: C.greenLight, fontWeight: 600 }}>{sufficientCount} uygun</span>
                {insufficientCount > 0 && <>{' · '}<span style={{ color: C.red }}>{insufficientCount} yetersiz</span></>}
              </div>
            </div>

            {/* Results Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${C.green}30` }}>
                    {['Durum', 'Vinç', 'Konfigürasyon', 'Yük Tablosu', 'Boom', 'Açı', 'Kapasite', 'Kullanım', 'Uç Yüks.', 'CW', 'Outrigger', ''].map((h, i) => (
                      <th key={i} style={{ padding: '10px 8px', textAlign: 'left', color: C.g400, fontWeight: 600, fontSize: 10, whiteSpace: 'nowrap', fontFamily: F }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} style={{
                      borderBottom: `1px solid ${C.green}15`,
                      background: r.sufficient ? (i % 2 === 0 ? C.greenDark + '20' : 'transparent') : C.red + '08',
                      opacity: r.sufficient ? 1 : 0.7,
                    }}>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{
                          display: 'inline-block', padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700,
                          background: r.sufficient ? C.greenLight + '20' : C.red + '20',
                          color: r.sufficient ? C.greenLight : C.red,
                          border: `1px solid ${r.sufficient ? C.greenLight : C.red}40`,
                        }}>
                          {r.sufficient ? '✅ UYGUN' : '❌ YETERSİZ'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', fontWeight: 600, color: C.white }}>{r.craneName}</td>
                      <td style={{ padding: '12px 8px', color: C.g200 }}>{r.configName}</td>
                      <td style={{ padding: '12px 8px', color: C.g300, fontSize: 10 }}>{r.chartName}</td>
                      <td style={{ padding: '12px 8px', color: C.yellow, fontWeight: 600, fontFamily: F }}>{r.boomLength}m</td>
                      <td style={{ padding: '12px 8px', color: C.yellow, fontFamily: F }}>{r.angle}°</td>
                      <td style={{ padding: '12px 8px', fontWeight: 700, fontFamily: F, color: r.sufficient ? C.greenLight : C.red }}>{r.capacity}t</td>
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 50, height: 6, borderRadius: 3, background: C.dark, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(100, r.utilization)}%`, borderRadius: 3, background: r.utilization > 100 ? C.red : r.utilization > 85 ? C.orange : C.greenLight }} />
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 600, fontFamily: F, color: r.utilization > 100 ? C.red : r.utilization > 85 ? C.orange : C.g300 }}>%{r.utilization}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px', color: C.cyan, fontFamily: F, fontSize: 11 }}>{r.tipHeight}m</td>
                      <td style={{ padding: '12px 8px', color: C.g400, fontSize: 10 }}>{r.counterweight || '-'}</td>
                      <td style={{ padding: '12px 8px', color: C.g400, fontSize: 10 }}>{r.outrigger || '-'}</td>
                      <td style={{ padding: '12px 8px' }}>
                        {r.sufficient && (
                          <button onClick={() => applyResult(r)} style={{
                            padding: '6px 14px', background: C.yellow, border: 'none', borderRadius: 6,
                            color: C.greenDark, fontWeight: 800, fontSize: 11, cursor: 'pointer', fontFamily: F, whiteSpace: 'nowrap',
                          }}>
                            Uygula →
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No results */}
        {hasSearched && results.length === 0 && (
          <div style={{ background: C.darkSurf, borderRadius: 12, padding: 32, border: `1px solid ${C.orange}30`, textAlign: 'center', marginTop: 16 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>😔</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.orange, marginBottom: 8 }}>Uygun vinç bulunamadı</div>
            <div style={{ fontSize: 12, color: C.g400 }}>Filo vinçlerinizden hiçbiri bu kaldırma senaryosunu karşılayamıyor.</div>
            <div style={{ fontSize: 11, color: C.g500, marginTop: 8 }}>Vinç Yönetimi'nden yeni vinç ve konfigürasyon ekleyebilirsiniz.</div>
          </div>
        )}

        {/* Empty search state */}
        {!hasSearched && config && !loading && fleetCranes.length > 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: C.g500 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏗️</div>
            <div style={{ fontSize: 14, color: C.g400 }}>Yukarıdaki parametreleri kontrol edin ve ARA butonuna basın</div>
            <div style={{ fontSize: 11, marginTop: 4, color: C.g600 }}>Sadece filo vinçleriniz ve kayıtlı konfigürasyonları aranacaktır</div>
          </div>
        )}
      </div>
    </div>
  )
}
