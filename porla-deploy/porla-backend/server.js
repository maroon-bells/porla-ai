// ═══════════════════════════════════════════════════════
//  PORLA.AI — Backend Server
//  Face++ Skin Analyze API + Claude API Recommendation
//
//  npm install express cors axios form-data
//  node server.js
// ═══════════════════════════════════════════════════════

require("dotenv").config();

const express  = require("express");
const cors     = require("cors");
const axios    = require("axios");
const FormData = require("form-data");

const app = express();

// ── CORS — frontend manzilini cheklash uchun ──
// .env faylida FRONTEND_URL ni o'rnatish tavsiya etiladi
// (masalan: https://porla-ai.vercel.app). Bo'sh bo'lsa, hamma uchun ochiq.
const FRONTEND_URL = process.env.FRONTEND_URL;
app.use(cors(FRONTEND_URL ? { origin: FRONTEND_URL } : {}));

app.use(express.json({ limit: "15mb" }));

// ── API kalitlari (.env faylidan o'qiladi — pastga qarang) ──
const FACEPP_KEY    = process.env.FACEPP_API_KEY    || "";
const FACEPP_SECRET = process.env.FACEPP_API_SECRET || "";
const CLAUDE_KEY    = process.env.ANTHROPIC_API_KEY || "";

const FACEPP_DETECT_URL = "https://api-us.faceplusplus.com/facepp/v3/detect";
const FACEPP_SKIN_URL   = "https://api-us.faceplusplus.com/facepp/v1/skinanalyze";
const CLAUDE_URL        = "https://api.anthropic.com/v1/messages";

if (!FACEPP_KEY || !FACEPP_SECRET) {
  console.warn("⚠️  FACEPP_API_KEY / FACEPP_API_SECRET o'rnatilmagan — teri tahlili ishlamaydi. .env faylini tekshiring.");
}
if (!CLAUDE_KEY) {
  console.warn("⚠️  ANTHROPIC_API_KEY o'rnatilmagan — Claude validatsiya va AI tavsiyalar o'tkazib yuboriladi.");
}

// ═══════════════════════════════════════════════════════
//  1. VALIDATSIYA — Detect API orqali sifat tekshirish
// ═══════════════════════════════════════════════════════
//
// Face++ /v3/detect quyidagilarni qaytaradi:
//   faces[0].attributes.facequality.value   (0-100, 100=eng yaxshi)
//   faces[0].attributes.blur.blurness.value (0-100, YUQORI = ko'proq blur/hira)
//   faces[0].face_rectangle  { width, height, ... }
//
// Bular orqali: yuz bormi? sifat yetarli mi? hira emasmi? yetarlicha katta mi?

async function validateFace(image_base64) {
  const form = new FormData();
  form.append("api_key",    FACEPP_KEY);
  form.append("api_secret", FACEPP_SECRET);
  form.append("image_base64", image_base64);
  form.append("return_attributes", "facequality,blur,headpose");

  const res = await axios.post(FACEPP_DETECT_URL, form, {
    headers: form.getHeaders(),
    timeout: 20000,
  });

  const data  = res.data;
  const faces = data.faces || [];

  // ── 1. Yuz umuman topilmadi ──
  if (faces.length === 0) {
    return { ok: false, error: "no_face" };
  }

  const face = faces[0];
  const attr = face.attributes || {};
  const rect = face.face_rectangle || {};

  // ── 2. Yuz juda kichik (uzoqdan olingan) ──
  // face_rectangle.width / image kengligi nisbati past bo'lsa — uzoq
  // Detect API image o'lchamini qaytarmaydi, shuning uchun absolyut piksel
  // o'lchamidan foydalanamiz: yuz kengligi 150px dan kichik bo'lsa, juda uzoq
  if (rect.width < 150 || rect.height < 150) {
    return { ok: false, error: "too_far" };
  }

  // ── 3. Rasm sifati past (facequality) ──
  const quality = attr.facequality?.value ?? 100;
  if (quality < 40) {
    return { ok: false, error: "bad_image" };
  }

  // ── 4. Rasm juda hira (blur) ──
  const blurness = attr.blur?.blurness?.value ?? 0;
  if (blurness > 50) {
    return { ok: false, error: "bad_light" }; // hira/sifatsiz — qaytadan so'raymiz
  }

  // ── 5. Boshning burchagi juda katta (yon profil) ──
  const yaw = Math.abs(attr.headpose?.yaw_angle ?? 0);
  const pitch = Math.abs(attr.headpose?.pitch_angle ?? 0);
  if (yaw > 40 || pitch > 35) {
    return { ok: false, error: "too_far" }; // burchak noto'g'ri — qayta so'raymiz
  }

  return { ok: true, face, rect };
}

