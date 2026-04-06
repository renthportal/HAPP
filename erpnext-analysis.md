# ERPNext (frappe/erpnext) - Kapsamli Analiz

## 1. Genel Bakis

ERPNext, **GPL-3.0 lisansli, ucretsiz ve acik kaynakli bir Kurumsal Kaynak Planlama (ERP) sistemidir**. 2011 yilinda Frappe Technologies Pvt. Ltd. tarafindan olusturulmustur. Isletmelerin muhasebeden envantere, uretimden satisa kadar tum operasyonlarini tek bir entegre platformda yonetmelerini saglar.

- **Web sitesi**: https://frappe.io/erpnext
- **GitHub**: https://github.com/frappe/erpnext
- **Hedef kitle**: KOBi'ler ve buyuk isletmeler
- **Rakipler**: Odoo, SAP, Oracle NetSuite

---

## 2. Teknoloji Yigini (Tech Stack)

| Katman | Teknoloji |
|---|---|
| **Backend** | Python (%81.3) |
| **Frontend** | JavaScript (%16.6), HTML (%1.8) |
| **Web Framework** | Frappe Framework (full-stack Python/JS) |
| **UI Kutuphanesi** | Frappe UI (Vue.js tabanli) |
| **Veritabani** | MariaDB (birincil) |
| **Onbellek / Kuyruk** | Redis |
| **Web Sunucu** | Gunicorn (WSGI) + Nginx (reverse proxy) |
| **Gercek Zamanli** | Socket.IO |
| **Arkaplan Gorevleri** | RQ (Redis Queue) |
| **Paketleme** | Flit (`pyproject.toml`) |
| **Linting** | Ruff (Python 3.10+) |
| **Minimum Frappe** | >=17.0.0-dev, <18.0.0 |

**Temel Python Bagimliliklari**: `Unidecode`, `barcodenumber`, `rapidfuzz`, `holidays`, `googlemaps`, `plaid-python`, `python-youtube`, `pypng`, `mt-940`

---

## 3. Mimari (Architecture)

ERPNext, Frappe Framework uzerine kurulu **Model-View-Controller (MVC) mimarisi** kullanir.

### Temel Mimari Prensipler:

- **DocType-Odakli**: Her sey bir "DocType"dir. DocType hem veri modelini (veritabani tablo semasi) hem de gorunumu (form duzeni) tanimlar. Bir DocType olusturuldiginda otomatik olarak veritabani tablosu olusur.
- **Metadata-Odakli UI**: Gorunumler, DocType meta verilerinden (JSON tanimlari) tarayicida dinamik olarak uretilir.
- **Client-Server Iletisimi**: Istemci, sunucu ile JSON-RPC cagrilari uzerinden iletisim kurar.
- **Olay-Odakli Hook'lar**: Hem istemci (JS) hem sunucu (Python) tarafinda belge yasam dongusu olaylarina (before_save, on_submit, on_cancel vb.) hook eklenebilir.
- **Coklu Kiralama (Multi-Tenant)**: Frappe Bench, birden fazla sitenin ayni kod tabanini paylasmasi ancak ayri veritabanlarina sahip olmasi destekler.
- **Uygulama Tabanli Modulerlik**: ERPNext, Frappe Framework uzerinde calisan bir "Frappe uygulamasidir". Ek uygulamalar (HRMS, Payments, Lending vb.) yanina kurulabilir.

---

## 4. Ana Moduller

| Modul | Dizin | Aciklama |
|---|---|---|
| **Muhasebe (Accounts)** | `accounts/` | Defteri kebir, hesap plani, yevmiye kayitlari, satis/alis faturalari, odeme islemleri, vergi yonetimi, banka mutabakati, butceleme |
| **Satis (Selling)** | `selling/` | Teklifler, satis siparisleri, musteri yonetimi, fiyatlandirma kurallari |
| **Satin Alma (Buying)** | `buying/` | Satin alma siparisleri, tedarikci yonetimi, teklif talepleri |
| **Stok / Envanter (Stock)** | `stock/` | Depolar, stok hareketleri, urun yonetimi, seri numaralari, parti takibi, stok mutabakati, envanter degerleme (FIFO, hareketli ortalama) |
| **Uretim (Manufacturing)** | `manufacturing/` | Urun agaci (BOM), is emirleri, uretim planlama, rotalama, is kartlari |
| **Varlik Yonetimi (Assets)** | `assets/` | Varlik olusturma, amortisman, bakim, sermayelerme, elden cikarma |
| **CRM** | `crm/` | Muadaylar, firsatlar, e-posta kampanyalari, satis hatti |
| **Projeler (Projects)** | `projects/` | Proje takibi, gorevler, zaman cizelgeleri |
| **Kalite Yonetimi** | `quality_management/` | Kalite denetimleri, prosedurler, hedefler |
| **Destek (Support)** | `support/` | Sorun takibi, SLA yonetimi, garanti talepleri |
| **Fason Uretim (Subcontracting)** | `subcontracting/` | Dis kaynak uretim operasyonlari |
| **E-Ticaret** | `shopping_cart/` | Web tabanli musteri portali |
| **Bolgesel (Regional)** | `regional/` | Ulkeye ozgu vergi kurallari ve uyumluluk |
| **EDI** | `edi/` | B2B belge degisimi icin Elektronik Veri Degisimi |
| **Bakim (Maintenance)** | `maintenance/` | Planli bakim ziyaretleri |
| **Portal** | `portal/` | Musteri/tedarikci self-servis portali |
| **Telefon (Telephony)** | `telephony/` | Cagri entegrasyonu |

