import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "4y6hfnze";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-07-03";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published"
});

const builder = imageUrlBuilder(sanityClient);

export function imageUrl(source: SanityImageSource) {
  return builder.image(source);
}

export async function getHomepageData() {
  return sanityClient.fetch(`{
    "settings": *[_type == "siteSettings"][0]{
      title,
      tagline,
      primaryColor,
      accentColor,
      headingFont,
      bodyFont,
      logo,
      socialLabel,
      socialUrl,
      navigation[]->{label, anchor, order},
      cookieConsent {
        enabled,
        message { en, ar },
        acceptAllText { en, ar },
        rejectAllText { en, ar },
        customizeText { en, ar },
        hidePreferencesText { en, ar },
        savePreferencesText { en, ar },
        necessaryLabel { en, ar },
        necessaryDesc { en, ar },
        analyticsLabel { en, ar },
        analyticsDesc { en, ar },
        marketingLabel { en, ar },
        marketingDesc { en, ar }
      }
    },
    "page": *[_type == "page" && (slug.current == "homepage" || slug.current == "home" || _id == "home")][0]{
      title,
      seoTitle,
      seoDescription,
      sections[]{
        _key,
        _type,
        enabled,
        type,
        anchor,
        title,
        quote { en, ar },
        eyebrow { en, ar },
        headline { en, ar },
        description { en, ar },
        subHeadlineLine1 { en, ar },
        subHeadlineLine2 { en, ar },
        bgType,
        mobileBgPosition,
        bgImage,
        bgImageMobile,
        bgVideo { asset->{ url } },
        image,
        video { asset->{ url } },
        cta { 
          label { en, ar },
          href,
          type,
          linkType,
          internalLink,
          externalLink
        },
        brands[@->isActive != false]->{
          title,
          titleAr,
          slug,
          image { asset->{ url, metadata { dimensions { aspectRatio } } } },
          imageAr { asset->{ url, metadata { dimensions { aspectRatio } } } },
          isActive,
          size,
          scale
        },
        slides[]{
          title { en, ar },
          description { en, ar },
          image
        },
        collections[]{
          title { en, ar },
          headline { en, ar },
          description { en, ar },
          coverImage
        },
        media[]->{
          title,
          image,
          video { asset->{ url } },
          externalVideoUrl,
          alt,
          caption
        },
        leftCard {
          eyebrow { en, ar },
          title { en, ar },
          description { en, ar },
          image
        },
        rightCard {
          eyebrow { en, ar },
          title { en, ar },
          description { en, ar },
          image
        },
        buttonText { en, ar },
        buttonPath,
        modelImage { asset->{ url } }
      }
    },
    "brands": *[_type == "brand" && isActive == true] | order(title asc) {
      _id,
      title,
      titleAr,
      slug,
      image { asset->{ url, metadata { dimensions { aspectRatio } } } },
      imageAr { asset->{ url, metadata { dimensions { aspectRatio } } } },
      size,
      scale,
      "headline": coalesce(*[_type == "brandPage" && brand._ref == ^._id][0].headline, headline) { en, ar },
      "description": coalesce(*[_type == "brandPage" && brand._ref == ^._id][0].description, description) { en, ar },
      "bgImage": coalesce(*[_type == "brandPage" && brand._ref == ^._id][0].bgImage, bgImage) { asset->{ url } },
      "buttonText": *[_type == "brandPage" && brand._ref == ^._id][0].buttonText { en, ar },
      "buttonLink": *[_type == "brandPage" && brand._ref == ^._id][0].buttonLink
    }
  }`);
}

export async function getAboutPageData() {
  try {
    return await sanityClient.fetch(`*[_type == "aboutPage"][0] {
      eyebrow,
      title,
      headline,
      subtitle,
      p1,
      p2,
      p3,
      p4,
      p5,
      p6,
      p7,
      visionTitle,
      visionText,
      commitmentTitle,
      commitmentText,
      heroImage { asset->{ url } },
      collageImage1 { asset->{ url } },
      collageImage2 { asset->{ url } },
      videoBgImage { asset->{ url } },
      videoSourceType,
      videoUrl,
      videoFile { asset->{ url } },
      videoTitle,
      videoSubtitle,
      seo { metaTitle, metaDescription, keywords, ogImage { asset->{ url } }, canonicalUrl, noIndex }
    }`);
  } catch (err) {
    console.error("Error fetching about page data:", err);
    return null;
  }
}

export async function getLoginPageData() {
  try {
    return await sanityClient.fetch(`*[_type == "loginPage"][0] {
      loginTitle { en, ar },
      signupTitle { en, ar },
      welcomeBack { en, ar },
      welcomeNew { en, ar },
      emailLabel { en, ar },
      passwordLabel { en, ar },
      confirmPasswordLabel { en, ar },
      nameLabel { en, ar },
      loginBtn { en, ar },
      signupBtn { en, ar },
      haveAccount { en, ar },
      noAccount { en, ar },
      backHome { en, ar },
      successMsg { en, ar },
      bgImage { asset->{ url } }
    }`);
  } catch (err) {
    console.error("Error fetching login page data:", err);
    return null;
  }
}

