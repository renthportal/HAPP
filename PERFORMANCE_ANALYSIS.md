# HAPP (Hangel) — Performans Analizi ve Optimizasyon Raporu

**Tarih:** 2026-02-18
**Proje:** Vinç Kaldırma Planlama Uygulaması (Next.js 14 + Supabase)

---

## 1. Yönetici Özeti

HAPP, Next.js 14 App Router + Supabase tabanlı bir vinç planlama uygulamasıdır. Analiz sonucunda **6 kritik**, **8 orta** ve **5 düşük** öncelikli performans sorunu tespit edilmiştir. En büyük darboğazlar: monolitik 2300 satırlık ana bileşen, her frame'de tam canvas yeniden çizimi, eksik veri önbellekleme ve gereksiz yeniden render'lar.

---

## 2. Kritik Sorunlar (Yüksek Etki)

### 2.1 Monolitik HappApp.jsx (2300+ satır)
**Dosya:** `src/components/happ/HappApp.jsx`
**Sorun:** Tek bir dev JSX dosyasında tüm uygulama mantığı: canvas çizimi, form kontrolleri, PDF oluşturma, CSV import, vinç arama motoru, hesaplamalar, 30+ useState hook'u.
**Etki:**
- Her state değişikliğinde tüm bileşen ağacı yeniden değerlendirilir
- Tree-shaking verimsiz — kullanılmayan kodlar bundle'a dahil olur
- Hot Module Replacement (HMR) yavaşlar (geliştirme deneyimi)
- Kod bölünmesi (code splitting) yapılamaz

**Çözüm:**
- `RangeChart`, `PDFPreview`, `CraneSearch`, `LiftPlanForm`, `CalcTab`, `ExportTab` ayrı bileşenlere taşınsın
- `React.memo()` ile alt bileşenler sarılsın
- Büyük bileşenler `dynamic()` ile lazy-load yapılsın

### 2.2 Canvas Her Frame'de Tam Yeniden Çizim
**Dosya:** `src/components/happ/HappApp.jsx:619-1031`
**Sorun:** `draw` callback'i her render'da yeniden oluşturuluyor ve 1031 satırda 30+ bağımlılık ile `useCallback` kullanılsa da her cfg değişikliğinde tüm canvas sıfırdan çiziliyor.
**Etki:** Drag sırasında 60fps hedefine ulaşılamıyor, mobilde kasma.

**Çözüm:**
- Katmanlı canvas (layered canvas): arka plan/grid ayrı, crane/boom ayrı, objects ayrı
- Dirty flag sistemi: yalnızca değişen katmanı yeniden çiz
- `requestAnimationFrame` throttle'ı zaten var ama draw fonksiyonunun bağımlılık listesi çok geniş

### 2.3 Inline Style Objeleri Her Render'da Yeniden Oluşturuluyor
**Dosya:** `src/components/happ/HappApp.jsx` (tüm dosya boyunca)
**Sorun:** Yüzlerce inline style objesi (`style={{...}}`) her render'da yeni referans oluşturur. React bunları her seferinde karşılaştırır.
**Etki:** Gereksiz DOM güncellemeleri, GC baskısı.

**Çözüm:**
- Sık kullanılan stiller `useMemo` ile ya da dosya seviyesinde sabit olarak tanımlansın
- Tailwind CSS'e geçiş düşünülebilir (dashboard sayfalarında zaten kullanılıyor)

### 2.4 Supabase İstemcisi Her Render'da Yeniden Oluşturuluyor
**Dosyalar:**
- `src/app/dashboard/projects/page.tsx:9`
- `src/app/dashboard/cranes/page.tsx:8`
- `src/app/dashboard/team/page.tsx:12`
- `src/app/dashboard/settings/page.tsx:10`
- `src/app/dashboard/DashboardShell.tsx:27`

**Sorun:** `const supabase = createClient()` bileşen gövdesinde çağrılıyor, her render'da yeni istemci oluşur.
**Etki:** Gereksiz obje oluşturma, potansiyel bağlantı sızıntısı.

**Çözüm:**
- `useMemo` veya `useRef` ile singleton pattern uygulanmalı
- Veya modül seviyesinde tek bir istemci oluşturulmalı

### 2.5 Veri Sorgularında Önbellekleme Yok
**Dosyalar:** Tüm dashboard sayfaları
**Sorun:** Her sayfa yüklendiğinde veritabanına tam sorgu atılıyor, sonuçlar önbelleğe alınmıyor.
**Etki:**
- Sayfa geçişlerinde gereksiz yeniden sorgu
- `projects/page.tsx` — `select('*')` tüm kolonları çekiyor (JSONB dahil)
- `cranes/page.tsx` — tüm chart verisi her seferinde indiriliyor

