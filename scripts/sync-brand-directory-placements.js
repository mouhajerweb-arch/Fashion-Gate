const fs = require("fs");
const path = require("path");
const { createClient } = require("@sanity/client");

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "4y6hfnze";
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_WRITE_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-07-03";

if (!token) {
  console.error("Missing SANITY_AUTH_TOKEN or SANITY_WRITE_TOKEN.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion,
  useCdn: false,
  perspective: "raw",
});

const logoFilesBySlug = {
  "nean-com": "Nean Black.svg",
  "acler": "128331b8-42c5-4029-91cc-0a774de11206.png",
  "weekend-maxmara": "weekendmaxmara-logo-ufficiale.svg",
  "max-and-co": "Max&Co.svg",
  "emporio-armani-ea7": "1200x1200.png",
};

const marqueeOrder = [
  "elie-saab",
  "gucci",
  "maxmara",
  "weekend-maxmara",
  "max-and-co",
  "persona-marina-rinaldi",
  "prada",
  "valentino",
  "ysl",
  "chloe",
  "nean-com",
  "acler",
  "editorial",
  "sandro",
  "almais",
  "giorgio-armani",
  "hugo-boss",
  "calvin-klein",
  "paul-shark",
  "adidas",
  "puma",
  "emporio-armani-ea7",
  "skechers",
  "loreal",
  "lancome",
  "atelier-rebul",
  "cartier",
  "jimmy-choo",
  "coach",
  "moje",
];

const designerCategoryAssignments = [
  {
    titleEn: "Luxury Fashion & Haute Couture",
    slugs: ["elie-saab", "gucci", "maxmara", "prada", "valentino", "ysl", "chloe"],
  },
  {
    titleEn: "Contemporary & Premium Apparel",
    slugs: [
      "nean-com",
      "acler",
      "weekend-maxmara",
      "persona-marina-rinaldi",
      "max-and-co",
      "editorial",
      "sandro",
      "giorgio-armani",
      "hugo-boss",
      "calvin-klein",
      "paul-shark",
      "almais",
    ],
  },
  {
    titleEn: "Independent & Creative Design",
    slugs: ["moje", "almais"],
  },
  {
    titleEn: "Footwear & Athletic Lifestyle",
    slugs: ["adidas", "puma", "emporio-armani-ea7", "skechers"],
  },
  {
    titleEn: "Fine Jewelry & Luxury Timepieces",
    slugs: ["cartier"],
  },
  {
    titleEn: "Premium Beauty & Skincare",
    slugs: ["loreal", "gucci", "prada", "ysl", "giorgio-armani", "lancome", "valentino", "elie-saab", "atelier-rebul"],
  },
  {
    titleEn: "Luxury Accessories & Leather Goods",
    slugs: ["jimmy-choo", "coach", "cartier", "chloe"],
  },
];

function ref(id) {
  return {
    _type: "reference",
    _ref: id,
    _key: id.replace(/[^a-zA-Z0-9]/g, "-"),
  };
}

async function uploadMissingLogos(brandsBySlug) {
  const uploaded = [];
  const skipped = [];

  for (const [slug, fileName] of Object.entries(logoFilesBySlug)) {
    const brand = brandsBySlug.get(slug);
    if (!brand) continue;
    if (brand.image?.asset?._ref) {
      skipped.push(`${slug}: already has logo`);
      continue;
    }

    const filePath = path.join(process.cwd(), "public", "brand", fileName);
    if (!fs.existsSync(filePath)) {
      skipped.push(`${slug}: missing local file ${fileName}`);
      continue;
    }

    const asset = await client.assets.upload("image", fs.createReadStream(filePath), { filename: fileName });
    await client.patch(brand._id).set({ image: { _type: "image", asset: { _type: "reference", _ref: asset._id } } }).commit();
    brand.image = { asset: { _ref: asset._id } };
    uploaded.push(`${slug}: ${fileName}`);
  }

  return { uploaded, skipped };
}

function appendMissingOrderedBrandRefs(existingRefs = [], brandsBySlug) {
  const seen = new Set(existingRefs.map((item) => item?._ref).filter(Boolean));
  const ordered = [...existingRefs];

  for (const slug of marqueeOrder) {
    const brand = brandsBySlug.get(slug);
    if (!brand || seen.has(brand._id)) continue;
    ordered.push(ref(brand._id));
    seen.add(brand._id);
  }

  const remaining = [...brandsBySlug.values()]
    .filter((brand) => !seen.has(brand._id))
    .sort((a, b) => (a.title || "").localeCompare(b.title || ""));

  for (const brand of remaining) {
    ordered.push(ref(brand._id));
    seen.add(brand._id);
  }

  return ordered;
}

function assignedBrandRefs(existingRefs = [], slugs, brandsBySlug) {
  const seen = new Set(existingRefs.map((item) => item?._ref).filter(Boolean));
  const ordered = [];

  for (const item of existingRefs) {
    if (!item?._ref) continue;
    ordered.push(item);
  }

  for (const slug of slugs) {
    const brand = brandsBySlug.get(slug);
    if (!brand || seen.has(brand._id)) continue;
    ordered.push(ref(brand._id));
    seen.add(brand._id);
  }

  return ordered;
}

async function updateHomepageMarquee(brandsBySlug) {
  const pageDocs = await client.fetch(
    `*[_type == "page" && (_id in ["home", "drafts.home"] || slug.current in ["home", "homepage"])]{
      _id,
      slug,
      sections
    }`
  );

  const updated = [];

  for (const page of pageDocs) {
    const slug = page.slug?.current;
    if (!["home", "homepage"].includes(slug) && !["home", "drafts.home"].includes(page._id)) continue;

    const sections = Array.isArray(page.sections) ? page.sections : [];
    let touched = false;
    const nextSections = sections.map((section) => {
      if (section?._type !== "brandMarqueeSection") return section;
      touched = true;
      return { ...section, brands: appendMissingOrderedBrandRefs(section.brands || [], brandsBySlug) };
    });

    if (touched) {
      await client.patch(page._id).set({ sections: nextSections }).commit();
      updated.push(page._id);
    }
  }

  return updated;
}

async function updateDesignerCategories(brandsBySlug) {
  const categories = await client.fetch(`*[_type == "designerCategory"]{ _id, title, brands }`);
  const updated = [];

  for (const assignment of designerCategoryAssignments) {
    const category = categories.find((item) => item?.title?.en === assignment.titleEn);
    if (!category) continue;

    const refs = assignedBrandRefs(category.brands || [], assignment.slugs, brandsBySlug);

    await client.patch(category._id).set({ brands: refs }).commit();
    updated.push(`${assignment.titleEn} (${refs.length})`);
  }

  return updated;
}

async function main() {
  const brands = await client.fetch(`*[_type == "brand" && isActive == true]{
    _id,
    title,
    slug,
    image { asset }
  }`);
  const brandsBySlug = new Map(brands.filter((brand) => brand.slug?.current).map((brand) => [brand.slug.current, brand]));

  const logoResult = await uploadMissingLogos(brandsBySlug);
  const homepageDocs = await updateHomepageMarquee(brandsBySlug);
  const designerCategories = await updateDesignerCategories(brandsBySlug);

  console.log(JSON.stringify({ logos: logoResult, homepageDocs, designerCategories }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