export async function getContactPageData() {
  return sanityClient.fetch(`*[_type == "contactPage"][0] {
    heroImage { asset->{ url } },
    heroCursive,
    title,
    headline,
    subheadline,
    eyebrow,
    subtitle,
    locationTitle,
    addressLabel,
    addressValue,
    hoursTitle,
    hoursLabel,
    hoursValue,
    emailTitle,
    digitalLabel,
    digitalValue,
    whatsappTitle,
    whatsappLabel,
    whatsappValue,
    whatsappLink,
    chatConcierge,
    formImage { asset->{ url } },
    formCursive,
    formTitle,
    formSubtitle,
    fullNameLabel,
    emailLabel,
    phoneLabel,
    msgLabel,
    sendBtn,
    successHeader,
    successDesc,
    sendAnother,
    mapTitle,
    mapEmbedUrl,
    seo { metaTitle, metaDescription, keywords, ogImage { asset->{ url } }, canonicalUrl, noIndex }
  }`);
}

export async function getAnnouncements() {
  try {
    return await sanityClient.fetch(`*[_type == "announcement"] | order(order asc) {
      text { en, ar },
      link
    }`);
  } catch (err) {
    console.error("Error fetching announcements:", err);
    return [];
  }
}

export async function getSanityBrands() {
  try {
    return await sanityClient.fetch(`*[_type == "brand" && isActive == true] | order(title asc) {
      _id,
      title,
      titleAr,
      slug,
      image { asset->{ url, metadata { dimensions { aspectRatio } } } },
      imageAr { asset->{ url, metadata { dimensions { aspectRatio } } } },
      size,
      scale,
      "headline": coalesce(*[_type == "brandPage" && brand._ref == ^._id][0].headline, headline) { en, ar },
      "description": coalesce(*[_type == "brandPage" && brand._ref == ^._id][0].description, description) { en, ar },
      "bgImage": coalesce(*[_type == "brandPage" && brand._ref == ^._id][0].bgImage, bgImage) { asset->{ url } },
      "buttonText": *[_type == "brandPage" && brand._ref == ^._id][0].buttonText { en, ar },
      "buttonLink": *[_type == "brandPage" && brand._ref == ^._id][0].buttonLink
    }`);
  } catch (err) {
    console.error("Error fetching sanity brands:", err);
    return [];
  }
}

export async function getTermsPageData() {
  try {
    return await sanityClient.fetch(`*[_type == "termsPage"][0]`);
  } catch (err) {
    console.error("Error fetching terms page data:", err);
    return null;
  }
}

export async function getPrivacyPageData() {
  try {
    return await sanityClient.fetch(`*[_type == "privacyPage"][0]`);
  } catch (err) {
    console.error("Error fetching privacy page data:", err);
    return null;
  }
}

export async function getSanityBrand(slug: string) {
  try {
    return await sanityClient.fetch(`*[_type == "brand" && slug.current == $slug && isActive == true][0] {
      _id,
      title,
      titleAr,
      slug,
      image { asset->{ url } },
      imageAr { asset->{ url } },
      size,
      scale,
      "headline": coalesce(*[_type == "brandPage" && brand._ref == ^._id][0].headline, headline) { en, ar },
      "description": coalesce(*[_type == "brandPage" && brand._ref == ^._id][0].description, description) { en, ar },
      "bgImage": coalesce(*[_type == "brandPage" && brand._ref == ^._id][0].bgImage, bgImage) { asset->{ url } },
      "buttonText": *[_type == "brandPage" && brand._ref == ^._id][0].buttonText { en, ar },
      "buttonLink": *[_type == "brandPage" && brand._ref == ^._id][0].buttonLink,
      seo { metaTitle, metaDescription, keywords, ogImage { asset->{ url } }, canonicalUrl, noIndex }
    }`, { slug });
  } catch (err) {
    console.error("Error fetching single sanity brand:", err);
    return null;
  }
}

export async function getFooterSettings() {
  try {
    return await sanityClient.fetch(`*[_type == "footerSettings"][0] {
      description { en, ar },
      exploreTitle { en, ar },
      links[]{
        label { en, ar },
        href,
        isEnabled,
        order
      },
      updatesTitle { en, ar },
      subscribeText { en, ar },
      emailPlaceholder { en, ar },
      copyright { en, ar },
      facebookUrl,
      instagramUrl,
      whatsAppUrl,
      floatingWhatsAppUrl,
      tiktokUrl,
      youtubeUrl,
      pinterestUrl,
      snapchatUrl,
      xUrl
    }`);
  } catch (err) {
    if (typeof window === "undefined") {
      console.error("Error fetching footer settings:", err);
    }
    return null;
  }
}

