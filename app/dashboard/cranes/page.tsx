'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

const C = { dark: "#0A1F12", surface: "#132E1C", green: "#006838", greenLight: "#00A86B", yellow: "#FFC72C", g300: "#94A89A", g500: "#475950", white: "#F0F4F1", orange: "#FF6B35", red: "#EF4444" }

const CRANE_TYPES = [
  { id: 'mobile', label: 'Mobil Vinç' },
  { id: 'crawler', label: 'Paletli Vinç' },
  { id: 'rough', label: 'Arazi Tipi Vinç' },
  { id: 'truck', label: 'Kamyon Üstü Vinç' },
]

const BOOM_TYPES = [
  { id: 'telescopic', label: 'Teleskopik' },
  { id: 'lattice', label: 'Kafes (Lattice)' },
  { id: 'luffing', label: 'Luffing Jib' },
  { id: 'fixed', label: 'Sabit Jib' },
]

const OUTRIGGER_OPTS = [
  { id: 'full', label: '100% Açık' },
  { id: '75', label: '75%' },
  { id: '50', label: '50%' },
  { id: '0', label: 'Kapalı (0%)' },
  { id: 'on_tracks', label: 'Palet üzeri' },
]

const VEHICLE_TYPES = [
  { id: 'lowbed', label: 'Lowbed', icon: '🚛' },
  { id: 'truck', label: 'Kamyon', icon: '🚚' },
  { id: 'open_trailer', label: 'Açık Dorse', icon: '🚜' },
  { id: 'tractor', label: 'Çekici', icon: '🔧' },
  { id: 'spmt', label: 'Modüler Treyler (SPMT)', icon: '⚙️' },
  { id: 'other', label: 'Diğer', icon: '📦' },
]

interface Vehicle { type: string; count: number; notes: string }
interface Config {
  id: string; crane_id: string; name: string; description: string;
  counterweight: string; boom_type: string; max_boom: number;
  max_capacity_at_config: number; outrigger_config: string;
  transport_vehicles: Vehicle[]; load_chart_id: string | null;
  sort_order: number;
}
interface Crane {
  id: string; name: string; manufacturer: string; crane_type: string;
  max_capacity: number; serial_number: string; year_of_manufacture: number;
  notes: string; configs?: Config[];
}

