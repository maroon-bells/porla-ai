import { useState, useEffect, useRef } from "react";

// ── PINK PALETTE (sophisticated, not childish) ──
const C = {
  pink:       "#c45c8a",
  pinkDeep:   "#9e3d6b",
  pinkLight:  "#f0c0d4",
  pinkXLight: "#fdf0f5",
  cream:      "#faf8f7",
  sand:       "#f5eef2",
  warmWhite:  "#fffcfe",
  dark:       "#1a1218",
  mid:        "#6a4058",
  muted:      "#a08090",
  border:     "#eedde7",
};

const PRODUCTS = [
  // ── SERUM ──
  { id:1,  cat:"serum",    emoji:"🧴", brand:"COSRX",        name:"Advanced Snail 96 Mucin Power Essence 96ml",         price:129000, skin:["yog","aralash"],   stars:5, badge:"Bestseller",
    img:"https://www.cosrx.com/cdn/shop/files/james_800x1067_1_1_4e9750cc-2cd6-4817-ace5-be2305a85806_1200x1200.jpg?v=1763111577",
    desc:"96% shiliq filtrat bilan boyitilgan Koreaning №1 serumi. Teringizni chuqur namlaydi, porlarni toraytiradi va qo'ng'ir dog'larni asta-sekin yo'qotadi. Barcha teri turlari uchun mos, kundalik parvarish uchun ideal." },

  { id:2,  cat:"serum",    emoji:"💧", brand:"Innisfree",     name:"Green Tea Hyaluronic Acid Serum 30ml",               price:145000, skin:["quruq","sezgir"],  stars:5, badge:"AI Pick",
    img:"https://us.innisfree.com/cdn/shop/files/01_IF_GT-HS_Packshot_2024_01_1080x1080_1b6524d9-595a-42a0-b57f-4532b11278cb_1.jpg?v=1775044946",
    desc:"Jeju orolining toza yashil choy ekstrakti va 5 xil gialuron kislotasi bilan boyitilgan namlovchi serum. Teringizni 24 soat namlaydi, elastiklikni tiklaydi va bezarar yengil teksturaga ega." },

  { id:3,  cat:"serum",    emoji:"✨", brand:"COSRX",         name:"The Vitamin C 23 Serum 20ml",                        price:178000, skin:["aralash","yog"],    stars:5, badge:"Yangi",
    img:"https://www.cosrx.com/cdn/shop/files/Advanced_VitaminC23_00_1200x1200.webp?v=1760935746",
    desc:"23% sof C vitamini bilan boyitilgan kuchli yorqinlashtiruvchi serum. 7 kunda teri tonini tekislaydi, dog'larni kamaytiradi va teringizga salomatlik porlashini qaytaradi. Klinik sinovdan o'tgan formula." },

  { id:4,  cat:"serum",    emoji:"🌟", brand:"Missha",        name:"Time Revolution Night Repair Serum 5X 50ml",         price:210000, skin:["quruq","aralash"],  stars:5, badge:"Premium",
    img:"https://misshaus.com/cdn/shop/products/001_071cb1b0-1dc1-4660-bd0f-af00290d2f8a.jpg?v=1773694048",
    desc:"Bifida ferment lizat va 5 ta kuchli anti-aging ingredient bilan boyitilgan kechki serum. Uyqu vaqtida teringiz tabiiy tiklanish jarayonini tezlashtiradi, ajinlarni kamaytiradi va elastiklikni qaytaradi." },

  { id:5,  cat:"serum",    emoji:"🫧", brand:"Wellage",       name:"Real Hyaluronic Blue 100 Ampoule 30ml",              price:95000,  skin:["quruq","sezgir"],  stars:5, badge:"Trendda",
    img:"https://holiholic.com/cdn/shop/products/WELLAGE_RealHyaluronicBlue100Ampoule-Holiholic_grande.jpg?v=1680063142",
    desc:"100% sof gialuron kislotasi bilan to'ldirilgan intensiv namlovchi ampoule. Quruq va dehidratatsiyalangan teri uchun maxsus ishlab chiqilgan, bir marta qo'llashda sezilarli farq seziladi." },

  // ── TONER ──
  { id:6,  cat:"toner",    emoji:"🌿", brand:"Some By Mi",    name:"AHA BHA PHA 30 Days Miracle Toner 150ml",            price:98000,  skin:["yog","aralash"],   stars:4, badge:"Yangi",
    img:"https://www.shopmissa.com/cdn/shop/files/SOMEBYMI_AHABHAPHAToner_1200x1200.jpg?v=1751295521",
    desc:"3 ta kislota (AHA, BHA, PHA) birikmasidan iborat 30 kunlik mo'jizaviy toner. Qora nuqtalar, kengaygan porlar va notekis teri yuzasini tubdan o'zgartiradi. Barcha teri turlari uchun, lekin ayniqsa yog'li teri uchun ideal." },

  { id:7,  cat:"toner",    emoji:"🌊", brand:"Round Lab",     name:"1025 Dokdo Toner 200ml",                             price:112000, skin:["aralash","sezgir"], stars:5, badge:"Bestseller",
    img:"https://roundlab.com/cdn/shop/files/Dokdo_Toner_2025.png?v=1772851199",
    desc:"Dokdo orolining toza dengiz minerallari bilan boyitilgan namlovchi toner. Mineral moddalar va hyaluronic acid bilan teri namligini tiklaydi, sezgir terini tinchlantirib, sog'lom ko'rinish beradi." },

  { id:8,  cat:"toner",    emoji:"🍃", brand:"Klairs",        name:"Supple Preparation Unscented Toner 180ml",           price:89000,  skin:["sezgir","quruq"],  stars:5, badge:"",
    img:"https://www.klairs.com/cdn/shop/files/SupplePreparationUnscentedToner180mL_product.jpg?v=1776808592",
    desc:"Hidsiz, spirtssiz va gippoallergen formula bilan sezgir teri uchun yaratilgan toner. Beta-glucan va Centella asiatica teri tozalanishidan keyin darhol tinchlantirib, namlaydi va himoya qiladi." },

  { id:9,  cat:"toner",    emoji:"🌸", brand:"Mediheal",      name:"NMF Aquaring Ampoule Mask EX Toner 150ml",           price:75000,  skin:["quruq","aralash"],  stars:4, badge:"",
    img:"https://www.eyurs.com/cdn/shop/files/mediheal-nmf-aquaring-ampoule-mask-ex.jpg?v=1692045369",
    desc:"NMF (tabiiy namlashtiruvchi omillar) bilan boyitilgan ampoule toner. Quruq va yorilgan teri uchun intensiv namlik beradi, teri to'sig'ini mustahkamlaydi va yumshoqlikni tiklaydi." },

  // ── KREM ──
  { id:10, cat:"krem",     emoji:"🫙", brand:"Laneige",       name:"Water Bank Blue Hyaluronic Cream 50ml",              price:195000, skin:["quruq","aralash"],  stars:5, badge:"AI Pick",
    img:"https://us.laneige.com/cdn/shop/files/LN_WBCM_24AD_Product_02_large.jpg?v=1703778486",
    desc:"Laneige'ning eng mashhur kremlar seriyasining yangi versiyasi. Ko'k gialuron kislotasi va mineral suv texnologiyasi teringizni 72 soatga namlaydi. Yengil, qulay va har kuni ishlatiladigan Premium namlovchi krem." },

  { id:11, cat:"krem",     emoji:"🌱", brand:"Dr.Jart+",      name:"Cicapair Tiger Grass Cream 50ml",                    price:230000, skin:["sezgir"],           stars:5, badge:"Premium",
    img:"https://www.mastersbeautystore.com/cdn/shop/files/Dr.Jart_CicapairSkinRepairCream.jpg?v=1705937394",
    desc:"Baqlajon o'ti (Tiger Grass) ekstrakti asosidagi dermatologik sertifikatlangan krem. Qizillik, sezgirlik va shikastlangan terini tinchlantiradi, mustahkamlaydi va tezkor tiklanishiga yordam beradi." },

  { id:12, cat:"krem",     emoji:"🍯", brand:"Benton",        name:"Aloe Propolis Soothing Gel 100ml",                   price:92000,  skin:["aralash","sezgir"], stars:5, badge:"",
    img:"https://sukoshi.com/cdn/shop/products/benton-aloe-propolis-soothing-gel-renewal-main_1024x1024.png?v=1676581382",
    desc:"Aloe vera va propolis aralashmasi teri qizilligini bosadi, namlik beradi va tinchlantiradi. Quyosh kuyishi, sezgir va muammoli teri uchun ideal vosita. Yengil gel teksturasi barcha faslda ishlash mumkin." },

  { id:13, cat:"krem",     emoji:"🌙", brand:"Laneige",       name:"Water Sleeping Mask 70ml",                           price:185000, skin:["quruq","sezgir"],  stars:5, badge:"Bestseller",
    img:"https://www.ecoshop-usa.com/cdn/shop/files/product_images_1720592860.20201207_final_Water-Sleeping-Mask-EX_thumbnail04_11741213959.png?v=1741213988&width=1024",
    desc:"Uyqu paytida teri namlangani va tiklanishi uchun maxsus yaratilgan kechki maska-krem. Mineral suv va hyaluronic acid bilan boyitilgan, erta turganda teringiz yumshoq, yorqin va yoqimli ko'rinadi." },

  // ── CLEANSER ──
  { id:14, cat:"cleanser", emoji:"🫧", brand:"Etude House",   name:"SoonJung pH 6.5 Whip Cleanser 150ml",               price:69000,  skin:["sezgir","quruq"],  stars:4, badge:"",
    img:"https://ohlolly.com/cdn/shop/files/Etude_Soonjung_ph_6.5_whip_cleanser.jpg?v=1758231216&width=1024",
    desc:"pH 6.5 darajasida ishlab chiqilgan yengil ko'pik tozalovchi, sezgir teri uchun mukammal. Panthenol va Madecassoside bilan boyitilgan formula yuzni yumshoqlik bilan tozalab, tabiiy muvozanatni saqlaydi." },

  { id:15, cat:"cleanser", emoji:"🌾", brand:"The Face Shop",  name:"Rice Water Bright Cleansing Foam 150ml",             price:65000,  skin:["yog","aralash"],   stars:4, badge:"",
    img:"https://asianbeautyessentials.com/cdn/shop/files/image-Photoroom_16.png?v=1762457152",
    desc:"Guruch suvi ekstrakti bilan boyitilgan yorqinlashtiruvchi tozalovchi ko'pik. Porlarni chuqur tozalaydi, ortiqcha yog'ni nazorat qiladi va teri tonini tekislaydi. Umumiy parvarish uchun eng yaxshi tanlov." },

  { id:16, cat:"cleanser", emoji:"🫐", brand:"COSRX",         name:"Low pH Good Morning Gel Cleanser 150ml",             price:72000,  skin:["yog","aralash"],   stars:5, badge:"Trendda",
    img:"https://www.cosrx.com/cdn/shop/files/low-ph-good-morning-gel-cleanser-cosrx-official-1_1200x1200.jpg?v=1768785801",
    desc:"Ertalabki parvarish uchun maxsus yaratilgan past pH darajasidagi jel tozalovchi. Willow bark suvi bilan boyitilgan, teri mikrobiomini saqlaydi, ortiqcha yog' va iflosliklari yumshoqlik bilan tozalaydi." },

  // ── SPF ──
  { id:17, cat:"spf",      emoji:"☀️", brand:"Dr.G",          name:"Green Mild Up Sun SPF 50+ PA++++ 50ml",              price:125000, skin:["sezgir","aralash"], stars:5, badge:"Bestseller",
    img:"https://cdn.shopify.com/s/files/1/0668/0022/2505/files/PhotoRoom_20230624_170221.jpg?v=1687640557",
    desc:"Mineral filtrlar asosidagi eng yaxshi quyosh himoya kremlari qatoriga kiradi. SPF 50+ PA++++ kuchli himoya, Zinc Oxide va Titanium Dioxide tarkibi sezgir va akne moyil teri uchun ham xavfsiz. Oq dog' qoldirmaydi." },

  { id:18, cat:"spf",      emoji:"🌤️", brand:"Round Lab",    name:"Birch Juice Moisturizing Sun Cream SPF 50+ 50ml",     price:115000, skin:["quruq","sezgir"],  stars:5, badge:"AI Pick",
    img:"https://roundlab.com/cdn/shop/files/Birch_Juice_Mild-Up_Sunscreen_UVLock_SPF_50_Broad_Spectrum_Round_Lab_2.png?v=1772850750",
    desc:"Qayindaraxt shirasi bilan boyitilgan namlovchi quyosh kremi. Himoya qilish bilan birga teringizni chuqur namlaydi, yengil teksturasi teri ostiga yaxshi singadi va makiyaj ostida ham qulay ishlaydi." },

  { id:19, cat:"spf",      emoji:"🌞", brand:"Isntree",       name:"Hyaluronic Acid Airy Sun Stick SPF 50+ 22g",         price:89000,  skin:["yog","aralash"],   stars:4, badge:"Yangi",
    img:"https://www.skincupid.us/cdn/shop/files/ISNTREE_Hyaluronic_Acid_Airy_Sun_Stick_SPF50_PA_22g.jpg?v=1760352096",
    desc:"Qulay stick formatidagi quyosh himoyasi, istalgan joyda tezda qo'llash mumkin. Gialuron kislotasi teringizni namlaydi, stik formati yog' qoldirmaydi va portativ — sumkada olib yurish uchun ideal." },

  // ── MASKA ──
  { id:20, cat:"maska",    emoji:"🎭", brand:"Mediheal",      name:"NMF Aquaring Ampoule Mask EX 10ea",                  price:145000, skin:["quruq","aralash"],  stars:5, badge:"Bestseller",
    img:"https://www.eyurs.com/cdn/shop/files/mediheal-nmf-aquaring-ampoule-mask-ex.jpg?v=1692045369",
    desc:"Korea'ning №1 maska markasi Mediheal'ning namlovchi maska seti (10 ta). NMF komponenti va gialuron kislotasi teri namligini intensiv tiklaydi. 20 daqiqada porloq, yumshoq va sog'lom teri." },

  { id:21, cat:"maska",    emoji:"🌿", brand:"Abib",          name:"Heartleaf Spot Pad Calming Touch 80ea",              price:168000, skin:["sezgir","yog"],    stars:5, badge:"Trendda",
    img:"https://en.abib.com/cdn/shop/files/CT_ab985d23-5017-4a0a-897b-d342c25ef914.jpg?v=1765183451",
    desc:"Yurak shaklidagi o'simlik (heartleaf) ekstrakti bilan boyitilgan tinchlantiruvchi pad-maska. Sezgir, qizargan va muammoli teri uchun maxsus. 80 ta disk bir buyurtmada — kundalik parvarishning eng yaxshi yordamchisi." },

  { id:22, cat:"maska",    emoji:"⚫", brand:"Some By Mi",    name:"Pore Miracle Blackhead Off Gelatin Mask 100ml",      price:82000,  skin:["yog","aralash"],   stars:4, badge:"",
    img:"https://koreanskincare.com/cdn/shop/files/Product-page-sizes_e21ee680-28f4-4f71-8e61-416924a00999.jpg?v=1744120910",
    desc:"Qora nuqtalar va kengaygan porlar uchun maxsus jelatin maska. Yuzga surtilgach, qattiqlashib, qora nuqtalar va iflosliklari bilan birga tortib oladi. Burun va T-zona uchun ajoyib haftalik parvarish." },

  // ── KO'Z PARVARISHI ──
  { id:23, cat:"eye",      emoji:"👁️", brand:"Mizon",        name:"Snail Repair Eye Cream 25ml",                        price:95000,  skin:["quruq","aralash"],  stars:4, badge:"",
    img:"https://www.dodoskin.com/cdn/shop/products/8809663751739-1.jpg?v=1669026335",
    desc:"Shiliq filtrat asosidagi ko'z atrofi kremi. Ko'z osti qorong'iligini, shishini va mayda ajinlarni kamaytiradi. Yengil krem teksturasi tez singadi va 24 soat davomida ko'z atrofini namlaydi." },

  { id:24, cat:"eye",      emoji:"✨", brand:"Innisfree",     name:"Retinol Cica Repair Eye Cream 30ml",                 price:135000, skin:["aralash","quruq"],  stars:5, badge:"Premium",
    img:"https://www.eyurs.com/cdn/shop/files/innisfree-retinol-cica-barrier-defense-cream-50ml.jpg?v=1712198884",
    desc:"Retinol va Cica (Centella) birikmasidan yaratilgan anti-aging ko'z atrofi kremi. Ko'z atrofidagi ajinlarni yumshatadi, elastiklikni tiklaydi va qorong'ilikni kamaytiradi. Kechasi qo'llash uchun ideal." },

  // ── LIP PARVARISHI ──
  { id:25, cat:"lip",      emoji:"💋", brand:"Laneige",       name:"Lip Sleeping Mask EX Berry 20g",                     price:98000,  skin:["aralash","sezgir"], stars:5, badge:"Bestseller",
    img:"https://us.laneige.com/cdn/shop/files/Inline_Content_Block_1x1_Hot_Cocoa_421aee86-3dd5-4347-a469-a1cf4bb876ab.png?v=1771426377",
    desc:"Koreaning eng mashhur lab maskasi — Olive Young Awards g'olibi. Uxlayotganingizda lablaringizni chuqur namlaydi va eski terisini yumshoqlik bilan tozalaydi. Berry xushi bilan yoqimli kechki parvarish rituali." },

  { id:26, cat:"lip",      emoji:"🌷", brand:"Dr.Jart+",      name:"Vital Hydra Solution Lip Mask 5g",                   price:45000,  skin:["quruq","sezgir"],  stars:4, badge:"",
    img:"https://www.drjart.com/media/export/cms/products/600x600/dj_sku_H7Z301_600x600_0.jpg",
    desc:"Hyaluronic acid va Panthenol bilan boyitilgan namlovchi lab maskasi. Quruq, yorilgan va rangsiz lablarga intensiv parvarish beradi. Bir marta qo'llashda silliq va yumshoq lablarga ega bo'lasiz." },

  // ── TANA PARVARISHI ──
  { id:27, cat:"body",     emoji:"🌺", brand:"Innisfree",     name:"My Body Lotion Jeju Cherry Blossom 300ml",           price:72000,  skin:["aralash","sezgir"], stars:4, badge:"",
    img:"https://us.innisfree.com/cdn/shop/files/01_IF_CB-JC_Packshot_2024_01_1080x1080_c8ec9552-baa1-4450-8500-021b480c6e92_1_large.jpg?v=1759872279",
    desc:"Jeju olcha guli ekstrakti bilan boyitilgan yengil tana losyoni. Teri silliqligini ta'minlaydi, yoqimli gullar atri bilan kun bo'yi xushbo'y bo'lasiz. Yengil tekstura tez singadi va yopishqoq his qoldirmaydi." },

  { id:28, cat:"body",     emoji:"🧖", brand:"Some By Mi",    name:"Galactomyces Pure Vitamin C Glow Toner 200ml",       price:115000, skin:["yog","aralash"],   stars:5, badge:"Trendda",
    img:"https://sokoglam.com/cdn/shop/files/SOMEBYMI_GALACTOMYCES-PURE-VITAMIN-C-GLOW-TONER.jpg?v=1756219054",
    desc:"Galactomyces va C vitamini birikmasidan yaratilgan yorqinlashtiruvchi toner. Teri tonini tekislaydi, dog'larni kamaytiradi va porlash beradi. Bir mahsulotda toner va serum funksiyasi — tejamkor va samarali." },
];