export async function getDesignerPageData() {
  try {
    return await sanityClient.fetch(`coalesce(
      *[_type == "designerPage" && _id == "designersPage"][0],
      *[_type == "designerPage" && _id == "designers"][0]
    ) {
      eyebrow { en, ar },
      title { en, ar },
      description { en, ar },
      heroImage { asset->{ url } },
      heroImagePosition,
      heroImagePositionMobile,
      categoriesHeading { en, ar },
      featuredBrandsHeading { en, ar },
      searchPlaceholder { en, ar },
      allCategoriesLabel { en, ar },
      exploreBrandLabel { en, ar },
      seo { metaTitle, metaDescription, keywords, ogImage { asset->{ url } }, canonicalUrl, noIndex }
    }`);
  } catch (err) {
    console.error("Error fetching designer page data:", err);
    return null;
  }
}

export async function getDesignerCategories() {
  try {
    const headerCategories = await sanityClient.fetch(`*[_type == "header"][0].menuItems[
      href match "*designers*" ||
      label.en match "*Designer*" ||
      label.en match "*Designers*" ||
      label.ar match "*مصمم*"
    ][0].designerCategories[]-> {
      _id,
      title { en, ar },
      order,
      brands[@->isActive != false]->{
        _id,
        title,
        titleAr,
        slug,
        image { asset->{ url, metadata { dimensions { aspectRatio } } } },
        imageAr { asset->{ url, metadata { dimensions { aspectRatio } } } },
        size,
        scale,
        headline { en, ar },
        description { en, ar },
        bgImage { asset->{ url } }
      }
    }`);

    if (Array.isArray(headerCategories) && headerCategories.length > 0) {
      return headerCategories;
    }

    return [];
  } catch (err) {
    console.error("Error fetching designer categories:", err);
    return [];
  }
}

export async function getDesignerPageCategories() {
  try {
    const data = await sanityClient.fetch(`{
      "navCategoryIds": *[_type == "header"][0].menuItems[
        href match "*designers*" ||
        label.en match "*Designer*" ||
        label.en match "*Designers*"
      ][0].designerCategories[]._ref,
      "pageSections": coalesce(
        *[_type == "designerPage" && _id == "designersPage"][0],
        *[_type == "designerPage" && _id == "designers"][0]
      ).categorySections[]{
        isVisible,
        sectionImage { asset->{ url } },
        category->{
          _id,
          title { en, ar },
          order,
          brands[@->isActive != false]->{
            _id,
            title,
            titleAr,
            slug,
            image { asset->{ url, metadata { dimensions { aspectRatio } } } },
            imageAr { asset->{ url, metadata { dimensions { aspectRatio } } } },
            size,
            scale,
            headline { en, ar },
            description { en, ar },
            bgImage { asset->{ url } }
          }
        },
        brands[]{
          isVisible,
          cardImage { asset->{ url } },
          brand->{
            _id,
            title,
            titleAr,
            slug,
            image { asset->{ url, metadata { dimensions { aspectRatio } } } },
            imageAr { asset->{ url, metadata { dimensions { aspectRatio } } } },
            size,
            scale,
            headline { en, ar },
            description { en, ar },
            bgImage { asset->{ url } }
          }
        }
      },
      "headerCategories": *[_type == "header"][0].menuItems[
        href match "*designers*" ||
        label.en match "*Designer*" ||
        label.en match "*Designers*"
      ][0].designerCategories[]-> {
        _id,
        title { en, ar },
        order,
        brands[@->isActive != false]->{
          _id,
          title,
          titleAr,
          slug,
          image { asset->{ url, metadata { dimensions { aspectRatio } } } },
          imageAr { asset->{ url, metadata { dimensions { aspectRatio } } } },
          size,
          scale,
          headline { en, ar },
          description { en, ar },
          bgImage { asset->{ url } }
        }
      }
    }`);

    const navIds = new Set((data?.navCategoryIds || []).filter(Boolean));
    const pageSections = Array.isArray(data?.pageSections) ? data.pageSections : [];
    const configuredSections = pageSections
      .filter((section: any) => section?.isVisible !== false && section?.category?._id && navIds.has(section.category._id))
      .map((section: any) => {
        const sectionBrandRows = Array.isArray(section.brands) ? section.brands : [];
        const hiddenBrandIds = new Set(
          sectionBrandRows
            .filter((item: any) => item?.isVisible === false && item?.brand)
            .map((item: any) => item.brand.slug?.current || item.brand._id)
            .filter(Boolean)
        );
        const visibleOverrides = new Map(
          sectionBrandRows
            .filter((item: any) => item?.isVisible !== false && item?.brand)
            .map((item: any) => [
              item.brand.slug?.current || item.brand._id,
              {
                ...item.brand,
                cardImage: item.cardImage,
              },
            ])
        );
        const baseBrands = Array.isArray(section.category.brands) ? section.category.brands : [];
        const mergedBrands = baseBrands
          .filter((brand: any) => !hiddenBrandIds.has(brand.slug?.current || brand._id))
          .map((brand: any) => visibleOverrides.get(brand.slug?.current || brand._id) || brand);
        const mergedIds = new Set(mergedBrands.map((brand: any) => brand.slug?.current || brand._id).filter(Boolean));
        const extraConfiguredBrands = [...visibleOverrides.entries()]
          .filter(([id]) => id && !mergedIds.has(id))
          .map(([, brand]) => brand);

        return {
          ...section.category,
          sectionImage: section.sectionImage,
          brands: [...mergedBrands, ...extraConfiguredBrands],
        };
      });

    if (Array.isArray(data?.headerCategories) && data.headerCategories.length > 0) {
      const configuredById = new Map(configuredSections.map((section: any) => [section._id, section]));
      return data.headerCategories.map((category: any) => configuredById.get(category._id) || category);
    }

    if (configuredSections.length > 0) {
      return configuredSections;
    }

    return [];
  } catch (err) {
    console.error("Error fetching designer page categories:", err);
    return [];
  }
}