// ═══════════════════════════════════════════════════════
//  1.5 — CLAUDE VALIDATSIYA — qo'shimcha tekshiruv
// ═══════════════════════════════════════════════════════
//
// Face++ detect ko'pincha yuzga o'xshash narsalarda (poster, qo'g'irchoq,
// rasm ichidagi rasm) ham "yuz topildi" deb javob beradi, va past sifat/blur
// chegaralari har doim aniq ishlamaydi. Shuning uchun Claude Vision orqali
// qo'shimcha — "bu haqiqatan ham LIVE inson yuzi, aniq va makiyajsiz selfie mi?"
// tekshiruvini qilamiz.
//
// Bu funksiya Face++ validatsiyasidan KEYIN, lekin skin-analyze dan OLDIN
// chaqiriladi — shunda noto'g'ri rasm Face++ kreditini sarflamaydi.

async function validateWithClaude(image_base64, mediaType = "image/jpeg") {
  if (!CLAUDE_KEY) return { ok: true }; // Claude kaliti yo'q — bu bosqichni o'tkazib yuboramiz

  const prompt = `Siz PORLA.AI uchun rasm sifatini tekshiruvchi yordamchisiz. Quyidagi rasmni ko'rib, faqat ushbu savollarga javob bering:

1. Rasmda ANIQ bitta inson yuzi (selfie) bormi? (boshqa odam, hayvon, narsa, peyzaj, ekran skrinshoti, chizma/karikatura emas)
2. Yuz YETARLI YAQIN va KATTA ko'rinadimi (yuz rasmning kamida 25%ini egallaydi)?
3. Rasm YETARLI ANIQ (hira/blur emas, fokusda)?
4. Yorug'lik YETARLI (juda qorong'i yoki ortiqcha yoritilmagan)?
5. Yuz og'ir MAKIYAJ bilan qoplanmaganmi (teri tahlili uchun)?

FAQAT quyidagi JSON formatda javob bering, boshqa hech narsa yozmang:
{"valid": true}
yoki agar biror shart bajarilmasa:
{"valid": false, "reason": "no_face" | "too_far" | "bad_light" | "makeup"}

Eslatma: "no_face" — yuz umuman yo'q yoki bu odam emas (masalan hayvon, predmet, chizma).
"too_far" — yuz juda kichik/uzoq.
"bad_light" — hira yoki yoritish yetarli emas.
"makeup" — og'ir makiyaj tufayli teri tahlili noaniq bo'ladi.`;

  try {
    const res = await axios.post(CLAUDE_URL, {
      model: "claude-sonnet-4-20250514",
      max_tokens: 150,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: image_base64 } },
          { type: "text", text: prompt },
        ],
      }],
    }, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_KEY,
        "anthropic-version": "2023-06-01",
      },
      timeout: 15000,
    });

    const text = res.data?.content?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    if (parsed.valid === true) return { ok: true };
    return { ok: false, error: parsed.reason || "no_face" };

  } catch (err) {
    console.error("Claude validatsiya xatosi:", err.response?.data || err.message);
    // Claude validatsiyasi ishlamasa — Face++ natijasiga ishonib davom etamiz
    return { ok: true };
  }
}

// ═══════════════════════════════════════════════════════
//  2. FACE++ SKIN ANALYZE — Teri tahlili
// ═══════════════════════════════════════════════════════
//
// MUHIM: skinanalyze javobidagi field'lar HAR XIL turdagi qiymat qaytaradi:
//   - pores_forehead/left_cheek/right_cheek/jaw → {value: 0|1} BINARY (bor/yo'q)
//   - acne                                       → {value: N} SON (akne nuqtalari soni, 0-50+)
//   - blackhead                                  → {value: 0|1} BINARY
//   - skin_spot                                  → {value: 0|1} BINARY
//   - mole                                       → {value: N} SON
//   - dark_circle                                → {value: 0-3} DARAJA (0=yo'q...3=kuchli)
//   - *_wrinkle / crows_feet / etc               → {value: 0|1} BINARY
//
// Shuning uchun har birini TO'G'RI shkalaga moslab, keyin 0-100 ga proyeksiya qilamiz.

