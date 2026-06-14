// ── window.storage shim ──────────────────────────────────────────
// Asl kod (App.jsx) Claude.ai Artifacts muhitidagi `window.storage`
// API'siga mos yozilgan (get/set/delete/list, Promise asosida).
// Bu fayl xuddi shu interfeysni brauzerning localStorage'i orqali
// taqdim etadi, shunda App.jsx kodini o'zgartirish shart emas.
//
// ESLATMA: localStorage faqat shu brauzer/qurilmada saqlanadi.
// Agar admin panel ma'lumotlari barcha foydalanuvchilar/qurilmalar
// orasida sinxron bo'lishi kerak bo'lsa, buni haqiqiy backend API
// (masalan porla-backend ichida /api/products endpoint) bilan
// almashtirish kerak.

const PREFIX = "porla-storage:";

function read(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? null : raw;
  } catch {
    return null;
  }
}

window.storage = {
  async get(key) {
    const value = read(key);
    if (value === null) return null;
    return { key, value, shared: false };
  },

  async set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, value);
      return { key, value, shared: false };
    } catch {
      return null;
    }
  },

  async delete(key) {
    try {
      const existed = read(key) !== null;
      localStorage.removeItem(PREFIX + key);
      return { key, deleted: existed, shared: false };
    } catch {
      return null;
    }
  },

  async list(prefix = "") {
    try {
      const keys = Object.keys(localStorage)
        .filter(k => k.startsWith(PREFIX))
        .map(k => k.slice(PREFIX.length))
        .filter(k => k.startsWith(prefix));
      return { keys, prefix, shared: false };
    } catch {
      return null;
    }
  },
};