---

## 5. Depo Istatistikleri

| Metrik | Deger |
|---|---|
| **Yildizlar** | ~32,700 |
| **Fork'lar** | ~10,855 |
| **Katkilcilar** | 700+ |
| **Toplam Commit** | ~57,511 |
| **Acik Sorunlar** | ~2,107 |
| **Lisans** | GPL-3.0 |
| **Olusturulma Tarihi** | 8 Haziran 2011 |
| **Varsayilan Dal** | `develop` |
| **Son Guncelleme** | 6 Nisan 2026 (aktif olarak bakim yapiliyor) |
| **Birincil Dil** | Python |
| **Depo Boyutu** | ~1.6 GB |
| **Guncel Gelistirme Surumu** | 17.x.x-develop |
| **Son Kararlari Surum** | v16 (Ocak 2026) |

---

## 6. Kod Yapisi

```
erpnext/
  accounts/            -- Muhasebe ve finans (en buyuk modul)
  assets/              -- Sabit varlik yonetimi
  buying/              -- Satin alma
  selling/             -- Satis operasyonlari
  stock/               -- Envanter ve depolama
  manufacturing/       -- Uretim ve BOM
  crm/                 -- Musteri iliskileri yonetimi
  projects/            -- Proje yonetimi
  support/             -- Destek ve biletleme
  quality_management/  -- Kalite yonetim sistemi
  subcontracting/      -- Fason uretim
  regional/            -- Ulkeye ozgu uyumluluk
  edi/                 -- Elektronik veri degisimi
  shopping_cart/       -- E-ticaret
  telephony/           -- Cagri entegrasyonlari
  controllers/         -- Paylasilan kontrolor mantigi (vergiler, stok, hesaplar)
  erpnext_integrations/ -- Ucuncu taraf entegrasyonlari
  patches/             -- Veritabani migrasyon scriptleri
  setup/               -- Sirket/sistem kurulum sihirbazlari
  templates/           -- Jinja/HTML sablonlari
  public/              -- Statik dosyalar (JS, CSS, gorseller)
  www/                 -- Web sayfalari
  utilities/           -- Yardimci fonksiyonlar
  config/              -- Uygulama yapilandirmasi
  commands/            -- CLI komutlari
  locale/              -- Ceviri dosyalari
  hooks.py             -- Merkezi uygulama yapilandirmasi
  modules.txt          -- Modul kaydi
  patches.txt          -- Yama calistirma sirasi
```

Her modul dizini tipik olarak su alt dizinleri icerir:
- `doctype/` -- DocType tanimlari (JSON sema + Python kontrolorleri)
- `report/` -- Script raporlari ve sorgu raporlari
- `dashboard/` -- Gosterge paneli grafik yapilandirmalari
- `page/` -- Ozel sayfalar

---

## 7. API ve Entegrasyon

### REST API
Frappe Framework'e entegre kapsamli REST API:
- **CRUD**: `GET/POST/PUT/DELETE /api/resource/{doctype}/{name}`
- **RPC Metodlari**: `POST /api/method/{dotted.path.to.function}`
- **Veri Formati**: Tum iletisim JSON uzerinden

### Kimlik Dogrulama
1. **API Key + API Secret** -- HTTP basliklarinda
2. **Token Tabanli** -- Uzun sureli baglatilar icin
3. **OAuth 2.0** -- Ucuncu taraf erisimi icin

### Webhook'lar
Belge olaylarina (olusturma, guncelleme, onaylama, iptal, silme) tetiklenen giden webhook'lar desteklenir.

### Yerlesik Entegrasyonlar
- **Plaid** -- Banka veri senkronizasyonu
- **Google Maps** -- Adres/konum hizmetleri
- **YouTube** -- Video entegrasyonu
- **Odeme Gecitleri** -- `frappe/payments` uygulamasi uzerinden (Razorpay, Stripe, Braintree, PayPal, PayTM)
- **Banka Ekstre Ithali** -- MT-940 format desteği
- **E-posta Kampanyalari** -- CRM icin yerlesik e-posta otomasyonu

