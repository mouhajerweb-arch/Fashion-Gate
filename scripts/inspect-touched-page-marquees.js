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

client
  .fetch(`*[_id in ["home", "drafts.designers", "drafts.women"]]{
    _id,
    _type,
    title,
    slug,
    "marqueeCount": count(sections[_type == "brandMarqueeSection"][0].brands),
    "sectionTypes": sections[]._type
  }`)
  .then((docs) => console.log(JSON.stringify(docs, null, 2)))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