function clamp(v, lo=0, hi=100) { return Math.max(lo, Math.min(hi, v)); }

function convertSkinResult(result, faceRect) {
  if (!result) return null;

  // ── PORLAR: 4 zonadan confidence asosida hisoblash ──
  // Face++ pores_* har doim {value:0|1, confidence:0-100} qaytaradi.
  // confidence — "shu zonada por bor" degan ISHONCH darajasi, value esa
  // qattiq threshold (odatda 50%). Foydalanuvchiga aniqroq ko'rsatish uchun
  // to'g'ridan-to'g'ri confidence'ni asosiy signal sifatida ishlatamiz —
  // bu value=0 bo'lsa ham, confidence yuqori bo'lganda porlar borligini ko'rsatadi.
  const poreZones = [
    result.pores_forehead, result.pores_left_cheek,
    result.pores_right_cheek, result.pores_jaw,
  ];
  let poresScore = 0;
  let poresCount = 0;
  poreZones.forEach(z => {
    if (!z) return;
    poresCount++;
    const val  = z.value ?? 0;
    const conf = z.confidence ?? 0; // 0-100, "por bor" ehtimoli

    if (val >= 1) {
      // Face++ "bor" deb hisoblagan — yuqori ball, confidence bilan kuchaytirilgan
      poresScore += clamp(60 + conf * 0.4); // 60-100 oraliq
    } else {
      // Face++ "yo'q" deb hisoblagan, lekin confidence baribir signal beradi —
      // confidence past bo'lsa ham (masalan 30-40%), bu hali ham ozgina porlar
      // borligini bildiradi, shuning uchun to'liq 0 ga tushirmaymiz
      poresScore += clamp(conf * 0.6); // 0-60 oraliq, confidence bilan o'sadi
    }
  });
  poresScore = poresCount ? Math.round(poresScore / poresCount) : 0;

  // Qo'shimcha: agar "rough" (g'adir-budur teri) atributi mavjud bo'lsa,
  // bu ham porlar/tekstura muammosining belgisi — qo'shamiz
  if (result.rough) {
    const roughVal  = result.rough.value ?? 0;
    const roughConf = result.rough.confidence ?? 0;
    if (roughVal >= 1) {
      poresScore = clamp(Math.round(poresScore * 0.7 + (60 + roughConf * 0.4) * 0.3));
    }
  }

  // ── AJINLAR: 5 turdan nechtasi bor + confidence ──
  const wrinkleZones = [
    result.forehead_wrinkle, result.crows_feet, result.eye_finelines,
    result.glabella_wrinkle, result.nasolabial_fold,
  ];
  let wrinklesScore = 0;
  let wrinklesCount = 0;
  wrinkleZones.forEach(z => {
    if (!z) return;
    wrinklesCount++;
    const val  = z.value ?? 0;
    const conf = z.confidence ?? 50;
    if (val >= 1) {
      wrinklesScore += 50 + (conf / 2);
    } else {
      wrinklesScore += clamp(50 - (conf / 2), 0, 50);
    }
  });
  wrinklesScore = wrinklesCount ? Math.round(wrinklesScore / wrinklesCount) : 0;

  // ── AKNE: bu SON (nuqtalar soni), 0-100 ga proyeksiya ──
  // Odatda 0-15 oraliqda bo'ladi: 0=yo'q, 1-3=yengil, 4-8=o'rtacha, 9+=kuchli
  const acneCount = result.acne?.value ?? 0;
  const acneScore = clamp(Math.round((acneCount / 12) * 100));

  // ── QORA NUQTALAR: blackhead binary + confidence ──
  const bh = result.blackhead;
  let blackheadsScore = 0;
  if (bh) {
    const val  = bh.value ?? 0;
    const conf = bh.confidence ?? 50;
    blackheadsScore = val >= 1 ? Math.round(50 + conf/2) : Math.round(clamp(50 - conf/2, 0, 50));
  }

  // ── PIGMENTATSIYA: skin_spot (binary) + mole (son) kombinatsiyasi ──
  const spot = result.skin_spot;
  const moleCount = result.mole?.value ?? 0;
  let pigmentationScore = 0;
  if (spot) {
    const val  = spot.value ?? 0;
    const conf = spot.confidence ?? 50;
    pigmentationScore = val >= 1 ? Math.round(50 + conf/2) : Math.round(clamp(50 - conf/2, 0, 50));
  }
  // Mole sonini qo'shib, og'irlikni biroz oshiramiz
  pigmentationScore = clamp(pigmentationScore + Math.round(moleCount * 3));

  // ── KO'Z OSTI QORAYISHI: dark_circle 0-3 daraja → 0-100 ──
  const darkCircleRaw = result.dark_circle?.value ?? 0;
  const darkCircleScore = clamp(Math.round((darkCircleRaw / 3) * 100));

  // ── KO'Z TORBASI (qizillik proksi sifatida ishlatamiz) ──
  const eyePouch = result.eye_pouch;
  let rednessScore = 0;
  if (eyePouch) {
    const val  = eyePouch.value ?? 0;
    const conf = eyePouch.confidence ?? 50;
    rednessScore = val >= 1 ? Math.round(40 + conf/2.5) : Math.round(clamp(30 - conf/3, 0, 30));
  }

  // ── NAMLIK: to'g'ridan-to'g'ri ma'lumot yo'q.
  // Taxmin: porlar va akne yuqori bo'lsa ko'pincha yog'li/aralash teri = namlik past emas,
  // lekin bu noaniq. Shuning uchun neytral boshlanish (60) dan, faqat juda
  // yuqori pore darajasida kamaytiramiz.
  let hydrationScore = 65;
  if (poresScore > 70) hydrationScore -= 15;
  if (acneScore  > 50) hydrationScore -= 10;
  hydrationScore = clamp(hydrationScore);

  // ── TERI TURI ──
  const skinTypeMap = { 0: "quruq", 1: "yog'li", 2: "aralash", 3: "sezgir" };
  const skinTypeIdx = result.skin_type?.skin_type;
  const skinType = skinTypeMap[skinTypeIdx] ?? "aralash";

  return {
    pores:        poresScore,
    blackheads:   blackheadsScore,
    wrinkles:     wrinklesScore,
    pigmentation: pigmentationScore,
    redness:      rednessScore,
    acne:         acneScore,
    dark_circle:  darkCircleScore,
    hydration:    hydrationScore,
    skin_age:     result.skin_age?.value ?? null,
    skin_type:    skinType,

    _raw: result, // debug
  };
}