**Çözüm:**
- React Query / SWR ile istemci tarafı önbellekleme
- `select('*')` yerine gerekli kolonlar belirtilsin
- Supabase RPC veya view kullanımı

### 2.6 Base64 Logo (37KB) Bundle'a Gömülü
**Dosya:** `src/components/happ/HappApp.jsx:8`
**Sorun:** `LOGO_DATA` sabit bir base64 string (~37KB) JavaScript bundle'ına dahil.
**Etki:** Bundle boyutu gereksiz büyüyor, parse süresi artıyor.

**Çözüm:**
- Logo'yu `/public` dizinine taşı, `<img src="/logo.jpg">` ile yükle
- Next.js Image bileşeni kullanarak otomatik optimizasyon

---

## 3. Orta Öncelikli Sorunlar

### 3.1 SVG Crane Görselleri String Olarak Saklanıyor
**Dosya:** `src/components/happ/HappApp.jsx:31-34`
**Sorun:** ~3KB × 4 vinç SVG'si string olarak JavaScript'te, `encodeURIComponent` ile data URI'ye dönüştürülüyor.
**Çözüm:** SVG dosyaları `/public` dizinine, `<Image>` bileşeni ile yükleme.

### 3.2 Sayfalamaya (Pagination) Destek Yok
**Dosyalar:** `projects/page.tsx`, `cranes/page.tsx`, `team/page.tsx`
**Sorun:** Tüm veriler tek sorguda çekiliyor.
**Çözüm:** `range()` veya `limit/offset` ile sayfalama eklenmeli.

### 3.3 Dashboard Layout Her İstekte Profil + Takım Sorgusu Yapıyor
**Dosya:** `src/app/dashboard/layout.tsx:16-27`
**Sorun:** Server-side'da her sayfa yüklemesinde 3 Supabase sorgusu: getUser, profiles, team_members.
**Çözüm:**
- Next.js `unstable_cache` veya `revalidate` kullanımı
- Veriyi istemci tarafında Context ile paylaşma

### 3.4 `window.scrollTo(0,0)` Mobil İçin Hack
**Dosya:** `src/components/happ/HappApp.jsx:480` (MobNum bileşeni)
**Sorun:** `onFocus` ve `onBlur`'da `setTimeout(() => window.scrollTo(0,0), 50/100)` çağrısı yapılıyor.
**Çözüm:** CSS `scroll-padding` veya `inputMode` özelliği ile native çözüm.

### 3.5 `useEffect` Eksik Bağımlılıklar
**Dosyalar:**
- `projects/page.tsx:13` — `loadProjects` bağımlılık listesinde yok
- `team/page.tsx:14` — `loadTeams` bağımlılık listesinde yok
- `HappApp.jsx:1351` — `crane` bağımlılık yerine `cfg.craneType` kullanılmalı

**Çözüm:** Bağımlılık dizileri düzeltilmeli, ESLint `react-hooks/exhaustive-deps` aktif edilmeli.

### 3.6 `createClient()` Fonksiyon Bileşeni İçinde
**Sorun:** Supabase Browser Client her render'da yeniden oluşturuluyor.
**Çözüm:** Singleton pattern veya `useMemo`.

### 3.7 Yük Tablosu Verileri İstemcide Hardcoded
**Dosya:** `src/components/happ/HappApp.jsx:215-338`
**Sorun:** 5 adet yük tablosu (~8KB veri) JavaScript bundle'ına gömülü.
**Çözüm:** Veritabanına taşıma (mevcut `load_charts` tablosu zaten var), lazy loading.

### 3.8 CSS Tutarsızlığı: Inline Style vs Tailwind
**Sorun:** HappApp.jsx tamamen inline styles kullanırken, dashboard sayfaları Tailwind kullanıyor.
**Etki:** İki farklı styling sistemi = daha büyük bundle, bakım zorluğu.

---

## 4. Düşük Öncelikli Sorunlar

### 4.1 `document.querySelector("canvas")` Kullanımı
**Dosya:** `src/components/happ/HappApp.jsx:498, 1394`
**Sorun:** DOM sorgusu yerine `useRef` kullanılmalı.

### 4.2 `window.confirm()` / `window.prompt()` Kullanımı
**Dosyalar:** `dashboard/page.tsx:39`, `projects/page.tsx:40`, `HappApp.jsx:1653`
**Sorun:** Blocking dialog, kullanıcı deneyimini bozar.
**Çözüm:** Custom modal bileşeni.