export async function getAllSanityProductSlugs(): Promise<{ id: string }[]> {
  try {
    const slugs = await sanityClient.fetch<string[]>(`*[_type == "product" && defined(slug.current)].slug.current`);
    return slugs.map(slug => ({ id: slug }));
  } catch (err) {
    console.error("Error fetching slugs:", err);
    return [];
  }
}

export async function getSanityProduct(slug: string): Promise<any> {
  try {
    const raw = await sanityClient.fetch(`*[_type == "product" && slug.current == $slug][0] {
      _id,
      name { en, ar },
      slug,
      subtitle { en, ar },
      description { en, ar },
      price,
      image { asset->{ url } },
      badge { en, ar },
      brand->{ slug, title, titleAr },
      category->{ slug, titleEn, titleAr },
      detailsList[]{ en, ar }
    }`, { slug });

    if (!raw) return null;

    return {
      id: raw.slug?.current || "",
      title: raw.name?.en || "",
      titleAr: raw.name?.ar || raw.name?.en || "",
      category: raw.category?.slug?.current || "",
      categoryAr: raw.category?.slug?.current || "",
      slogan: raw.subtitle?.en || "",
      sloganAr: raw.subtitle?.ar || raw.subtitle?.en || "",
      description: raw.description?.en || "",
      descriptionAr: raw.description?.ar || raw.description?.en || "",
      details: (raw.detailsList || []).map((d: any) => d.en),
      detailsAr: (raw.detailsList || []).map((d: any) => d.ar || d.en),
      imageUrl: raw.image?.asset?.url || "/brand/logo.png",
      brandId: raw.brand?.slug?.current || "",
      relatedIds: []
    };
  } catch (err) {
    console.error("Error fetching sanity product:", err);
    return null;
  }
}

export async function getAllSanityProducts(): Promise<any[]> {
  try {
    const rawList = await sanityClient.fetch(`*[_type == "product"] {
      _id,
      name { en, ar },
      slug,
      subtitle { en, ar },
      description { en, ar },
      price,
      image { asset->{ url } },
      badge { en, ar },
      brand->{ slug, title, titleAr },
      category->{ slug, titleEn, titleAr },
      detailsList[]{ en, ar }
    }`);

    return rawList.map((raw: any) => ({
      id: raw.slug?.current || "",
      title: raw.name?.en || "",
      titleAr: raw.name?.ar || raw.name?.en || "",
      category: raw.category?.slug?.current || "",
      categoryAr: raw.category?.slug?.current || "",
      slogan: raw.subtitle?.en || "",
      sloganAr: raw.subtitle?.ar || raw.subtitle?.en || "",
      description: raw.description?.en || "",
      descriptionAr: raw.description?.ar || raw.description?.en || "",
      details: (raw.detailsList || []).map((d: any) => d.en),
      detailsAr: (raw.detailsList || []).map((d: any) => d.ar || d.en),
      imageUrl: raw.image?.asset?.url || "/brand/logo.png",
      brandId: raw.brand?.slug?.current || "",
      relatedIds: []
    }));
  } catch (err) {
    console.error("Error fetching all products:", err);
    return [];
  }
}

