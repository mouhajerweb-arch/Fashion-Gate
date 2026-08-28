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

const titlesBySlug = {
  "adidas": "Adidas",
  "calvin-klein": "Calvin Klein",
  "skechers": "Skechers",
  "maxmara": "Max Mara",
  "editorial": "Editorial",
  "paul-shark": "Paul & Shark",
  "sandro": "Sandro",
  "moje": "Moje",
  "lancome": "Lancôme",
  "chloe": "Chloé",
  "max-and-co": "Max&Co",
  "weekend-maxmara": "Weekend Max Mara",
  "puma": "Puma",
  "loreal": "Loreal",
  "nean-com": "Nean.com",
  "almais": "Almais",
  "emporio-armani-ea7": "Emporio Armani EA7",
};

async function main() {
  const docs = await client.fetch(
    `*[_type == "brand" && slug.current in $slugs]{ _id, title, slug }`,
    { slugs: Object.keys(titlesBySlug) }
  );

  const patched = [];
  for (const doc of docs) {
    const title = titlesBySlug[doc.slug.current];
    if (!title || doc.title === title) continue;
    await client.patch(doc._id).set({ title }).commit();
    patched.push(`${doc.slug.current}: ${doc.title} -> ${title}`);
  }

  console.log(JSON.stringify({ patched }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
