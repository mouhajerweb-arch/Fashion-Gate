import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'plugins/fashiongate-elementor-experience/templates');
await fs.rm(target, { recursive: true, force: true });
await fs.mkdir(target, { recursive: true });

let counter = 0;
const id = () => (++counter).toString(16).padStart(7, '0');
const globalColor = key => `globals/colors?id=${key}`;
const globalFont = key => `globals/typography?id=${key}`;

const node = (widgetType, settings = {}) => ({ id: id(), elType: 'widget', widgetType, settings, elements: [] });
const motion = type => ({
  fg_animation: type,
  fg_trigger: 'viewport',
  fg_duration: 0.9,
  fg_delay: 0,
  fg_stagger: 0.09,
  fg_ease: 'power2.out',
  fg_start: 'top 85%',
  fg_end: 'bottom top',
  fg_desktop: 'yes',
  fg_tablet: 'yes',
  fg_mobile: '',
  fg_reduced: 'none'
});

const spacing = value => ({ unit: 'px', top: String(value), right: String(value), bottom: String(value), left: String(value), isLinked: true });

const container = (name, elements, settings = {}) => {
  if (settings.css_id) {
    settings._element_id = settings.css_id;
    delete settings.css_id;
  }
  return {
    id: id(),
    elType: 'container',
    isInner: false,
    settings: {
      _title: name,
      content_width: 'full',
      flex_direction: 'column',
      padding: spacing(60),
      padding_tablet: spacing(40),
      padding_mobile: spacing(24),
      flex_gap: { column: '24', row: '24', unit: 'px' },
      ...settings
    },
    elements
  };
};

const heading = (text, ar, tag = 'h2') => node('heading', {
  title: text,
  header_size: tag,
  __globals__: {
    title_color: globalColor('fg_text'),
    typography_typography: globalFont(ar ? 'fg_display_ar' : 'fg_display_en')
  }
});

const copy = text => node('text-editor', { editor: `<p>${text}</p>` });
const media = name => ({
  url: `https://www.fashiongatemall.com/landing/wp-content/plugins/fashiongate-elementor-experience/assets/media/${name}`,
  id: ''
});

const colors = {
  fg_background: '#FAF9F5',
  fg_light: '#FFFFFF',
  fg_dark: '#161616',
  fg_text: '#161616',
  fg_muted: '#55504A',
  fg_accent: '#E85D04',
  fg_accent_deep: '#C84C00',
  fg_border: '#E8E3DC'
};

const fonts = {
  fg_display_en: 'Cormorant Garamond',
  fg_body_en: 'Cairo',
  fg_display_ar: 'Cairo',
  fg_body_ar: 'Cairo'
};

const globals = {
  title: 'Fashion Gate Global Settings',
  type: 'kit',
  version: '0.4',
  content: [],
  page_settings: {
    custom_colors: Object.entries(colors).map(([_id, color]) => ({ _id, title: _id.replace('fg_', 'FG ').replaceAll('_', ' '), color })),
    custom_typography: Object.entries(fonts).map(([_id, family]) => ({ _id, title: _id.replace('fg_', 'FG ').replaceAll('_', ' '), typography_typography: 'custom', typography_font_family: family, typography_font_weight: '400' })),
    body_typography_typography: 'custom',
    body_typography_font_family: 'Cairo',
    body_typography_font_size: { unit: 'px', size: 16 },
    body_typography_line_height: { unit: 'em', size: 1.8 },
    viewport_mobile: 767,
    viewport_tablet: 1024
  }
};

await fs.writeFile(path.join(target, 'global-settings.json'), JSON.stringify(globals, null, 2));

