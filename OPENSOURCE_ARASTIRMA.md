# HAPP Projesi İçin Açık Kaynak GitHub Araştırması

> Tarih: 2026-03-01
> Proje: HAPP — Vinç Kaldırma Planlaması ve Menzil Diyagramı Çizim Aracı

---

## 1. Doğrudan Rakipler (Vinç Planlama Yazılımları)

GitHub'da açık kaynak vinç planlama yazılımı **bulunmamaktadır**. Bu alan ticari yazılımlar tarafından domine edilmektedir:

| Yazılım | Tür | Not |
|---------|-----|-----|
| [3D Lift Plan](https://www.3dliftplan.com/) | Ticari (Web) | 900+ vinç verisi, tarayıcı tabanlı |
| [Liebherr Crane Planner 2.0](https://www.liebherr.com/en/aus/products/mobile-and-crawler-cranes/service/crane-planner/crane-planner.html) | Ücretsiz/Pro | 3D arayüz, gerçek makine verileri |
| [KranXpert Free](https://www.kranxpert.de/kranxpertfree.php) | Ücretsiz (Freeware) | Basit vinç planlama, kayıt/açma desteği |
| [LiftPlanner](https://liftplanner.com/) | Ticari | AutoCAD entegrasyonu, 3D planlama |

> **Sonuç:** HAPP bu alanda **benzersiz bir açık kaynak/web tabanlı çözüm** olma potansiyeline sahiptir.

---

## 2. Canvas Çizim Kütüphaneleri (HAPP'ın Çizim Motorunu Geliştirebilir)

Bu kütüphaneler HAPP'ın mevcut saf Canvas API kullanımını iyileştirmek veya değiştirmek için kullanılabilir:

### 2.1 Fabric.js ⭐ ~27.8k GitHub Stars
- **Repo:** [fabricjs/fabric.js](https://github.com/fabricjs/fabric.js)
- **Lisans:** MIT
- **Özellikler:** Nesne tabanlı canvas yönetimi, sürükle-bırak, gruplama, dönüştürme, SVG import/export
- **HAPP İçin Uygunluk:** ⭐⭐⭐⭐⭐ — HappApp.jsx'teki 2,652 satırlık canvas çizim kodunu büyük ölçüde basitleştirebilir
- **Web:** [fabricjs.com](https://fabricjs.com/)

### 2.2 Konva.js / React-Konva ⭐ ~10.9k GitHub Stars
- **Repo:** [konvajs/react-konva](https://github.com/konvajs/react-konva)
- **Lisans:** MIT
- **Özellikler:** React için resmi binding, katmanlama, önbellek, olay yönetimi, animasyonlar
- **HAPP İçin Uygunluk:** ⭐⭐⭐⭐⭐ — React projesi olduğundan en doğal entegrasyon
- **Web:** [konvajs.org](https://konvajs.org/)

### 2.3 Excalidraw ⭐ ~74.8k GitHub Stars
- **Repo:** [excalidraw/excalidraw](https://github.com/excalidraw/excalidraw)
- **Lisans:** MIT
- **Özellikler:** Collaborative whiteboard, hand-drawn stil, kütüphane desteği, karanlık mod
- **HAPP İçin Uygunluk:** ⭐⭐⭐ — Genel çizim aracı, mühendislik hassasiyeti sınırlı
- **Kullanıcılar:** Google Cloud, Meta, Notion, Obsidian

### 2.4 tldraw ⭐ ~33.3k GitHub Stars
- **Repo:** [tldraw/tldraw](https://github.com/tldraw/tldraw)
- **Lisans:** Apache 2.0
- **Özellikler:** İşbirlikli whiteboard, sonsuz canvas API, özelleştirilebilir
- **HAPP İçin Uygunluk:** ⭐⭐⭐ — Canvas API olarak kullanılabilir ama mühendislik odaklı değil

---

## 3. Web Tabanlı CAD Araçları (Benzer Mimari)

### 3.1 OpenWebCAD
- **Repo:** [bertyhell/openwebcad](https://github.com/bertyhell/openwebcad)
- **Lisans:** Açık kaynak
- **Tech:** React + Canvas API
- **Özellikler:** Çizgi, dikdörtgen, daire çizimi, nesne seçimi/silme, SVG export
- **HAPP İçin Uygunluk:** ⭐⭐⭐⭐ — Benzer mimari, referans alınabilir

### 3.2 JSketcher
- **Repo:** [xibyte/jsketcher](https://github.com/xibyte/jsketcher)
- **Lisans:** Açık kaynak
- **Özellikler:** 2D/3D parametrik modelleme, constraint solver (JavaScript/TypeScript)
- **HAPP İçin Uygunluk:** ⭐⭐⭐⭐ — Constraint-based çizim mantığı HAPP'a eklenebilir

### 3.3 CADAM — Text-to-CAD
- **Repo:** [Adam-CAD/CADAM](https://github.com/Adam-CAD/CADAM)
- **Lisans:** GPLv3
- **Tech:** Three.js + React Three Fiber + Supabase + Tailwind CSS
- **HAPP İçin Uygunluk:** ⭐⭐⭐⭐ — **Aynı tech stack** (Supabase + Tailwind), AI destekli CAD

### 3.4 Maker.js (Microsoft Garage)
- **Repo:** [maker.js](https://maker.js.org/)
- **Lisans:** Apache 2.0
- **Özellikler:** Parametrik 2D çizim, DXF/SVG/PDF export
- **HAPP İçin Uygunluk:** ⭐⭐⭐⭐ — PDF export ve parametrik çizim özellikleri HAPP ile örtüşüyor

### 3.5 OpenJSCAD
- **Repo:** [jscad/OpenJSCAD.org](https://github.com/jscad/OpenJSCAD.org)
- **Lisans:** MIT
- **Özellikler:** Tarayıcı tabanlı parametrik 2D/3D tasarım, modüler
- **HAPP İçin Uygunluk:** ⭐⭐⭐ — Daha çok 3D baskı odaklı

### 3.6 Canvas-Designer
- **Repo:** [muaz-khan/Canvas-Designer](https://github.com/muaz-khan/Canvas-Designer)
- **Lisans:** MIT
- **Özellikler:** Collaborative çizim, 15 kullanıcıya kadar senkronizasyon, bezier eğrileri
- **HAPP İçin Uygunluk:** ⭐⭐⭐ — Real-time collaboration özelliği eklemek için referans

---

## 4. Diyagram ve İş Akışı Araçları

### 4.1 React Flow ⭐ ~20k+ GitHub Stars
- **Repo:** [xyflow/react-flow](https://github.com/xyflow/react-flow)
- **Lisans:** MIT
- **Özellikler:** Node tabanlı editör, iş akışı oluşturucu
- **HAPP İçin Uygunluk:** ⭐⭐ — Vinç diyagramına değil, proje yönetimine uygun

### 4.2 React Diagrams
- **Repo:** [projectstorm/react-diagrams](https://github.com/projectstorm/react-diagrams)
- **Lisans:** MIT
- **Özellikler:** TypeScript, modüler, genişletilebilir diyagram motoru
- **HAPP İçin Uygunluk:** ⭐⭐ — Genel diyagram aracı

### 4.3 draw.io ⭐ ~39k+ GitHub Stars
- **Repo:** [jgraph/drawio](https://github.com/jgraph/drawio)
- **Lisans:** Apache 2.0
- **Özellikler:** Kapsamlı diyagram editörü, export, şablon desteği
- **HAPP İçin Uygunluk:** ⭐⭐ — Genel amaçlı diyagram, vinç planlamasına özel değil

---

## 5. İnşaat Sektörü Açık Kaynak Kaynakları

### 5.1 opensource.construction
- **Repo:** [opensource-construction](https://github.com/opensource-construction)
- **Açıklama:** AEC (Mimarlık, Mühendislik, İnşaat) sektörü açık kaynak proje dizini
- **HAPP İçin Uygunluk:** ⭐⭐⭐ — Topluluk bağlantıları ve işbirliği fırsatları

### 5.2 OpenProject ⭐ ~8k+ GitHub Stars
- **Repo:** [opf/openproject](https://github.com/opf/openproject)
- **Lisans:** GPLv3
- **Özellikler:** Proje yönetimi, Gantt şemaları, takım işbirliği
- **HAPP İçin Uygunluk:** ⭐⭐ — Proje yönetimi modülü için referans

---

## 6. Öneriler ve Sonuç

### En Yüksek Öncelikli Öneriler

| Sıra | Proje | Neden? |
|------|-------|--------|
| 1 | **Konva.js / React-Konva** | HAPP'ın React tabanlı canvas çizim motorunu modernize etmek için en uygun. HappApp.jsx'teki 2,652 satırlık saf canvas kodunu büyük ölçüde sadeleştirebilir. |
| 2 | **Fabric.js** | Nesne tabanlı canvas yönetimi ile vinç, bom, jib gibi nesnelerin sürükle-bırak, döndürme, ölçekleme işlemlerini kolaylaştırır. |
| 3 | **Maker.js** | Parametrik 2D çizim ve DXF/SVG/PDF export özellikleri HAPP'ın mevcut ihtiyaçlarıyla doğrudan örtüşüyor. |
| 4 | **OpenWebCAD** | Benzer mimari (React + Canvas), HAPP'ın CAD özelliklerini geliştirmek için referans kaynak. |
| 5 | **CADAM** | Aynı tech stack (Supabase + Tailwind), AI destekli CAD yaklaşımı HAPP'a ilham verebilir. |

### Pazar Fırsatı

Araştırma sonucunda **vinç kaldırma planlaması alanında hiçbir açık kaynak GitHub projesi bulunmamaktadır**. Bu, HAPP'ın bu nişte ilk açık kaynak alternatif olma potansiyeline sahip olduğunu göstermektedir. Mevcut rakipler (3D Lift Plan, Liebherr Crane Planner, KranXpert) tamamen ticari veya kapalı kaynak çözümlerdir.