const fmt = n => n.toLocaleString("ru") + " so'm";
const Stars = ({ n }) => <span style={{color:"#d4923a",fontSize:12}}>{"★".repeat(n)}{"☆".repeat(5-n)}</span>;

const ADMIN_PASS = "porla2025";
const BADGE_OPTS = ["","Bestseller","AI Pick","Yangi","Premium","Sale"];
const SKIN_OPTS  = ["yog","quruq","aralash","sezgir"];

// ─────────────────────────────────────────────
//  FACE HEATMAP COMPONENT
//  Draws an SVG face silhouette with colored
//  zones for each skin concern
// ─────────────────────────────────────────────
function FaceHeatmap({ scores, analyzing }) {
  // zones: each has a label, color, SVG path/shape, position for label
  // Face is 280×340 viewBox, centered at 140,170
  const zones = [
    {
      key:"pores",
      label:"Porlar",
      color:"#ff6b6b",
      // T-zone: forehead + nose strip
      paths:[
        "M110,60 Q140,45 170,60 L175,120 Q140,130 105,120 Z",   // forehead
        "M128,125 L152,125 L155,195 L125,195 Z",                 // nose bridge
      ],
    },
    {
      key:"blackheads",
      label:"Qora nuqtalar",
      color:"#845ef7",
      // nose tip + chin
      paths:[
        "M120,190 Q140,205 160,190 L165,215 Q140,228 115,215 Z", // nose tip
        "M118,280 Q140,300 162,280 L165,310 Q140,322 115,310 Z", // chin
      ],
    },
    {
      key:"wrinkles",
      label:"Ajinlar",
      color:"#339af0",
      // eye corners + forehead lines (subtle)
      paths:[
        "M72,118 Q85,112 98,118 L100,130 Q85,136 70,130 Z",      // left eye corner
        "M182,118 Q195,112 208,118 L210,130 Q195,136 180,130 Z", // right eye corner
        "M95,68 Q140,58 185,68 L187,78 Q140,70 93,78 Z",         // forehead line 1
        "M100,85 Q140,76 180,85 L181,93 Q140,86 99,93 Z",        // forehead line 2
      ],
    },
    {
      key:"pigmentation",
      label:"Pigmentatsiya",
      color:"#f59f00",
      // cheek patches
      paths:[
        "M68,145 Q88,135 105,145 L108,175 Q88,185 65,175 Z",    // left cheek
        "M175,145 Q192,135 212,145 L215,175 Q192,185 172,175 Z", // right cheek
      ],
    },
    {
      key:"redness",
      label:"Qizillik",
      color:"#fa5252",
      // cheeks lower + nose sides
      paths:[
        "M70,175 Q90,168 108,178 L106,205 Q88,212 68,205 Z",    // left cheek lower
        "M172,178 Q190,168 210,175 L212,205 Q192,212 174,205 Z", // right cheek lower
      ],
    },
    {
      key:"hydration",
      label:"Namlik",
      color:"#51cf66",
      // under-eye
      paths:[
        "M78,148 Q100,142 118,148 L116,162 Q98,168 76,162 Z",   // left under-eye
        "M162,148 Q180,142 202,148 L200,162 Q182,168 160,162 Z", // right under-eye
      ],
    },
  ];

  return (
    <div style={{position:"relative", display:"inline-block"}}>
      <svg
        viewBox="0 0 280 340"
        width="260" height="315"
        style={{display:"block"}}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Face base silhouette ── */}
        <defs>
          <clipPath id="faceClip">
            <ellipse cx="140" cy="180" rx="108" ry="135"/>
          </clipPath>
          <filter id="blur">
            <feGaussianBlur stdDeviation="7"/>
          </filter>
          <filter id="blur2">
            <feGaussianBlur stdDeviation="4"/>
          </filter>
        </defs>

        {/* Face skin bg */}
        <ellipse cx="140" cy="180" rx="108" ry="135" fill="#fde8d8" stroke="#e8c4ad" strokeWidth="1.5"/>

        {/* Heatmap zones — only render if score > 15 */}
        {scores && zones.map(z => {
          const score = scores[z.key] ?? 0;
          if(score < 15) return null;
          const opacity = Math.min(0.75, 0.15 + (score/100)*0.6);
          return (
            <g key={z.key} filter="url(#blur)" clipPath="url(#faceClip)">
              {z.paths.map((d,i)=>(
                <path key={i} d={d} fill={z.color} opacity={opacity}/>
              ))}
            </g>
          );
        })}

        {/* Analyzing pulse overlay */}
        {analyzing && (
          <ellipse cx="140" cy="180" rx="108" ry="135"
            fill="none" stroke={C.pink} strokeWidth="2"
            opacity="0.5">
            <animate attributeName="opacity" values="0.2;0.7;0.2" dur="1.5s" repeatCount="indefinite"/>
            <animate attributeName="rx" values="108;112;108" dur="1.5s" repeatCount="indefinite"/>
            <animate attributeName="ry" values="135;140;135" dur="1.5s" repeatCount="indefinite"/>
          </ellipse>
        )}

        {/* Scan line animation */}
        {analyzing && (
          <line x1="32" y1="45" x2="248" y2="45" stroke={C.pink} strokeWidth="1.5" opacity="0.7">
            <animate attributeName="y1" values="45;315;45" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="y2" values="45;315;45" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;0.8;0" dur="2s" repeatCount="indefinite"/>
          </line>
        )}

        {/* Face features */}
        {/* Eyebrows */}
        <path d="M95,108 Q112,100 128,105" stroke="#8a6050" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
        <path d="M152,105 Q168,100 185,108" stroke="#8a6050" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>

        {/* Eyes */}
        <ellipse cx="111" cy="125" rx="18" ry="10" fill="white" opacity="0.9"/>
        <ellipse cx="169" cy="125" rx="18" ry="10" fill="white" opacity="0.9"/>
        <circle cx="111" cy="125" r="7" fill="#5a3a2a"/>
        <circle cx="169" cy="125" r="7" fill="#5a3a2a"/>
        <circle cx="114" cy="122" r="2" fill="white"/>
        <circle cx="172" cy="122" r="2" fill="white"/>

        {/* Nose */}
        <path d="M133,140 L128,180 Q140,188 152,180 L147,140" stroke="#c8a090" strokeWidth="1.2" fill="none" opacity="0.5"/>
        <circle cx="130" cy="182" r="5" fill="#e8b090" opacity="0.4"/>
        <circle cx="150" cy="182" r="5" fill="#e8b090" opacity="0.4"/>

        {/* Mouth */}
        <path d="M118,220 Q140,235 162,220" stroke="#c87090" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>

        {/* Ears */}
        <ellipse cx="32" cy="175" rx="10" ry="18" fill="#fde8d8" stroke="#e8c4ad" strokeWidth="1"/>
        <ellipse cx="248" cy="175" rx="10" ry="18" fill="#fde8d8" stroke="#e8c4ad" strokeWidth="1"/>

        {/* Hair */}
        <path d="M40,120 Q60,40 140,30 Q220,40 240,120" fill="#5a3a28" opacity="0.85"/>

        {/* Corner scan brackets */}
        <rect x="18" y="18" width="20" height="2.5" fill={C.pink} opacity="0.7"/>
        <rect x="18" y="18" width="2.5" height="20" fill={C.pink} opacity="0.7"/>
        <rect x="242" y="18" width="20" height="2.5" fill={C.pink} opacity="0.7"/>
        <rect x="259.5" y="18" width="2.5" height="20" fill={C.pink} opacity="0.7"/>
        <rect x="18" y="312" width="20" height="2.5" fill={C.pink} opacity="0.7"/>
        <rect x="18" y="293" width="2.5" height="20" fill={C.pink} opacity="0.7"/>
        <rect x="242" y="312" width="20" height="2.5" fill={C.pink} opacity="0.7"/>
        <rect x="259.5" y="293" width="2.5" height="20" fill={C.pink} opacity="0.7"/>
      </svg>

      {/* Legend badges — show active zones */}
      {scores && (
        <div style={{
          position:"absolute", right:-160, top:10,
          display:"flex", flexDirection:"column", gap:6, width:148
        }}>
          {zones.map(z => {
            const score = scores[z.key] ?? 0;
            if(score < 15) return null;
            const level = score >= 70 ? "Yuqori" : score >= 40 ? "O'rtacha" : "Past";
            return (
              <div key={z.key} style={{
                display:"flex", alignItems:"center", gap:7,
                background:"rgba(255,255,255,.95)", borderRadius:8,
                padding:"5px 10px", fontSize:11,
                border:`1px solid ${z.color}30`,
                boxShadow:"0 2px 8px rgba(0,0,0,.06)"
              }}>
                <div style={{width:9,height:9,borderRadius:"50%",background:z.color,flexShrink:0}}/>
                <div>
                  <div style={{fontWeight:600,color:C.dark,fontSize:11}}>{z.label}</div>
                  <div style={{color:z.color,fontSize:10}}>{level} · {score}/100</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  SCORE BARS
// ─────────────────────────────────────────────
const BARS = [
  { key:"pores",        label:"Kengaygan Porlar",   color:"#ff6b6b" },
  { key:"blackheads",   label:"Qora Nuqtalar",       color:"#845ef7" },
  { key:"acne",         label:"Akne",                color:"#ef4444" },
  { key:"wrinkles",     label:"Ajinlar",              color:"#339af0" },
  { key:"pigmentation", label:"Pigmentatsiya",        color:"#f59f00" },
  { key:"dark_circle",  label:"Ko'z Osti Qorayishi",  color:"#6366f1" },
  { key:"redness",      label:"Qizillik / Sezgirlik", color:"#fa5252" },
  { key:"hydration",    label:"Namlik Darajasi",      color:"#51cf66" },
];

// ─────────────────────────────────────────────
//  AI PAGE
// ─────────────────────────────────────────────
function AiPage({ onAddToCart, products = PRODUCTS }) {
  const [status,   setStatus]   = useState("idle");
  const [preview,  setPreview]  = useState(null);
  const [scores,   setScores]   = useState(null);
  const [recos,    setRecos]    = useState([]);
  const [aiSummary, setAiSummary] = useState(null); // Claude'ning tabiiy tildagi tahlili
  const [errorMsg, setErrorMsg] = useState("");
  const [activeZone, setActiveZone] = useState(null);
  const fileRef = useRef();

  // ── Backend URL — o'zingizning serveringiz ──
  // Local test uchun: "http://localhost:3001/api/skin-analyze"
  // Deploy qilgandan keyin: "https://your-server.com/api/skin-analyze"
  const BACKEND_URL  =
  "https://porla-ai-production.up.railway.app/analyze";

  // Fallback mahsulot tavsiya xaritasi (Claude javob bermasa)
  const RECO_MAP = {
    pores:        [1,4,3],
    blackheads:   [3,8,1],
    wrinkles:     [7,4,2],
    pigmentation: [3,4,7],
    redness:      [9,6,5],
    hydration:    [4,2,6],
    acne:         [3,6,1],
    dark_circle:  [23,24,2],
  };

  const ERROR_MSGS = {
    no_face:     "❌ Rasmda inson yuzi aniqlanmadi. Yuzingiz to'liq ko'ringan, makiyajsiz selfie yuklang.",
    too_far:     "📏 Yuz kameradan juda uzoqda yoki burchak noto'g'ri. Yuzingiz to'g'ridan-to'g'ri, yaqinroqdan ko'rinsin.",
    makeup:      "💄 Makiyajli yuz aniqlandi. To'g'ri natija uchun makiyajsiz selfie yuklang.",
    bad_light:   "💡 Rasm hira yoki yoritish yetarli emas. Tabiiy yorug'likda, aniqroq selfie qaytadan yuklang.",
    bad_image:   "🖼 Rasm sifati past. Boshqa, aniqroq rasm yuklang.",
    rate_limit:  "⏳ Juda ko'p so'rov yuborildi. Biroz kutib qayta urinib ko'ring.",
    server_error:"⚙️ Server xatosi. Biroz kutib qayta urinib ko'ring.",
  };

  async function analyze(file) {

  alert("ANALYZE BOSHLANDI");

  setStatus("analyzing");
  setScores(null);
  setRecos([]);
  setAiSummary(null);
  setErrorMsg("");

  try {

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(BACKEND_URL, {
      method: "POST",
      body: formData
    });

    alert("FETCH TUGADI");

    const json = await res.json();

    alert("JSON OLINDI");

    console.log(json);

    alert(JSON.stringify(json));

    if (!res.ok) {
      setStatus("error");
      setErrorMsg("Tahlil amalga oshmadi.");
      return;
    }

    setStatus("done");

    setAiSummary({
      text: json.report.overall_feedback,
      concerns: json.report.main_concerns || []
    });

  } catch (err) {

  console.error(err);

  alert("XATO: " + err.message);

  setStatus("error");
  setErrorMsg("Server bilan bog'lanishda xatolik.");

}
}

  // Claude javob bermaganda ishlatiladigan oddiy tavsiya
  function fallbackRecos(s) {
    const topKey = Object.entries(s).sort((a,b)=>b[1]-a[1])[0][0];
    const ids = RECO_MAP[topKey] || [1,4,2];
    return ids.map(id => products.find(p=>p.id===id)).filter(Boolean);
  }

  function handleFile(file){
    if(!file?.type.startsWith("image/")) return;
    const reader=new FileReader();
    reader.onload=e=>{
      setPreview(e.target.result);
      analyze(file);
    };
    reader.readAsDataURL(file);
  }

  function reset(){
    setPreview(null); setStatus("idle"); setScores(null); setErrorMsg(""); setRecos([]); setAiSummary(null);
    if(fileRef.current) fileRef.current.value="";
  }

  const btn = (label, onClick, style={}) => (
    <button onClick={onClick} style={{fontFamily:"'DM Sans',sans-serif",cursor:"pointer",...style}}>{label}</button>
  );

  return (
    <div>
      {/* Tips bar */}
      <div style={{background:C.sand,borderBottom:`1px solid ${C.border}`,padding:"13px 40px",display:"flex",gap:28,flexWrap:"wrap"}}>
        {[["🤳","Yuz yaqin bo'lsin"],["💄","Makiyajsiz"],["☀️","Tabiiy yorug'lik"],["😐","Neytral ifoda"]].map(([i,t])=>(
          <div key={t} style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:30,height:30,background:C.warmWhite,border:`1px solid ${C.border}`,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{i}</div>
            <span style={{fontSize:12.5,color:C.mid,fontWeight:500}}>{t}</span>
          </div>
        ))}
      </div>

      <div style={{padding:"48px 40px",background:C.pinkXLight,borderBottom:`1px solid ${C.border}`}}>
        <div style={{fontSize:10.5,letterSpacing:"2.5px",color:C.pink,textTransform:"uppercase",fontWeight:500,marginBottom:8}}>AI Texnologiyasi</div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:700,color:C.dark,marginBottom:32}}>Teringizni Chuqur Tahlil Qiling</div>

        <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:32,alignItems:"start"}}>

          {/* ── FACE HEATMAP (left) ── */}
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
            <div style={{
              background:C.warmWhite, border:`1px solid ${C.border}`, borderRadius:20,
              padding:"24px 24px 16px", position:"relative",
              minWidth:280, display:"flex", flexDirection:"column", alignItems:"center"
            }}>
              {/* status badge */}
              <div style={{
                position:"absolute",top:14,left:"50%",transform:"translateX(-50%)",
                background: status==="done"?"#f0fff4": status==="error"?"#fff0f0": C.pinkXLight,
                border:`1px solid ${status==="done"?"#b0e8c0": status==="error"?"#f0c0c0": C.pinkLight}`,
                color: status==="done"?"#2d7a4a": status==="error"?"#c04040": C.pink,
                fontSize:11, padding:"3px 12px", borderRadius:20, whiteSpace:"nowrap", fontWeight:500
              }}>
                {status==="idle"&&"Rasm yuklang"}
                {status==="analyzing"&&"Tahlil qilinmoqda..."}
                {status==="done"&&"✓ Tayyor"}
                {status==="error"&&"⚠ Xatolik"}
              </div>

              <div style={{marginTop:28}}>
                {/* Show uploaded photo with heatmap overlay side-by-side when done */}
                {preview && status==="done" ? (
                  <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
                    {/* Original photo */}
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:10,color:C.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Asl rasm</div>
                      <img src={preview} alt="uploaded"
                        style={{width:120,height:150,objectFit:"cover",borderRadius:12,border:`1px solid ${C.border}`}}/>
                    </div>
                    {/* Heatmap face */}
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:10,color:C.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>AI Xarita</div>
                      <FaceHeatmap scores={scores} analyzing={false}/>
                    </div>
                  </div>
                ) : (
                  <FaceHeatmap scores={scores} analyzing={status==="analyzing"}/>
                )}
              </div>

              {/* Upload button or retry */}
              <div style={{marginTop:16,width:"100%"}}>
                {status==="idle" && (
                  <>
                    <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
                    {btn("📁 Selfie Yuklash", ()=>fileRef.current.click(), {
                      width:"100%",padding:"12px",background:C.pink,color:"#fff",border:"none",
                      borderRadius:50,fontSize:13,fontWeight:500
                    })}
                  </>
                )}
                {status==="analyzing" && (
                  <div style={{textAlign:"center",padding:"8px 0"}}>
                    <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:6}}>
                      {[0,.2,.4].map(d=>(
                        <div key={d} style={{width:8,height:8,borderRadius:"50%",background:C.pink,
                          animation:"bounce 1.4s ease-in-out infinite",animationDelay:`${d}s`}}/>
                      ))}
                    </div>
                    <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-8px)}}`}</style>
                    <div style={{fontSize:12,color:C.muted}}>AI yuzingizni skanerlaydi...</div>
                  </div>
                )}
                {(status==="done"||status==="error") && (
                  <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
                )}
                {(status==="done"||status==="error") && btn("↺ Boshqa Rasm", ()=>{reset();setTimeout(()=>fileRef.current?.click(),50)}, {
                  width:"100%",padding:"10px",background:"none",border:`1.5px solid ${C.border}`,
                  color:C.muted,borderRadius:50,fontSize:12.5
                })}
                {status==="error" && (
                  <div style={{marginTop:10,background:"#fff0f0",border:"1px solid #f0c0c0",borderRadius:10,padding:"12px 14px",fontSize:12.5,color:"#c04040",lineHeight:1.6}}>
                    {errorMsg}
                  </div>
                )}
              </div>
            </div>

            {/* Color legend */}
            <div style={{background:C.warmWhite,border:`1px solid ${C.border}`,borderRadius:14,padding:"14px 16px",width:"100%"}}>
              <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1.5,marginBottom:10}}>Rang Belgisi</div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {BARS.map(b=>(
                  <div key={b.key} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",
                    padding:"4px 6px",borderRadius:7,background: activeZone===b.key?"rgba(196,92,138,.07)":"transparent"}}
                    onClick={()=>setActiveZone(activeZone===b.key?null:b.key)}>
                    <div style={{width:12,height:12,borderRadius:"50%",background:b.color,flexShrink:0,
                      boxShadow: scores&&(scores[b.key]??0)>15?`0 0 6px ${b.color}70`:"none"}}/>
                    <span style={{fontSize:11.5,color: scores&&(scores[b.key]??0)>15?C.dark:C.muted}}>{b.label}</span>
                    {scores && <span style={{marginLeft:"auto",fontSize:11,fontWeight:600,color:b.color}}>{scores[b.key]??0}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: SCORES + RECOMMENDATIONS ── */}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>

            {/* Score bars */}
            <div style={{background:C.warmWhite,border:`1px solid ${C.border}`,borderRadius:18,padding:24}}>
              <div style={{fontSize:10.5,color:C.muted,textTransform:"uppercase",letterSpacing:"1.5px",fontWeight:500,marginBottom:18}}>
                Batafsil Ko'rsatkichlar
              </div>
              {BARS.map(b=>{
                const score = scores?.[b.key]??0;
                const level = score>=70?"Yuqori":score>=40?"O'rtacha":score>=15?"Past":"Juda yaxshi";
                const lvlColor = score>=70?"#e05050":score>=40?"#d4a43a":score>=15?"#6ab87a":"#339af0";
                return (
                  <div key={b.key} style={{marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:9,height:9,borderRadius:"50%",background:scores?b.color:C.border}}/>
                        <span style={{fontSize:13,color:scores?C.dark:C.muted,fontWeight:400}}>{b.label}</span>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        {scores && <span style={{fontSize:10.5,color:lvlColor,fontWeight:600,background:`${lvlColor}18`,padding:"2px 8px",borderRadius:10}}>{level}</span>}
                        <span style={{fontSize:12,color:scores?C.mid:C.border,fontWeight:600,minWidth:40,textAlign:"right"}}>
                          {scores?`${score}/100`:"—"}
                        </span>
                      </div>
                    </div>
                    <div style={{height:6,background:C.sand,borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",borderRadius:3,background:b.color,
                        width:scores?`${score}%`:"0%",
                        transition:"width 1.6s cubic-bezier(.4,0,.2,1)"}}/>
                    </div>
                  </div>
                );
              })}

              {status==="idle" && (
                <div style={{textAlign:"center",padding:"16px 0",color:C.muted,opacity:.5}}>
                  <div style={{fontSize:32,marginBottom:8}}>🔬</div>
                  <div style={{fontSize:13}}>Selfie yuklashingizni kutmoqda...</div>
                </div>
              )}
            </div>

            {/* AI Summary */}
            {status==="done" && scores && (
              <div style={{background:`linear-gradient(135deg, ${C.pink}15, ${C.pinkXLight})`,border:`1px solid ${C.pinkLight}`,borderRadius:14,padding:20}}>
                <div style={{fontSize:10.5,color:C.pink,textTransform:"uppercase",letterSpacing:2,fontWeight:500,marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
                  AI Xulosa
                  {aiSummary && <span style={{fontSize:9,background:"#fff",color:C.pink,padding:"2px 8px",borderRadius:10,letterSpacing:0,textTransform:"none",fontWeight:600}}>Claude AI</span>}
                </div>

                {aiSummary ? (
                  // ── Claude'ning shaxsiy tahlili ──
                  <p style={{fontSize:13.5,color:C.dark,lineHeight:1.8,margin:0,fontWeight:400}}>
                    {aiSummary.text}
                  </p>
                ) : (
                  // ── Fallback statik tahlil ──
                  <>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:C.dark,marginBottom:8}}>
                      {(()=>{
                        const top=Object.entries(scores).sort((a,b)=>b[1]-a[1])[0];
                        const names={pores:"Porlar",blackheads:"Qora nuqtalar",wrinkles:"Ajinlar",pigmentation:"Pigmentatsiya",redness:"Qizillik",hydration:"Namlik",acne:"Akne",dark_circle:"Ko'z osti qorayishi"};
                        return `Asosiy muammo: ${names[top[0]]||top[0]}`;
                      })()}
                    </div>
                    <p style={{fontSize:13,color:C.mid,lineHeight:1.7,margin:0,fontWeight:300}}>
                      {(()=>{
                        const top=Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0];
                        const tips={
                          pores:"Kengaygan porlar uchun niaciniamide va retinol asosidagi mahsulotlar tavsiya qilinadi. Toza teri uchun ikki marta tozalash usulini ishlating.",
                          blackheads:"Qora nuqtalar uchun AHA/BHA kislotalar va yuzni bug'lash juda samarali. Salicylic acid asosidagi tonerlar yordam beradi.",
                          wrinkles:"Ajinlarni kamaytirish uchun retinol, peptidlar va antioxidantlar muhim. Kechasi krem ishlatish tavsiya qilinadi.",
                          pigmentation:"Pigmentatsiyaga qarshi vitamin C serumi, niacinamide va SPF muhofazasi tavsiya qilinadi. Quyoshdan himoya qiling.",
                          redness:"Sezgir teri uchun centella asiatica, aloe vera va parfyumsiz mahsulotlar tanlang. Issiq suv va spirtli tonerlarden saqlaning.",
                          hydration:"Namlikni qaytarish uchun hyaluronic acid, ceramide va glycerin asosidagi moisturizerlar tavsiya qilinadi.",
                          acne:"Akneга qarshi salicylic acid, tea tree oil va tinchlantiruvchi mahsulotlar tavsiya qilinadi. Yuzni ortiqcha ishqalamang.",
                          dark_circle:"Ko'z osti qorayishi uchun retinol va kofein asosidagi ko'z kremlari, yetarli uyqu tavsiya qilinadi.",
                        };
                        return tips[top]||"Teringizni muntazam parvarish qiling.";
                      })()}
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Recommendations */}
            {status==="done" && recos.length>0 && (
              <div style={{background:C.warmWhite,border:`1px solid ${C.border}`,borderRadius:18,padding:22}}>
                <div style={{fontSize:10.5,color:C.pink,textTransform:"uppercase",letterSpacing:2,fontWeight:500,marginBottom:16}}>✦ Teringizga Mos Mahsulotlar</div>
                {recos.map(p=>(
                  <div key={p.id} style={{padding:"11px 0",borderBottom:`1px solid ${C.sand}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{width:50,height:50,background:C.pinkXLight,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0,overflow:"hidden"}}>
                        {p.img ? <img src={p.img} alt={p.name} style={{width:"100%",height:"100%",objectFit:"contain",padding:4}}/> : p.emoji}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:500,color:C.dark,marginBottom:2}}>{p.name.substring(0,36)}...</div>
                        <div style={{fontSize:11,color:C.muted}}>{p.brand} · {p.skin.join(", ")} teri</div>
                      </div>
                      <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,color:C.pink,fontWeight:700,whiteSpace:"nowrap"}}>{fmt(p.price)}</span>
                      <button onClick={()=>onAddToCart(p.id)}
                        style={{background:C.pink,color:"#fff",border:"none",borderRadius:8,padding:"8px 14px",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap",marginLeft:8}}>
                        + Savat
                      </button>
                    </div>
                    {/* Claude'ning shaxsiy sababi */}
                    {p._reason && (
                      <div style={{marginTop:8,marginLeft:62,fontSize:12,color:C.mid,lineHeight:1.6,display:"flex",gap:6}}>
                        <span style={{flexShrink:0}}>💬</span><span>{p._reason}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{padding:"48px 40px",background:C.warmWhite,borderBottom:`1px solid ${C.border}`}}>
        <div style={{fontSize:10.5,letterSpacing:"2.5px",color:C.pink,textTransform:"uppercase",fontWeight:500,marginBottom:8}}>Jarayon</div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:700,color:C.dark,marginBottom:28}}>Qanday Ishlaydi?</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
          {[["01","Makiyajsiz Selfie","Yuzingiz yaqin va toza bo'lsin"],
            ["02","AI Validatsiya","Yuz aniqlanadi, boshqa narsalar rad etiladi"],
            ["03","6 Rangli Xarita","Har muammo alohida rang bilan yuzda ko'rsatiladi"],
            ["04","Mahsulot Tavsiya","Teringizga mos K-Beauty mahsulotlari"]
          ].map(([n,name,sub])=>(
            <div key={n} style={{background:C.cream,border:`1px solid ${C.border}`,borderRadius:14,padding:"22px 18px",textAlign:"center"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:38,fontWeight:700,color:C.border,marginBottom:8}}>{n}</div>
              <div style={{fontSize:14,color:C.dark,fontWeight:500,marginBottom:6}}>{name}</div>
              <div style={{fontSize:11.5,color:C.muted,lineHeight:1.5}}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  PRODUCT CARD
// ─────────────────────────────────────────────
const CAT_LABELS = {serum:"Serum",toner:"Toner",krem:"Krem",cleanser:"Tozalovchi",spf:"Quyosh",maska:"Maska",eye:"Ko'z",lip:"Lab",body:"Tana"};

function ProdCard({ p, onAdd, onOpen }) {
  const [hover, setHover] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  return (
    <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      onClick={()=>onOpen(p.id)}
      style={{background:C.cream,border:`1px solid ${hover?C.pink:C.border}`,borderRadius:16,overflow:"hidden",
        cursor:"pointer",transition:"all .25s",transform:hover?"translateY(-4px)":"none",
        boxShadow:hover?"0 12px 36px rgba(196,92,138,.12)":"none",position:"relative",display:"flex",flexDirection:"column"}}>
      {p.badge&&<div style={{position:"absolute",top:12,left:12,background:C.pink,color:"#fff",fontSize:9.5,padding:"4px 10px",borderRadius:20,fontWeight:500,zIndex:1}}>{p.badge}</div>}
      {p.cat&&<div style={{position:"absolute",top:12,right:12,background:"rgba(255,255,255,.88)",color:C.mid,fontSize:9,padding:"3px 8px",borderRadius:10,fontWeight:500,zIndex:1}}>{CAT_LABELS[p.cat]||p.cat}</div>}
      <div style={{height:200,display:"flex",alignItems:"center",justifyContent:"center",background:C.pinkXLight,overflow:"hidden",flexShrink:0}}>
        {p.img && !imgErr
          ? <img src={p.img} alt={p.name} onError={()=>setImgErr(true)}
              style={{width:"100%",height:"100%",objectFit:"contain",padding:"8px",transition:"transform .3s",transform:hover?"scale(1.06)":"scale(1)"}}/>
          : <div style={{fontSize:68,transition:"transform .3s",transform:hover?"scale(1.06)":"scale(1)"}}>{p.emoji}</div>
        }
      </div>
      <div style={{padding:14,flex:1,display:"flex",flexDirection:"column"}}>
        <div style={{fontSize:9.5,color:C.muted,textTransform:"uppercase",letterSpacing:"1.2px",marginBottom:4,fontWeight:500}}>{p.brand}</div>
        <Stars n={p.stars}/>
        <div style={{fontSize:12.5,color:C.dark,lineHeight:1.45,margin:"5px 0 10px",flex:1}}>{p.name}</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:C.pink,fontWeight:700}}>{fmt(p.price)}</span>
          <button onClick={e=>{e.stopPropagation();onAdd(p.id);}}
            style={{width:30,height:30,border:`1.5px solid ${C.border}`,borderRadius:8,background:"#fff",color:C.pink,fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontWeight:300}}>+</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MISSION CARD
// ─────────────────────────────────────────────
function MissionCard() {
  return (
    <div style={{border:`1.5px solid ${C.border}`,borderRadius:24,overflow:"hidden"}}>
      <div style={{background:C.dark,padding:"48px 48px 44px",display:"grid",gridTemplateColumns:"1fr auto",gap:36,alignItems:"start"}}>
        <div>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(196,92,138,.2)",border:"1px solid rgba(196,92,138,.35)",color:"#e8a0c0",fontSize:10,padding:"6px 14px",borderRadius:20,letterSpacing:2,textTransform:"uppercase",fontWeight:500,marginBottom:20}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#e8a0c0"}}/> Bizning Missiyamiz
          </div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:38,fontWeight:700,color:"#fff",lineHeight:1.05,marginBottom:14}}>
            Go'zallik — bu<br/><em style={{color:"#e8a0c0",fontStyle:"italic"}}>mehr va kuch.</em>
          </div>
          <p style={{fontSize:14,color:"rgba(255,255,255,.42)",lineHeight:1.9,fontWeight:300,maxWidth:500}}>
            PORLA.AI orqali sotilgan har bir mahsulotning o'rtacha foydasidan <strong style={{color:"#e8a0c0"}}>1%</strong> ko'krak saratoni bilan kurash olib borayotgan ayollar salomatligini qo'llab-quvvatlashga yo'naltiriladi.
          </p>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:20,padding:"8px 18px",fontSize:12.5,color:"rgba(255,255,255,.45)",marginTop:20}}>
            🤍 &nbsp;Har xaridingiz — biror ayolga umid
          </div>
        </div>
        <div style={{background:"rgba(196,92,138,.12)",border:"1.5px solid rgba(196,92,138,.28)",borderRadius:18,padding:"28px 32px",textAlign:"center",minWidth:150}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:68,fontWeight:700,color:"#e8a0c0",lineHeight:1}}>1%</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.32)",lineHeight:1.6,marginTop:6}}>Har bir<br/>sotuvdan<br/>xayriya</div>
        </div>
      </div>
      <div style={{background:C.pinkXLight,padding:"28px 48px",display:"grid",gridTemplateColumns:"repeat(3,1fr)"}}>
        {[["🎗️","Xayriya","Ko'krak saratoni bilan kurashayotgan ayollarga bevosita moliyaviy yordam"],
          ["🔬","Tadqiqot","Erta aniqlash va zamonaviy davolash usullarini qo'llab-quvvatlash"],
          ["🤝","Hamkorlik","O'zbekistondagi sog'liqni saqlash tashkilotlari bilan birgalikda ishlash"]
        ].map(([icon,title,desc],i)=>(
          <div key={i} style={{padding:"16px 20px",borderRight:i<2?`1px solid ${C.border}`:"none",textAlign:"center"}}>
            <div style={{fontSize:26,marginBottom:10}}>{icon}</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:C.dark,marginBottom:6}}>{title}</div>
            <div style={{fontSize:12.5,color:C.muted,lineHeight:1.65,fontWeight:300}}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  CART DRAWER
// ─────────────────────────────────────────────
function CartDrawer({ open, onClose, cart, onChange, onCheckout }) {
  const total = cart.reduce((s,c)=>s+c.price*c.qty,0);
  return (
    <>
      <div onClick={onClose} style={{display:open?"block":"none",position:"fixed",inset:0,background:"rgba(26,18,24,.45)",zIndex:200,backdropFilter:"blur(3px)"}}/>
      <div style={{position:"fixed",right:0,top:0,bottom:0,width:400,maxWidth:"95vw",background:"#fff",zIndex:201,
        display:"flex",flexDirection:"column",borderLeft:`1px solid ${C.border}`,
        transform:open?"translateX(0)":"translateX(110%)",transition:"transform .35s cubic-bezier(.4,0,.2,1)"}}>
        <div style={{padding:"24px 24px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:C.dark}}>Savatingiz</span>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.muted}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
          {cart.length===0?(
            <div style={{textAlign:"center",padding:"60px 0",color:C.muted}}>
              <div style={{fontSize:52,marginBottom:14}}>🛒</div>
              <p style={{fontSize:14}}>Savat bo'sh.<br/>Mahsulot qo'shing!</p>
            </div>
          ):cart.map(c=>(
            <div key={c.id} style={{display:"flex",alignItems:"flex-start",gap:14,padding:"15px 0",borderBottom:`1px solid ${C.sand}`}}>
              <div style={{width:56,height:56,background:C.pinkXLight,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>
                {c.img?<img src={c.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:12}}/>:c.emoji}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:500,color:C.dark,marginBottom:2}}>{c.name}</div>
                <div style={{fontSize:11.5,color:C.muted,marginBottom:8}}>{c.brand}</div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <button onClick={()=>onChange(c.id,-1)} style={{width:24,height:24,border:`1px solid ${C.border}`,borderRadius:6,background:"#fff",cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                  <span style={{fontSize:13,fontWeight:500}}>{c.qty}</span>
                  <button onClick={()=>onChange(c.id,1)} style={{width:24,height:24,border:`1px solid ${C.border}`,borderRadius:6,background:"#fff",cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:C.pink,fontWeight:700}}>{fmt(c.price*c.qty)}</span>
                <button onClick={()=>onChange(c.id,-999)} style={{background:"none",border:"none",cursor:"pointer",color:"#ccc",fontSize:17}}>🗑</button>
              </div>
            </div>
          ))}
        </div>
        {cart.length>0&&(
          <div style={{padding:"20px 24px",borderTop:`1px solid ${C.border}`}}>
            <div style={{background:C.pinkXLight,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 15px",fontSize:12.5,color:C.pink,marginBottom:18,display:"flex",alignItems:"center",gap:9}}>
              🎗️ Bu buyurtmadan <strong style={{marginLeft:4}}>{fmt(Math.round(total*.01))}</strong> ko'krak saratoni kurashiga yo'naltiriladi
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <span style={{fontSize:14,color:C.muted}}>Jami</span>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:C.dark}}>{fmt(total)}</span>
            </div>
            <button onClick={onCheckout} style={{width:"100%",padding:16,background:C.pink,color:"#fff",border:"none",borderRadius:50,fontSize:14,fontWeight:500,fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}}>
              Buyurtma Berish →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
//  AUTH MODAL
// ─────────────────────────────────────────────
function AuthModal({ open, onClose, onSuccess }) {
  const [tab, setTab] = useState("login");
  if(!open) return null;
  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,background:"rgba(26,18,24,.5)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
      <div style={{background:"#fff",borderRadius:24,padding:44,width:"100%",maxWidth:440,position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:18,right:18,background:C.cream,border:"none",width:34,height:34,borderRadius:"50%",cursor:"pointer",fontSize:18,color:C.muted}}>✕</button>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:700,color:C.dark,marginBottom:6}}>Xush Kelibsiz</div>
        <div style={{fontSize:13,color:C.muted,marginBottom:24,fontWeight:300}}>Hisobingizga kiring yoki yangi hisob yarating</div>
        <div style={{display:"flex",background:C.cream,borderRadius:10,padding:4,marginBottom:24,gap:4}}>
          {["login","register"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:9,border:"none",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",borderRadius:7,background:tab===t?"#fff":"none",color:tab===t?C.dark:C.muted,fontWeight:tab===t?500:400}}>
              {t==="login"?"Kirish":"Ro'yxatdan O'tish"}
            </button>
          ))}
        </div>
        {(tab==="login"?[["Email","email","email@misol.com"],["Parol","password","••••••••"]]:
          [["To'liq Ism","text","Ism Familiya"],["Email","email","email@misol.com"],["Parol","password","Kamida 8 belgi"]]
        ).map(([lbl,type,ph])=>(
          <div key={lbl}>
            <label style={{fontSize:12,color:C.mid,marginBottom:6,display:"block",fontWeight:500}}>{lbl}</label>
            <input type={type} placeholder={ph} style={{width:"100%",padding:"12px 15px",border:`1.5px solid ${C.border}`,borderRadius:10,fontSize:14,fontFamily:"'DM Sans',sans-serif",color:C.dark,marginBottom:14,outline:"none"}}/>
          </div>
        ))}
        <button onClick={onSuccess} style={{width:"100%",padding:13,background:C.pink,color:"#fff",border:"none",borderRadius:50,fontSize:14,fontWeight:500,fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}}>
          {tab==="login"?"Kirish":"Ro'yxatdan O'tish"}
        </button>
        <div style={{background:C.pinkXLight,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",fontSize:12.5,color:C.mid,marginTop:16}}>
          🎗️ Ro'yxatdan o'tganda <strong>10% chegirma</strong> + bepul teri tahlili!
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  ADMIN LOGIN + PANEL
// ─────────────────────────────────────────────
function AdminLogin({ onSuccess, onClose }) {
  const [pass, setPass] = useState(""); const [err, setErr] = useState(false);
  function attempt(){ if(pass===ADMIN_PASS) onSuccess(); else{ setErr(true); setTimeout(()=>setErr(false),1500); } }
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(26,18,24,.6)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
      <div style={{background:"#fff",borderRadius:20,padding:"40px 36px",width:360,position:"relative"}}>
        <button onClick={onClose} style={{position:"absolute",top:14,right:14,background:C.cream,border:"none",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:16,color:C.muted}}>✕</button>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:40,marginBottom:10}}>🔐</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,color:C.dark}}>Admin Kirish</div>
          <div style={{fontSize:13,color:C.muted,marginTop:4}}>Maxfiy parolni kiriting</div>
        </div>
        <input type="password" value={pass} placeholder="••••••••"
          onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&attempt()}
          style={{width:"100%",padding:"13px 16px",border:`2px solid ${err?"#e07070":C.border}`,borderRadius:10,fontSize:15,fontFamily:"'DM Sans',sans-serif",color:C.dark,outline:"none",marginBottom:8,textAlign:"center",letterSpacing:4,background:err?"#fff8f8":"#fff"}}/>
        {err&&<div style={{fontSize:12,color:"#c04040",textAlign:"center",marginBottom:8}}>Parol noto'g'ri!</div>}
        <button onClick={attempt} style={{width:"100%",padding:13,background:C.pink,color:"#fff",border:"none",borderRadius:50,fontSize:14,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",marginTop:6}}>Kirish →</button>
        <div style={{marginTop:12,fontSize:11,color:C.muted,textAlign:"center",opacity:.6}}>Demo parol: porla2025</div>
      </div>
    </div>
  );
}

function AdminPanel({ products, onSave, onClose }) {
  const [prods, setProds] = useState(products.map(p=>({...p})));
  const [editId, setEditId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [delConfirm, setDelConfirm] = useState(null);
  const imgRefs = useRef({});
  const edit = prods.find(p=>p.id===editId);
  function upd(id,f,v){ setProds(prev=>prev.map(p=>p.id===id?{...p,[f]:v}:p)); }
  function handleImg(id,file){ if(!file) return; const r=new FileReader(); r.onload=e=>upd(id,"img",e.target.result); r.readAsDataURL(file); }
  function addNew(){ const nid=Math.max(0,...prods.map(p=>p.id))+1; const np={id:nid,emoji:"🧴",img:null,brand:"Yangi Brend",name:"Yangi Mahsulot",price:100000,skin:["aralash"],desc:"...",stars:5,badge:""}; setProds(p=>[...p,np]); setEditId(nid); }
  function del(id){ setProds(p=>p.filter(x=>x.id!==id)); if(editId===id) setEditId(null); setDelConfirm(null); }
  function save(){ onSave(prods); setSaved(true); setTimeout(()=>setSaved(false),2000); }

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(26,18,24,.65)",zIndex:1000,display:"flex",backdropFilter:"blur(4px)"}}>
      {/* Sidebar */}
      <div style={{width:256,background:"#1a0e16",display:"flex",flexDirection:"column",borderRight:"1px solid rgba(255,255,255,.07)"}}>
        <div style={{padding:"20px 16px 16px",borderBottom:"1px solid rgba(255,255,255,.07)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:700,color:"#fff"}}>Admin Panel</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.3)"}}>PORLA.AI · Mahsulotlar</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.1)",border:"none",color:"rgba(255,255,255,.5)",width:28,height:28,borderRadius:6,cursor:"pointer",fontSize:16}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"10px 8px"}}>
          {prods.map(p=>(
            <div key={p.id} onClick={()=>setEditId(p.id)}
              style={{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:10,cursor:"pointer",marginBottom:3,
                background:editId===p.id?"rgba(196,92,138,.25)":"rgba(255,255,255,.04)",
                border:editId===p.id?`1px solid rgba(196,92,138,.4)`:"1px solid transparent"}}>
              {p.img?<img src={p.img} alt="" style={{width:34,height:34,borderRadius:7,objectFit:"cover",flexShrink:0}}/>
                :<div style={{width:34,height:34,borderRadius:7,background:"rgba(255,255,255,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{p.emoji}</div>}
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,color:"rgba(255,255,255,.8)",fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
                <div style={{fontSize:10.5,color:"rgba(255,255,255,.3)"}}>{p.price.toLocaleString("ru")} so'm</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{padding:"10px 8px",borderTop:"1px solid rgba(255,255,255,.07)",display:"flex",flexDirection:"column",gap:7}}>
          <button onClick={addNew} style={{padding:10,background:"rgba(196,92,138,.15)",border:"1px solid rgba(196,92,138,.25)",color:"#e8a0c0",borderRadius:8,cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>+ Yangi Mahsulot</button>
          <button onClick={save} style={{padding:10,background:saved?"#2d7a4a":C.pink,border:"none",color:"#fff",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",transition:"background .3s"}}>{saved?"✓ Saqlandi!":"💾 Saqlash"}</button>
        </div>
      </div>

      {/* Edit form */}
      <div style={{flex:1,background:C.warmWhite,overflowY:"auto"}}>
        {!edit?(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",flexDirection:"column",gap:12,color:C.muted}}>
            <div style={{fontSize:48}}>👆</div><div style={{fontSize:15}}>Chap tarafdan mahsulot tanlang</div>
          </div>
        ):(
          <div style={{padding:"32px 36px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,color:C.dark}}>Mahsulotni Tahrirlash</div>
              <button onClick={()=>setDelConfirm(edit.id)} style={{background:"#fff0f0",border:"1px solid #f0c0c0",color:"#c04040",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif"}}>🗑 O'chirish</button>
            </div>

            {/* Image */}
            <label style={{fontSize:11,color:C.muted,display:"block",marginBottom:10,textTransform:"uppercase",letterSpacing:"1px"}}>Mahsulot Rasmi</label>
            <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:16,alignItems:"start",marginBottom:20}}>
              <div style={{width:120,height:120,borderRadius:14,overflow:"hidden",border:`2px dashed ${C.pinkLight}`,background:C.pinkXLight,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative"}}
                onClick={()=>imgRefs.current[edit.id]?.click()}>
                {edit.img?<img src={edit.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  :<div style={{textAlign:"center"}}><div style={{fontSize:32}}>{edit.emoji}</div><div style={{fontSize:10,color:C.muted}}>Rasm yo'q</div></div>}
              </div>
              <div>
                <input ref={el=>imgRefs.current[edit.id]=el} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleImg(edit.id,e.target.files[0])}/>
                <button onClick={()=>imgRefs.current[edit.id]?.click()}
                  style={{width:"100%",padding:13,background:C.pink,color:"#fff",border:"none",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:500,fontFamily:"'DM Sans',sans-serif",marginBottom:8}}>
                  📁 Kompyuterdan Yuklash
                </button>
                <div style={{fontSize:11.5,color:C.muted,lineHeight:1.6}}>JPG, PNG, WEBP · Tavsiya: 800×800px, oq fon</div>
                {edit.img&&<button onClick={()=>upd(edit.id,"img",null)} style={{marginTop:8,background:"none",border:`1px solid ${C.border}`,color:C.muted,padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif"}}>✕ Rasmni o'chirish</button>}
              </div>
            </div>

            <div style={{height:1,background:C.border,margin:"0 0 20px"}}/>

            {/* Fields */}
            {[["brand","Brend Nomi","text"],["name","Mahsulot Nomi","text"],["price","Narxi (so'm)","number"]].map(([f,lbl,type])=>(
              <div key={f} style={{marginBottom:13}}>
                <label style={{fontSize:11,color:C.muted,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"1px"}}>{lbl}</label>
                <input type={type} value={edit[f]||""} onChange={e=>upd(edit.id,f,type==="number"?Number(e.target.value):e.target.value)}
                  style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:13,fontFamily:"'DM Sans',sans-serif",color:C.dark,outline:"none"}}/>
              </div>
            ))}

            {/* Stars */}
            <div style={{marginBottom:13}}>
              <label style={{fontSize:11,color:C.muted,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"1px"}}>Yulduzlar</label>
              <div style={{display:"flex",gap:6}}>
                {[1,2,3,4,5].map(n=>(
                  <button key={n} onClick={()=>upd(edit.id,"stars",n)}
                    style={{width:36,height:36,border:`1.5px solid ${edit.stars>=n?C.pink:C.border}`,borderRadius:8,background:edit.stars>=n?C.pink:"#fff",color:edit.stars>=n?"#fff":C.muted,fontSize:16,cursor:"pointer"}}>★</button>
                ))}
              </div>
            </div>

            {/* Badge */}
            <div style={{marginBottom:13}}>
              <label style={{fontSize:11,color:C.muted,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"1px"}}>Badge (Yorliq)</label>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {BADGE_OPTS.map(b=>(
                  <button key={b} onClick={()=>upd(edit.id,"badge",b)}
                    style={{padding:"6px 14px",border:`1.5px solid ${edit.badge===b?C.pink:C.border}`,borderRadius:20,fontSize:12,cursor:"pointer",background:edit.badge===b?C.pink:"#fff",color:edit.badge===b?"#fff":C.muted,fontFamily:"'DM Sans',sans-serif"}}>
                    {b||"Yo'q"}
                  </button>
                ))}
              </div>
            </div>

            {/* Skin */}
            <div style={{marginBottom:13}}>
              <label style={{fontSize:11,color:C.muted,display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"1px"}}>Teri Turi</label>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {SKIN_OPTS.map(s=>{const on=edit.skin.includes(s); return(
                  <button key={s} onClick={()=>upd(edit.id,"skin",on?edit.skin.filter(x=>x!==s):[...edit.skin,s])}
                    style={{padding:"6px 14px",border:`1.5px solid ${on?C.pink:C.border}`,borderRadius:20,fontSize:12,cursor:"pointer",background:on?C.pink:"#fff",color:on?"#fff":C.muted,fontFamily:"'DM Sans',sans-serif"}}>{s}</button>
                );})}
              </div>
            </div>

            {/* Desc */}
            <div style={{marginBottom:20}}>
              <label style={{fontSize:11,color:C.muted,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:"1px"}}>Tavsif</label>
              <textarea value={edit.desc||""} rows={4} onChange={e=>upd(edit.id,"desc",e.target.value)}
                style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:13,fontFamily:"'DM Sans',sans-serif",color:C.dark,outline:"none",resize:"vertical"}}/>
            </div>

            <button onClick={save} style={{width:"100%",padding:15,background:saved?"#2d7a4a":C.pink,color:"#fff",border:"none",borderRadius:50,fontSize:15,fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",transition:"background .3s"}}>
              {saved?"✓ Saqlandi!":"💾 Saqlash"}
            </button>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {delConfirm&&(
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10}}>
          <div style={{background:"#fff",borderRadius:18,padding:32,maxWidth:340,textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:12}}>🗑️</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:C.dark,marginBottom:8}}>O'chirishni tasdiqlang</div>
            <p style={{fontSize:13,color:C.muted,marginBottom:22}}>Bu mahsulot butunlay o'chiriladi.</p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setDelConfirm(null)} style={{flex:1,padding:12,border:`1.5px solid ${C.border}`,borderRadius:50,cursor:"pointer",fontSize:13,background:"#fff",color:C.dark,fontFamily:"'DM Sans',sans-serif"}}>Bekor</button>
              <button onClick={()=>del(delConfirm)} style={{flex:1,padding:12,background:"#c04040",color:"#fff",border:"none",borderRadius:50,cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>Ha, o'chir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  TOAST
// ─────────────────────────────────────────────
function Toast({ msg, show }) {
  return (
    <div style={{position:"fixed",bottom:28,right:28,zIndex:9999,background:C.dark,color:"#fff",padding:"14px 22px",borderRadius:14,fontSize:13.5,fontFamily:"'DM Sans',sans-serif",
      transform:show?"translateY(0)":"translateY(90px)",opacity:show?1:0,transition:"all .4s cubic-bezier(.4,0,.2,1)",maxWidth:340,boxShadow:"0 8px 32px rgba(26,18,24,.25)"}}>
      {msg}
    </div>
  );
}

// ─────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [page, setPage]             = useState("home");
  const [products, setProducts]     = useState(PRODUCTS);
  const [cart, setCart]             = useState([]);
  const [cartOpen, setCartOpen]     = useState(false);
  const [authOpen, setAuthOpen]     = useState(false);
  const [detailId, setDetailId]     = useState(null);
  const [shopFilter, setShopFilter] = useState("all");
  const [skinFilter, setSkinFilter] = useState("all");
  const [toast, setToast]           = useState({ show:false, msg:"" });
  const [adminOpen, setAdminOpen]   = useState(false);
  const [adminLogin, setAdminLogin] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);

  useEffect(()=>{
    const link=document.createElement("link"); link.rel="stylesheet";
    link.href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
    window.storage?.get("porla-products").then(r=>{ if(r?.value) try{ setProducts(JSON.parse(r.value)); }catch{} }).catch(()=>{});
  },[]);

  const showToast = msg => { setToast({show:true,msg}); setTimeout(()=>setToast(t=>({...t,show:false})),3200); };
  const goTo = p => { setPage(p); window.scrollTo({top:0,behavior:"smooth"}); };

  function addToCart(id){
    const p=products.find(x=>x.id===id); if(!p) return;
    setCart(prev=>{ const ex=prev.find(c=>c.id===id); if(ex) return prev.map(c=>c.id===id?{...c,qty:c.qty+1}:c); return [...prev,{...p,qty:1}]; });
    showToast(`✓ ${p.brand} savatga qo'shildi!`);
  }
  function changeQty(id,delta){ setCart(prev=>prev.map(c=>c.id===id?{...c,qty:c.qty+delta}:c).filter(c=>c.qty>0)); }
  function saveProducts(newProds){ setProducts(newProds); window.storage?.set("porla-products",JSON.stringify(newProds)).catch(()=>{}); showToast("✓ Mahsulotlar saqlandi!"); }
  function openAdmin(){ if(adminAuthed) setAdminOpen(true); else setAdminLogin(true); }

  const cartCount = cart.reduce((s,c)=>s+c.qty,0);
  const detail    = products.find(p=>p.id===detailId);
  const filtered  = products
    .filter(p => shopFilter==="all" || p.cat===shopFilter)
    .filter(p => skinFilter==="all"  || p.skin.includes(skinFilter));

  // shared styles
  const secP  = {padding:"64px 40px"};
  const sTag  = {fontSize:10.5,letterSpacing:"2.5px",color:C.pink,textTransform:"uppercase",fontWeight:500,marginBottom:8};
  const sTitle= {fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:700,color:C.dark,lineHeight:1.1};

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.cream,color:C.dark,minHeight:"100vh"}}>

      {/* MISSION STRIP */}
      <div style={{background:C.pink,padding:"10px 24px",textAlign:"center",fontSize:12.5,color:"#fff"}}>
        🎗️ Har bir xaridingizning <strong>1%</strong> ko'krak saratoni bilan kurashayotgan ayollar salomatligiga yo'naltiriladi
      </div>

      {/* NAV */}
      <nav style={{background:C.warmWhite,borderBottom:`1px solid ${C.border}`,padding:"0 40px",display:"flex",alignItems:"center",justifyContent:"space-between",height:66,position:"sticky",top:0,zIndex:100}}>
        <div onClick={()=>goTo("home")} style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:700,color:C.dark,cursor:"pointer"}}>
          PORLA<span style={{color:C.pink}}>.AI</span>
        </div>
        <div style={{display:"flex",gap:28}}>
          {[["home","Bosh Sahifa"],["shop","Mahsulotlar"],["ai","Teri Tahlili"],["mission","Missiyamiz"]].map(([p,lbl])=>(
            <span key={p} onClick={()=>goTo(p)} style={{fontSize:13,color:page===p?C.dark:C.muted,cursor:"pointer",fontWeight:page===p?500:400,borderBottom:page===p?`2px solid ${C.pink}`:"2px solid transparent",paddingBottom:2}}>{lbl}</span>
          ))}
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <button onClick={()=>setAuthOpen(true)} style={{border:`1.5px solid ${C.border}`,color:C.pink,padding:"8px 18px",borderRadius:50,fontSize:13,fontWeight:500,cursor:"pointer",background:"transparent",fontFamily:"'DM Sans',sans-serif"}}>Kirish</button>
          <button onClick={openAdmin} style={{border:`1.5px solid ${C.border}`,color:C.muted,padding:"8px 14px",borderRadius:50,fontSize:13,cursor:"pointer",background:"transparent",fontFamily:"'DM Sans',sans-serif"}} title="Admin panel">⚙️</button>
          <button onClick={()=>setCartOpen(true)} style={{background:C.pink,color:"#fff",padding:"8px 18px",borderRadius:50,fontSize:13,fontWeight:500,cursor:"pointer",border:"none",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:7}}>
            🛒 Savat <span style={{background:"#fff",color:C.pink,width:18,height:18,borderRadius:"50%",fontSize:10,fontWeight:700,display:"inline-flex",alignItems:"center",justifyContent:"center"}}>{cartCount}</span>
          </button>
        </div>
      </nav>

      {/* ══ HOME ══ */}
      {page==="home"&&<div>
        {/* Hero */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:"calc(100vh - 90px)",background:C.warmWhite}}>
          <div style={{padding:"80px 56px",display:"flex",flexDirection:"column",justifyContent:"center",borderRight:`1px solid ${C.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:10,fontSize:11,color:C.pink,letterSpacing:3,textTransform:"uppercase",fontWeight:500,marginBottom:20}}>
              <div style={{width:28,height:1,background:C.pink}}/>K-Beauty · O'zbekiston
            </div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:64,fontWeight:700,lineHeight:.95,color:C.dark,letterSpacing:"-2px",marginBottom:22}}>
              Teringiz.<br/><em style={{color:C.pink,fontStyle:"italic"}}>Porlasin.</em>
            </h1>
            <p style={{fontSize:15,lineHeight:1.9,color:C.muted,marginBottom:34,fontWeight:300,maxWidth:440}}>
              Koreaning original go'zallik mahsulotlari. AI yordamida teringizni klinik darajada tahlil qiling va aynan o'zingizga mos parvarish toping.
            </p>
            <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
              <button onClick={()=>goTo("ai")} style={{background:C.pink,color:"#fff",padding:"15px 30px",borderRadius:50,fontSize:14,fontWeight:500,border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>✦ Terini Tahlil Qilish</button>
              <button onClick={()=>goTo("shop")} style={{border:`1.5px solid ${C.border}`,color:C.pink,padding:"14px 28px",borderRadius:50,fontSize:14,cursor:"pointer",background:"transparent",fontFamily:"'DM Sans',sans-serif"}}>Xarid Qilish →</button>
            </div>
          </div>
          {/* Hero right — real photo with heatmap overlay */}
          <div style={{background:C.pinkXLight,display:"flex",alignItems:"center",justifyContent:"center",padding:"48px 40px",position:"relative"}}>
            {/* soft blurred bg circles */}
            <div style={{position:"absolute",width:420,height:420,borderRadius:"50%",background:"rgba(196,92,138,.06)",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}/>
            <div style={{position:"absolute",width:280,height:280,borderRadius:"50%",background:"rgba(196,92,138,.05)",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}/>

            <div style={{zIndex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
              {/* Photo card with heatmap overlay */}
              <div style={{position:"relative",borderRadius:28,overflow:"hidden",boxShadow:"0 24px 64px rgba(196,92,138,.22), 0 4px 16px rgba(0,0,0,.08)",width:260,height:320}}>
                {/* Real photo */}
                <img
                  src="data:image/png;base64,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"
                  alt="PORLA.AI demo"
                  style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}}
                />
                {/* SVG heatmap overlay — transparent zones on face */}
                <svg
                  viewBox="0 0 260 320"
                  width="260" height="320"
                  style={{position:"absolute",top:0,left:0,mixBlendMode:"multiply"}}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <filter id="hblur"><feGaussianBlur stdDeviation="9"/></filter>
                    <filter id="hblur2"><feGaussianBlur stdDeviation="5"/></filter>
                  </defs>
                  {/* T-zone pores — forehead + nose */}
                  <ellipse cx="128" cy="82" rx="44" ry="28" fill="#ff6b6b" opacity="0.28" filter="url(#hblur)"/>
                  <rect x="116" y="108" width="24" height="52" rx="12" fill="#ff6b6b" opacity="0.22" filter="url(#hblur2)"/>
                  {/* Cheek redness — subtle */}
                  <ellipse cx="72" cy="162" rx="30" ry="22" fill="#fa8072" opacity="0.20" filter="url(#hblur)"/>
                  <ellipse cx="188" cy="162" rx="30" ry="22" fill="#fa8072" opacity="0.20" filter="url(#hblur)"/>
                  {/* Under-eye hydration zone */}
                  <ellipse cx="95" cy="142" rx="22" ry="10" fill="#51cf66" opacity="0.18" filter="url(#hblur2)"/>
                  <ellipse cx="165" cy="142" rx="22" ry="10" fill="#51cf66" opacity="0.18" filter="url(#hblur2)"/>
                  {/* Nose tip blackheads */}
                  <ellipse cx="128" cy="168" rx="14" ry="10" fill="#845ef7" opacity="0.22" filter="url(#hblur2)"/>
                </svg>
                {/* Scan line animation */}
                <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:"linear-gradient(90deg,transparent,rgba(196,92,138,.7),transparent)",animation:"scanHero 3s ease-in-out infinite"}}/>
                <style>{`@keyframes scanHero{0%{top:0;opacity:0}10%{opacity:1}90%{opacity:1}100%{top:320px;opacity:0}}`}</style>
                {/* Corner brackets — scanner aesthetic */}
                <div style={{position:"absolute",top:10,left:10,width:22,height:22,borderTop:"2px solid rgba(196,92,138,.7)",borderLeft:"2px solid rgba(196,92,138,.7)",borderRadius:"4px 0 0 0"}}/>
                <div style={{position:"absolute",top:10,right:10,width:22,height:22,borderTop:"2px solid rgba(196,92,138,.7)",borderRight:"2px solid rgba(196,92,138,.7)",borderRadius:"0 4px 0 0"}}/>
                <div style={{position:"absolute",bottom:10,left:10,width:22,height:22,borderBottom:"2px solid rgba(196,92,138,.7)",borderLeft:"2px solid rgba(196,92,138,.7)",borderRadius:"0 0 0 4px"}}/>
                <div style={{position:"absolute",bottom:10,right:10,width:22,height:22,borderBottom:"2px solid rgba(196,92,138,.7)",borderRight:"2px solid rgba(196,92,138,.7)",borderRadius:"0 0 4px 0"}}/>
                {/* AI badge overlay */}
                <div style={{position:"absolute",bottom:14,left:"50%",transform:"translateX(-50%)",background:"rgba(26,18,24,.72)",backdropFilter:"blur(6px)",borderRadius:20,padding:"5px 14px",fontSize:11,color:"#fff",fontWeight:500,whiteSpace:"nowrap",letterSpacing:"0.5px"}}>
                  ✦ AI Tahlil Tayyor
                </div>
              </div>

              {/* Legend pills */}
              <div style={{display:"flex",flexWrap:"wrap",gap:7,justifyContent:"center",maxWidth:280}}>
                {[["#ff6b6b","Porlar"],["#845ef7","Qora nuqtalar"],["#51cf66","Namlik"],["#fa8072","Qizillik"]].map(([clr,lbl])=>(
                  <div key={lbl} style={{display:"flex",alignItems:"center",gap:5,background:"rgba(255,255,255,.85)",borderRadius:20,padding:"4px 10px",fontSize:11,backdropFilter:"blur(4px)",border:`1px solid ${clr}30`}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:clr}}/>
                    <span style={{color:C.dark,fontWeight:500}}>{lbl}</span>
                  </div>
                ))}
              </div>

              <button onClick={()=>goTo("ai")} style={{background:C.pink,color:"#fff",border:"none",borderRadius:50,padding:"11px 26px",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",boxShadow:"0 4px 16px rgba(196,92,138,.3)"}}>
                ✦ O'z teringizni tahlil qiling
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",background:C.warmWhite,borderBottom:`1px solid ${C.border}`}}>
          {[["50+","K-Beauty Brend"],["20+","Teri Ko'rsatkichi"],["5 000+","Mamnun Mijoz"],["100%","Original Mahsulot"]].map(([n,l],i)=>(
            <div key={i} style={{padding:"24px 40px",borderRight:i<3?`1px solid ${C.border}`:"none"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:700,color:C.pink,lineHeight:1,marginBottom:4}}>{n}</div>
              <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:1}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Trust */}
        <div style={{background:C.sand,borderBottom:`1px solid ${C.border}`,padding:"14px 40px",display:"flex",alignItems:"center",gap:24,flexWrap:"wrap"}}>
          {[["🇰🇷","Korea'dan To'g'ridan-to'g'ri"],["✓","Sertifikatlangan Original"],["🚚","Butun O'zbekiston"],["↩","14 Kun Qaytarish"],["🎗️","Har xariddan 1% xayriya"]].map(([ico,txt],i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:9,fontSize:12.5,color:C.mid}}>
              <div style={{width:30,height:30,background:C.warmWhite,border:`1px solid ${C.border}`,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{ico}</div>
              {txt}
              {i<4&&<div style={{width:1,height:20,background:C.border,marginLeft:12}}/>}
            </div>
          ))}
        </div>

        {/* Bestsellers */}
        <div style={{...secP,background:C.warmWhite,borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28}}>
            <div><div style={sTag}>Trendda</div><div style={sTitle}>Eng Ko'p Sotilgan</div></div>
            <span onClick={()=>goTo("shop")} style={{fontSize:13,color:C.pink,cursor:"pointer"}}>Hammasini ko'rish →</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
            {products.slice(0,4).map(p=><ProdCard key={p.id} p={p} onAdd={addToCart} onOpen={id=>{setDetailId(id);goTo("detail");}}/>)}
          </div>
        </div>

        {/* Routine */}
        <div style={{...secP,background:C.cream,borderBottom:`1px solid ${C.border}`}}>
          <div style={{marginBottom:28}}><div style={sTag}>Parvarish</div><div style={sTitle}>Teri Turingiz Uchun Routine</div></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
            {[["01","Tozalash","Cleanser"],["02","Toner","Namlik berish"],["03","Serum","Muolaja"],["04","Krem","Himoya"]].map(([n,name,sub])=>(
              <div key={n} onClick={()=>goTo("shop")} style={{background:C.warmWhite,border:`1px solid ${C.border}`,borderRadius:14,padding:"22px 18px",textAlign:"center",cursor:"pointer"}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:38,fontWeight:700,color:C.border,marginBottom:8}}>{n}</div>
                <div style={{fontSize:14,color:C.dark,fontWeight:500,marginBottom:4}}>{name}</div>
                <div style={{fontSize:11.5,color:C.muted}}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div style={{...secP,background:C.warmWhite,borderBottom:`1px solid ${C.border}`}}><MissionCard/></div>

        {/* Before/After */}
        <div style={{...secP,background:C.cream,borderBottom:`1px solid ${C.border}`}}>
          <div style={{marginBottom:28}}><div style={sTag}>Natijalar</div><div style={sTitle}>Mijozlarimiz Tajribasi</div></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
            {[[false,"😟","30 kun oldin","Nilufar, 24 yosh · Toshkent","Kengaygan porlar · Qo'ng'ir dog'lar · Quruq teri"],
              [true,"😊","30 kundan keyin","Nilufar, 24 yosh · Toshkent","Porlar torayldi · Teri yorishdi · Namlik tiklandi"]].map(([after,em,date,name,desc],i)=>(
              <div key={i} style={{background:C.warmWhite,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
                <div style={{height:100,display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,background:C.pinkXLight}}>{em}</div>
                <div style={{padding:"14px 18px"}}>
                  <div style={{display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:10,fontWeight:600,marginBottom:7,
                    ...(after?{background:"#f0fff4",color:"#2d7a4a",border:"1px solid #c0e8cc"}:{background:"#fff5f5",color:"#c45c5c",border:"1px solid #f0d0d0"})}}>{date}</div>
                  <div style={{fontSize:13,fontWeight:500,color:C.dark,marginBottom:3}}>{name}</div>
                  <div style={{fontSize:11.5,color:C.muted}}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Telegram */}
        <div style={{background:C.dark,padding:"32px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:20,flexWrap:"wrap"}}>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:"#fff",marginBottom:5}}>Telegram Kanalimiz</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.4)",fontWeight:300}}>Yangi mahsulotlar, chegirmalar va teri maslahatlarini to'g'ridan-to'g'ri oling</div>
          </div>
          <button style={{background:"#229ED9",color:"#fff",padding:"14px 26px",borderRadius:50,fontSize:14,fontWeight:500,cursor:"pointer",border:"none",fontFamily:"'DM Sans',sans-serif"}}>✈ Telegram Kanaliga Qo'shilish</button>
        </div>
      </div>}

      {/* ══ SHOP ══ */}
      {page==="shop"&&<div style={{padding:"40px 40px",background:C.warmWhite}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24}}>
          <div><div style={sTag}>Olive Young Katalogi</div><div style={sTitle}>Barcha Mahsulotlar</div></div>
          <span style={{fontSize:13,color:C.muted}}>{filtered.length} ta mahsulot</span>
        </div>

        {/* Category filters */}
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
          {[["all","Barchasi 🌸"],["serum","Serum"],["toner","Toner"],["krem","Krem"],["cleanser","Tozalovchi"],["spf","Quyosh Himoyasi"],["maska","Maska"],["eye","Ko'z"],["lip","Lab"],["body","Tana"]].map(([f,lbl])=>(
            <button key={f} onClick={()=>setShopFilter(f)} style={{padding:"8px 18px",border:`1.5px solid ${shopFilter===f?C.pink:C.border}`,borderRadius:50,fontSize:12.5,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:shopFilter===f?C.pink:C.warmWhite,color:shopFilter===f?"#fff":C.muted,transition:"all .2s"}}>{lbl}</button>
          ))}
        </div>

        {/* Skin type filter row */}
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:28,paddingBottom:20,borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontSize:12,color:C.muted,alignSelf:"center",marginRight:4}}>Teri turi:</span>
          {[["all","Barchasi"],["yog","Yog'li"],["quruq","Quruq"],["aralash","Aralash"],["sezgir","Sezgir"]].map(([f,lbl])=>(
            <button key={f} onClick={()=>setSkinFilter(f)} style={{padding:"6px 14px",border:`1.5px solid ${skinFilter===f?C.pinkLight:C.border}`,borderRadius:50,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",background:skinFilter===f?C.pinkXLight:C.warmWhite,color:skinFilter===f?C.pink:C.muted,transition:"all .2s"}}>{lbl}</button>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:16}}>
          {filtered.map(p=><ProdCard key={p.id} p={p} onAdd={addToCart} onOpen={id=>{setDetailId(id);goTo("detail");}}/>)}
        </div>
        {filtered.length===0&&<div style={{textAlign:"center",padding:"48px 0",color:C.muted}}>
          <div style={{fontSize:36,marginBottom:12}}>🔍</div>
          <div style={{fontSize:14}}>Bu kategoriyada mahsulot topilmadi</div>
        </div>}
      </div>}

      {/* ══ AI ══ */}
      {page==="ai"&&<AiPage onAddToCart={addToCart} products={products}/>}

      {/* ══ MISSION ══ */}
      {page==="mission"&&<div>
        <div style={{...secP,background:C.warmWhite,borderBottom:`1px solid ${C.border}`}}><MissionCard/></div>
        <div style={{...secP,background:C.cream}}>
          <div style={{marginBottom:8}}><div style={sTag}>Statistika</div><div style={sTitle}>Nima Uchun Bu Muhim?</div></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden",marginTop:28}}>
            {[["1/8","Ayolda umr bo'yi ko'krak saratoni riski"],["90%","Erta aniqlanganida sog'ayish imkoniyati"],["2M+","Har yili yangi tashxis qo'yiladi dunyo bo'ylab"],["💗","Siz ham bu kurashning bir qismidasiz"]].map(([n,l],i)=>(
              <div key={i} style={{padding:"32px 24px",borderRight:i<3?`1px solid ${C.border}`:"none",textAlign:"center"}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:40,fontWeight:700,color:C.pink,marginBottom:8}}>{n}</div>
                <div style={{fontSize:12,color:C.muted,lineHeight:1.5}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>}

      {/* ══ DETAIL ══ */}
      {page==="detail"&&detail&&<div>
        <div onClick={()=>goTo("shop")} style={{padding:"20px 40px",background:C.warmWhite,borderBottom:`1px solid ${C.border}`,fontSize:13,color:C.pink,cursor:"pointer"}}>← Mahsulotlarga Qaytish</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",background:C.warmWhite}}>
          <div style={{height:480,display:"flex",alignItems:"center",justifyContent:"center",background:C.pinkXLight,borderRight:`1px solid ${C.border}`,overflow:"hidden"}}>
            {detail.img?<img src={detail.img} alt={detail.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{fontSize:120}}>{detail.emoji}</div>}
          </div>
          <div style={{padding:"56px 48px"}}>
            <div style={{fontSize:11,color:C.muted,textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:10}}>{detail.brand}</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:700,color:C.dark,lineHeight:1.1,marginBottom:12}}>{detail.name}</div>
            <div style={{marginBottom:18}}><Stars n={detail.stars}/><span style={{fontSize:13,color:C.muted,marginLeft:8}}>(128 ta sharh)</span></div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:700,color:C.pink,marginBottom:22}}>{fmt(detail.price)}</div>
            <p style={{fontSize:14.5,color:C.muted,lineHeight:1.85,marginBottom:26,fontWeight:300}}>{detail.desc}</p>
            <div style={{background:C.pinkXLight,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 18px",fontSize:13,color:C.mid,marginBottom:26,display:"flex",alignItems:"center",gap:10}}>
              🎗️ Ushbu mahsulot foydasining 1%i ko'krak saratoni bilan kurashayotgan ayollarga yo'naltiriladi.
            </div>
            <button onClick={()=>addToCart(detail.id)} style={{width:"100%",padding:17,background:C.pink,color:"#fff",border:"none",borderRadius:50,fontSize:15,fontWeight:500,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",marginBottom:12}}>Savatga Qo'shish 🛒</button>
            <button onClick={()=>goTo("ai")} style={{width:"100%",padding:15,border:`1.5px solid ${C.border}`,color:C.pink,background:"transparent",borderRadius:50,fontSize:15,fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}}>✦ Teri Tahlili Orqali Ko'rish</button>
          </div>
        </div>
      </div>}

      {/* FOOTER */}
      <footer style={{background:C.dark,padding:"52px 40px 30px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr 1fr 1fr",gap:48,marginBottom:44}}>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:"#fff",marginBottom:12}}>PORLA<span style={{color:"#e8a0c0"}}>.AI</span></div>
            <p style={{fontSize:13,color:"rgba(255,255,255,.3)",lineHeight:1.7,fontWeight:300}}>O'zbekistondagi birinchi AI-powered K-Beauty platformasi.</p>
          </div>
          {[["Sahifalar",[["Bosh Sahifa","home"],["Mahsulotlar","shop"],["Teri Tahlili","ai"],["Missiyamiz","mission"]]],
            ["Brendlar",[["COSRX",null],["Laneige",null],["Innisfree",null],["Some By Mi",null]]],
            ["Aloqa",[["+998 90 000 00 00",null],["info@porla.ai",null],["Toshkent, O'zbekiston",null]]]
          ].map(([h,links])=>(
            <div key={h}>
              <div style={{fontSize:11,color:"rgba(255,255,255,.35)",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:16}}>{h}</div>
              {links.map(([lbl,pg])=>(
                <div key={lbl} onClick={pg?()=>goTo(pg):undefined} style={{fontSize:13,color:"rgba(255,255,255,.55)",marginBottom:10,cursor:pg?"pointer":"default"}}>{lbl}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,.07)",paddingTop:24,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <span style={{fontSize:12,color:"rgba(255,255,255,.2)"}}>© 2025 PORLA.AI · Barcha huquqlar himoyalangan</span>
          <span style={{fontSize:12,color:"#e8a0c0",opacity:.7}}>🎗️ Har xaridingiz hayot saqlay oladi</span>
        </div>
      </footer>

      {/* MODALS */}
      <CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)} cart={cart} onChange={changeQty}
        onCheckout={()=>{setCart([]);setCartOpen(false);showToast("🎉 Buyurtmangiz qabul qilindi!");}}/>
      <AuthModal open={authOpen} onClose={()=>setAuthOpen(false)} onSuccess={()=>{setAuthOpen(false);showToast("✓ Tizimga muvaffaqiyatli kirdingiz!");}}/>
      <Toast msg={toast.msg} show={toast.show}/>
      {adminLogin&&<AdminLogin onSuccess={()=>{setAdminLogin(false);setAdminAuthed(true);setAdminOpen(true);}} onClose={()=>setAdminLogin(false)}/>}
      {adminOpen&&<AdminPanel products={products} onSave={saveProducts} onClose={()=>setAdminOpen(false)}/>}
    </div>
  );
}
