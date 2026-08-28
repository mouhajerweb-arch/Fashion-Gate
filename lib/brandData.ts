export interface Brand {
  id: string;
  name: string;
  nameAr: string;
  backdropUrl: string;
  isActive?: boolean;
  headline?: string;
  headlineAr?: string;
  description?: string;
  descriptionAr?: string;
}

export const brands: Brand[] = [
  { id: "adidas", name: "Adidas", nameAr: "أديداس", backdropUrl: "/assets/adidas_bg.jpg" },
  { id: "calvin-klein", name: "Calvin Klein", nameAr: "كالفين كلاين", backdropUrl: "/assets/ck_bg.jpg" },
  { id: "skechers", name: "Skechers", nameAr: "سكيتشرز", backdropUrl: "/brand-pages/page_10.jpg" },
  { id: "maxmara", name: "Max Mara", nameAr: "ماكس مارا", backdropUrl: "/brand-pages/page_04.jpg" },
  { id: "editorial", name: "Editorial", nameAr: "إيديتوريال", backdropUrl: "/brand-pages/page_06.jpg" },
  { id: "paul-shark", name: "Paul & Shark", nameAr: "بول آند شارك", backdropUrl: "/brand-pages/page_08.jpg" },
  { id: "sandro", name: "Sandro", nameAr: "ساندرو", backdropUrl: "/brand-pages/page_12.jpg" },
  { id: "moje", name: "Moje", nameAr: "موهي", backdropUrl: "/brand-pages/page_11.jpg" },
  { id: "elie-saab", name: "Elie Saab", nameAr: "إيلي صعب", backdropUrl: "/brand-pages/page_04.jpg" },
  { id: "gucci", name: "Gucci", nameAr: "غوتشي", backdropUrl: "/brand-pages/page_06.jpg" },
  { id: "jimmy-choo", name: "Jimmy Choo", nameAr: "جيمي تشو", backdropUrl: "/brand-pages/page_10.jpg" },
  { id: "hugo-boss", name: "Hugo Boss", nameAr: "هوغو بوس", backdropUrl: "/brand-pages/page_08.jpg" },
  { id: "giorgio-armani", name: "Giorgio Armani", nameAr: "جورجيو أرماني", backdropUrl: "/brand-pages/page_08.jpg" },
  { id: "lancome", name: "Lancôme", nameAr: "لانكوم", backdropUrl: "/brand-pages/page_11.jpg" },
  { id: "prada", name: "Prada", nameAr: "برادا", backdropUrl: "/brand-pages/page_06.jpg" },
  { id: "valentino", name: "Valentino", nameAr: "فالنتينو", backdropUrl: "/brand-pages/page_04.jpg" },
  { id: "ysl", name: "Saint Laurent", nameAr: "سان لوران", backdropUrl: "/brand-pages/page_06.jpg" },
  { id: "cartier", name: "Cartier", nameAr: "كارتييه", backdropUrl: "/brand-pages/page_11.jpg" },
  { id: "chloe", name: "Chloé", nameAr: "كلوي", backdropUrl: "/brand-pages/page_12.jpg" },
  { id: "coach", name: "Coach", nameAr: "كوتش", backdropUrl: "/brand-pages/page_10.jpg" }
];

export function getBrandById(id: string): Brand | undefined {
  return brands.find((brand) => brand.id === id);
}

export function getAllBrands(): Brand[] {
  return brands.filter((brand) => brand.isActive !== false);
}
