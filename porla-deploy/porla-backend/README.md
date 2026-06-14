# PORLA.AI Backend — Sozlash Yo'riqnomasi

Bu backend ikki AI xizmatini birlashtiradi:
1. **Face++** — yuzdan teri tahlili (porlar, akne, ajinlar, dog'lar, va h.k.)
2. **Claude (Anthropic)** — Face++ natijalariga asoslanib, tabiiy o'zbek tilida shaxsiy tavsiya va mahsulot tanlovi

---

## 1. O'rnatish

```bash
cd porla-backend
npm install
```

## 2. API Kalitlarini Sozlash

Ikki usul bor:

### Usul A — Environment variables (tavsiya etiladi)

```bash
export FACEPP_API_KEY="hUM2ejJ9aTfErLfTDTzyxtuA1_2eFjg2"
export FACEPP_API_SECRET="heiii5M9lUHO5As8cJt0xLRMcHlYCXeZ"
export ANTHROPIC_API_KEY="sk-ant-..."   # Claude tavsiyasi uchun
```

### Usul B — server.js faylida to'g'ridan-to'g'ri

`server.js` faylida Face++ kalitlari allaqachon kiritilgan. Claude kaliti uchun:

```js
const CLAUDE_KEY = process.env.ANTHROPIC_API_KEY || "sk-ant-SIZNING_KALITINGIZ";
```

> ⚠️ **Eslatma:** Agar `ANTHROPIC_API_KEY` berilmasa, sayt ishlayveradi — lekin Claude tavsiyasi o'rniga oddiy (statik) tavsiya ko'rsatiladi. Heatmap va Face++ tahlili baribir ishlaydi.

## 3. Serverni Ishga Tushirish

```bash
node server.js
```

Konsolda ko'rinishi kerak:
```
✅ PORLA.AI backend ishlamoqda: http://localhost:3001
```

Tekshirish uchun brauzerda oching: `http://localhost:3001/health`

```json
{ "status": "ok", "service": "PORLA.AI Backend", "faceplusplus": true, "claude": true }
```

## 4. Frontendni Ulash

`porla-ai.jsx` faylida:

```js
const BACKEND_URL = "http://localhost:3001/api/skin-analyze";
```

Production'ga deploy qilgandan keyin (Railway, Render, Vercel va h.k.) — bu URL'ni real domeningiz bilan almashtiring:

```js
const BACKEND_URL = "https://porla-backend.up.railway.app/api/skin-analyze";
```

---

## Qanday ishlaydi?

```
Foydalanuvchi selfie yuklaydi
        │
        ▼
  porla-ai.jsx (frontend)
        │  POST /api/skin-analyze { image_base64 }
        ▼
  server.js (backend)
        │
        ├─► Face++ API ─► teri ko'rsatkichlari (pores, acne, wrinkles...)
        │
        └─► Claude API ─► shu ko'rsatkichlarni o'qib,
                           o'zbek tilida tahlil + 3 mahsulot tavsiyasi
        │
        ▼
  Frontend: heatmap + AI Xulosa + Tavsiya kartalari
```

## Face++ Ko'rsatkichlari

| Field | Tasvir | Qiymat |
|---|---|---|
| `pores` | Kengaygan porlar (4 zona o'rtachasi) | 0-100 |
| `blackheads` | Qora nuqtalar | 0-100 |
| `wrinkles` | Ajinlar (5 turdan o'rtacha) | 0-100 |
| `pigmentation` | Dog'lar / pigment | 0-100 |
| `acne` | Akne | 0-100 |
| `dark_circle` | Ko'z osti qorayishi | 0-100 |
| `hydration` | Namlik (taxminiy, porlardan kelib chiqib) | 0-100 |
| `skin_type` | Teri turi | quruq / yog'li / aralash / sezgir |
| `skin_age` | Tahminiy teri yoshi | son |

## Claude Tavsiyasi Formati

```json
{
  "summary": "Teringizda asosan kengaygan porlar va akne ko'zga tashlanadi...",
  "top_concerns": ["pores", "acne"],
  "recommendations": [
    { "id": 6, "reason": "AHA BHA PHA toner porlarni tozalashga yordam beradi..." },
    { "id": 22, "reason": "Gelatin maska qora nuqtalarni olib tashlaydi..." },
    { "id": 17, "reason": "SPF kelajakdagi pigmentatsiyani oldini oladi..." }
  ]
}
```

---

## Muammolarni Bartaraf Etish

**"Demo rejim" ko'rsatilmoqda** → Backend ishga tushirilmagan yoki `BACKEND_URL` noto'g'ri. `node server.js` ishlab turganini va portni tekshiring.

**"no_face" xatosi** → Face++ rasmda yuz topa olmadi. Yorug'roq, yaqinroq selfie kerak.

**Claude tavsiyasi ko'rinmaydi, lekin heatmap ishlaydi** → `ANTHROPIC_API_KEY` berilmagan yoki noto'g'ri. Sayt baribir statik tavsiya bilan ishlaydi.

**CORS xatosi** → `server.js`da `app.use(cors())` allaqachon bor — agar muammo davom etsa, frontend domenini aniq ko'rsating:
```js
app.use(cors({ origin: "https://your-frontend-domain.com" }));
```
