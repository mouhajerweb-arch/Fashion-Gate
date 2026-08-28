const fs = require("fs");
const path = require("path");
const { createClient } = require("@sanity/client");

const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error("Missing SANITY_AUTH_TOKEN or SANITY_WRITE_TOKEN.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "4y6hfnze",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-07-03",
  token,
  useCdn: false,
});

const beautyBrandSlugs = [
  "lancome",
  "loreal",
  "gucci",
  "prada",
  "ysl",
  "giorgio-armani",
  "valentino",
  "jimmy-choo",
  "cartier",
  "chloe",
  "coach",
  "elie-saab",
  "atelier-rebul",
  "clarins-paris",
  "elizabeth-arden",
  "anastasia-beverly-hills",
  "the-face-shop",
  "belif",
  "dr-belmeur",
  "beyond",
  "fmgt",
  "suntique",
  "allione",
  "your-vegan",
  "dermedic",
  "gemology",
  "lakme",
  "alfaparf-milano",
  "mavala",
  "shiseido",
];

const bannerSeeds = [
  {
    title: { en: "Makeup", ar: "المكياج" },
    subtitle: { en: "Color, artistry and radiance", ar: "ألوان وفن وإشراقة" },
    link: "/category/makeup/en",
    file: path.join(process.cwd(), "public", "brand", "luxury-beauty.png"),
  },
  {
    title: { en: "Skincare", ar: "العناية بالبشرة" },
    subtitle: { en: "Ritual, care and glow", ar: "طقوس عناية ونضارة" },
    link: "/category/skincare/en",
    file: path.join(process.cwd(), "public", "brand", "hero-look-07.jpg"),
  },
  {
    title: { en: "Beauty Houses", ar: "دور الجمال" },
    subtitle: {
      en: "World-renowned beauty, skincare and fragrance brands",
      ar: "علامات عالمية في الجمال والعناية والعطور",
    },
    link: "/category/beauty/en",
    file: path.join(process.cwd(), "public", "brand", "hero-woman-wide.png"),
  },
];

function hasLocalizedValue(value) {
  return Boolean(value && (String(value.en || "").trim() || String(value.ar || "").trim()));
}

async function uploadBannerImage(file) {
  if (!fs.existsSync(file)) return null;
  const stream = fs.createReadStream(file);
  const asset = await client.assets.upload("image", stream, {
    filename: path.basename(file),
  });
  return {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
  };
}

async function ensureBeautyPage(brandsBySlug) {
  const existing = await client.fetch('*[_id == "beauty"][0]{_id,title,description,banners,brandsHeading,allowedBrands}');
  await client.createIfNotExists({
    _id: "beauty",
    _type: "beautyPage",
  });
  const patch = client.patch("beauty").setIfMissing({ _type: "beautyPage" });

  if (!hasLocalizedValue(existing?.title)) {
    patch.set({
      title: {
        en: "Beauty",
        ar: "الجمال",
      },
    });
  }

  if (!hasLocalizedValue(existing?.description)) {
    patch.set({
      description: {
        en: "A curated beauty destination bringing together makeup artistry, advanced skincare rituals, and the world's most recognizable luxury beauty houses.",
        ar: "وجهة جمال منسقة تجمع بين فن المكياج وطقوس العناية المتقدمة وأبرز دور الجمال العالمية.",
      },
    });
  }

  if (!hasLocalizedValue(existing?.brandsHeading)) {
    patch.set({
      brandsHeading: {
        en: "Luxury Beauty Houses",
        ar: "دور الجمال الفاخرة",
      },
    });
  }

  if (!Array.isArray(existing?.banners) || existing.banners.length === 0) {
    const banners = [];
    for (const banner of bannerSeeds) {
      const image = await uploadBannerImage(banner.file);
      banners.push({
        _key: `${banner.title.en.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-banner`,
        _type: "categoryBanner",
        title: banner.title,
        subtitle: banner.subtitle,
        link: banner.link,
        ...(image ? { image } : {}),
      });
    }
    patch.set({ banners });
  }

  const existingRefs = new Set(
    (existing?.allowedBrands || [])
      .map((item) => item?.brand?._ref)
      .filter(Boolean)
  );
  const additions = beautyBrandSlugs
    .map((slug) => brandsBySlug.get(slug))
    .filter(Boolean)
    .filter((brand) => !existingRefs.has(brand._id))
    .map((brand) => ({
      _key: `beauty-${brand.slug.current}`,
      _type: "featuredBeautyBrand",
      brand: {
        _type: "reference",
        _ref: brand._id,
      },
      isVisible: true,
      categoryLogoScale: 1,
    }));

  if (!Array.isArray(existing?.allowedBrands) || existing.allowedBrands.length === 0) {
    patch.set({ allowedBrands: additions });
  } else if (additions.length > 0) {
    patch.set({ allowedBrands: [...existing.allowedBrands, ...additions] });
  }

  await patch.commit({ autoGenerateArrayKeys: true });
  return { addedBrandRows: additions.length };
}

async function ensureCategoryCardScale(brands) {
  const patched = [];
  for (const brand of brands) {
    if (brand.categoryLogoScale === undefined || brand.categoryLogoScale === null) {
      await client.patch(brand._id).set({ categoryLogoScale: 1.5 }).commit();
      patched.push(brand.slug.current);
    }
  }
  return patched;
}

async function main() {
  const brands = await client.fetch(
    '*[_type == "brand" && slug.current in $slugs]{_id,title,slug,categoryLogoScale,isActive}',
    { slugs: beautyBrandSlugs }
  );
  const activeBrands = brands.filter((brand) => brand.isActive !== false);
  const brandsBySlug = new Map(activeBrands.map((brand) => [brand.slug.current, brand]));

  const missingSlugs = beautyBrandSlugs.filter((slug) => !brandsBySlug.has(slug));
  const beautyPage = await ensureBeautyPage(brandsBySlug);
  const scalePatched = await ensureCategoryCardScale(activeBrands);

  console.log(JSON.stringify({
    beautyPage,
    activeBeautyBrandsFound: activeBrands.length,
    missingOrInactiveSlugs: missingSlugs,
    categoryCardScalePatchedTo1_5: scalePatched,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