const arabicBlogPostFallbacks: Record<string, { titleAr: string; excerptAr: string; paragraphsAr: string[]; contentAr: any[] }> = {
  "blog-fashion-gate-mall-syria": {
    titleAr: "مول بوابة الأزياء دمشق: أول مول فاخر عالمي في سوريا",
    excerptAr: "تستعد دمشق لاستقبال أول تجربة تجارة تجزئة فاخرة عالمية. يفتح مول بوابة الأزياء دمشق أبوابه هذا العام كأول وجهة تسوق فاخرة تجمع أشهر دور الأزياء العالمية.",
    paragraphsAr: [
      "مول بوابة الأزياء دمشق: أول مركز تسوق تجاري فاخر بمواصفات عالمية في دمشق.",
      "تستعد العاصمة السورية دمشق لاستقبال وجهة التسوق الأرقى على الإطلاق، حيث يجمع مول بوابة الأزياء دمشق أفخم دور الأزياء العالمية، والمطاعم الراقية، وتجارب الترفيه الاستثنائية تحت سقف واحد."
    ],
    contentAr: [
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "تستعد العاصمة السورية دمشق لاستقبال تجربة تجزئة فاخرة وغير مسبوقة. يفتتح مول بوابة الأزياء دمشق أبوابه هذا العام كأول مركز تسوق فاخر بمواصفات عالمية، ليجمع أشهر دور الأزياء العالمية وتجارب التسوق المتكاملة في قلب المدينة." }]
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "معيار جديد للتسوق الفاخر في دمشق" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "يقع المشروع في موقع حيوي متميز، وقد تم تصميمه بعناية فائقة ليعكس أحدث التوجهات المعمارية في قطاع الضيافة والتجزئة الفاخرة، مما يوفر للزوار بيئة تسوق مريحة وأنيقة." }]
      }
    ]
  },
  "fashion-gate-mall-syria-grand-opening-event": {
    titleAr: "كواليس الافتتاح الكبير: ماذا تتوقع في حفل إطلاق مول بوابة الأزياء دمشق",
    excerptAr: "يتم التخطيط لإطلاق مول بوابة الأزياء دمشق كاحتفالية كبرى تجمع وسائل الإعلام الإقليمية والنخب للاحتفاء بأول مجمع تجاري فاخر في سوريا.",
    paragraphsAr: [
      "استعدادات مكثفة لإطلاق أول وجهة تسوق فاخرة في العاصمة دمشق.",
      "يشهد حفل الافتتاح المرتقب لمول بوابة الأزياء دمشق حضور كبار الشخصيات، والنخب، ووسائل الإعلام الإقليمية للاحتفال بهذا الإنجاز المعماري والتجاري الفريد."
    ],
    contentAr: [
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "تجري الاستعدادات على قدم وساق لإطلاق مول بوابة الأزياء دمشق في احتفالية كبرى تجمع كبار الشخصيات ووسائل الإعلام والإعلاميين للاحتفاء ببدء مرحلة جديدة في قطاع التجزئة الفاخرة." }]
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "ماذا تتوقع خلال أيام الافتتاح" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "عروض أزياء حصرية، وتجارب ضيافة فاخرة، وجولات استكشافية داخل أقسام المول المختلفة التي تضم أرقى العلامات التجارية العالمية." }]
      }
    ]
  },
  "why-unlimited-is-betting-on-damascus": {
    titleAr: "لماذا تراهن أنليميتد على دمشق لإطلاق أول مول فاخر في سوريا",
    excerptAr: "لماذا يتم إطلاق مول فاخر في دمشق الآن؟ تكشف شركة أنليميتد عن حجم الطلب، والتوقيت، والرهان الأكبر خلف مول بوابة الأزياء دمشق.",
    paragraphsAr: [
      "رؤية استثمارية طموحة تعزز حضور العلامات التجارية الفاخرة في دمشق.",
      "تسلط شركة أنليميتد الضوء على الفرص الاستثمارية الواعدة والطلب المتزايد على التجزئة الفاخرة في سوريا، مما يجعل مول بوابة الأزياء وجهة استثنائية."
    ],
    contentAr: [
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "تأتي هذه الخطوة الاستثمارية انطلاقاً من إيمان شركة أنليميتد بالقوة الاقتصادية والطلب المتزايد على المنتجات والتجارب الفاخرة في دمشق." }]
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "الرؤية المستقبلية للتجزئة الفاخرة" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "يمثل مول بوابة الأزياء نقطة انطلاق نحو بناء منظومة تسوق متكاملة تعيد تعزيز موقع دمشق كمركز إقليمي للجمال والأناقة." }]
      }
    ]
  },
  "countdown-fashion-gate-mall-syria-opens-soon": {
    titleAr: "بدأ العد التنازلي: مول بوابة الأزياء دمشق يفتح أبوابه قريباً",
    excerptAr: "يدخل مول بوابة الأزياء دمشق مرحلة العد التنازلي النهائية قبل الافتتاح في دمشق. إليك ما يمكنك توقعه مع اقتراب موعد الإطلاق.",
    paragraphsAr: [
      "اللمسات الأخيرة تكتمل مع اقتراب موعد الافتتاح الرسمي.",
      "يدخل المشروع مراحله النهائية استعداداً لاستقبال الزوار وتوفير تجربة تسوق راقية تلبي تطلعات عشاق الموضة والأناقة."
    ],
    contentAr: [
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "وصلت أعمال التجهيز والتشطيبات النهائية لمول بوابة الأزياء دمشق إلى المراحل الأخيرة، حيث يُنتظر الإعلان عن الموعد الرسمي للافتتاح الفعلي." }]
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "الاستعداد لتجربة تسوق استثنائية" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "سيكون الزوار على موعد مع أحدث صيحات الموضة والديكورات الداخلية الأنيقة والمطاعم الفاخرة فور افتتاح الأبواب." }]
      }
    ]
  },
  "fashion-gate-mall-design-story": {
    titleAr: "التصميم خلف مول بوابة الأزياء دمشق: تطبيق معايير الضيافة الفاخرة في قطاع التجزئة",
    excerptAr: "تساهم خبرة المهندس ماهر محاجر في تصميم الضيافة الفاخرة في تشكيل مول بوابة الأزياء دمشق، لنقل معايير الخمس نجوم إلى قطاع التجزئة في دمشق لأول مرة.",
    paragraphsAr: [
      "رؤية معمارية مستلهمة من قطاع الضيافة الفاخرة بخمس نجوم.",
      "يقود تصميم المشروع فريق مهندسي مهاجر الدولية لإعادة تعريف تجربة التسوق والتصميم الداخلي للمراكز التجارية في المنطقة."
    ],
    contentAr: [
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "يعتمد التصميم المعماري لمول بوابة الأزياء دمشق على معايير الفنادق الفاخرة ذات الخمس نجوم، حيث أشرف المهندس ماهر محاجر وفريقه في مهاجر الدولية على تصميم كافة التفاصيل الداخلية والأنارة والمساحات الفسيحة." }]
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "أهمية تصميم الضيافة في مراكز التسوق" }]
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "يسهم استخدام فلسفة تصميم الضيافة في إتاحة الراحة والهدوء للزوار وتشجيعهم على قضاء أوقات ممتعة داخل المعرض والمطاعم والمساحات الترفيهية." }]
      }
    ]
  }
};

