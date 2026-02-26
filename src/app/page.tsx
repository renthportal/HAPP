'use client'

import dynamic from 'next/dynamic'

const HappApp = dynamic(() => import('@/components/happ/HappApp'), { ssr: false })

export default function HomePage() {
  return <HappApp onSave={undefined} initialData={undefined} projectName="" />
}
