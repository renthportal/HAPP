'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function CranesPage() {
  const [charts, setCharts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => { loadCharts() }, [])

  const loadCharts = async () => {
    const { data } = await supabase
      .from('load_charts')
      .select('*')
      .order('is_preset', { ascending: false })
      .order('name')
    setCharts(data || [])
    setLoading(false)
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-500">Yükleniyor...</div>

  const presets = charts.filter(c => c.is_preset)
  const custom = charts.filter(c => !c.is_preset)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-white">Vinçler & Yük Tabloları</h1>
          <p className="text-sm text-gray-500">{charts.length} yük tablosu kayıtlı</p>
        </div>
        <button className="px-5 py-2.5 bg-happ-yellow text-happ-dark font-bold rounded-lg text-sm hover:bg-yellow-400">
          + Yük Tablosu Ekle
        </button>
      </div>

      {/* Preset tablolar */}
      <h2 className="text-sm font-medium text-gray-400 mb-3">Hazır Tablolar</h2>
      <div className="grid gap-3 mb-8">
        {presets.map(chart => (
          <div key={chart.id} className="bg-happ-surface border border-happ-green/15 rounded-xl p-5 flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">{chart.name}</h3>
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                <span>{chart.manufacturer} {chart.model}</span>
                <span>{chart.max_capacity}t maks</span>
                <span>{chart.max_boom}m boom</span>
                <span>{chart.boom_lengths?.length || 0} kademe</span>
                <span>{(chart.chart_data as any[])?.length || 0} menzil noktası</span>
              </div>
            </div>
            <span className="text-xs bg-happ-green/20 text-happ-green-light px-2 py-1 rounded">Preset</span>
          </div>
        ))}
      </div>

      {/* Kullanıcı tabloları */}
      <h2 className="text-sm font-medium text-gray-400 mb-3">Kendi Tablolarım</h2>
      {custom.length === 0 ? (
        <div className="text-center py-12 bg-happ-surface border border-happ-green/15 rounded-xl">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-gray-400 text-sm">Henüz özel yük tablosu eklemediniz</p>
          <p className="text-gray-600 text-xs mt-1">CSV import veya manuel giriş ile ekleyebilirsiniz</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {custom.map(chart => (
            <div key={chart.id} className="bg-happ-surface border border-happ-green/15 rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">{chart.name}</h3>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  <span>{chart.max_capacity}t maks</span>
                  <span>{chart.max_boom}m boom</span>
                </div>
              </div>
              <button className="text-xs text-gray-600 hover:text-red-400">Sil</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