export async function getSanityBlogPosts(): Promise<any[]> {
  try {
    const rawList = await sanityClient.fetch(`*[_type == "post"] | order(publishedAt desc) {
      _id,
      title { en, ar },
      slug,
      excerpt { en, ar },
      format,
      category,
      mainImage { asset->{ url } },
      content,
      readTime,
      tags,
      publishedAt,
      author {
        name,
        role { en, ar },
        image { asset->{ url } }
      }
    }`);

    if (!rawList || !Array.isArray(rawList) || rawList.length === 0) {
      return [];
    }

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return rawList.map((raw: any) => {
      if (!raw) return null;
      const rawContent = raw.content;
      const contentEn = Array.isArray(rawContent) ? rawContent : (Array.isArray(rawContent?.en) ? rawContent.en : []);
      const contentAr = Array.isArray(rawContent) ? rawContent : (Array.isArray(rawContent?.ar) ? rawContent.ar : contentEn);

      const contentArrayEn = Array.isArray(contentEn)
        ? contentEn
            .filter((block: any) => block._type === "block" && block.children)
            .map((block: any) => block.children.map((child: any) => child.text).join(""))
        : [];

      const pubDate = raw.publishedAt ? new Date(raw.publishedAt) : new Date();
      const month = monthNames[pubDate.getMonth()];

      const slugCurrent = raw.slug?.current || "";
      const fallback = arabicBlogPostFallbacks[slugCurrent];

      const contentArrayAr = (fallback?.paragraphsAr && fallback.paragraphsAr.length > 0)
        ? fallback.paragraphsAr
        : (Array.isArray(contentAr)
            ? contentAr
                .filter((block: any) => block._type === "block" && block.children)
                .map((block: any) => block.children.map((child: any) => child.text).join(""))
            : contentArrayEn);

      const rawTitleAr = typeof raw.title === "object" ? raw.title?.ar : (typeof raw.title === "string" ? raw.title : undefined);
      const isTitleArValid = rawTitleAr && typeof rawTitleAr === "string" && !rawTitleAr.startsWith("blog/") && !rawTitleAr.startsWith("http");

      const titleEn = typeof raw.title === "string" ? raw.title : (raw.title?.en || raw.title?.ar || "Untitled");
      const titleAr = isTitleArValid ? rawTitleAr! : (fallback?.titleAr || titleEn);

      const rawExcerptAr = typeof raw.excerpt === "object" ? raw.excerpt?.ar : (typeof raw.excerpt === "string" ? raw.excerpt : undefined);
      const excerptEn = typeof raw.excerpt === "string" ? raw.excerpt : (raw.excerpt?.en || raw.excerpt?.ar || "");
      const excerptAr = (rawExcerptAr && typeof rawExcerptAr === "string" && rawExcerptAr.trim().length > 0)
        ? rawExcerptAr
        : (fallback?.excerptAr || excerptEn);

      return {
        id: raw._id,
        slug: slugCurrent,
        title: titleEn,
        titleAr: titleAr,
        format: raw.format || "Blog post",
        category: raw.category || "design-trends",
        month: month,
        priority: "Medium",
        audience: "",
        keywordFocus: "",
        goal: "",
        excerpt: excerptEn,
        excerptAr: excerptAr,
        content: contentArrayEn,
        contentAr: contentArrayAr,
        image: raw.mainImage?.asset?.url || "/brand-pages/page_01.jpg",
        readTime: raw.readTime || 5,
        tags: raw.tags || [],
        publishedAt: raw.publishedAt
      };
    }).filter(Boolean);
  } catch (err) {
    console.error("Error fetching sanity blog posts:", err);
    return [];
  }
}

