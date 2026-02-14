'use client'
import dynamic from 'next/dynamic'

const HappApp = dynamic(() => import('@/components/happ/HappApp'), { 
  ssr: false,
  loading: () => (
    <div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0A1F12'}}>
      <div style={{textAlign:'center'}}>
        <div style={{color:'#FFC72C',fontWeight:900,fontSize:32,letterSpacing:6}}>HAPP</div>
        <div style={{color:'#6B7E70',fontSize:12,marginTop:8}}>Yükleniyor...</div>
      </div>
    </div>
  )
})

export default function DashboardPage() {
  return <HappApp />
}
