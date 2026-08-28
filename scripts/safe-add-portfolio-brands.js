const { createClient } = require("@sanity/client");

const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error("Missing SANITY_AUTH_TOKEN or SANITY_WRITE_TOKEN.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "4y6hfnze",
  dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-07-03",
  useCdn: false,
  perspective: "raw",
});

const perfumeBrands = [
  ["lancome", "Lancôme"],
  ["prada", "Prada"],
  ["valentino", "Valentino"],
  ["guess", "Guess"],
  ["mugler", "Mugler"],
  ["ralph-lauren", "Ralph Lauren"],
  ["calvin-klein", "Calvin Klein"],
  ["cartier", "Cartier"],
  ["chloe", "Chloé"],
  ["davidoff", "Davidoff"],
  ["lacoste", "Lacoste"],
  ["mont-blanc", "Mont Blanc"],
  ["giorgio-armani", "Giorgio Armani"],
  ["ferragamo", "Ferragamo"],
  ["hugo-boss", "Hugo Boss"],
  ["versace", "Versace"],
  ["michael-kors", "Michael Kors"],
  ["beverly-hills-polo-club", "Beverly Hills Polo Club"],
  ["armand-basi", "Armand Basi"],
  ["azzaro", "Azzaro"],
  ["bmw", "BMW"],
  ["george-rech", "George Rech"],
  ["guy-laroche", "Guy Laroche"],
  ["kenneth-cole", "Kenneth Cole"],
  ["max-and-co", "Max&Co"],
  ["ysl-beauty", "YSL Beauty"],
  ["pascal-morabito", "Pascal Morabito"],
  ["trussardi", "Trussardi"],
  ["viktor-rolf", "Viktor&Rolf"],
  ["vince-camuto", "Vince Camuto"],
  ["diesel", "Diesel"],
  ["anf", "ANF"],
  ["mcm", "MCM"],
  ["oscar", "Oscar"],
  ["signature", "Signature"],
  ["jeanne-arthes", "Jeanne Arthes"],
  ["gucci", "Gucci"],
  ["narciso-rodriguez", "Narciso Rodriguez"],
];

const beautyBrands = [
  ["clarins-paris", "Clarins Paris"],
  ["elizabeth-arden", "Elizabeth Arden"],
  ["anastasia-beverly-hills", "Anastasia Beverly Hills"],
  ["lancaster", "Lancaster"],
  ["dermedic", "Dermedic"],
  ["gemology", "Gemology"],
  ["lakme", "Lakmé"],
  ["alfaparf-milano", "Alfaparf Milano"],
  ["mavala", "Mavala"],
  ["shiseido", "Shiseido"],
  ["the-face-shop", "The Face Shop"],
  ["belif", "Belif"],
  ["dr-belmeur", "Dr. Belmeur"],
  ["beyond", "Beyond"],
  ["fmgt", "FMGT"],
  ["suntique", "Suntique"],
  ["allione", "Allione"],
  ["your-vegan", "Your Vegan"],
];

const makeupSlugs = [
  "loreal",
  "lancome",
  "gucci",
  "prada",
  "ysl",
  "ysl-beauty",
  "giorgio-armani",
  "valentino",
  "anastasia-beverly-hills",
  "lakme",
  "alfaparf-milano",
  "the-face-shop",
  "fmgt",
  "allione",
];

const skincareSlugs = [
  "lancome",
  "clarins-paris",
  "elizabeth-arden",
  "lancaster",
  "dermedic",
  "gemology",
  "mavala",
  "shiseido",
  "the-face-shop",
  "belif",
  "dr-belmeur",
  "beyond",
  "suntique",
  "your-vegan",
];

const designerAssignments = [
  {
    titleEn: "Luxury Fashion & Haute Couture",
    slugs: ["prada", "valentino", "gucci", "chloe", "ferragamo", "versace", "giorgio-armani", "ralph-lauren"],
  },
  {
    titleEn: "Contemporary & Premium Apparel",
    slugs: [
      "guess",
      "calvin-klein",
      "hugo-boss",
      "michael-kors",
      "diesel",
      "lacoste",
      "kenneth-cole",
      "max-and-co",
      "trussardi",
      "george-rech",
      "beverly-hills-polo-club",
    ],
  },
  {
    titleEn: "Footwear & Athletic Lifestyle",
    slugs: ["anf"],
  },
  {
    titleEn: "Fine Jewelry & Luxury Timepieces",
    slugs: ["cartier"],
  },
  {
    titleEn: "Premium Beauty & Skincare",
    slugs: [
      ...beautyBrands.map(([slug]) => slug),
      "lancome",
      "ysl-beauty",
      "mugler",
      "davidoff",
      "armand-basi",
      "azzaro",
      "pascal-morabito",
      "viktor-rolf",
      "vince-camuto",
      "oscar",
      "signature",
      "jeanne-arthes",
      "narciso-rodriguez",
    ],
  },
  {
    titleEn: "Luxury Accessories & Leather Goods",
    slugs: ["cartier", "mcm", "michael-kors"],
  },
];