export async function getBlogsPageSettings(): Promise<any> {
  try {
    const raw = await sanityClient.fetch(`*[_type == "blogsPage" && _id == "blogsPage"][0] {
      eyebrow { en, ar },
      headline { en, ar },
      description { en, ar },
      stat1 { en, ar },
      stat2 { en, ar },
      stat3 { en, ar },
      editorialVision {
        eyebrow { en, ar },
        quote { en, ar },
        attribution { en, ar }
      },
      seo { metaTitle, metaDescription, keywords, ogImage { asset->{ url } }, canonicalUrl, noIndex }
    }`);
    return raw || null;
  } catch (err) {
    console.error("Error fetching blogs page settings:", err);
    return null;
  }
}


export async function getAllSanityBlogPostSlugs(): Promise<{ slug: string }[]> {
  try {
    const slugs = await sanityClient.fetch<string[]>(`*[_type == "post" && defined(slug.current)].slug.current`);
    return slugs.map(slug => ({ slug }));
  } catch (err) {
    console.error("Error fetching blog slugs:", err);
    return [];
  }
}

export async function getSanityBlogPost(slug: string): Promise<any> {
  try {
    const raw = await sanityClient.fetch(`*[_type == "post" && slug.current == $slug][0] {
      _id,
      title { en, ar },
      slug,
      excerpt { en, ar },
      format,
      category,
      mainImage { asset->{ url } },
      content,
      readTime,
      tags,
      publishedAt,
      author {
        name,
        role { en, ar },
        image { asset->{ url } }
      },
      seo { metaTitle, metaDescription, keywords, ogImage { asset->{ url } }, canonicalUrl, noIndex }
    }`, { slug });

    if (!raw) return null;

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const pubDate = raw.publishedAt ? new Date(raw.publishedAt) : new Date();
    const month = monthNames[pubDate.getMonth()];

    const slugCurrent = raw.slug?.current || "";
    const fallback = arabicBlogPostFallbacks[slugCurrent];

    const rawTitleAr = typeof raw.title === "object" ? raw.title?.ar : (typeof raw.title === "string" ? raw.title : undefined);
    const isTitleArValid = rawTitleAr && typeof rawTitleAr === "string" && !rawTitleAr.startsWith("blog/") && !rawTitleAr.startsWith("http");

    const titleEn = typeof raw.title === "string" ? raw.title : (raw.title?.en || raw.title?.ar || "Untitled");
    const titleAr = isTitleArValid ? rawTitleAr! : (fallback?.titleAr || titleEn);

    const rawExcerptAr = typeof raw.excerpt === "object" ? raw.excerpt?.ar : (typeof raw.excerpt === "string" ? raw.excerpt : undefined);
    const excerptEn = typeof raw.excerpt === "string" ? raw.excerpt : (raw.excerpt?.en || raw.excerpt?.ar || "");
    const excerptAr = (rawExcerptAr && typeof rawExcerptAr === "string" && rawExcerptAr.trim().length > 0)
      ? rawExcerptAr
      : (fallback?.excerptAr || excerptEn);

    const rawContent = raw.content;
    const contentEn = Array.isArray(rawContent) ? rawContent : (rawContent?.en || []);
    const contentAr = (fallback?.contentAr && fallback.contentAr.length > 0)
      ? fallback.contentAr
      : (Array.isArray(rawContent) ? rawContent : (rawContent?.ar || contentEn));

    return {
      slug: slugCurrent,
      title: titleEn,
      titleAr: titleAr,
      format: raw.format || "Blog post",
      month: month,
      priority: "Medium",
      excerpt: excerptEn,
      excerptAr: excerptAr,
      content: contentEn,
      contentAr: contentAr,
      image: raw.mainImage?.asset?.url || "/brand-pages/page_01.jpg",
      readTime: raw.readTime || 5,
      tags: raw.tags || [],
      author: {
        name: raw.author?.name || "Editor",
        role: typeof raw.author?.role === "string" ? raw.author?.role : (raw.author?.role?.en || "Editorial Director"),
        roleAr: typeof raw.author?.role === "string" ? raw.author?.role : (raw.author?.role?.ar || raw.author?.role?.en || "مدير التحرير"),
        imageUrl: raw.author?.image?.asset?.url || "/brand/logo.png"
      }
    };
  } catch (err) {
    console.error("Error fetching single blog post:", err);
    return null;
  }
}

export function getLocalizedValue(value: any, lang: "en" | "ar", fallback?: any): any {
  if (!value) return fallback;
  if (typeof value === "object") {
    return value[lang] !== undefined ? value[lang] : (fallback !== undefined ? fallback : value.en);
  }
  return value;
}

export async function getHeaderSettings() {
  return sanityClient.fetch(`*[_type == "header"][0] {
    _id,
    title,
    menuItems[] {
      label { en, ar },
      href,
      dropdownType
    }
  }`);
}