### Harici Entegrasyon Platformlari
REST API ve webhook'lar araciligiyla **n8n**, **Pipedream** ve **Zapier** ile entegre olur.

---

## 8. Veritabani

### Motor
- **Birincil**: MariaDB (10.6+ onerilen)
- **Deneysel**: PostgreSQL (Frappe seviyesinde desteklenir, ancak ERPNext resmi olarak desteklemez)
- **Onbellek**: Redis

### Sema Yonetimi
- **DocType-Odakli Sema**: DocType tanimlandiginda veritabani tablolari otomatik olusturulur/degistirilir. Her DocType bir `tab{DocType Name}` tablosuna eslenir.
- **ORM**: Frappe ozel ORM sunar (`frappe.get_doc()`, `frappe.get_list()`, `frappe.db.sql()`)
- **Migrasyonlar**: `patches/` dizini ve `patches.txt` dosyasi uzerinden yonetilir
- **Muhasebe Boyutlari**: 59 DocType ozel muhasebe boyutu alanlarini destekler

---

## 9. Dagitim (Deployment)

### Secenek 1: Frappe Cloud (Yonetilen Hosting)
- [frappecloud.com](https://frappecloud.com) uzerinden tek tikla dagitim

### Secenek 2: Docker (Kendi Sunucunuz)
- Resmi Docker kurulumu: [github.com/frappe/frappe_docker](https://github.com/frappe/frappe_docker)
- Docker Compose tabanli dagitim
- Konteynerler: Frappe/ERPNext uygulama sunucusu, MariaDB, Redis, Nginx, worker surecleri

### Secenek 3: Frappe Bench (Manuel Kurulum)
```bash
bench init frappe-bench
cd frappe-bench
bench get-app erpnext
bench new-site site.local
bench --site site.local install-app erpnext
```
**On Kosullar**: Python 3.10+, Node.js 18+, MariaDB 10.6+, Redis, wkhtmltopdf

### Altyapi Gereksinimleri
- **OS**: Linux/Ubuntu 20+ onerilen
- **Reverse Proxy**: Nginx
- **Surec Yoneticisi**: Supervisor veya systemd
- **SSL**: Let's Encrypt

---

## 10. Topluluk ve Ekosistem

### Cekirdek Framework
- **[frappe/frappe](https://github.com/frappe/frappe)** -- ERPNext'in uzerine insa edildigi full-stack web framework

### Resmi Yardimci Uygulamalar

| Uygulama | Depo | Aciklama |
|---|---|---|
| **Frappe HR (HRMS)** | [frappe/hrms](https://github.com/frappe/hrms) | IK yonetimi, bordro, devamsizlik, izin. v14'te ERPNext'ten ayrildi. |
| **Frappe Payments** | [frappe/payments](https://github.com/frappe/payments) | Odeme gecidi entegrasyonlari |
| **Frappe Lending** | [frappe/lending](https://github.com/frappe/lending) | Kredi yonetim sistemi |
| **Frappe Education** | [frappe/education](https://github.com/frappe/education) | Okul/egitim yonetimi |
| **Frappe Healthcare** | - | Klinik/hastane yonetimi |

### Dagitim ve DevOps Araclari
| Arac | Depo | Aciklama |
|---|---|---|
| **Frappe Bench** | [frappe/bench](https://github.com/frappe/bench) | Coklu kiralama dagitim yonetimi CLI |
| **Frappe Docker** | [frappe/frappe_docker](https://github.com/frappe/frappe_docker) | Resmi Docker imajlari |

### Topluluk Kaynaklari
- **Forum**: [discuss.frappe.io](https://discuss.frappe.io)
- **Dokumantasyon**: [docs.frappe.io/erpnext](https://docs.frappe.io/erpnext)
- **Ogrenme**: Frappe School
- **Telegram**: Topluluk destek grubu
- **Organizasyon**: [github.com/frappe](https://github.com/frappe) -- 50+ depo

### Surumleme
ERPNext, Frappe Framework ile uyumlu semantik surumleme kullanir. Guncel kararli surum **v16** (Ocak 2026), **v17** `develop` dalinda aktif gelistirme altindadir.

---

## Ozet

ERPNext, 32,700+ yildiz, 700+ katkilci ve 15 yillik gecmise sahip, olgun ve aktif olarak bakim yapilan bir acik kaynakli ERP sistemidir. Frappe Framework (Python/JavaScript/MariaDB) uzerine kuruludur ve metadata-odakli DocType mimarisi kullanir. Muhasebe, envanter, uretim, CRM, projeler, varlik yonetimi ve daha fazlasini kapsar. Ekosistem, IK, odemeler, kredi, egitim ve saglik modullerinin ayri kurulabilir uygulamalar olarak bakim yapildigi moduler bir yaklasima dogru evrilmistir.
