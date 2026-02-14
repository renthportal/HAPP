# VecH v4.0 — Rebrand Notes

## Değiştirilen Dosyalar:

### 1. `src/components/happ/HappApp.jsx` (REPLACE)
- Tüm "HAPP" → "VecH" 
- Logo: H-kutu yerine Hareket logosu (base64 embed)
- v4.0 tüm yeni özellikler dahil

### 2. `src/app/dashboard/page.tsx` (REPLACE)
- Suspense fix + temiz prop'lar

### 3. `public/logo-hareket.png` (NEW)
- Hareket logosu — favicon veya başka yerlerde kullanmak için

## Ayrıca Elle Güncellenmesi Gerekenler:

### `src/app/dashboard/DashboardShell.tsx`
Satır: `<span className="text-happ-yellow font-black text-xl tracking-[5px]">HAPP</span>`
Değiştir: `<span className="text-happ-yellow font-black text-xl tracking-[5px]">VecH</span>`

### `src/app/page.tsx` (Landing page)  
`HAPP` → `VecH` (3-4 yer)

### `src/app/layout.tsx`
`title: 'HAPP — Crane Lift Planning'` → `title: 'VecH — Crane Lift Planning'`

### `src/app/auth/login/page.tsx` & `register/page.tsx`
`HAPP` → `VecH` (logo text)
