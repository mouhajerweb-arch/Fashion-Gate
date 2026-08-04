import { defineType, defineField } from "sanity";
import { Utensils } from "lucide-react";

export const restaurantPage = defineType({
  name: "restaurantPage",
  title: "Restaurant & Cafe Page",
  type: "document",
  icon: Utensils,
  groups: [
    { name: "header", title: "Header Settings" },
    { name: "hero", title: "Hero Section" },
    { name: "about", title: "About Section" },
    { name: "panels", title: "Highlight Panels" },
    { name: "menu", title: "Tasting Menu" },
    { name: "gallery", title: "Ambiance Gallery" },
    { name: "location", title: "Location & Contact" },
  ],
  fields: [
    defineField({
      name: "restaurantId",
      title: "Restaurant ID",
      type: "string",
      description: 'Must match the route name exactly (e.g. "vilamore" or "the-espresso-lab")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Document Title",
      type: "string",
      description: "For internal admin organization (e.g. 'Vilamore Damascus')",
    }),

    // --- 0. HEADER SECTION ---
    defineField({
      name: "headerLogo",
      title: "Header Logo",
      type: "image",
      description: "Upload the custom logo PNG for this restaurant.",
      options: { hotspot: true },
      group: "header",
    }),
    defineField({
      name: "logoHeight",
      title: "Logo Height (Desktop)",
      type: "number",
      description: "Logo height in pixels on desktop screens (default: 50)",
      group: "header",
    }),
    defineField({
      name: "logoHeightMobile",
      title: "Logo Height (Mobile)",
      type: "number",
      description: "Logo height in pixels on mobile screens (default: 30)",
      group: "header",
    }),
    defineField({
      name: "logoWidth",
      title: "Logo Width (Optional)",
      type: "number",
      description: "Optional logo width in pixels (leave blank for auto)",
      group: "header",
    }),
    defineField({
      name: "backButtonLabel",
      title: "Back Button Label",
      type: "localizedString",
      description: "Label for the back button (default: HOME / الرئيسية)",
      group: "header",
    }),
    defineField({
      name: "backButtonLink",
      title: "Back Button Link",
      type: "string",
      description: "Redirection link path for the back button (default: /en or /ar)",
      group: "header",
    }),
    defineField({
      name: "visitUsButtonLabel",
      title: "Visit Us Button Label",
      type: "localizedString",
      description: "Label for the secondary button (default: VISIT US / اتصل بنا)",
      group: "header",
    }),
    defineField({
      name: "visitUsButtonLink",
      title: "Visit Us Button Link",
      type: "string",
      description: "Redirection link or anchor for the button (default: #location)",
      group: "header",
    }),
    defineField({
      name: "headerLinks",
      title: "Header Navigation Links",
      type: "array",
      group: "header",
      of: [
        {
          type: "object",
          name: "navLink",
          fields: [
            { name: "title", title: "Link Title", type: "localizedString" },
            { 
              name: "linkType", 
              title: "Link Type", 
              type: "string", 
              options: {
                list: [
                  { title: "Scroll to Section ID", value: "anchor" },
                  { title: "URL Path (e.g. /en)", value: "url" }
                ],
                layout: "radio"
              },
              initialValue: "anchor"
            },
            { name: "anchorSection", title: "Anchor Section (e.g. hero, about, menu, gallery, location)", type: "string" },
            { name: "urlPath", title: "URL Path (if link type is URL)", type: "string" }
          ],
          preview: {
            select: {
              titleEn: "title.en",
              titleAr: "title.ar",
              linkType: "linkType",
              anchor: "anchorSection",
              url: "urlPath",
            },
            prepare({ titleEn, titleAr, linkType, anchor, url }) {
              const label = titleEn || titleAr || "Untitled Link";
              const target = linkType === "anchor" ? `#${anchor || ""}` : (url || "");
              return {
                title: label,
                subtitle: `${(linkType || "anchor").toUpperCase()} ➔ ${target}`,
              };
            },
          },
        }
      ]
    }),

    // --- 1. HERO SECTION ---
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "localizedString",
      group: "hero",
    }),
    defineField({
      name: "heroSub",
      title: "Hero Subtitle",
      type: "localizedString",
      group: "hero",
    }),
    defineField({
      name: "heroQuote",
      title: "Hero Quote",
      type: "localizedString",
      group: "hero",
    }),
    defineField({
      name: "heroBgType",
      title: "Hero Background Type",
      type: "string",
      group: "hero",
      options: {
        list: [
          { title: "Static Image", value: "image" },
          { title: "Video Background", value: "video" },
        ],
        layout: "radio",
      },
      initialValue: "image",
    }),
    defineField({
      name: "heroBgImage",
      title: "Hero Background Image",
      type: "image",
      group: "hero",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroBgVideoUrl",
      title: "Hero Background Video URL",
      type: "string",
      group: "hero",
      description: "Direct URL to video file (.mp4/etc.) or a streaming link (YouTube/Vimeo).",
    }),

    // --- 2. ABOUT / PHILOSOPHY SECTION ---
    defineField({
      name: "aboutTitle",
      title: "About Title",
      type: "localizedString",
      group: "about",
    }),
    defineField({
      name: "aboutSubtitle",
      title: "About Subtitle",
      type: "localizedString",
      group: "about",
    }),
    defineField({
      name: "aboutQuote",
      title: "About Quote",
      type: "localizedString",
      group: "about",
    }),
    defineField({
      name: "aboutDesc",
      title: "About Description",
      type: "localizedText",
      group: "about",
    }),
    defineField({
      name: "aboutImages",
      title: "About Collage Images",
      type: "array",
      group: "about",
      of: [{ type: "image", options: { hotspot: true } }],
      description: "Upload up to 3 images to show in the floating photo collage",
    }),

    // --- 3. ALTERNATING FEATURES / PANELS ---
    defineField({
      name: "panels",
      title: "Highlight Panels",
      type: "array",
      group: "panels",
      of: [
        {
          type: "object",
          name: "panel",
          fields: [
            { name: "label", title: "Label / Category", type: "localizedString" },
            { name: "title", title: "Panel Title", type: "localizedString" },
            { name: "desc", title: "Panel Description", type: "localizedText" },
            { name: "btnText", title: "Button Text", type: "localizedString" },
            { name: "image", title: "Panel Image", type: "image", options: { hotspot: true } },
          ],
          preview: {
            select: {
              titleEn: "title.en",
              titleAr: "title.ar",
              labelEn: "label.en",
              labelAr: "label.ar",
              media: "image",
            },
            prepare({ titleEn, titleAr, labelEn, labelAr, media }) {
              const title = titleEn || titleAr || "Untitled Panel";
              const label = labelEn || labelAr || "";
              return {
                title,
                subtitle: label,
                media,
              };
            },
          },
        },
      ],
    }),

    // --- 4. TASTING MENU SECTION ---
    defineField({
      name: "menuHeader",
      title: "Menu Section Header",
      type: "localizedString",
      group: "menu",
    }),
    defineField({
      name: "menuTabs",
      title: "Menu Category Tabs",
      type: "array",
      group: "menu",
      of: [{ type: "localizedString" }],
    }),
    defineField({
      name: "menus",
      title: "Menu Dishes / Items",
      type: "array",
      group: "menu",
      of: [
        {
          type: "object",
          name: "menuItem",
          fields: [
            {
              name: "categoryIndex",
              title: "Category Index",
              type: "number",
              description: "0-indexed mapping to the tabs defined above (e.g. 0 = Breakfast, 1 = Cold Mezza, etc.)",
            },
            { name: "name", title: "Dish / Drink Name", type: "localizedString" },
            { name: "desc", title: "Description", type: "localizedText" },
            { name: "price", title: "Price", type: "localizedString" },
            { name: "tag", title: "Tag (e.g. SIGNATURE, VEGAN)", type: "localizedString" },
            { name: "note", title: "Chef's Secret / Levant Story / Coffee origin", type: "localizedString" },
            { name: "image", title: "Dish Image", type: "image", options: { hotspot: true } },
          ],
          preview: {
            select: {
              nameEn: "name.en",
              nameAr: "name.ar",
              categoryIndex: "categoryIndex",
              priceEn: "price.en",
              priceAr: "price.ar",
              media: "image",
            },
            prepare({ nameEn, nameAr, categoryIndex, priceEn, priceAr, media }) {
              const name = nameEn || nameAr || "Unnamed Dish";
              const price = priceEn || priceAr || "TBC";
              const catNames = [
                "Breakfast & Bakery",
                "Cold Mezza",
                "Hot Mezza & Pastries",
                "Charcoal Grills & Mains",
                "Levantine Desserts"
              ];
              const category = catNames[categoryIndex] || `Category ${categoryIndex}`;
              return {
                title: name,
                subtitle: `${category} | Price: ${price}`,
                media,
              };
            },
          },
        },
      ],
    }),

    // --- 5. AMBIANCE / GALLERY SECTION ---
    defineField({
      name: "galleryTitle",
      title: "Gallery Title",
      type: "localizedString",
      group: "gallery",
    }),
    defineField({
      name: "gallerySubtitle",
      title: "Gallery Subtitle",
      type: "localizedString",
      group: "gallery",
    }),
    defineField({
      name: "galleryImages",
      title: "Gallery Images",
      type: "array",
      group: "gallery",
      of: [
        {
          type: "object",
          name: "galleryItem",
          fields: [
            { name: "image", title: "Image", type: "image", options: { hotspot: true } },
            { name: "title", title: "Image Title", type: "localizedString" },
            { name: "subtitle", title: "Image Subtitle", type: "localizedString" },
          ],
          preview: {
            select: {
              titleEn: "title.en",
              titleAr: "title.ar",
              subEn: "subtitle.en",
              subAr: "subtitle.ar",
              media: "image",
            },
            prepare({ titleEn, titleAr, subEn, subAr, media }) {
              const title = titleEn || titleAr || "Untitled Image";
              const subtitle = subEn || subAr || "";
              return {
                title,
                subtitle,
                media,
              };
            },
          },
        },
      ],
    }),

    // --- 6. LOCATION & CONTACT SECTION ---
    defineField({
      name: "locationHeader",
      title: "Location Header",
      type: "localizedString",
      group: "location",
    }),
    defineField({
      name: "hoursTitle",
      title: "Hours Section Title",
      type: "localizedString",
      group: "location",
    }),
    defineField({
      name: "hoursVal",
      title: "Hours Value",
      type: "localizedString",
      group: "location",
    }),
    defineField({
      name: "contactTitle",
      title: "Contact Section Title",
      type: "localizedString",
      group: "location",
    }),
    defineField({
      name: "contactVal",
      title: "Contact Value",
      type: "localizedString",
      group: "location",
    }),
    defineField({
      name: "addressVal",
      title: "Address Value",
      type: "localizedString",
      group: "location",
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "restaurantId",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Unnamed Page",
        subtitle: `Restaurant ID: ${subtitle}`,
      };
    },
  },
});
