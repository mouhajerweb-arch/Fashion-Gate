import type { StructureResolver } from "sanity/structure";
import { 
  BookOpen, 
  Settings, 
  FileText, 
  ShoppingBag, 
  Layers, 
  HelpCircle, 
  Heart,
  Award,
  Utensils
} from "lucide-react";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Pages List
      S.listItem()
        .title("Pages")
        .icon(FileText)
        .child(
          S.list()
            .title("Pages")
            .items([
              S.listItem()
                .title("Homepage")
                .child(
                  S.document()
                    .schemaType("page")
                    .documentId("home")
                    .title("Homepage")
                ),
              S.listItem()
                .title("About Page")
                .child(
                  S.document()
                    .schemaType("aboutPage")
                    .documentId("aboutPage")
                    .title("About Page")
                ),
              S.listItem()
                .title("Contact Us")
                .child(
                  S.document()
                    .schemaType("contactPage")
                    .documentId("contactPage")
                    .title("Contact Us")
                ),
              S.listItem()
                .title("Blogs Page")
                .child(
                  S.document()
                    .schemaType("blogsPage")
                    .documentId("blogsPage")
                    .title("Blogs Page")
                ),
              S.listItem()
                .title("Men Page")
                .child(
                  S.document()
                    .schemaType("page")
                    .documentId("men")
                    .title("Men Page")
                ),
              S.listItem()
                .title("Women Page")
                .child(
                  S.document()
                    .schemaType("page")
                    .documentId("women")
                    .title("Women Page")
                ),
              S.listItem()
                .title("Designers Page")
                .child(
                  S.document()
                    .schemaType("designerPage")
                    .documentId("designersPage")
                    .title("Designers Page")
                ),
              S.listItem()
                .title("Product Page")
                .child(
                  S.document()
                    .schemaType("page")
                    .documentId("product-page")
                    .title("Product Page")
                ),
              S.listItem()
                .title("Login Page")
                .child(
                  S.document()
                    .schemaType("loginPage")
                    .documentId("loginPage")
                    .title("Login Page")
                ),
              S.listItem()
                .title("Terms & Conditions")
                .child(
                  S.document()
                    .schemaType("termsPage")
                    .documentId("termsPage")
                    .title("Terms & Conditions")
                ),
              S.listItem()
                .title("Privacy Policy")
                .child(
                  S.document()
                    .schemaType("privacyPage")
                    .documentId("privacyPage")
                    .title("Privacy Policy")
                ),

              S.listItem()
                .title("Fashion Page")
                .child(
                  S.document()
                    .schemaType("fashionPage")
                    .documentId("fashion")
                    .title("Fashion Page")
                ),
              S.listItem()
                .title("Perfume Page")
                .child(
                  S.document()
                    .schemaType("perfumePage")
                    .documentId("perfumes")
                    .title("Perfume Page")
                ),
              S.listItem()
                .title("Beauty")
                .id("beauty")
                .child(
                  S.list()
                    .title("Beauty Pages")
                    .items([
                      S.listItem()
                        .title("Beauty Page")
                        .id("beautyPage")
                        .child(
                          S.editor()
                            .id("beauty")
                            .schemaType("beautyPage")
                            .documentId("beauty")
                            .title("Beauty Page")
                        ),
                      S.listItem()
                        .title("Skincare Page")
                        .id("skincarePage")
                        .child(
                          S.editor()
                            .id("skincare")
                            .schemaType("skincarePage")
                            .documentId("skincare")
                            .title("Skincare Page")
                        ),
                      S.listItem()
                        .title("Makeup Page")
                        .id("makeupPage")
                        .child(
                          S.editor()
                            .id("makeup")
                            .schemaType("makeupPage")
                            .documentId("makeup")
                            .title("Makeup Page")
                        ),
                    ])
                ),
              S.listItem()
                .title("Dining Page")
                .child(
                  S.document()
                    .schemaType("diningPage")
                    .documentId("diningPage")
                    .title("Dining Page")
                ),
              S.listItem()
                .title("Vilamore Restaurant")
                .child(
                  S.document()
                    .schemaType("restaurantPage")
                    .documentId("vilamore")
                    .title("Vilamore Restaurant")
                ),
              S.listItem()
                .title("The Espresso Lab")
                .child(
                  S.document()
                    .schemaType("restaurantPage")
                    .documentId("the-espresso-lab")
                    .title("The Espresso Lab")
                ),
            ])
        ),

      S.divider(),

      // E-Commerce Catalog & Brands
      S.documentTypeListItem("product").title("Products").icon(ShoppingBag),
      S.documentTypeListItem("brand").title("Brands").icon(Award),
      S.documentTypeListItem("collection").title("Collections / Categories").icon(Layers),
      S.documentTypeListItem("restaurantPage").title("Restaurants & Cafes").icon(Utensils),

      S.divider(),

      // Core Content
      S.documentTypeListItem("announcement").title("Announcements").icon(Layers),
      S.documentTypeListItem("post").title("Blog Posts").icon(BookOpen),
      S.documentTypeListItem("testimonial").title("Testimonials").icon(Heart),
      S.documentTypeListItem("faq").title("FAQs").icon(HelpCircle),

      S.divider(),

      // Site Settings
      S.listItem()
        .title("Site Settings")
        .icon(Settings)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site Settings")
        ),
      S.listItem()
        .title("Footer Settings")
        .icon(Settings)
        .child(
          S.document()
            .schemaType("footerSettings")
            .documentId("footerSettings")
            .title("Footer Settings")
        ),

      // Hide default list items
      ...S.documentTypeListItems().filter(
        (listItem) =>
          ![
            "page",
            "aboutPage",
            "contactPage",
            "blogsPage",
            "loginPage",
            "brandPage",
            "post",
            "faq",
            "testimonial",
            "announcement",
            "product",
            "collection",
            "brand",
            "siteSettings",
            "footerSettings",
            "section",
            "diningPage",
            "restaurantPage",
            "perfumePage",
            "beautyPage",
            "skincarePage",
            "makeupPage",
            "fashionPage",
            "designerPage"
          ].includes(listItem.getId() || "")
      ),
    ]);
