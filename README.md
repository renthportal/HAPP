# HAPP — Crane Lift Planning

Profesyonel vinç kaldırma planı oluşturma ve menzil diyagramı çizim aracı.

## Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Supabase (Auth + PostgreSQL + RLS)
- **Hosting:** Vercel
- **CI/CD:** GitHub → Vercel (otomatik deploy)

## Kurulum

```bash
# 1. Repo'yu klonla
git clone https://github.com/KULLANICI/HAPP.git
cd HAPP

# 2. Bağımlılıkları yükle
npm install

# 3. .env.local dosyası oluştur
cp .env.example .env.local
# Supabase URL ve anahtarlarını ekle

# 4. Supabase SQL migration'larını çalıştır
# Supabase Dashboard > SQL Editor > sırasıyla 001-004 dosyalarını çalıştır

# 5. Geliştirme sunucusunu başlat
npm run dev
```

## SQL Migration Sırası

Supabase Dashboard → SQL Editor'da sırasıyla çalıştır:

1. `supabase/migrations/001_profiles.sql` — Kullanıcı profilleri
2. `supabase/migrations/002_teams.sql` — Takım yönetimi
3. `supabase/migrations/003_projects.sql` — Projeler & vinçler & rehber
4. `supabase/migrations/004_load_charts.sql` — Yük tabloları + preset veriler

> ⚠️ Sıra önemli! Her migration bir öncekine bağımlı.

## Vercel Deploy

1. Vercel'e GitHub repo'yu bağla
2. Environment variables ekle (.env.example'daki anahtarlar)
3. Deploy!

## Proje Yapısı

```
src/
├── app/
│   ├── auth/           → Login, Register, OAuth callback
│   ├── dashboard/      → Ana uygulama (auth gerekli)
│   │   ├── projects/   → Proje listesi
│   │   ├── cranes/     → Vinç & yük tabloları
│   │   ├── team/       → Takım yönetimi
│   │   └── settings/   → Hesap ayarları
│   └── page.tsx        → Landing page
├── components/happ/    → HAPP v3 bileşenleri (buraya taşınacak)
├── lib/supabase/       → Supabase client (browser + server)
└── middleware.ts       → Auth guard
```
