# PORLA.AI — Deploy Qo'llanmasi

Bu papkada PORLA.AI K-Beauty saytining to'liq kodi joylashgan: **frontend** (React + Vite) va **backend** (`porla-backend/` — Express, Face++ va Claude API).

## 📁 Tuzilma

```
porla-deploy/
├── index.html
├── package.json          ← frontend (Vite + React)
├── vite.config.js
├── .env.example           ← frontend muhit o'zgaruvchilari namunasi
├── src/
│   ├── main.jsx           ← kirish nuqtasi
│   ├── App.jsx            ← asosiy sayt komponenti (1478 qator)
│   ├── index.css
│   └── storageShim.js     ← admin panel uchun localStorage shim
└── porla-backend/         ← AI teri tahlili backend (Express)
    ├── server.js
    ├── package.json
    ├── .env.example
    └── README.md
```

---

## 1️⃣ Frontendni mahalliy ishga tushirish

```bash
npm install
npm run dev
```

Brauzerda `http://localhost:5173` ochiladi.

### Build (production uchun)

```bash
npm run build
```

Natija `dist/` papkasida hosil bo'ladi — bu papkani har qanday static hosting'ga (Vercel, Netlify, Cloudflare Pages) yuklash mumkin.

---

## 2️⃣ Frontendni Vercel'ga deploy qilish (tavsiya etiladi)

1. Bu papkani GitHub repository'ga yuklang (pastdagi "Git bilan ishlash" bo'limiga qarang).
2. [vercel.com](https://vercel.com) → **New Project** → GitHub repo'ni tanlang.
3. Vercel avtomatik aniqlaydi: **Framework Preset: Vite**.
4. **Environment Variables** bo'limida qo'shing:
   - `VITE_BACKEND_URL` = backend deploy qilingandan keyingi to'liq URL, masalan:
     `https://porla-backend.onrender.com/api/skin-analyze`
5. **Deploy** tugmasini bosing.

> Agar backend'ni hali deploy qilmagan bo'lsangiz, `VITE_BACKEND_URL`ni vaqtincha bo'sh qoldiring — sayt baribir ishlaydi, AI tahlil bo'limi "Demo rejim" ko'rsatadi.

### Muqobil: Netlify

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- Environment Variables bo'limida xuddi shu `VITE_BACKEND_URL`ni qo'shing.

---

## 3️⃣ Backendni deploy qilish

Backend AI skin-tahlil endpoint'ini (`/api/skin-analyze`) taqdim etadi. Buni quyidagi platformalarda bepul/arzon deploy qilish mumkin: **Render**, **Railway**, **Fly.io**.

### Render.com orqali (tavsiya etiladi)

1. `porla-backend/` papkasini alohida GitHub repo qilib yuklang (yoki monorepo'da subfolder sifatida qoldiring).
2. [render.com](https://render.com) → **New** → **Web Service** → GitHub repo'ni tanlang.
3. Sozlamalar:
   - **Root Directory**: `porla-backend` (agar monorepo bo'lsa)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. **Environment** bo'limida `.env.example` asosida quyidagilarni qo'shing:
   - `FACEPP_API_KEY`
   - `FACEPP_API_SECRET`
   - `ANTHROPIC_API_KEY` (ixtiyoriy — Claude validatsiya/tavsiya uchun)
   - `FRONTEND_URL` = Vercel'dagi frontend manzilingiz (CORS uchun, masalan `https://porla-ai.vercel.app`)
5. Deploy tugagach, sizga `https://xxxxx.onrender.com` ko'rinishidagi URL beriladi.
6. Bu URL'ni `https://xxxxx.onrender.com/api/skin-analyze` shaklida frontend'dagi `VITE_BACKEND_URL`ga qo'ying va frontendni qayta deploy qiling.

Batafsil — `porla-backend/README.md` faylida.

---

## 🔑 Kerakli API kalitlar

| Kalit | Qaerdan olinadi | Majburiy? |
|---|---|---|
| `FACEPP_API_KEY` / `FACEPP_API_SECRET` | [console.faceplusplus.com](https://console.faceplusplus.com) | ✅ Ha — AI teri tahlili uchun |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) | ❌ Yo'q — bo'lmasa, statik tavsiyalar ishlatiladi |

---

## ⚠️ Muhim eslatmalar

### Admin panel ma'lumotlari (localStorage)
`src/storageShim.js` admin paneldagi mahsulot o'zgarishlarini **brauzer localStorage'ida** saqlaydi. Bu degani:
- Har bir admin/qurilma o'z o'zgarishlarini ko'radi, boshqalarga ko'rinmaydi.
- Brauzer keshi tozalansa, ma'lumotlar yo'qoladi.

Agar barcha foydalanuvchilar/qurilmalar uchun **umumiy** mahsulot ma'lumotlar bazasi kerak bo'lsa, kelajakda buni haqiqiy backend + database (masalan PostgreSQL) bilan almashtirish tavsiya etiladi — `porla-backend`ga `/api/products` (GET/POST) endpoint qo'shish orqali.

### Git bilan ishlash
```bash
cd porla-deploy
git init
git add .
git commit -m "PORLA.AI initial commit"
git remote add origin <GITHUB_REPO_URL>
git push -u origin main
```

`.env` fayllari `.gitignore` orqali repo'ga tushmaydi — API kalitlarni faqat hosting platformasining Environment Variables bo'limida saqlang.

---

## ✅ Tezkor xulosa (checklist)

- [ ] `npm install && npm run dev` — mahalliy test
- [ ] GitHub repo yaratish va kodni yuklash
- [ ] Backend'ni Render/Railway'da deploy qilish + `.env` to'ldirish
- [ ] Frontend'ni Vercel/Netlify'da deploy qilish + `VITE_BACKEND_URL` sozlash
- [ ] Backend'dagi `FRONTEND_URL`ni Vercel manzili bilan yangilash (CORS)
- [ ] Saytni ochib, AI Tahlil bo'limini sinab ko'rish
