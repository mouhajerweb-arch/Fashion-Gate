import { defineField, defineType } from "sanity";

export const header = defineType({
  name: "header",
  title: "Header Settings",
  type: "document",
  groups: [
    { name: "branding", title: "Brand & Logo", default: true },
    { name: "language", title: "Language Switcher 🌐" },
    { name: "navigation", title: "Navigation & Menus 🧭" },
    { name: "search", title: "Search Box 🔍" },
    { name: "controls", title: "User & Controls 👤" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title (Administrative)",
      type: "string",
      group: "branding",
      initialValue: "Main Navigation Header Settings",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "logoImage",
      title: "Logo Monogram / Icon Image",
      type: "image",
      group: "branding",
      description: "Upload a logo image (SVG or PNG). Displayed alongside the brand name."
    }),
    defineField({
      name: "logoTitle",
      title: "Brand Name (Bilingual)",
      type: "localizedString",
      group: "branding",
      description: "Primary brand name to display in the header (e.g., 'FASHION GATE' / 'فاشن غيت')."
    }),
    defineField({
      name: "logoSubtitle",
      title: "Brand Subtitle / Descriptor (Bilingual)",
      type: "localizedString",
      group: "branding",
      description: "Secondary luxury subtitle under the brand name (e.g., 'MALL' / 'مول' or 'DAMASCUS' / 'دمشق'). If left empty, will auto-detect from brand name."
    }),
    defineField({
      name: "logoLayout",
      title: "Logo & Brand Text Layout Style",
      type: "string",
      group: "branding",
      initialValue: "stacked",
      options: {
        list: [
          { title: "Luxury Stacked Lockup (Brand on top, tracked Subtitle below - Recommended)", value: "stacked" },
          { title: "Single Line (Horizontal)", value: "inline" }
        ],
        layout: "radio"
      },
      description: "Stacked format is optimized for mobile responsiveness and high-end luxury aesthetics."
    }),
    defineField({
      name: "showLanguageSwitcher",
      title: "Show Language Switcher",
      type: "boolean",
      group: "language",
      initialValue: true,
      description: "Toggle whether to display the language switcher (flag & AR/EN toggle) in the header."
    }),
    defineField({
      name: "languageSwitcherStyle",
      title: "Language Switcher Visual Style",
      type: "string",
      group: "language",
      initialValue: "flag_and_text",
      options: {
        list: [
          { title: "Flag & Language Code (e.g. 🇸🇾 AR / 🇬🇧 EN)", value: "flag_and_text" },
          { title: "Flag Only", value: "flag_only" },
          { title: "Language Code Only (AR / EN)", value: "text_only" }
        ],
        layout: "radio"
      },
      description: "Select how the language switcher button is styled in the header."
    }),
    defineField({
      name: "showSearch",
      title: "Show Search Box",
      type: "boolean",
      group: "search",
      initialValue: true,
      description: "Toggle whether to display the search box on the right of the header."
    }),
    defineField({
      name: "searchPlaceholder",
      title: "Search Box Placeholder (Bilingual)",
      type: "localizedString",
      group: "search",
      description: "Custom placeholder inside search field (e.g., 'Search...' / 'ابحث...')."
    }),
    defineField({
      name: "searchDepartmentsHeading",
      title: "Search Departments Section Heading",
      type: "localizedString",
      group: "search",
      description: "Bilingual heading for the category links section (e.g., 'Departments' / 'الأقسام المختارة')."
    }),
    defineField({
      name: "searchDepartments",
      title: "Search Departments Quick Links",
      type: "array",
      group: "search",
      of: [
        {
          type: "object",
          name: "searchNavItem",
          title: "Search Link Item",
          fields: [
            defineField({
              name: "label",
              title: "Label (Bilingual)",
              type: "localizedString"
            }),
            defineField({
              name: "href",
              title: "Redirect Link",
              type: "string",
              options: {
                list: [
                  { title: "Homepage", value: "/" },
                  { title: "About Us", value: "/about" },
                  { title: "Contact Us", value: "/contact" },
                  { title: "Blogs", value: "/blogs" },
                  { title: "Terms & Conditions", value: "/terms" },
                  { title: "Privacy Policy", value: "/privacy" },
                  { title: "Men Section", value: "/men" },
                  { title: "Women Section", value: "/women" },
                  { title: "Designers Section", value: "/designers" },
                  { title: "Perfumes Section", value: "/perfumes" },
                  { title: "Skincare Section", value: "/skincare" },
                  { title: "Dining Section", value: "/dining" },
                  { title: "Women Anchor (#women)", value: "#women" },
                  { title: "Men Anchor (#men)", value: "#men" },
                  { title: "Designers Anchor (#designers)", value: "#designers" }
                ]
              }
            })
          ]
        }
      ]
    }),
    defineField({
      name: "searchSuggestedBrandsHeading",
      title: "Search Suggested Brands Section Heading",
      type: "localizedString",
      group: "search",
      description: "Bilingual heading for the suggested brands section (e.g., 'Suggested Brands' / 'دور الفخامة')."
    }),
    defineField({
      name: "searchSuggestedBrands",
      title: "Search Suggested Brands",
      type: "array",
      group: "search",
      of: [{ type: "reference", to: [{ type: "brand" }] }],
      description: "Select which brands to suggest when search starts."
    }),
    defineField({
      name: "searchMatchingHeading",
      title: "Search Results Section Heading",
      type: "localizedString",
      group: "search",
      description: "Bilingual heading for matching search results section (e.g., 'Matching Pieces' / 'النتائج المطابقة')."
    }),
    defineField({
      name: "showUserProfile",
      title: "Show User Profile Icon",
      type: "boolean",
      group: "controls",
      initialValue: true,
      description: "Toggle whether to display the user profile button in the header."
    }),
    defineField({
      name: "menuItems",
      title: "Menu Items",
      type: "array",
      group: "navigation",
      of: [
        {
          type: "object",
          name: "navItem",
          title: "Navigation Item",
          fields: [
            defineField({
              name: "label",
              title: "Label (Bilingual)",
              type: "localizedString"
            }),
            defineField({
              name: "href",
              title: "Redirect Link",
              type: "string",
              options: {
                list: [
                  { title: "Homepage", value: "/" },
                  { title: "About Us", value: "/about" },
                  { title: "Contact Us", value: "/contact" },
                  { title: "Blogs", value: "/blogs" },
                  { title: "Terms & Conditions", value: "/terms" },
                  { title: "Privacy Policy", value: "/privacy" },
                  { title: "Men Section", value: "/men" },
                  { title: "Women Section", value: "/women" },
                  { title: "Designers Section", value: "/designers" },
                  { title: "Perfumes Section", value: "/perfumes" },
                  { title: "Skincare Section", value: "/skincare" },
                  { title: "Beauty Section", value: "/category/beauty" },
                  { title: "Makeup Section", value: "/category/makeup" },
                  { title: "Dining Section", value: "/dining" },
                  { title: "Women Anchor (#women)", value: "#women" },
                  { title: "Men Anchor (#men)", value: "#men" },
                  { title: "Designers Anchor (#designers)", value: "#designers" }
                ]
              }
            }),
            defineField({
              name: "dropdownItems",
              title: "Dropdown Menu Items",
              type: "array",
              description: "Custom dropdown links for this menu item (e.g. for Dining: SERA, Espresso Lab; for Fashion: Women, Men).",
              of: [
                {
                  type: "object",
                  name: "dropdownItem",
                  title: "Dropdown Item",
                  fields: [
                    defineField({
                      name: "label",
                      title: "Label (Bilingual)",
                      type: "localizedString",
                      validation: (Rule) => Rule.required()
                    }),
                    defineField({
                      name: "href",
                      title: "Redirect Link",
                      type: "string",
                      description: "Path or URL (e.g. '/dining/sera', '/category/fashion?sub=women')",
                      validation: (Rule) => Rule.required()
                    }),
                    defineField({
                      name: "subItems",
                      title: "Sub Items (Nested Dropdown)",
                      type: "array",
                      description: "Optional second-level dropdown items (e.g., Women and Men under Skincare).",
                      of: [
                        {
                          type: "object",
                          name: "subItem",
                          title: "Sub Item",
                          fields: [
                            defineField({
                              name: "label",
                              title: "Label (Bilingual)",
                              type: "localizedString",
                              validation: (Rule) => Rule.required()
                            }),
                            defineField({
                              name: "href",
                              title: "Redirect Link",
                              type: "string",
                              validation: (Rule) => Rule.required()
                            })
                          ],
                          preview: {
                            select: {
                              titleEn: "label.en",
                              titleAr: "label.ar",
                              href: "href"
                            },
                            prepare(selection) {
                              const { titleEn, titleAr, href } = selection;
                              return {
                                title: `${titleEn || ""} / ${titleAr || ""}`,
                                subtitle: href || ""
                              };
                            }
                          }
                        }
                      ]
                    })
                  ],
                  preview: {
                    select: {
                      titleEn: "label.en",
                      titleAr: "label.ar",
                      href: "href",
                      subItems: "subItems"
                    },
                    prepare(selection) {
                      const { titleEn, titleAr, href, subItems } = selection;
                      const count = subItems ? subItems.length : 0;
                      return {
                        title: `${titleEn || ""} / ${titleAr || ""}`,
                        subtitle: `Link: ${href || ""}${count > 0 ? ` | Sub-items: ${count}` : ""}`
                      };
                    }
                  }
                }
              ]
            }),
            defineField({
              name: "designerCategories",
              title: "Dropdown Designer Categories",
              type: "array",
              of: [{ type: "reference", to: [{ type: "designerCategory" }] }],
              description: "Select which designer categories to show in the hover dropdown of this menu item."
            })
          ],
          preview: {
            select: {
              titleEn: "label.en",
              titleAr: "label.ar",
              href: "href",
              categories: "designerCategories",
              dropdownItems: "dropdownItems"
            },
            prepare(selection) {
              const { titleEn, titleAr, href, categories, dropdownItems } = selection;
              const catCount = categories ? categories.length : 0;
              const dropCount = dropdownItems ? dropdownItems.length : 0;
              const detail = dropCount > 0 
                ? `Dropdown Items: ${dropCount}` 
                : catCount > 0 
                ? `Dropdown Categories: ${catCount}` 
                : "No dropdown";
              return {
                title: `${titleEn || ""} / ${titleAr || ""}`,
                subtitle: `Link: ${href || ""} | ${detail}`
              };
            }
          }
        }
      ]
    })
  ]
});
