export type Project = {
  slug: string;
  id: string;
  title: string;
  category: string;
  year: string;
  desc: string;
  tags: string[];
  repo: string;
  image?: string; // contoh: "/images/slameticon.png"
  // ===== Opsional: bagian ini baru tampil kalau diisi =====
  role?: string; // contoh: "Developer (individu)"
  context?: string; // konteks project (tugas kuliah, magang, dll)
  problem?: string; // masalah yang ingin diselesaikan
  solution?: string; // cara kamu menyelesaikannya
  features?: string[]; // fitur utama
  gallery?: string[]; // screenshot tambahan, contoh: ["/images/p1-a.png"]
};

export const PROJECTS: Project[] = [
  {
    slug: "food-time-express",
    id: "01",
    title: "Food Time Express",
    image: "/images/banyumax.png",
    category: "Web / TypeScript",
    year: "GitHub",
    desc: "Project web berbasis TypeScript bertema pemesanan makanan.",
    tags: ["TypeScript", "Web"],
    repo: "https://github.com/ForRyll/food-time-express",
  },
  {
    slug: "mi-gacoan",
    id: "02",
    title: "Mi Gacoan UI/UX",
    image: "/images/humanfix.png",
    category: "UI/UX / Kampus",
    year: "GitHub",
    desc: "Perancangan antarmuka dan pengalaman pengguna dengan pendekatan Human Computer Interaction.",
    context: "Dibuat sebagai tugas UAS mata kuliah Human Computer Interaction.",
    tags: ["UI/UX", "HCI"],
    repo: "https://github.com/ForRyll/mi-gacoan",
  },
  {
    slug: "sistem-stok-arti-coffee",
    id: "03",
    title: "Sistem Stok Arti Coffee",
    image: "/images/kkn.png",
    category: "Web / Kampus",
    year: "GitHub",
    desc: "Sistem pengelolaan stok barang untuk Arti Coffee.",
    context: "Dibuat sebagai tugas akhir mata kuliah Pengembangan Perangkat Lunak.",
    tags: ["Sistem Informasi", "PHP"],
    repo: "https://github.com/ForRyll/sistempengelolaanstokbarang_articoffee",
  },
  {
    slug: "e-health",
    id: "04",
    title: "E-Health",
    image: "/images/mooney.png",
    category: "Web / PHP",
    year: "GitHub",
    desc: "Aplikasi web bertema kesehatan yang dibangun dengan PHP.",
    tags: ["PHP", "Web"],
    repo: "https://github.com/ForRyll/e_health",
  },
  {
    slug: "budgetbuddy",
    id: "05",
    title: "BudgetBuddy",
    image: "/images/slameticon.png",
    category: "App / Keuangan",
    year: "GitHub",
    desc: "Aplikasi pengelola keuangan pribadi.",
    tags: ["Keuangan", "App"],
    repo: "https://github.com/ForRyll/BudgetBuddy",
  },
  {
    slug: "arti-coffee",
    id: "06",
    title: "Arti Coffee",
    image: "/images/1.png",
    category: "Web / PHP",
    year: "GitHub",
    desc: "Aplikasi web untuk Arti Coffee yang dibangun dengan PHP.",
    tags: ["PHP", "Web"],
    repo: "https://github.com/ForRyll/arti_coffee",
  },
];