function brandDocId(slug) {
  return `brand-${slug}`;
}

function ref(id) {
  return {
    _type: "reference",
    _ref: id,
    _key: id.replace(/[^a-zA-Z0-9]/g, "-"),
  };
}

function row(id, rowType) {
  return {
    _key: `${id.replace(/[^a-zA-Z0-9]/g, "-")}-${Math.random().toString(36).slice(2, 8)}`,
    _type: rowType,
    brand: { _type: "reference", _ref: id },
    isVisible: true,
    categoryLogoScale: 1,
  };
}

function currentRefs(items = []) {
  return new Set(items.map((item) => item?.brand?._ref || item?._ref).filter(Boolean));
}

async function upsertMissingBrands() {
  const all = [...perfumeBrands, ...beautyBrands];
  const uniqueBySlug = new Map(all.map(([slug, title]) => [slug, title]));
  const slugs = [...uniqueBySlug.keys()];
  const existing = await client.fetch(
    `*[_type == "brand" && slug.current in $slugs]{ _id, title, slug }`,
    { slugs }
  );

  const existingBySlug = new Map(existing.map((brand) => [brand.slug.current, brand]));
  const idsBySlug = new Map();
  const created = [];
  const reused = [];

  for (const [slug, title] of uniqueBySlug.entries()) {
    const existingBrand = existingBySlug.get(slug);
    if (existingBrand) {
      idsBySlug.set(slug, existingBrand._id);
      reused.push(`${title} (${existingBrand._id})`);
      continue;
    }

    const doc = {
      _id: brandDocId(slug),
      _type: "brand",
      title,
      isActive: true,
      slug: { _type: "slug", current: slug },
      size: "medium",
      scale: 3,
      categoryLogoScale: 1,
      headline: { en: `${title} at Fashion Gate`, ar: title },
      description: {
        en: `${title} is part of the curated Fashion Gate brand portfolio.`,
        ar: `${title} ضمن محفظة العلامات المختارة في فاشن غيت.`,
      },
    };

    await client.createIfNotExists(doc);
    idsBySlug.set(slug, doc._id);
    created.push(`${title} (${doc._id})`);
  }

  return { idsBySlug, created, reused };
}

async function appendPageRows(pageId, rowType, slugs, idsBySlug) {
  const page = await client.getDocument(pageId);
  if (!page) return { pageId, added: 0, missingPage: true };

  const allowedBrands = Array.isArray(page.allowedBrands) ? page.allowedBrands : [];
  const seen = currentRefs(allowedBrands);
  const additions = slugs
    .map((slug) => idsBySlug.get(slug))
    .filter((id) => id && !seen.has(id))
    .map((id) => row(id, rowType));

  if (additions.length) {
    await client.patch(pageId).set({ allowedBrands: [...allowedBrands, ...additions] }).commit();
  }

  return { pageId, added: additions.length };
}

async function appendDesignerCategoryRefs(idsBySlug) {
  const categories = await client.fetch(`*[_type == "designerCategory"]{ _id, title, brands }`);
  const updates = [];

  for (const assignment of designerAssignments) {
    const category = categories.find((item) => item?.title?.en === assignment.titleEn);
    if (!category) continue;

    const brands = Array.isArray(category.brands) ? category.brands : [];
    const seen = currentRefs(brands);
    const additions = assignment.slugs
      .map((slug) => idsBySlug.get(slug))
      .filter((id) => id && !seen.has(id))
      .map((id) => ref(id));

    if (additions.length) {
      await client.patch(category._id).set({ brands: [...brands, ...additions] }).commit();
    }

    updates.push(`${assignment.titleEn}: +${additions.length}`);
  }

  return updates;
}

async function main() {
  const { idsBySlug, created, reused } = await upsertMissingBrands();
  const pageUpdates = [
    await appendPageRows("perfumes", "featuredCategoryBrand", perfumeBrands.map(([slug]) => slug), idsBySlug),
    await appendPageRows("makeup", "featuredMakeupBrand", makeupSlugs, idsBySlug),
    await appendPageRows("skincare", "featuredSkincareBrand", skincareSlugs, idsBySlug),
  ];
  const designerCategoryUpdates = await appendDesignerCategoryRefs(idsBySlug);

  console.log(JSON.stringify({ created, reused, pageUpdates, designerCategoryUpdates }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