export async function getRestaurantPageData(restaurantId: string) {
  try {
    return await sanityClient.fetch(`*[_type == "restaurantPage" && (restaurantId == $restaurantId || (restaurantId == "The-Espresso-Lab-coffee" && $restaurantId == "the-espresso-lab") || (_id == "the-espresso-lab" && $restaurantId == "the-espresso-lab") || (_id == "arto-coffee" && $restaurantId == "the-espresso-lab") || _id == $restaurantId)][0] {
      restaurantId,
      title,
      headerLogo { asset->{ url } },
      logoHeight,
      logoHeightMobile,
      logoWidth,
      backButtonLabel { en, ar },
      backButtonLink,
      visitUsButtonLabel { en, ar },
      visitUsButtonLink,
      headerLinks[]{
        title { en, ar },
        linkType,
        anchorSection,
        urlPath
      },
      heroTitle,
      heroSub,
      heroQuote,
      heroBgType,
      heroBgImage { asset->{ url } },
      heroBgVideoUrl,
      aboutTitle,
      aboutSubtitle,
      aboutQuote,
      aboutDesc,
      aboutImages[]{ asset->{ url } },
      panels[]{
        label,
        title,
        desc,
        btnText,
        image { asset->{ url } }
      },
      menuHeader,
      menuTabs,
      menus[]{
        categoryIndex,
        name,
        desc,
        price,
        tag,
        note,
        image { asset->{ url } }
      },
      galleryTitle,
      gallerySubtitle,
      galleryImages[]{
        image { asset->{ url } },
        title,
        subtitle
      },
      locationHeader,
      hoursTitle,
      hoursVal,
      contactTitle,
      contactVal,
      addressVal,
      seo { metaTitle, metaDescription, keywords, ogImage { asset->{ url } }, canonicalUrl, noIndex }
    }`, { restaurantId });
  } catch (err) {
    console.error("Error fetching restaurant page data:", err);
    return null;
  }
}

export async function getDiningPageData() {
  try {
    return await sanityClient.fetch(`*[_type == "diningPage"][0] {
      title,
      eyebrow { en, ar },
      headline { en, ar },
      description { en, ar },
      restaurantPlace {
        title { en, ar },
        description { en, ar },
        image { asset->{ url } },
        logo { asset->{ url } },
        operatingHoursLabel { en, ar },
        operatingHoursValue { en, ar },
        contactUsLabel { en, ar },
        contactUsValue { en, ar },
        buttonText { en, ar },
        redirectionType,
        pageReference->{ restaurantId },
        buttonPath,
        showSecondaryButton,
        secondaryButtonText { en, ar },
        secondaryButtonPath
      },
      cafePlace {
        title { en, ar },
        description { en, ar },
        image { asset->{ url } },
        logo { asset->{ url } },
        operatingHoursLabel { en, ar },
        operatingHoursValue { en, ar },
        contactUsLabel { en, ar },
        contactUsValue { en, ar },
        buttonText { en, ar },
        redirectionType,
        pageReference->{ restaurantId },
        buttonPath,
        showSecondaryButton,
        secondaryButtonText { en, ar },
        secondaryButtonPath
      }
    }`);
  } catch (err) {
    console.error("Error fetching dining page data:", err);
    return null;
  }
}

export async function getCategoryPageData(categoryId: string): Promise<any> {
  try {
    const docType = categoryId === "perfumes" 
      ? "perfumePage" 
      : categoryId === "beauty"
      ? "beautyPage"
      : categoryId === "skincare" 
      ? "skincarePage" 
      : categoryId === "makeup"
      ? "makeupPage"
      : categoryId === "fashion"
      ? "fashionPage"
      : "categoryPage";
      
    return sanityClient.fetch(`*[
      _type == $docType &&
      (
        categoryId == $categoryId ||
        _id == $categoryId ||
        _id == $docType ||
        !defined(categoryId)
      )
    ][0] {
      _id,
      categoryId,
      title { en, ar },
      description { en, ar },
      banners[] {
        _key,
        title { en, ar },
        subtitle { en, ar },
        image { asset->{ url } },
        link
      },
      brandsHeading { en, ar },
      allowedBrands[] {
        _type,
        _type == "reference" => @-> {
          _id,
          title,
          titleAr,
          slug,
          headline,
          description,
          image { asset->{ url } },
          imageAr { asset->{ url } },
          size,
          scale,
          categoryLogoScale,
          bgImage { asset->{ url } }
        },
        _type != "reference" => {
          isVisible,
          categoryLogoScale,
          "brand": brand-> {
            _id,
            title,
            titleAr,
            slug,
            headline,
            description,
            image { asset->{ url } },
            imageAr { asset->{ url } },
            size,
            scale,
            categoryLogoScale,
            bgImage { asset->{ url } }
          }
        }
      },
      brandLogoScaleOverrides[] {
        scale,
        brand-> {
          _id,
          slug
        }
      },
      seo { metaTitle, metaDescription, keywords, ogImage { asset->{ url } }, canonicalUrl, noIndex }
    }`, { docType, categoryId });
  } catch (err) {
    console.error("Error fetching category page data:", err);
    return null;
  }
}