// ═══════════════════════════════════════════════════════
//  3. CLAUDE — Tabiiy tilda tavsiya
// ═══════════════════════════════════════════════════════

const PRODUCT_CATALOG = [
  { id:1,  brand:"COSRX",       name:"Advanced Snail 96 Mucin Power Essence", tag:"namlovchi, qora dog'lar, umumiy" },
  { id:2,  brand:"Innisfree",   name:"Green Tea Hyaluronic Acid Serum",       tag:"namlik, quruq teri" },
  { id:3,  brand:"COSRX",       name:"The Vitamin C 23 Serum",                tag:"pigmentatsiya, yorqinlik, dog'lar" },
  { id:4,  brand:"Missha",      name:"Time Revolution Night Repair Serum",    tag:"ajinlar, anti-aging" },
  { id:5,  brand:"Wellage",     name:"Real Hyaluronic Blue 100 Ampoule",      tag:"namlik, intensiv" },
  { id:6,  brand:"Some By Mi",  name:"AHA BHA PHA 30 Days Miracle Toner",     tag:"porlar, qora nuqtalar, akne" },
  { id:7,  brand:"Round Lab",   name:"1025 Dokdo Toner",                      tag:"namlik, sezgir teri" },
  { id:8,  brand:"Klairs",      name:"Supple Preparation Unscented Toner",    tag:"sezgir teri, tinchlantiruvchi" },
  { id:9,  brand:"Mediheal",    name:"NMF Aquaring Ampoule Mask EX Toner",    tag:"namlik, quruq teri" },
  { id:10, brand:"Laneige",     name:"Water Bank Blue Hyaluronic Cream",      tag:"namlik, kunduzgi krem" },
  { id:11, brand:"Dr.Jart+",    name:"Cicapair Tiger Grass Cream",            tag:"qizillik, sezgirlik, tinchlantiruvchi" },
  { id:12, brand:"Benton",      name:"Aloe Propolis Soothing Gel",            tag:"qizillik, akne, tinchlantiruvchi" },
  { id:13, brand:"Laneige",     name:"Water Sleeping Mask",                   tag:"namlik, kechki parvarish" },
  { id:14, brand:"Etude House", name:"SoonJung pH 6.5 Whip Cleanser",         tag:"sezgir teri, tozalovchi" },
  { id:15, brand:"The Face Shop", name:"Rice Water Bright Cleansing Foam",    tag:"porlar, yorqinlik, tozalovchi" },
  { id:16, brand:"COSRX",       name:"Low pH Good Morning Gel Cleanser",      tag:"yog'li teri, kunduzgi tozalovchi" },
  { id:17, brand:"Dr.G",        name:"Green Mild Up Sun SPF 50+",             tag:"SPF, sezgir teri, pigmentatsiya oldini olish" },
  { id:18, brand:"Round Lab",   name:"Birch Juice Moisturizing Sun Cream",    tag:"SPF, namlovchi" },
  { id:19, brand:"Isntree",     name:"Hyaluronic Acid Airy Sun Stick",        tag:"SPF, yog'li teri, qulay" },
  { id:20, brand:"Mediheal",    name:"NMF Aquaring Ampoule Mask EX",          tag:"namlik, maska" },
  { id:21, brand:"Abib",        name:"Heartleaf Spot Pad Calming Touch",      tag:"akne, qizillik, pad" },
  { id:22, brand:"Some By Mi",  name:"Pore Miracle Blackhead Off Gelatin Mask", tag:"qora nuqtalar, porlar, maska" },
  { id:23, brand:"Mizon",       name:"Snail Repair Eye Cream",                tag:"ko'z atrofi, qorong'ilik" },
  { id:24, brand:"Innisfree",   name:"Retinol Cica Repair Eye Cream",         tag:"ko'z atrofi, ajinlar, anti-aging" },
  { id:25, brand:"Laneige",     name:"Lip Sleeping Mask EX Berry",            tag:"lab parvarishi" },
  { id:26, brand:"Dr.Jart+",    name:"Vital Hydra Solution Lip Mask",         tag:"lab parvarishi, namlik" },
  { id:27, brand:"Innisfree",   name:"My Body Lotion Jeju Cherry Blossom",    tag:"tana parvarishi" },
  { id:28, brand:"Some By Mi",  name:"Galactomyces Pure Vitamin C Glow Toner", tag:"yorqinlik, pigmentatsiya, toner" },
];

