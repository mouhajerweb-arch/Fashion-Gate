export interface Brand {
  id: string;
  name: string;
  nameAr: string;
  headline: string;
  headlineAr: string;
  description: string;
  descriptionAr: string;
  backdropUrl: string;
  isActive?: boolean;
}

export const brands: Brand[] = [
  {
    id: "adidas",
    name: "Adidas",
    nameAr: "أديداس",
    headline: "Where High-Performance Sportswear Meets Contemporary Street Culture",
    headlineAr: "حيث تلتقي الملابس الرياضية عالية الأداء مع ثقافة الشارع المعاصرة",
    description: "Representing the pinnacle of global athletic lifestyle innovation, Adidas is integrated into the portfolio to bridge the gap between high-performance sportswear and contemporary street culture. The inclusion of this iconic brand underscores a commitment to providing energetic, trend-forward, and sustainable options for modern, active lifestyles.",
    descriptionAr: "تمثل أديداس ذروة ابتكار أسلوب الحياة الرياضي العالمي، وقد تم دمجها في محفظتنا لسد الفجوة بين الملابس الرياضية عالية الأداء وثقافة الشارع المعاصرة. ويؤكد إدراج هذه العلامة التجارية الأيقونية على الالتزام بتقديم خيارات حيوية ومواكبة للموضة ومستدامة لأساليب الحياة الحديثة والنشطة.",
    backdropUrl: "/assets/adidas_bg.jpg"
  },
  {
    id: "calvin-klein",
    name: "Calvin Klein",
    nameAr: "كالفين كلاين",
    headline: "Modern American Minimalism & Sophisticated Clean Aesthetic",
    headlineAr: "البساطة الأمريكية الحديثة والجماليات النظيفة والأنيقة",
    description: "Bringing an essential element of modern American minimalism, Calvin Klein anchors the fashion offering with its sophisticated, clean aesthetic. The brand is selected to deliver elevated daily essentials, premium denim, and iconic tailored pieces that appeal to the design-conscious individual seeking effortless luxury.",
    descriptionAr: "تقدم كالفين كلاين عنصراً أساسياً من البساطة الأمريكية الحديثة، وترسخ عروض الموضة بجماليتها المتطورة والنظيفة. تم اختيار العلامة التجارية لتقديم أساسيات يومية راقية، ودنيم ممتاز، وقطع مفصلة أيقونية تجذب الأفراد المهتمين بالتصميم والباحثين عن الفخامة العفوية.",
    backdropUrl: "/assets/ck_bg.jpg"
  },
  {
    id: "skechers",
    name: "Skechers",
    nameAr: "سكيتشرز",
    headline: "Premium Daily Comfort Built on Internationally Acclaimed Technology",
    headlineAr: "راحة يومية ممتازة مبنية على تقنيات معترف بها عالمياً",
    description: "Chosen to fulfill the vital demand for premium daily comfort, Skechers complements the footwear selection with its internationally acclaimed comfort technologies. By balancing current lifestyle trends with innovative cushioning, the brand ensures a diverse, functional, and accessible footwear offering for all demographics.",
    descriptionAr: "تم اختيار سكيتشرز لتلبية الطلب الحيوي على الراحة اليومية الممتازة، وهي تكمل تشكيلة الأحذية بتقنيات الراحة المعترف بها دولياً. ومن خلال تحقيق التوازن بين اتجاهات أسلوب الحياة الحالية والتوسيد المبتكر، تضمن العلامة التجارية تقديم أحذية متنوعة وعملية ومتاحة لجميع الفئات.",
    backdropUrl: "/brand-pages/page_10.jpg"
  },
  {
    id: "maxmara",
    name: "Max Mara",
    nameAr: "ماكس مارا",
    headline: "Unparalleled Italian Craftsmanship & Timeless Sartorial Precision",
    headlineAr: "حرفية إيطالية لا مثيل لها ودقة خياطة خالدة تناسب تطلعاتك",
    description: "As a cornerstone of the luxury portfolio, Max Mara introduces unparalleled Italian craftsmanship and timeless sartorial precision. The inclusion of this legendary fashion house elevates the destination's high-end style credentials, offering sophisticated outerwear and sharp tailoring for the discerning professional.",
    descriptionAr: "بصفتها حجر الزاوية في محفظة المنتجات الفاخرة، تقدم ماكس مارا حرفية إيطالية لا مثيل لها ودقة خياطة خالدة. إن إدراج دار الأزياء الأسطورية هذه يرفع من مكانة الوجهة في الأسلوب الراقي، حيث تقدم معاطف خارجية متطورة وتفاصيل خياطة حادة للمحترفين المتميزين.",
    backdropUrl: "/brand-pages/page_04.jpg"
  },
  {
    id: "editorial",
    name: "Editorial",
    nameAr: "إيديتوريال",
    headline: "Distinctly Curated, Avant-Garde Perspectives for Unique Self-Expression",
    headlineAr: "منظور طليعي ومنسق للتعبير الفريد عن الذات",
    description: "Serving as the creative heart of the retail mix, Editorial brings a distinctly curated, avant-garde perspective to the collective. This brand is featured to provide a fluid space for unique self-expression, blending seasonal statement pieces with refined basics that keep the retail environment dynamic.",
    descriptionAr: "باعتدادها القلب الإبداعي للمزيج التجاري، تقدم إيديتوريال منظوراً طليعياً ومنسقاً بشكل متميز للمجموعة. تم إبراز هذه العلامة التجارية لتوفير مساحة مرنة للتعبير الفريد عن الذات، ومزج القطع الموسمية المميزة مع الأساسيات الراقية التي تحافظ على ديناميكية بيئة البيع بالتجزئة.",
    backdropUrl: "/brand-pages/page_06.jpg"
  },
  {
    id: "paul-shark",
    name: "Paul & Shark",
    nameAr: "بول آند شارك",
    headline: "Sophisticated Maritime Heritage & Technical European Sportswear",
    headlineAr: "تراث بحري متطور وملابس رياضية أوروبية ذات أداء تقني",
    description: "Reflecting a dedication to premium technical performance and classic European style, Paul & Shark brings a sophisticated maritime heritage to the sportswear lineup. The brand enhances the collection with its weather-resistant fabrics and elegant smart-casual attire, catering to those who value both utility and luxury.",
    descriptionAr: "يعكس بول آند شارك تفانياً في الأداء التقني المتميز والأسلوب الأوروبي الكلاسيكي، ويضفي تراثاً بحرياً متطوراً على تشكيلة الملابس الرياضية. تعزز العلامة التجارية المجموعة بأقمشتها المقاومة للعوامل الجوية وملابسها الأنيقة غير الرسمية، لتلبي احتياجات أولئك الذين يقدرون الفائدة والفخامة معاً.",
    backdropUrl: "/brand-pages/page_08.jpg"
  },
  {
    id: "sandro",
    name: "Sandro",
    nameAr: "ساندرو",
    headline: "Effortless Parisian Refinement & Contemporary Elegance",
    headlineAr: "الرقي الباريسي العفوي والأناقة المعاصرة ذات الطابع المتفرد",
    description: "Embodying the definitive spirit of effortless Parisian refinement, Sandro adds a layer of contemporary elegance with a sharp, non-conformist edge. The label introduces a perfect balance of fluid femininity and structured tailoring, presenting versatile wardrobe staples for a highly fashion-literate audience.",
    descriptionAr: "تجسد ساندرو الروح المحددة للأناقة الباريسية العفوية، وتضيف طبقة من الأناقة المعاصرة ذات طابع متفرد. تقدم العلامة توازناً مثالياً بين الأنوثة الانسيابية والخياطة المنظمة، وتقدم قطع خزانة ملابس متعددة الاستخدامات لجمهور ذواق للموضة.",
    backdropUrl: "/brand-pages/page_12.jpg"
  },
  {
    id: "moje",
    name: "Moje",
    nameAr: "موهي",
    headline: "Understated Creativity, Unique Textures & Independent Design",
    headlineAr: "إبداع متفرد، قوام نسيجي فريد، وتصاميم مستقلة تعكس شخصيتك",
    description: "Completing the curation with an artistic, individualistic touch, moje represents the commitment to independent design and understated creativity. The brand introduces unique textures, fluid forms, and thoughtful color palettes that offer visitors a highly personalized and versatile alternative to mainstream fashion.",
    descriptionAr: "استكمالاً للمجموعة بلمسة فنية وفردية، تمثل موهي الالتزام بالتصميم المستقل والإبداع البسيط. تقدم العلامة التجارية قواماً فريداً، وأشكالاً انسيابية، ولوحات ألوان مدروسة توفر للزوار بديلاً شخصياً للغاية ومتعدد الاستخدامات للموضة السائدة.",
    backdropUrl: "/brand-pages/page_11.jpg"
  },
 
  {
    id: "elie-saab",
    name: "Elie Saab",
    nameAr: "إيلي صعب",
    headline: "Romantic Glamour & Breathtaking Haute Couture",
    headlineAr: "بريق رومانسي وأزياء راقية تحبس الأنفاس",
    description: "Founded in 1982 by a self-taught fashion prodigy in Beirut, Elie Saab represents the peak of modern luxury and romantic glamour. The brand gained international renown for its breathtaking haute couture gowns, famous for intricate hand embroidery, luxurious fabrics, and a flawless understanding of the female silhouette. Seamlessly bridging Eastern opulence and Western elegance, the house has expanded into sophisticated ready-to-wear collections, accessories, and iconic fragrances. It remains a premier choice for royalty and red-carpet tastemakers looking to make an unforgettable statement.",
    descriptionAr: "تأسست إيلي صعب في بيروت عام 1982 على يد معجزة تصميم علم نفسه بنفسه، وهي تمثل قمة الفخامة الحديثة والبريق الرومانسي. اكتسبت العلامة التجارية شهرة دولية لفساتين الأزياء الراقية التي تحبس الأنفاس، وتشتهر بالتطريز اليدوي المعقد، والأقمشة الفاخرة، والفهم الخالي من العيوب للصورة الظلية الأنثوية. ومن خلال سد الفجوة بسلاسة بين الفخامة الشرقية والأناقة الغربية، توسعت الدار في مجموعات الملابس الجاهزة المتطورة والإكسسوارات والعطور المميزة. وتظل الخيار الأمثل للملوك وصناع الموضة على السجادة الحمراء الذين يتطلعون إلى ترك بصمة لا تنسى.",
    backdropUrl: "/brand-pages/page_04.jpg"
  },
  {
    id: "gucci",
    name: "Gucci",
    nameAr: "غوتشي",
    headline: "Bold Creative Expression & Italian Leather Craftsmanship",
    headlineAr: "تعبير إبداعي جريء وحرفية جلدية إيطالية عريقة",
    description: "Established in Florence in 1921 by Guccio Gucci, this legendary Italian fashion house has spent more than a century redefining global luxury. Beginning as a boutique leather goods workshop inspired by equestrian design, the brand has evolved into a powerhouse of bold creative expression and fine craftsmanship. Fusing its historic Tuscan heritage with modern style, the collections showcase timeless pieces alongside contemporary, high-fashion statements. Today, the label continues to lead global fashion conversations through distinct leather goods, visionary apparel, and memorable design icons.",
    descriptionAr: "تأسست دار الأزياء الإيطالية الأسطورية غوتشي في فلورنسا عام 1921 على يد غوتشيو غوتشي، وقد أمضت أكثر من قرن في إعادة تعريف الفخامة العالمية. بدأت العلامة التجارية كورشة عمل لإنتاج المنتجات الجلدية الفاخرة المستوحاة من تصميم الفروسية، وتطورت لتصبح قوة للتعبير الإبداعي الجريء والحرفية العالية. من خلال دمج تراثها التوسكاني التاريخي مع الأسلوب المعاصر، تعرض المجموعات قطعاً خالدة إلى جانب تصاميم الموضة الحديثة والراقية. واليوم، تستمر العلامة في قيادة حوارات الموضة العالمية من خلال سلع جلدية متميزة وملابس ذات رؤية فريدة ورموز تصميم لا تنسى.",
    backdropUrl: "/brand-pages/page_06.jpg"
  },
  {
    id: "jimmy-choo",
    name: "Jimmy Choo",
    nameAr: "جيمي تشو",
    headline: "Modern Glamour & Fine Footwear Artistry",
    headlineAr: "بريق معاصر وفن أحذية راقٍ يعبر عن شخصيتك",
    description: "Originating in 1996 from a bespoke shoemaking atelier in East London, Jimmy Choo has grown into a leading luxury accessories house celebrated for its sense of modern glamour. With creative direction guided by Sandra Choi, the brand blends imaginative design with fine artisanal craftsmanship, producing most of its collections in the premier footwear regions of Florence, Italy. The label delivers confidence and sophisticated style through footwear, handbags, eyewear, and fragrances. Its distinct look has secured a permanent place in red-carpet style and contemporary pop culture.",
    descriptionAr: "نشأت جيمي تشو عام 1996 من مشغل لصناعة الأحذية المفصلة حسب الطلب في شرق لندن، ونمت لتصبح داراً رائدة للإكسسوارات الفاخرة المشهورة ببريقها المعاصر. مع توجيه إبداعي بقيادة ساندرا تشوي، تمزج العلامة التجارية بين التصميم الخيالي والحرفية الفنية الراقية، حيث تنتج معظم مجموعاتها في مناطق الأحذية الأولى بفلورنسا الإيطالية. وتقدم الدار الثقة والأسلوب الراقي من خلال الأحذية والحقائب والنظارات والعطور. وقد أمن مظهرها المتميز مكاناً دائماً في أسلوب السجادة الحمراء والثقافة الشعبية المعاصرة.",
    backdropUrl: "/brand-pages/page_10.jpg"
  },
  {
    id: "hugo-boss",
    name: "Hugo Boss",
    nameAr: "هوغو بوس",
    headline: "Refined Tailoring & Sharp Structured Elegance",
    headlineAr: "خياطة رفيعة وأناقة منظمة وحادة تناسب تطلعاتك",
    description: "With a history stretching back to 1924 in Germany, Hugo Boss stands as a global symbol of refined tailoring, sharp style, and effortless dressing. Best known for perfecting the classic suit, the brand has successfully expanded into an all-encompassing lifestyle brand offering pristine menswear, chic womenswear, and premium fragrances. The collections focus on exceptional cuts, high-quality materials, and clean design to provide wardrobe staples that balance professionalism with modern casual style. It remains the destination for individuals who appreciate sharp lines and structured elegance.",
    descriptionAr: "تأسست هوغو بوس عام 1924 في ألمانيا، وتقف كرمز عالمي للخياطة الرفيعة والأسلوب الأنيق والملابس العفوية. تشتهر العلامة التجارية بإتقانها البدلة الكلاسيكية، وقد توسعت بنجاح لتصبح علامة تجارية متكاملة لأسلوب الحياة تقدم ملابس رجالية نقية وملابس نسائية أنيقة وعطوراً فاخرة. تركز المجموعات على قصات استثنائية ومواد عالية الجودة وتصميم نظيف لتوفر أساسيات خزانة الملابس التي توازن بين الاحترافية والأسلوب الكاجوال المعاصر. وتظل وجهة للأفراد الذين يقدرون الخطوط الحادة والأناقة المنظمة.",
    backdropUrl: "/brand-pages/page_08.jpg"
  },
  {
    id: "giorgio-armani",
    name: "Giorgio Armani",
    nameAr: "جورجيو أرماني",
    headline: "Understated Elegance & Relaxed Luxury Tailoring",
    headlineAr: "أناقة هادئة وخياطة فاخرة ومريحة تعبر عن الثقة",
    description: "Since its launch in Milan in 1975, Giorgio Armani has stood as a global symbol of understated elegance and clean luxury. The brand changed modern fashion by introducing relaxed, unstructured tailoring that moved away from rigid clothing rules. Known for quiet sophistication, exceptional fabrics, and neutral tones, the fashion house delivers timeless style across high fashion, ready to wear apparel, accessories, and fragrance lines. It appeals directly to individuals who appreciate clean design, minimal ornamentation, and effortless confidence.",
    descriptionAr: "منذ إطلاقها في ميلانو عام 1975، تقف جورجيو أرماني كرمز عالمي للأناقة الهادئة والفخامة النظيفة. غيرت العلامة التجارية الموضة الحديثة من خلال تقديم خياطة مريحة غير منظمة ابتعدت عن قواعد الملابس الصارمة. تشتهر دار الأزياء بالرقي الهادئ والأقمشة الاستثنائية والنغمات المحايدة، وتقدم أسلوباً خالداً عبر الموضة الراقية والملابس الجاهزة والإكسسوارات وخطوط العطور. وهي تروق مباشرة للأفراد الذين يقدرون التصميم النظيف والزخرفة البسيطة والثقة العفوية.",
    backdropUrl: "/brand-pages/page_08.jpg"
  },
  {
    id: "lancome",
    name: "Lancôme",
    nameAr: "لانكوم",
    headline: "Premium Luxury Beauty & Skincare Science",
    headlineAr: "جمال فاخر متكامل وعلم متطور للعناية بالبشرة",
    description: "Founded in 1935 by Armand Petitjean in France, Lancôme has spent nearly a century as a leading name in luxury beauty and skincare. The brand started with a passion for classic French elegance, launching five memorable fragrances before expanding into advanced skincare science and makeup. By blending high quality ingredients with regular cosmetic innovation, the label helps people express their personal beauty at every stage of life. Today, it remains a trusted global choice for premium self care, renowned beauty products, and timeless Parisian style.",
    descriptionAr: "تأسست لانكوم عام 1935 على يد أرماند بيتيتجين في فرنسا، وقد أمضت ما يقرب من قرن كاسم رائد في عالم الجمال والعناية بالبشرة الفاخرة. بدأت العلامة التجارية بشغف بالأناقة الفرنسية الكلاسيكية، حيث أطلقت خمسة عطور لا تنسى قبل أن تتوسع في علم العناية بالبشرة والمكياج المتقدم. من خلال مزج المكونات عالية الجودة مع الابتكار التجميلي المنتظم، تساعد العلامة التجارية الأشخاص على التعبير عن جمالهم الشخصي في كل مرحلة من مراحل الحياة. وهي تظل اليوم خياراً عالمياً موثوقاً للرعاية الذاتية المتميزة والمنتجات التجميلية الشهيرة والأسلوب الباريسي الخالد.",
    backdropUrl: "/brand-pages/page_11.jpg"
  },
  {
    id: "prada",
    name: "Prada",
    nameAr: "برادا",
    headline: "Intellectual Design & Challenging Traditional Style Norms",
    headlineAr: "تصميم فكري وتحدي لمعايير الأسلوب التقليدي",
    description: "Established in Milan in 1921 as a fine leather goods shop, Prada evolved into one of the most influential luxury brands in the world under the creative vision of Miuccia Prada. The brand is celebrated for its intellectual approach to design, often challenging traditional ideas of beauty with unconventional styles and industrial materials like its signature nylon. By mixing art, film, and fashion, the collections offer a distinctive look that balances classic Italian heritage with modern art concepts. It continues to guide global style trends for those who value creative expression and smart design.",
    descriptionAr: "تأسست برادا في ميلانو عام 1921 كمتجر للسلع الجلدية الفاخرة، وتطورت لتصبح واحدة من أكثر العلامات التجارية الفاخرة تأثيراً في العالم تحت الرؤية الإبداعية لميوتشيا برادا. وتشتهر العلامة بنهجها الفكري في التصميم، وغالباً ما تتحدى الأفكار التقليدية للجمال بأساليب غير تقليدية ومواد صناعية مثل النايلون المميز لها. من خلال مزج الفن والسينما والموضة، تقدم المجموعات مظهراً مميزاً يوازن بين التراث الإيطالي الكلاسيكي ومفاهيم الفن الحديث. وتستمر في توجيه اتجاهات الأسلوب العالمي للذين يقدرون التعبير الإبداعي والتصميم الذكي.",
    backdropUrl: "/brand-pages/page_06.jpg"
  },
  {
    id: "valentino",
    name: "Valentino",
    nameAr: "فالنتينو",
    headline: "Romantic Glamour & Grand Italian Style Heritage",
    headlineAr: "بريق رومانسي وتراث إيطالي عريق في التصميم",
    description: "Founded in Rome in 1960 by Valentino Garavani, this storied fashion house represents the peak of romantic glamour and grand Italian style. The brand earned worldwide fame for its dramatic evening gowns, masterful drapery, and the iconic hue known as Valentino Red. Combining classic Roman heritage with contemporary styling, the house offers haute couture, ready to wear fashion, bags, and luxury accessories. The label remains a major presence on international red carpets, appealing to people who love bold romance, striking colors, and classic luxury.",
    descriptionAr: "تأسست فالنتينو في روما عام 1960 على يد فالنتينو غارافاني، وتمثل دار الأزياء العريقة هذه ذروة البريق الرومانسي والأسلوب الإيطالي الكبير. نالت الدار شهرة عالمية لفساتين السهرة الدرامية، والستائر المتقنة، واللون الأيقوني المعروف باسم أحمر فالنتينو. تجمع الدار بين التراث الروماني الكلاسيكي والتصميم المعاصر، وتقدم الهوت كوتور والملابس الجاهزة والحقائب والإكسسوارات الفاخرة. وتظل العلامة حضوراً رئيسياً على السجاد الأحمر الدولي، وتجذب الذين يحبون الرومانسية الجريئة والألوان البارزة والفخامة الكلاسيكية.",
    backdropUrl: "/brand-pages/page_04.jpg"
  },
  {
    id: "ysl",
    name: "Saint Laurent",
    nameAr: "سان لوران",
    headline: "Rebellious Spirit & Sharp Parisian Silhouettes",
    headlineAr: "روح متمردة وصور ظلية باريسية حادة",
    description: "Established in Paris in 1961 by Yves Saint Laurent and Pierre Bergé, YSL is a legendary force that completely reshaped the modern wardrobe. The fashion house famously challenged style norms by introducing Le Smoking, the first tuxedo tailored specifically for women, effectively blending masculine power with feminine grace. The brand maintains its rebellious spirit and edgy attitude through sharp ready to wear lines, iconic leather goods, and a celebrated beauty collection. It continues to inspire individuals who embrace bold styles, sharp silhouettes, and effortless Parisian cool.",
    descriptionAr: "تأسست إيف سان لوران في باريس عام 1961 على يد إيف سان لوران وبيير بيرجيه، وهي قوة أسطورية أعادت تشكيل خزانة الملابس الحديثة بالكامل. اشتهرت دار الأزياء بتحدي معايير الأسلوب من خلال تقديم بدلة التوكسيدو الأولى المصممة خصيصاً للنساء، والتي تمزج بفعالية القوة الذكورية والنعومة الأنثوية. وتحافظ العلامة على روحها المتمردة وموقفها الحاد من خلال خطوط ملابس جاهزة حادة وسلع جلدية أيقونية ومجموعة مستحضرات تجميل شهيرة. وتستمر في إلهام الأفراد الذين يتبنون الأساليب الجريئة والظلال الحادة والأناقة الباريسية العفوية.",
    backdropUrl: "/brand-pages/page_06.jpg"
  },
  {
    id: "cartier",
    name: "Cartier",
    nameAr: "كارتييه",
    headline: "The Jeweler of Kings & Timeless Luxury Watchmaking",
    headlineAr: "مجوهرات الملوك وصناعة الساعات الفاخرة الخالدة",
    description: "Founded in Paris in 1847 by Louis-François Cartier, this legendary house earned its reputation as the jeweler of kings and the king of jewelers. The brand is celebrated worldwide for its incredible mastery of fine jewelry and luxury watchmaking, creating timeless icons like the Santos watch and the Panthère collection. By mixing classic French refinement with bold artistic design, the maison sets the global standard for prestige and elegance. It remains the ultimate choice for those who want to celebrate life's most meaningful milestones with unparalleled luxury.",
    descriptionAr: "تأسست كارتييه في باريس عام 1847 على يد لويس فرانسوا كارتييه، واكتسبت هذه الدار الأسطورية سمعتها كصائغ الملوك وملك الصاغة. وتشتهر الدار في جميع أنحاء العالم ببراعتها المذهلة في المجوهرات الراقية وصناعة الساعات الفاخرة، حيث خلقت رموزاً خالدة مثل ساعة سانتوس ومجموعة بانثير. ومن خلال مزج الرقي الفرنسي الكلاسيكي مع التصميم الفني الجريء، تضع الدار المعيار العالمي للمكانة والأناقة. وتظل الخيار الأمثل للذين يرغبون في الاحتفال بأهم معالم الحياة بفخامة لا مثيل لها.",
    backdropUrl: "/brand-pages/page_11.jpg"
  },
  {
    id: "chloe",
    name: "Chloé",
    nameAr: "كلوي",
    headline: "Romantic Free-Spirited Aesthetic & Effortless Parisian Grace",
    headlineAr: "جمالية رومانسية حرة ورقي باريسي طبيعي",
    description: "Established in Paris in 1952 by Gaby Aghion, Chloé introduced a fresh alternative to the stiff formality of haute couture with its luxury ready to wear clothing. The brand is famous for pioneering a romantic, free spirited aesthetic defined by fluid silhouettes, soft fabrics, and effortless femininity. Combining classic Parisian elegance with a modern bohemian attitude, the fashion house delivers beautiful apparel, sought after handbags, and delicate fragrances. It continues to inspire individuals who value natural grace, youthful energy, and a relaxed approach to high fashion.",
    descriptionAr: "تأسست كلوي في باريس عام 1952 على يد غابي أجيون، وقدمت بديلاً منعشاً للرسمية الصارمة للأزياء الراقية بملابسها الجاهزة الفاخرة. وتشتهر العلامة التجارية بريادتها لجمالية رومانسية حرة تحددها الصور الظلية الانسيابية والأقمشة الناعمة والأنوثة العفوية. ومن خلال الجمع بين الأناقة الباريسية الكلاسيكية والموقف البوهيمي المعاصر، تقدم الدار ملابس جميلة وحقائب يد مرغوبة وعطوراً رقيقة. وتستمر في إلهام الأفراد الذين يقدرون النعومة الطبيعية والطاقة الشبابية والنهج المريح للموضة الراقية.",
    backdropUrl: "/brand-pages/page_12.jpg"
  },
  {
    id: "coach",
    name: "Coach",
    nameAr: "كوتش",
    headline: "Authentic Leather Craftsmanship & Effortless City Style",
    headlineAr: "حرفية جلدية أصيلة وأسلوب حياة مدني متميز",
    description: "Originating in 1941 as a family run workshop in a Manhattan loft, Coach began with a simple mission to craft beautiful leather goods from high quality materials. The brand grew into a premier American fashion house, celebrated for its practical yet stylish designs and exceptional leather craftsmanship. Fusing its historic New York heritage with modern street style, the collections feature iconic bags, ready to wear apparel, and lifestyle accessories. Today, the label remains a global favorite for people who appreciate authentic craftsmanship, durable luxury, and effortless city style.",
    descriptionAr: "نشأت كوتش عام 1941 كورشة عمل تديرها عائلة في علية بمانهاتن، وبدأت بمهمة بسيطة لصناعة سلع جلدية جميلة من مواد عالية الجودة. نمت العلامة التجارية لتصبح دار أزياء أمريكية رائدة تشتهر بتصميماتها العملية والأنيقة وحرفيتها الجلدية الاستثنائية. ومن خلال دمج تراث نيويورك التاريخي مع أسلوب الشارع المعاصر، تتميز المجموعات بحقائب أيقونية وملابس جاهزة وإكسسوارات لأسلوب الحياة. واليوم، تظل العلامة مفضلة عالمياً للذين يقدرون الحرفية الأصيلة والفخامة الدائمة وأسلوب المدينة العفوي.",
    backdropUrl: "/brand-pages/page_10.jpg"
  }
];

export function getBrandById(id: string): Brand | undefined {
  return brands.find((brand) => brand.id === id);
}

export function getAllBrands(): Brand[] {
  return brands.filter((brand) => brand.isActive !== false);
}