### 4.3 Font Yükleme Optimizasyonu Yok
**Sorun:** `Inter` ve `Fira Code` fontları optimize edilmemiş.
**Çözüm:** `next/font` ile self-hosted font yükleme.

### 4.4 Image Optimizasyonu Eksik
**Dosya:** `DashboardShell.tsx:43`, `page.tsx:9`
**Sorun:** `<img>` yerine `next/image` kullanılmalı (logo).

### 4.5 `any` Tipi Yaygın Kullanımı
**Dosyalar:** Tüm TypeScript sayfaları
**Sorun:** `useState<any>`, `profile: any` — tip güvenliği yok.
**Etki:** Runtime hataları, geliştirici deneyimi kötü.

---

## 5. Veritabanı Performansı

### 5.1 Mevcut İndeksler (İyi)
- `projects.user_id`, `projects.team_id`, `projects.status` — Mevcut ve yeterli
- RLS politikaları doğru yapılandırılmış

### 5.2 Eksik Optimizasyonlar
- `select('*')` yerine gerekli alan seçimi yapılmalı (özellikle `projects` tablosu — JSONB alanları büyük)
- `load_charts.chart_data` JSONB alanı büyük olabilir — liste görünümünde gereksiz

### 5.3 N+1 Sorgu Riski
- `team/page.tsx:loadTeams` — önce memberships, sonra her takım için ayrı members sorgusu
- Supabase'in join desteği (`select('*, teams(*)')`) zaten kullanılıyor (iyi)

---

## 6. Bundle Boyutu Analizi

| Bileşen | Tahmini Boyut | Notlar |
|---------|---------------|-------|
| HappApp.jsx | ~75KB (minified) | Canvas, SVG, hesaplamalar, PDF, UI dahil |
| Base64 Logo | ~37KB | Bundle'dan çıkarılabilir |
| Hardcoded Yük Tabloları | ~8KB | DB'ye taşınabilir |
| SVG Crane Görselleri | ~12KB | Ayrı dosyalara taşınabilir |
| **Potansiyel Tasarruf** | **~57KB** | Logo + tablolar + SVG'ler |

---

## 7. Uygulanan Optimizasyonlar

Bu analiz kapsamında aşağıdaki optimizasyonlar uygulanmıştır:

### 7.1 Supabase İstemci Singleton Paterni
`createClient()` çağrılarını modül seviyesinde tek sefere indirmek için singleton pattern uygulandı.

### 7.2 Projeler Sayfasında Select Optimizasyonu
`select('*')` yerine yalnızca gerekli kolonlar seçiliyor.

### 7.3 Next.js Config Optimizasyonları
- `reactStrictMode: true` eklendi
- `poweredByHeader: false` (güvenlik + minor perf)
- `compress: true` varsayılan zaten ama açıkça belirtildi

### 7.4 Canvas Draw Callback Optimizasyonu
- `draw` fonksiyonu içindeki bazı hesaplamalar memoize edildi

### 7.5 Middleware Route Matcher Optimizasyonu
- Yalnızca gerekli route'larda çalışması için matcher sıkılaştırıldı

---

## 8. Önerilen İyileştirme Yol Haritası

### Faz 1 — Hızlı Kazanımlar (Düşük Risk)
1. ~~Supabase singleton pattern~~ ✅
2. ~~`select('*')` → gerekli kolonlar~~ ✅
3. ~~Next.js config optimizasyonları~~ ✅
4. Base64 logo'yu `/public` dizinine taşı
5. `next/font` ile font optimizasyonu
6. `next/image` kullanımı

### Faz 2 — Orta Vadeli (Orta Risk)
1. HappApp.jsx modülerleştirme (ayrı bileşenler)
2. React Query/SWR ile veri önbellekleme
3. Sayfalama (pagination) ekleme
4. Katmanlı canvas mimarisi

### Faz 3 — Uzun Vadeli (Yüksek Risk)
1. HappApp.jsx TypeScript'e dönüştürme
2. State yönetimi (Zustand/Jotai)
3. Canvas Web Worker'a taşıma
4. Hardcoded verileri DB'ye migrasyon

---

## 9. Performans Metrikleri (Tahmini İyileştirme)

| Metrik | Mevcut (Tahmini) | Hedef |
|--------|-------------------|-------|
| Initial Bundle Size | ~250KB gzip | ~180KB gzip |
| Time to Interactive (TTI) | ~3.5s | ~2.0s |
| Canvas FPS (drag sırasında) | ~30fps | ~55fps |
| Dashboard sayfa geçişi | ~800ms | ~200ms (cache) |
| Lighthouse Performance | ~65 | ~85+ |