async function getClaudeRecommendation(scores) {
  if (!CLAUDE_KEY) return null;

  const catalogText = PRODUCT_CATALOG
    .map(p => `id:${p.id} | ${p.brand} ${p.name} — (${p.tag})`)
    .join("\n");

  const prompt = `Sen PORLA.AI K-Beauty platformasining shaxsiy teri maslahatchisisiz. Foydalanuvchining yuzi Face++ AI orqali tahlil qilindi va quyidagi natijalar olindi (har ko'rsatkich 0-100, 100 = muammo eng yuqori darajada):

- Kengaygan porlar: ${scores.pores}/100
- Qora nuqtalar: ${scores.blackheads}/100
- Ajinlar: ${scores.wrinkles}/100
- Pigmentatsiya / dog'lar: ${scores.pigmentation}/100
- Akne: ${scores.acne}/100
- Ko'z osti qorayishi: ${scores.dark_circle}/100
- Qizillik: ${scores.redness}/100
- Namlik darajasi: ${scores.hydration}/100 (yuqori = yaxshi namlangan)
- Teri turi: ${scores.skin_type}
${scores.skin_age ? `- Teri yoshi: ${scores.skin_age}` : ""}

PORLA.AI mahsulot katalogi:
${catalogText}

VAZIFA:
1. Foydalanuvchi terisidagi eng katta 2-3 muammoni aniqlang (eng yuqori ballar, hydration bundan mustasno — u past bo'lsa muammo).
2. O'zbek tilida, iliq va professional ohangda, 3-5 jumlali QISQA tahlil yozing — foydalanuvchiga tushunarli, hukm qilmaydigan tilda. Aniq ballarni keltiring (masalan "porlaringiz 68/100 — bu yuqori daraja").
3. Katalogdan 3 ta MAHSULOT ID sini tanlang — eng mos keladiganlarini, muammolarga mos teglar bo'yicha.
4. Har bir tanlangan mahsulot uchun 1 jumlalik o'zbek tilida sabab yozing.

Quyidagi formatda FAQAT JSON qaytaring (boshqa hech narsa qo'shmang):
{
  "summary": "Tahlil matni bu yerda...",
  "top_concerns": ["pores", "acne"],
  "recommendations": [
    {"id": 6, "reason": "Sabab matni..."},
    {"id": 22, "reason": "Sabab matni..."},
    {"id": 17, "reason": "Sabab matni..."}
  ]
}`;

  try {
    const res = await axios.post(CLAUDE_URL, {
      model: "claude-sonnet-4-20250514",
      max_tokens: 700,
      messages: [{ role: "user", content: prompt }],
    }, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_KEY,
        "anthropic-version": "2023-06-01",
      },
      timeout: 20000,
    });

    const text = res.data?.content?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    parsed.recommendations = (parsed.recommendations || []).map(r => {
      const prod = PRODUCT_CATALOG.find(p => p.id === r.id);
      return { ...r, product: prod || null };
    });

    return parsed;
  } catch (err) {
    console.error("Claude xatosi:", err.response?.data || err.message);
    return null;
  }
}