// ═══════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════
export default function CranesPage() {
  const supabase = createClient()
  const [cranes, setCranes] = useState<Crane[]>([])
  const [loadCharts, setLoadCharts] = useState<any[]>([])
  const [expandedCrane, setExpandedCrane] = useState<string | null>(null)
  const [showCraneForm, setShowCraneForm] = useState(false)
  const [editingCrane, setEditingCrane] = useState<Crane | null>(null)
  const [showConfigForm, setShowConfigForm] = useState<string | null>(null)
  const [editingConfig, setEditingConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const { data: cranesData } = await supabase.from('fleet_cranes').select('*').order('created_at', { ascending: false })
      const { data: configsData } = await supabase.from('crane_configs').select('*').order('sort_order', { ascending: true })
      const { data: chartsData } = await supabase.from('load_charts').select('id, name, max_capacity, max_boom').order('name')
      const merged = (cranesData || []).map((crane: any) => ({
        ...crane, configs: (configsData || []).filter((cfg: any) => cfg.crane_id === crane.id)
      }))
      setCranes(merged)
      setLoadCharts(chartsData || [])
    } catch (err) { console.error('Load error:', err) }
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadData() }, [loadData])

  const saveCrane = async (crane: Partial<Crane>) => {
    if (editingCrane?.id) {
      await supabase.from('fleet_cranes').update(crane).eq('id', editingCrane.id)
    } else {
      await supabase.from('fleet_cranes').insert(crane)
    }
    setShowCraneForm(false); setEditingCrane(null); loadData()
  }

  const deleteCrane = async (id: string) => {
    if (!confirm('Bu vinç ve tüm konfigürasyonları silinecek. Emin misiniz?')) return
    await supabase.from('fleet_cranes').delete().eq('id', id); loadData()
  }

  const saveConfig = async (config: Partial<Config>, craneId: string) => {
    const payload = { ...config, crane_id: craneId }
    if (editingConfig?.id) {
      await supabase.from('crane_configs').update(payload).eq('id', editingConfig.id)
    } else {
      await supabase.from('crane_configs').insert(payload)
    }
    setShowConfigForm(null); setEditingConfig(null); loadData()
  }

  const deleteConfig = async (id: string) => {
    if (!confirm('Bu konfigürasyon silinecek. Emin misiniz?')) return
    await supabase.from('crane_configs').delete().eq('id', id); loadData()
  }

  return (
    <div style={{ padding: '20px 16px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.yellow, letterSpacing: 2, margin: 0 }}>Vinç Yönetimi</h1>
          <p style={{ fontSize: 11, color: C.g300, margin: '4px 0 0' }}>Filo vinçleri · konfigürasyonlar · yük tabloları · nakliye</p>
        </div>
        <button onClick={() => { setEditingCrane(null); setShowCraneForm(true) }}
          style={{ padding: '10px 20px', background: C.green, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          + Vinç Ekle
        </button>
      </div>

      {loading && <div style={{ textAlign: 'center', color: C.g300, padding: 40 }}>Yükleniyor...</div>}

      {!loading && cranes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: C.surface, borderRadius: 16, border: `1px dashed ${C.g500}` }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏗️</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 8 }}>Henüz vinç eklenmemiş</div>
          <div style={{ fontSize: 12, color: C.g300, marginBottom: 16 }}>Filonuzdaki vinçleri ekleyin, her biri için konfigürasyon ve yük tablosu tanımlayın.</div>
          <button onClick={() => { setEditingCrane(null); setShowCraneForm(true) }}
            style={{ padding: '10px 24px', background: C.yellow, color: '#000', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            İlk Vincini Ekle
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {cranes.map(crane => {
          const isExp = expandedCrane === crane.id
          const cfgCnt = crane.configs?.length || 0
          const typeLabel = CRANE_TYPES.find(t => t.id === crane.crane_type)?.label || crane.crane_type
          return (
            <div key={crane.id} style={{ background: C.surface, border: `1px solid ${isExp ? C.green + '60' : C.g500 + '30'}`, borderRadius: 12, overflow: 'hidden' }}>
              <div onClick={() => setExpandedCrane(isExp ? null : crane.id)}
                style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 10, color: C.g300, transform: isExp ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>▶</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{crane.name}</span>
                    <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 10, background: C.green + '20', color: C.greenLight }}>{typeLabel}</span>
                    {crane.max_capacity && <span style={{ fontSize: 12, fontWeight: 800, color: C.yellow }}>{crane.max_capacity}t</span>}
                  </div>
                  <div style={{ fontSize: 10, color: C.g500, marginTop: 2 }}>
                    {crane.manufacturer || ''}{crane.year_of_manufacture ? ` · ${crane.year_of_manufacture}` : ''} · {cfgCnt} konfigürasyon
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={e => { e.stopPropagation(); setEditingCrane(crane); setShowCraneForm(true) }}
                    style={{ padding: '4px 10px', background: C.g500 + '30', color: C.g300, border: 'none', borderRadius: 6, fontSize: 10, cursor: 'pointer' }}>✏️</button>
                  <button onClick={e => { e.stopPropagation(); deleteCrane(crane.id) }}
                    style={{ padding: '4px 10px', background: C.red + '15', color: C.red, border: 'none', borderRadius: 6, fontSize: 10, cursor: 'pointer' }}>🗑️</button>
                </div>
              </div>

              {isExp && (
                <div style={{ borderTop: `1px solid ${C.g500}25`, padding: '12px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.greenLight }}>Konfigürasyonlar</span>
                    <button onClick={() => { setEditingConfig(null); setShowConfigForm(crane.id) }}
                      style={{ padding: '5px 14px', background: C.yellow + '15', color: C.yellow, border: `1px solid ${C.yellow}30`, borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                      + Konfigürasyon Ekle</button>
                  </div>
                  {cfgCnt === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: C.g500, fontSize: 11 }}>
                      Henüz konfigürasyon yok. Her konfigürasyon farklı CW, boom, ayak açıklığı ve yük tablosu içerebilir.
                    </div>
                  )}
                  {crane.configs?.map((cfg, idx) => (
                    <ConfigCard key={cfg.id} config={cfg} loadCharts={loadCharts} isLast={idx === cfgCnt - 1}
                      onEdit={() => { setEditingConfig(cfg); setShowConfigForm(crane.id) }}
                      onDelete={() => deleteConfig(cfg.id)} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {showCraneForm && <CraneFormModal crane={editingCrane} onSave={saveCrane}
        onClose={() => { setShowCraneForm(false); setEditingCrane(null) }} />}
      {showConfigForm && <ConfigFormModal config={editingConfig} craneId={showConfigForm} loadCharts={loadCharts}
        onSave={cfg => saveConfig(cfg, showConfigForm)}
        onClose={() => { setShowConfigForm(null); setEditingConfig(null) }} />}
    </div>
  )
}

// ═══ CONFIG CARD ═══
function ConfigCard({ config, loadCharts, isLast, onEdit, onDelete }: {
  config: Config; loadCharts: any[]; isLast: boolean; onEdit: () => void; onDelete: () => void
}) {
  const vehicles: Vehicle[] = config.transport_vehicles || []
  const totalV = vehicles.reduce((s, v) => s + v.count, 0)
  const boomLbl = BOOM_TYPES.find(b => b.id === config.boom_type)?.label || config.boom_type
  const outLbl = OUTRIGGER_OPTS.find(o => o.id === config.outrigger_config)?.label || config.outrigger_config
  const chart = loadCharts.find(c => c.id === config.load_chart_id)

  return (
    <div style={{ padding: '12px 14px', background: C.dark + 'AA', borderRadius: 10, marginBottom: isLast ? 0 : 8, border: `1px solid ${C.g500}20` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.yellow }}>{config.name}</div>
          {config.description && <div style={{ fontSize: 10, color: C.g300, marginTop: 2 }}>{config.description}</div>}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={onEdit} style={smallBtn}>✏️</button>
          <button onClick={onDelete} style={{ ...smallBtn, background: C.red + '12', color: C.red }}>🗑️</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
        {config.counterweight && <Tag label={`CW: ${config.counterweight}`} color={C.orange} />}
        <Tag label={boomLbl} color={C.greenLight} />
        {config.max_boom && <Tag label={`Boom: ${config.max_boom}m`} color="#4FC3F7" />}
        {config.max_capacity_at_config && <Tag label={`Kap: ${config.max_capacity_at_config}t`} color={C.yellow} />}
        <Tag label={`Ayak: ${outLbl}`} color="#AB47BC" />
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 10, marginBottom: vehicles.length > 0 ? 6 : 0 }}>
        <span style={{ color: C.g500 }}>📊 Yük Tablosu:</span>
        {chart ? <span style={{ color: C.greenLight, fontWeight: 600 }}>{chart.name} ({chart.max_capacity}t / {chart.max_boom}m)</span>
          : <span style={{ color: C.g500, fontStyle: 'italic' }}>Bağlı değil</span>}
      </div>

      {vehicles.length > 0 && (
        <div style={{ marginTop: 6, padding: '8px 10px', background: C.surface, borderRadius: 8, border: `1px solid ${C.g500}15` }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: C.g300, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
            Nakliye — {totalV} araç
          </div>
          {vehicles.map((v, i) => {
            const vt = VEHICLE_TYPES.find(t => t.id === v.type)
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.white, marginBottom: 2 }}>
                <span>{vt?.icon || '📦'}</span>
                <span style={{ fontWeight: 600, minWidth: 22, textAlign: 'center', color: C.yellow }}>{v.count}×</span>
                <span>{vt?.label || v.type}</span>
                {v.notes && <span style={{ color: C.g500, fontSize: 9 }}>— {v.notes}</span>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Tag({ label, color }: { label: string; color: string }) {
  return <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 8, background: color + '15', color, fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</span>
}

// ═══ CRANE FORM MODAL ═══
function CraneFormModal({ crane, onSave, onClose }: { crane: Crane | null; onSave: (c: any) => void; onClose: () => void }) {
  const [name, setName] = useState(crane?.name || '')
  const [mfr, setMfr] = useState(crane?.manufacturer || '')
  const [cType, setCType] = useState(crane?.crane_type || 'mobile')
  const [maxCap, setMaxCap] = useState(crane?.max_capacity || '')
  const [serial, setSerial] = useState(crane?.serial_number || '')
  const [year, setYear] = useState(crane?.year_of_manufacture || '')
  const [notes, setNotes] = useState(crane?.notes || '')

  const save = () => {
    if (!name.trim()) return alert('Vinç adı gerekli')
    onSave({ name: name.trim(), manufacturer: mfr.trim() || null, crane_type: cType,
      max_capacity: maxCap ? Number(maxCap) : null, serial_number: serial.trim() || null,
      year_of_manufacture: year ? Number(year) : null, notes: notes.trim() || null })
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ fontSize: 16, fontWeight: 800, color: C.yellow, marginBottom: 16 }}>
        {crane ? '✏️ Vinç Düzenle' : '🏗️ Yeni Vinç Ekle'}
      </div>
      <Field label="Vinç Adı *" placeholder="LTM 1300-6.2" value={name} onChange={setName} />
      <Field label="Üretici" placeholder="Liebherr" value={mfr} onChange={setMfr} />
      <div style={{ marginBottom: 12 }}>
        <label style={lbl}>Vinç Tipi</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CRANE_TYPES.map(t => (
            <button key={t.id} onClick={() => setCType(t.id)}
              style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${cType === t.id ? C.yellow : C.g500}40`,
                background: cType === t.id ? C.yellow + '15' : 'transparent', color: cType === t.id ? C.yellow : C.g300,
                fontSize: 11, cursor: 'pointer', fontWeight: cType === t.id ? 700 : 400 }}>{t.label}</button>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <Field label="Maks Kapasite (t)" placeholder="300" value={maxCap} onChange={setMaxCap} type="number" />
        <Field label="Seri No" placeholder="ABC-1234" value={serial} onChange={setSerial} />
        <Field label="Üretim Yılı" placeholder="2019" value={year} onChange={setYear} type="number" />
      </div>
      <Field label="Notlar" placeholder="Opsiyonel notlar..." value={notes} onChange={setNotes} multiline />
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
        <button onClick={onClose} style={btnSec}>İptal</button>
        <button onClick={save} style={btnPri}>Kaydet</button>
      </div>
    </Modal>
  )
}

// ═══ CONFIG FORM MODAL ═══
function ConfigFormModal({ config, craneId, loadCharts, onSave, onClose }: {
  config: Config | null; craneId: string; loadCharts: any[]; onSave: (c: any) => void; onClose: () => void
}) {
  const [name, setName] = useState(config?.name || '')
  const [desc, setDesc] = useState(config?.description || '')
  const [cw, setCw] = useState(config?.counterweight || '')
  const [bType, setBType] = useState(config?.boom_type || 'telescopic')
  const [maxB, setMaxB] = useState(config?.max_boom || '')
  const [maxC, setMaxC] = useState(config?.max_capacity_at_config || '')
  const [outrig, setOutrig] = useState(config?.outrigger_config || 'full')
  const [chartId, setChartId] = useState(config?.load_chart_id || '')
  const [vehicles, setVehicles] = useState<Vehicle[]>(config?.transport_vehicles || [])

  const addV = () => setVehicles([...vehicles, { type: 'lowbed', count: 1, notes: '' }])
  const rmV = (i: number) => setVehicles(vehicles.filter((_, idx) => idx !== i))
  const updV = (i: number, f: string, val: any) => { const n = [...vehicles]; (n[i] as any)[f] = val; setVehicles(n) }

  const save = () => {
    if (!name.trim()) return alert('Konfigürasyon adı gerekli')
    onSave({ name: name.trim(), description: desc.trim() || null, counterweight: cw.trim() || null,
      boom_type: bType, max_boom: maxB ? Number(maxB) : null, max_capacity_at_config: maxC ? Number(maxC) : null,
      outrigger_config: outrig, load_chart_id: chartId || null, transport_vehicles: vehicles.filter(v => v.count > 0) })
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ fontSize: 16, fontWeight: 800, color: C.yellow, marginBottom: 16 }}>
        {config ? '✏️ Konfigürasyon Düzenle' : '⚙️ Yeni Konfigürasyon'}
      </div>
      <Field label="Konfigürasyon Adı *" placeholder="Teleskopik 87.5t CW — 84m boom" value={name} onChange={setName} />
      <Field label="Açıklama" placeholder="Notlar..." value={desc} onChange={setDesc} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Field label="Counterweight" placeholder="87.5t" value={cw} onChange={setCw} />
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>Boom Tipi</label>
          <select value={bType} onChange={e => setBType(e.target.value)} style={sel}>
            {BOOM_TYPES.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <Field label="Maks Boom (m)" placeholder="84" value={maxB} onChange={setMaxB} type="number" />
        <Field label="Maks Kapasite (t)" placeholder="300" value={maxC} onChange={setMaxC} type="number" />
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>Ayak Açıklığı</label>
          <select value={outrig} onChange={e => setOutrig(e.target.value)} style={sel}>
            {OUTRIGGER_OPTS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={lbl}>📊 Yük Tablosu Bağla</label>
        <select value={chartId} onChange={e => setChartId(e.target.value)} style={sel}>
          <option value="">— Tablo seçin —</option>
          {loadCharts.map(ch => <option key={ch.id} value={ch.id}>{ch.name} ({ch.max_capacity}t / {ch.max_boom}m)</option>)}
        </select>
        <div style={{ fontSize: 9, color: C.g500, marginTop: 3 }}>Menzil Şeması'ndan yüklenen CSV tabloları burada listelenir.</div>
      </div>

      <div style={{ marginBottom: 16, padding: 14, background: C.dark, borderRadius: 10, border: `1px solid ${C.g500}20` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <label style={{ ...lbl, margin: 0 }}>🚛 Nakliye Araçları</label>
          <button onClick={addV}
            style={{ padding: '4px 12px', background: C.yellow + '15', color: C.yellow, border: `1px solid ${C.yellow}30`, borderRadius: 6, fontSize: 10, cursor: 'pointer', fontWeight: 600 }}>+ Araç Ekle</button>
        </div>
        {vehicles.length === 0 && <div style={{ textAlign: 'center', padding: '12px 0', color: C.g500, fontSize: 10 }}>Bu konfigürasyonun nakliyesi için gerekli araçları ekleyin.</div>}
        {vehicles.map((v, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
            <select value={v.type} onChange={e => updV(i, 'type', e.target.value)} style={{ ...sel, flex: '0 0 140px', marginBottom: 0 }}>
              {VEHICLE_TYPES.map(vt => <option key={vt.id} value={vt.id}>{vt.icon} {vt.label}</option>)}
            </select>
            <input type="number" value={v.count} min={1} max={99} onChange={e => updV(i, 'count', Number(e.target.value))}
              style={{ ...inp, width: 48, textAlign: 'center' as any, marginBottom: 0 }} />
            <span style={{ fontSize: 10, color: C.g500, whiteSpace: 'nowrap' }}>adet</span>
            <input value={v.notes} onChange={e => updV(i, 'notes', e.target.value)} placeholder="Not..."
              style={{ ...inp, flex: 1, marginBottom: 0, fontSize: 10 }} />
            <button onClick={() => rmV(i)}
              style={{ padding: '4px 8px', background: C.red + '15', color: C.red, border: 'none', borderRadius: 5, fontSize: 10, cursor: 'pointer', flexShrink: 0 }}>✕</button>
          </div>
        ))}
        {vehicles.length > 0 && (
          <div style={{ textAlign: 'right', fontSize: 10, color: C.yellow, fontWeight: 700, marginTop: 6 }}>
            Toplam: {vehicles.reduce((s, v) => s + v.count, 0)} araç
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={btnSec}>İptal</button>
        <button onClick={save} style={btnPri}>Kaydet</button>
      </div>
    </Modal>
  )
}

// ═══ SHARED ═══
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: C.surface, borderRadius: 16, padding: 24, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', border: `1px solid ${C.green}30` }}
        onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  )
}

function Field({ label, placeholder, value, onChange, type = 'text', multiline = false }: {
  label: string; placeholder?: string; value: any; onChange: (v: any) => void; type?: string; multiline?: boolean
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={lbl}>{label}</label>
      {multiline ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={2} style={{ ...inp, resize: 'vertical' as any }} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inp} />}
    </div>
  )
}

const lbl: React.CSSProperties = { display: 'block', fontSize: 10, fontWeight: 700, color: C.g300, marginBottom: 4, textTransform: 'uppercase' as any, letterSpacing: 0.5 }
const inp: React.CSSProperties = { width: '100%', padding: '8px 10px', background: C.dark, border: `1px solid ${C.g500}40`, borderRadius: 8, color: C.white, fontSize: 12, outline: 'none', boxSizing: 'border-box' as any }
const sel: React.CSSProperties = { ...inp, cursor: 'pointer' }
const btnPri: React.CSSProperties = { padding: '8px 24px', background: C.green, color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }
const btnSec: React.CSSProperties = { padding: '8px 20px', background: 'transparent', color: C.g300, border: `1px solid ${C.g500}40`, borderRadius: 8, fontSize: 12, cursor: 'pointer' }
const smallBtn: React.CSSProperties = { padding: '3px 8px', background: C.g500 + '25', color: C.g300, border: 'none', borderRadius: 5, fontSize: 9, cursor: 'pointer' }
