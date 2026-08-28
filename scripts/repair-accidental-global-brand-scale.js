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

const accidentallyScaledSlugs = [
  "cartier",
  "chloe",
  "coach",
  "jimmy-choo",
  "lancome",
  "prada",
  "valentino",
  "ysl",
];

async function main() {
  const brands = await client.fetch(
    `*[
      _type == "brand" &&
      slug.current in $slugs &&
      scale == 1.5 &&
      !defined(categoryLogoScale)
    ]{
      _id,
      title,
      slug,
      scale,
      categoryLogoScale
    }`,
    { slugs: accidentallyScaledSlugs }
  );

  const transaction = client.transaction();

  brands.forEach((brand) => {
    transaction.patch(brand._id, (patch) => patch.unset(["scale"]));
  });

  if (brands.length > 0) {
    await transaction.commit();
  }

  console.log(JSON.stringify({
    repairedCount: brands.length,
    repairedBrands: brands.map((brand) => ({
      title: brand.title,
      slug: brand.slug?.current,
      previousScale: brand.scale,
    })),
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