for (const ar of [false, true]) {
  const lang = ar ? 'ar' : 'en';
  const t = (en, arabic) => ar ? arabic : en;
  const title = t('FASHION GATE', 'فاشن غيت');
  const sections = [];
  const add = (key, name, elements, settings) => {
    const section = container(name, elements, settings);
    sections.push({ key, name, section });
    return section;
  };

  // 00. ANNOUNCEMENT MARQUEE BAR
  add('announcement', 'FG Announcement Marquee Bar', [
    node('fg-announcement-bar', {
      show_announcement: 'yes',
      speed: 35,
      messages: [
        { _id: id(), text: t('NEW COLLECTIONS HAVE ARRIVED · VISIT FASHION GATE AT BOULEVARD DAMASCUS', 'أحدث تشكيلات الأزياء الراقية متوفرة الآن في فاشن غيت · بوليفارد دمشق'), link: { url: '#clothes' } },
        { _id: id(), text: t('SPECIAL SEASONAL HIGHLIGHTS & EXCLUSIVE LUXURY BRANDS', 'تفضلوا بزيارتنا في فاشن غيت - وجهة الموضة الاستثنائية بدمشق'), link: { url: '#brands' } },
        { _id: id(), text: t('DISCOVER PRIVATE PERFUME BLENDS & HAUTE BEAUTY RITUALS', 'عطور ونفحات استثنائية من دور العطور العالمية والجمال الفاخر'), link: { url: '#perfume' } }
      ]
    })
  ], { padding: spacing(0), css_id: 'fg-header-marquee' });

  // 01. MAIN HEADER
  add('header', 'FG Main Header', [
    node('fg-fashion-header', {
      logo: media('fashion-gate-logo.svg'),
      logo_url: { url: '/' },
      whatsapp_label: t('WhatsApp Us', 'تواصل عبر واتساب'),
      whatsapp_number: '+963 930 000 000',
      whatsapp_url: { url: 'https://wa.me/963930000000' },
      phone_number: '+963 930 000 000',
      phone_url: { url: 'tel:+963930000000' },
      x_url: { url: 'https://x.com/fashiongatemall' },
      instagram_url: { url: 'https://www.instagram.com/fashiongatemall' },
      facebook_url: { url: 'https://www.facebook.com/fashiongatemall' },
      lang_label: t('EN', 'عربي'),
      lang_url: { url: ar ? '?lang=en' : '?lang=ar' },
      flag_image: media(ar ? 'United-Kingdom-flag.svg' : 'Syrian-flag.svg')
    })
  ], { html_tag: 'header', css_classes: 'fg-header-bar', padding: spacing(0), css_id: 'fg-main-header-container' });

  // 02. HERO SECTION
  add('hero', 'FG Luxury Hero', [
    node('fg-animated-hero', {
      title: t('FASHION GATE MALL', 'فـاشـن غـيـت مـول'),
      subtitle: t('Damascus, Syria', 'دمشق، سورية'),
      eyebrow: t('▪ FASHION GATE · DAMASCUS', '▪ فاشن غيت · دمشق'),
      body: t('Discover ready-to-wear haute couture, high beauty rituals, and private perfume blends at Damascus’s premier luxury fashion address.', 'اكتشف الأزياء الراقية ومستحضرات التجميل والعطور الاستثنائية في أرقى وجهة موضة بدمشق.'),
      tag: 'h1',
      image: media('hero-woman-wide.png'),
      mobile_image: media('hero-look-01.jpg'),
      alt: t('Fashion Gate Hero Campaign', 'حملة فاشن غيت الإعلانية'),
      cta: t('EXPLORE FASHION', 'اكتشف الأزياء'),
      link: { url: '#clothes' },
      secondary_cta: t('PLAN YOUR VISIT', 'خطط لزيارتك'),
      secondary_link: { url: '#register' },
      bottom_nav: [
        { _id: id(), label: t('WOMEN', 'النساء'), link: { url: '#clothes' } },
        { _id: id(), label: t('MEN', 'الرجال'), link: { url: '#clothes' } },
        { _id: id(), label: t('BEAUTY', 'الجمال'), link: { url: '#skincare' } },
        { _id: id(), label: t('PERFUME', 'العطور'), link: { url: '#perfume' } }
      ],
      ...motion('mask-up'),
      fg_trigger: 'load'
    })
  ], { padding: spacing(0), css_id: 'fg-hero' });

  // 03. "THIS SEASON" EDITORIAL IMAGE CAROUSEL
  const carouselCards = [
    { _id: id(), title: t('Autumn Runway Edit', 'مختارات منصة الخريف'), label: 'LOOKBOOK 01', image: media('hero-look-01.jpg'), hover_image: media('autumn-edit.png'), body: t('Tailored wool coats and structured silhouettes.', 'معاطف صوفية وقصّات محددة.'), link: { url: '#clothes' } },
    { _id: id(), title: t('Haute Parfumerie Collection', 'مجموعة العطور الفاخرة'), label: 'LOOKBOOK 02', image: media('hero-unisex-perfume.jpg'), hover_image: media('lookbook-scent.png'), body: t('Rare amber, rose, and smoked wood extracts.', 'خلاصات النادر من العنبر والورد والحطب.'), link: { url: '#perfume' } },
    { _id: id(), title: t('Velvet Skin Rituals', 'طقوس البشرة المخملية'), label: 'LOOKBOOK 03', image: media('luxury-beauty.png'), hover_image: media('jasmine-oil.png'), body: t('Botanical serums and age-defying elixirs.', 'سيرومات عشبية وإكسيرات تجديد الشباب.'), link: { url: '#skincare' } },
    { _id: id(), title: t('Couture Accessories & Totes', 'حقائب وإكسسوارات كوتور'), label: 'LOOKBOOK 04', image: media('lookbook-tote.png'), hover_image: media('signature-accents.png'), body: t('Handcrafted leather luxury statements.', 'قطع جلديّة فاخرة مصنوعة يدوياً.'), link: { url: '#clothes' } },
    { _id: id(), title: t('Modern Elegance & Tailoring', 'أناقة وتفصيل عصري'), label: 'LOOKBOOK 05', image: media('modern-sophistication.png'), hover_image: media('blazer.png'), body: t('Refined evening wear and timeless classics.', 'أزياء سهرة راقية وكلاسيكيات خالدة.'), link: { url: '#clothes' } }
  ];

  add('this-season-carousel', 'FG Editorial Carousel', [
    node('fg-horizontal-showcase', {
      title: t('THIS SEASON', 'هذا الموسم'),
      eyebrow: t('▪ SEASONAL LOOKBOOK & ATMOSPHERE', '▪ إطلالات الموسم وأجواء الموضة'),
      cards: carouselCards,
      pin: 'yes',
      gallery_scrub: 1,
      mobile_layout: 'swipe',
      tag: 'h2'
    })
  ], { css_id: 'this-season', padding: spacing(60) });

  // 04. CLOTHES CATEGORY
  const clothesCards = [
    { _id: id(), title: t('Evening Couture & Gowns', 'فساتين وسهرة كوتور'), label: t('COUTURE', 'كوتور'), image: media('hero-look-01.jpg'), hover_image: media('hero-woman-wide.png'), body: t('Silk chiffon, hand embroidery, and dramatic floor-length silhouettes.', 'حرير شيفون وتطريز يدوي وتصاميم أنيقة.'), link: { url: '#register' } },
    { _id: id(), title: t('Tailored Jackets & Blazers', 'سترات وتفصيل فاخر'), label: t('TAILORING', 'تفصيل'), image: media('blazer.png'), hover_image: media('hero-look-05.jpg'), body: t('Structured shoulders and premium Italian wool blends.', 'أكتاف محددة وأقمشة صوف إيطالية فاخرة.'), link: { url: '#register' } },
    { _id: id(), title: t('Designer Trench & Outerwear', 'معاطف وتوليفات خارجية'), label: t('OUTERWEAR', 'معاطف'), image: media('lookbook-trench.png'), hover_image: media('autumn-edit.png'), body: t('Timeless double-breasted coats with refined belt accents.', 'معاطف أنيقة بتفاصيل حزام راقية.'), link: { url: '#register' } },
    { _id: id(), title: t('Signature Leather Totes', 'حقائب جلدية توقيعية'), label: t('ACCESSORIES', 'إكسسوارات'), image: media('lookbook-tote.png'), hover_image: media('signature-accents.png'), body: t('Full-grain calfskin with brushed gold hardware.', 'جلد طبيعي فاخر مع تفاصيل ذهبية.'), link: { url: '#register' } }
  ];

  add('clothes-category', 'FG Clothes Category', [
    node('fg-luxury-cards', {
      title: t('01 / CLOTHES', '01 / الأزياء والملابس الراقية'),
      eyebrow: t('▪ READY-TO-WEAR & COUTURE', '▪ الأزياء والكوتور'),
      body: t('Explore fashion-forward silhouettes, luxury fabrics, and contemporary European tailoring curated for Damascus.', 'استكشف القصّات العصريّة والأقمشة الفاخرة والتفصيل الأوروبي الراقي المختار لدمشق.'),
      cards: clothesCards,
      cta: t('EXPLORE CLOTHES COLLECTION', 'اكتشف مجموعة الأزياء'),
      link: { url: '#register' },
      tag: 'h2'
    })
  ], { css_id: 'clothes', padding: spacing(60) });

  // 05. SKIN CARE CATEGORY
  const skincareCards = [
    { _id: id(), title: t('Damascus Rose Youth Elixir', 'إكسير ورد دمشق للشباب'), label: t('SERUM', 'سيروم'), image: media('jasmine-oil.png'), hover_image: media('luxury-beauty.png'), body: t('Pure distilled Damask rose extracts for intense skin hydration.', 'خلاصة الورد الدمشقي المقطر لترطيب عميق.'), link: { url: '#register' } },
    { _id: id(), title: t('Velvet Replenishing Cream', 'كريم المخمل المغذي'), label: t('MOISTURIZER', 'مرطب'), image: media('luxury-beauty.png'), hover_image: media('hero-look-04.jpg'), body: t('Rich botanical butter infusing skin with luminescent glow.', 'زبدة نباتية غنية تمنح البشرة إشراقة مخملية.'), link: { url: '#register' } },
    { _id: id(), title: t('Celestial Night Repair Oil', 'زيت الإصلاح الليلي'), label: t('NIGHT CARE', 'عناية ليلية'), image: media('lookbook-scent.png'), hover_image: media('jasmine-oil.png'), body: t('Concentrated peptide & antioxidant elixir for nocturnal recovery.', 'ببتيدات بتركيز عالٍ ومضادات أكسدة للتجديد الليلي.'), link: { url: '#register' } }
  ];

  add('skincare-category', 'FG Skin Care Category', [
    node('fg-luxury-cards', {
      title: t('02 / SKIN CARE', '02 / العناية بالبشرة والجمال'),
      eyebrow: t('▪ BEAUTY & RADIANCE RITUALS', '▪ طقوس الجمال الفاخر'),
      body: t('Experience high-performance dermatological serums, botanical creams, and bespoke beauty treatments.', 'تعرّف على سيرومات عالية الأداء وكريمات نباتية وطقوس جمال مخصصة للبشرة.'),
      cards: skincareCards,
      cta: t('EXPLORE SKIN CARE COLLECTION', 'اكتشف مجموعة العناية بالبشرة'),
      link: { url: '#register' },
      tag: 'h2'
    })
  ], { css_id: 'skincare', padding: spacing(60) });

  // 06. PERFUME CATEGORY
  const perfumeCards = [
    { _id: id(), title: t('Royal Oud & Damascus Amber', 'عود ملكي وعنبر دمشقي'), label: t('PARFUM EXTRAIT', 'عطر خالص'), image: media('hero-unisex-perfume.jpg'), hover_image: media('lookbook-scent.png'), body: t('Deep aged agarwood blended with golden amber and smoked spices.', 'عود معتق فاخر امتزج بالعنبر الذهبي والتوابل.'), link: { url: '#register' } },
    { _id: id(), title: t('Velvet Damask Rose & Musk', 'ورد دمشقي ومسك مخملي'), label: t('EAU DE PARFUM', 'أو دي بارفان'), image: media('lookbook-scent.png'), hover_image: media('hero-unisex-perfume.jpg'), body: t('Sensual floral heart notes wrapped in white cashmere musk.', 'نفحات زهرية حسية مغلفة بمسك الكشمير الأبيض.'), link: { url: '#register' } },
    { _id: id(), title: t('Smoked Vanilla & Cedar Nectar', 'فانيليا مدخنة وأرز'), label: t('PRIVATE BLEND', 'مجموعة خاصة'), image: media('hero-look-06.jpg'), hover_image: media('hero-unisex-perfume.jpg'), body: t('Warm Madagascar vanilla with rich Atlas cedarwood.', 'فانيليا مدغشقر الدافئة مع خشب الأرز الأطلسي.'), link: { url: '#register' } }
  ];

  add('perfume-category', 'FG Perfume Category', [
    node('fg-luxury-cards', {
      title: t('03 / PERFUME', '03 / العطور الفاخرة والنادرة'),
      eyebrow: t('▪ HAUTE PARFUMERIE HOUSE', '▪ دار العطور'),
      body: t('Discover atmospheric, sensual, and rare fragrance extraits crafted by world-renowned perfumers.', 'اكتشف عطوراً استثنائية ونادرة صُممت بأيدي أشهر العطارين العالميين.'),
      cards: perfumeCards,
      cta: t('EXPLORE PERFUME COLLECTION', 'اكتشف مجموعة العطور'),
      link: { url: '#register' },
      tag: 'h2'
    })
  ], { css_id: 'perfume', padding: spacing(60) });

  // 07. BRAND LOGO MARQUEE
  add('brand-marquee', 'FG Brand Logo Marquee', [
    node('fg-marquee', {
      title: t('DIOR ▪ CHANEL ▪ TOM FORD ▪ HERMÈS ▪ PRADA ▪ GUCCI ▪ SAINT LAURENT ▪ VALENTINO ▪ FASHION GATE ▪ ', 'ديور ▪ شانيل ▪ توم فورد ▪ هيرميس ▪ برادا ▪ جوتشي ▪ سان لوران ▪ فالنتينو ▪ فاشن غيت ▪ '),
      speed: 30,
      direction: 'normal'
    })
  ], { css_id: 'brands', padding: spacing(32), css_classes: 'fg-marquee-section' });

  // 08. FASHION GATE BRAND QUOTE
  add('brand-quote', 'FG Brand Quote Statement', [
    node('fg-reveal-heading', {
      reveal_text: t('“Fashion is not only what you wear. It is how you experience the world.”', '“الأناقة ليست مجرد ما ترتديه، بل كيف تعيش العالم.”'),
      tag: 'h2',
      split: 'lines',
      ...motion('text-reveal')
    }),
    copy(t('— FASHION GATE · BOULEVARD DAMASCUS', '— فاشن غيت · بوليفارد دمشق'))
  ], { css_id: 'quote', padding: spacing(80), css_classes: 'fg-quote-box' });

  // 09. FINAL LEAD CTA & FORM
  const fields = [
    ['name', t('Full Name', 'الاسم الكامل'), 'text'],
    ['email', t('Email Address', 'البريد الإلكتروني'), 'email'],
    ['phone', t('Phone Number', 'رقم الهاتف'), 'tel'],
    ['interest', t('Primary Interest', 'الاهتمام الرئيسي'), 'select'],
    ['message', t('Personal Request / Message', 'طلبك / رسالتك'), 'textarea'],
    ['consent', t('I agree to be contacted by Fashion Gate VIP Concierge.', 'أوافق على التواصل معي من قبل خدمة العملاء الفاخرة.'), 'checkbox']
  ].map(([key, label, type]) => ({
    _id: id(),
    key,
    label,
    type,
    required: key === 'phone' ? '' : 'yes',
    options: key === 'interest' ? t('Clothes & Ready-to-Wear\nSkin Care & Beauty\nHaute Parfumerie\nGeneral VIP Visit', 'الأزياء والملابس\nالعناية بالبشرة والجمال\nالعطور الفاخرة\nزيارة عامة') : ''
  }));

  add('lead-cta', 'FG Final Lead CTA', [
    node('fg-lead-experience', {
      title: t('DISCOVER FASHION GATE YOUR WAY.', 'اكتشف فاشن غيت بطريقتك.'),
      body: t('Plan your private VIP visit, request exclusive collection previews, or speak with our client concierge.', 'خطط لزيارتك الخاصة أو اطلب معاينات حصرية للتشكيلات وتواصل مع فريق خدمة العملاء الفاخرة.'),
      fields,
      campaign: 'fashiongate-v2-luxury-landing',
      cta: t('BOOK YOUR VISIT', 'حجز زيارة'),
      success: t('Thank you. Your request has been received by our VIP Concierge team.', 'شكراً لك. تم استلام طلبك من قبل فريق خدمة العملاء الفاخرة.'),
      error: t('Unable to send request. Please try again.', 'تعذّر إرسال الطلب. يرجى المحاولة مجدداً.'),
      privacy: { url: `https://www.fashiongatemall.com/privacy/${lang}` },
      privacy_label: t('Privacy Policy', 'سياسة الخصوصية')
    })
  ], { css_id: 'register', padding: spacing(80) });

  // 10. PREMIUM FOOTER
  add('dark-footer', 'FG Premium Footer', [
    heading(title, ar, 'h2'),
    copy(t('Boulevard Damascus · Syria | Premier Luxury Fashion Destination', 'بوليفارد دمشق · سوريا | الوجهة الأولى للأزياء الفاخرة')),
    copy(t(`
      <div class="fg-footer-links">
        <a href="#clothes">${t('Women', 'النساء')}</a>
        <a href="#clothes">${t('Men', 'الرجال')}</a>
        <a href="#skincare">${t('Beauty', 'الجمال')}</a>
        <a href="#perfume">${t('Perfume', 'العطور')}</a>
        <a href="#brands">${t('Brands', 'العلامات التجارية')}</a>
        <a href="#register">${t('Visit & Contact', 'الزيارة والتواصل')}</a>
      </div>
      <div class="fg-footer-copy">© 2026 Fashion Gate. ${t('All Rights Reserved.', 'جميع الحقوق محفوظة.')}</div>
    `, `
      <div class="fg-footer-links">
        <a href="#clothes">النساء</a>
        <a href="#clothes">الرجال</a>
        <a href="#skincare">الجمال</a>
        <a href="#perfume">العطور</a>
        <a href="#brands">العلامات التجارية</a>
        <a href="#register">الزيارة والتواصل</a>
      </div>
      <div class="fg-footer-copy">© 2026 فاشن غيت. جميع الحقوق محفوظة.</div>
    `))
  ], { html_tag: 'footer', css_classes: 'fg-light-footer', padding: spacing(64) });

  const template = (title, type, content) => ({
    version: '0.4',
    title,
    type,
    content,
    page_settings: {
      template: 'elementor_canvas',
      hide_title: 'yes'
    }
  });

  const main = container('Campaign content', sections.slice(1, -1).map(s => s.section), {
    html_tag: 'main',
    css_id: 'fg-main',
    padding: spacing(0),
    padding_tablet: spacing(0),
    padding_mobile: spacing(0),
    flex_gap: { column: '0', row: '0', unit: 'px' }
  });

  // Write full page JSON
  await fs.writeFile(
    path.join(target, `immersive-landing-${lang}.json`),
    JSON.stringify(template(`Fashion Gate — Immersive Lead Generation ${lang.toUpperCase()}`, 'page', sections.map(s => s.section)), null, 2)
  );

  // Write individual section JSON files
  for (const { key, name, section } of sections) {
    await fs.writeFile(
      path.join(target, `${key}-${lang}.json`),
      JSON.stringify(template(`${name} — ${lang.toUpperCase()}`, 'container', [section]), null, 2)
    );
  }
}

console.log('Successfully generated Fashion Gate V2 10-section luxury light-theme Elementor templates.');