// ═══════════════════════════════════════════════════════
//  4. ENDPOINT — /api/skin-analyze
// ═══════════════════════════════════════════════════════

app.post("/api/skin-analyze", async (req, res) => {
  const { image_base64, image_url } = req.body;

  if (!image_base64 && !image_url) {
    return res.status(400).json({ error: "image_base64 yoki image_url kerak" });
  }

  try {
    // ── QADAM 1: Validatsiya — yuz bormi, sifat yetarli mi? ──
    let validation;
    try {
      validation = await validateFace(image_base64);
    } catch (err) {
      const errMsg = err.response?.data?.error_message || "";
      console.error("Detect xatosi:", errMsg || err.message);
      if (errMsg.includes("INVALID_IMAGE") || errMsg.includes("IMAGE_ERROR_UNSUPPORTED_FORMAT")) {
        return res.status(422).json({ error: "bad_image" });
      }
      if (errMsg.includes("CONCURRENCY_LIMIT_EXCEEDED")) {
        return res.status(429).json({ error: "rate_limit" });
      }
      return res.status(500).json({ error: "server_error", message: err.message });
    }

    if (!validation.ok) {
      // no_face | too_far | bad_image | bad_light
      return res.status(422).json({ error: validation.error });
    }

    // ── QADAM 1.5: Claude orqali qo'shimcha tekshiruv ──
    // Face++ "yuz" deb hisoblagan, lekin aslida boshqa narsa (poster, ekran,
    // hayvon va h.k.) bo'lgan rasmlarni ushlab qoladi.
    const mediaType = req.body.media_type || "image/jpeg";
    const claudeCheck = await validateWithClaude(image_base64, mediaType);
    if (!claudeCheck.ok) {
      return res.status(422).json({ error: claudeCheck.error });
    }

    // ── QADAM 2: Skin Analyze — teri tahlili ──
    const skinForm = new FormData();
    skinForm.append("api_key",    FACEPP_KEY);
    skinForm.append("api_secret", FACEPP_SECRET);
    skinForm.append("image_base64", image_base64);

    const skinRes = await axios.post(FACEPP_SKIN_URL, skinForm, {
      headers: skinForm.getHeaders(),
      timeout: 20000,
    });

    const skinData = skinRes.data;

    if (skinData.error_message) {
      console.error("Skinanalyze error:", skinData.error_message);
      if (skinData.error_message.includes("NO_FACE_FOUND")) {
        return res.status(422).json({ error: "no_face" });
      }
      return res.status(500).json({ error: "server_error", message: skinData.error_message });
    }

    const result = skinData.result;
    if (!result) {
      return res.status(422).json({ error: "no_face" });
    }

    const scores = convertSkinResult(result, validation.rect);

    // ── QADAM 3: Claude'dan tavsiya ──
    const recommendation = await getClaudeRecommendation(scores);

    return res.json({
      success: true,
      data: { scores, recommendation },
    });

  } catch (err) {
    console.error("Server xatosi:", err.response?.data || err.message);

    const errMsg = err.response?.data?.error_message || "";
    if (errMsg.includes("NO_FACE_FOUND"))            return res.status(422).json({ error: "no_face" });
    if (errMsg.includes("INVALID_IMAGE"))            return res.status(422).json({ error: "bad_image" });
    if (errMsg.includes("CONCURRENCY_LIMIT_EXCEEDED")) return res.status(429).json({ error: "rate_limit" });

    return res.status(500).json({ error: "server_error", message: err.message });
  }
});

// ── Healthcheck ──
app.get("/health", (_, res) => res.json({
  status: "ok",
  service: "PORLA.AI Backend",
  faceplusplus: !!FACEPP_KEY,
  claude: !!CLAUDE_KEY,
}));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ PORLA.AI backend ishlamoqda: http://localhost:${PORT}`));
