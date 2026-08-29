export interface Brand {
  id: string;
  name: string;
  nameAr: string;
  backdropUrl: string;
  isActive?: boolean;
  headline?: string;
  headlineAr?: string;
  description?: string;
  descriptionAr?: string;
}

export const brands: Brand[] = [
  {
    "id": "adidas",
    "name": "Adidas",
    "nameAr": "أديداس",
    "backdropUrl": "/assets/adidas_bg.jpg",
    "description": "Founded in 1949 in Herzogenaurach, Germany, by Adolf \"Adi\" Dassler, Adidas grew out of a small shoemaking workshop into one of the most recognized sportswear companies in the world. The brand built its early reputation on performance footwear for athletes before expanding into a full lifestyle offering that spans apparel, accessories, and collaborations across sport and street culture. Its three stripe mark remains one of the most identifiable logos in global fashion. It suits shoppers who want performance credibility paired with genuine street relevance."
  },
  {
    "id": "calvin-klein",
    "name": "Calvin Klein",
    "nameAr": "كالفين كلاين",
    "backdropUrl": "/assets/ck_bg.jpg",
    "description": "Founded in 1968 in New York by Calvin Klein and Barry Schwartz, the brand built its identity on clean American minimalism at a time when fashion favored ornamentation. Calvin Klein became known for stripping design back to its essentials, pioneering the designer jeans movement in the 1970s and later becoming a defining name in underwear and fragrance. The label continues to deliver elevated basics and sharp tailoring built around a philosophy of effortless, unfussy style. It appeals to the design conscious individual who wants luxury that never feels loud."
  },
  {
    "id": "skechers",
    "name": "Skechers",
    "nameAr": "سكيتشرز",
    "backdropUrl": "/brand-pages/page_10.jpg",
    "description": "Founded in 1992 in Manhattan Beach, California, by Robert Greenberg, Skechers began as a footwear company focused on making comfort technology accessible without sacrificing style. The brand has since grown into a global name recognized for its cushioning innovations and broad range spanning athletic, casual, and lifestyle footwear. Its approach balances current trends with genuine walkability, a combination that has made it a household name across age groups. It suits shoppers who want comfort that doesn't ask them to compromise on how a shoe looks."
  },
  {
    "id": "maxmara",
    "name": "Max Mara",
    "nameAr": "ماكس مارا",
    "backdropUrl": "/brand-pages/page_04.jpg",
    "description": "Launched in 1969 in Italy as an extension of the Max Mara house, Weekend Max Mara was created to bring the same tailoring rigor to a more relaxed, everyday wardrobe. The line takes the parent brand's heritage and applies it to easy knitwear, breezy dresses, and off duty layers built for daily life, without lowering the standard of construction. Quality remains central even as the mood shifts toward comfort. It suits women who want their casual wardrobe to carry the same craftsmanship as their formal one."
  },
  {
    "id": "editorial",
    "name": "Editorial",
    "nameAr": "إيديتوريال",
    "backdropUrl": "/brand-pages/page_06.jpg",
    "description": "A curated concept rather than a single label, Editorial was created to give the retail environment a rotating, magazine-like point of view on fashion. The space blends seasonal statement pieces with refined basics, changing regularly to keep the offering dynamic rather than static. It functions less like a traditional brand and more like a styled edit, giving shoppers a place to find pieces that feel current without needing to track a single designer's collections. It suits visitors who want the retail experience itself to feel fresh."
  },
  {
    "id": "paul-shark",
    "name": "Paul & Shark",
    "nameAr": "بول آند شارك",
    "backdropUrl": "/brand-pages/page_08.jpg",
    "description": "Founded in 1975 in Genoa, Italy, by Ciro Paone, Paul & Shark grew out of a family textile business into a name synonymous with maritime inspired sportswear. Paone built the brand around technical, weather resistant fabrics paired with the relaxed elegance of Italian coastal style, a combination that became its signature. The collections continue to serve people who move between sport and smart casual settings without wanting to change their aesthetic. It appeals to those who value both performance and refinement in equal measure."
  },
  {
    "id": "sandro",
    "name": "Sandro",
    "nameAr": "ساندرو",
    "backdropUrl": "/brand-pages/page_12.jpg",
    "description": "Founded in 1984 in Paris by Evelyne Chetrite, Sandro began as a small menswear label before growing into one of the defining names in contemporary French fashion under the direction of Chetrite and her sister Judith Milgrom. The brand built its identity on a sharp, non-conformist take on Parisian style, blending structured tailoring with a fluid, easy femininity. Sandro remains a go to for shoppers who want wardrobe staples with a confident edge rather than a purely classic finish. It suits a fashion literate audience that wants Paris without the predictability."
  },
  {
    "id": "moje",
    "name": "Moje",
    "nameAr": "موهي",
    "backdropUrl": "/brand-pages/page_11.jpg"
  },
  {
    "id": "elie-saab",
    "name": "Elie Saab",
    "nameAr": "إيلي صعب",
    "backdropUrl": "/brand-pages/page_04.jpg",
    "description": "Founded in 1982 by a self-taught fashion prodigy in Beirut, Elie Saab represents the peak of modern luxury and romantic glamour. The brand gained international renown for its breathtaking haute couture gowns, famous for intricate hand embroidery, luxurious fabrics, and a flawless understanding of the female silhouette. Seamlessly bridging Eastern opulence and Western elegance, the house has expanded into sophisticated ready-to-wear collections, accessories, and iconic fragrances. It remains a premier choice for royalty and red-carpet tastemakers looking to make an unforgettable statement."
  },
  {
    "id": "gucci",
    "name": "Gucci",
    "nameAr": "غوتشي",
    "backdropUrl": "/brand-pages/page_06.jpg",
    "description": "Established in Florence in 1921 by Guccio Gucci, this legendary Italian fashion house has spent more than a century redefining global luxury. Beginning as a boutique leather goods workshop inspired by equestrian design, the brand has evolved into a powerhouse of bold creative expression and fine craftsmanship. Fusing its historic Tuscan heritage with modern style, the collections showcase timeless pieces alongside contemporary, high-fashion statements. Today, the label continues to lead global fashion conversations through distinct leather goods, visionary apparel, and memorable design icons."
  },
  {
    "id": "jimmy-choo",
    "name": "Jimmy Choo",
    "nameAr": "جيمي تشو",
    "backdropUrl": "/brand-pages/page_10.jpg",
    "description": "Originating in 1996 from a bespoke shoemaking atelier in East London, Jimmy Choo has grown into a leading luxury accessories house celebrated for its sense of modern glamour. With creative direction guided by Sandra Choi, the brand blends imaginative design with fine artisanal craftsmanship, producing most of its collections in the premier footwear regions of Florence, Italy. The label delivers confidence and sophisticated style through footwear, handbags, eyewear, and fragrances. Its distinct look has secured a permanent place in red-carpet style and contemporary pop culture."
  },
  {
    "id": "hugo-boss",
    "name": "Hugo Boss",
    "nameAr": "هوغو بوس",
    "backdropUrl": "/brand-pages/page_08.jpg",
    "description": "With a history stretching back to 1924 in Germany, Hugo Boss stands as a global symbol of refined tailoring, sharp style, and effortless dressing. Best known for perfecting the classic suit, the brand has successfully expanded into an all-encompassing lifestyle brand offering pristine menswear, chic womenswear, and premium fragrances. The collections focus on exceptional cuts, high-quality materials, and clean design to provide wardrobe staples that balance professionalism with modern casual style. It remains the destination for individuals who appreciate sharp lines and structured elegance."
  },
  {
    "id": "giorgio-armani",
    "name": "Giorgio Armani",
    "nameAr": "جورجيو أرماني",
    "backdropUrl": "/brand-pages/page_08.jpg",
    "description": "Since its launch in Milan in 1975, Giorgio Armani has stood as a global symbol of understated elegance and clean luxury. The brand changed modern fashion by introducing relaxed, unstructured tailoring that moved away from rigid clothing rules. Known for quiet sophistication, exceptional fabrics, and neutral tones, the fashion house delivers timeless style across high fashion, ready to wear apparel, accessories, and fragrance lines. It appeals directly to individuals who appreciate clean design, minimal ornamentation, and effortless confidence."
  },
  {
    "id": "lancome",
    "name": "Lancôme",
    "nameAr": "لانكوم",
    "backdropUrl": "/brand-pages/page_11.jpg",
    "description": "Founded in 1935 by Armand Petitjean in France, Lancôme has spent nearly a century as a leading name in luxury beauty and skincare. The brand started with a passion for classic French elegance, launching five memorable fragrances before expanding into advanced skincare science and makeup. By blending high quality ingredients with regular cosmetic innovation, the label helps people express their personal beauty at every stage of life. Today, it remains a trusted global choice for premium self care, renowned beauty products, and timeless Parisian style."
  },
  {
    "id": "prada",
    "name": "Prada",
    "nameAr": "برادا",
    "backdropUrl": "/brand-pages/page_06.jpg",
    "description": "Established in Milan in 1921 as a fine leather goods shop, Prada evolved into one of the most influential luxury brands in the world under the creative vision of Miuccia Prada. The brand is celebrated for its intellectual approach to design, often challenging traditional ideas of beauty with unconventional styles and industrial materials like its signature nylon. By mixing art, film, and fashion, the collections offer a distinctive look that balances classic Italian heritage with modern art concepts. It continues to guide global style trends for those who value creative expression and smart design."
  },
  {
    "id": "valentino",
    "name": "Valentino",
    "nameAr": "فالنتينو",
    "backdropUrl": "/brand-pages/page_04.jpg",
    "description": "Founded in Rome in 1960 by Valentino Garavani, this storied fashion house represents the peak of romantic glamour and grand Italian style. The brand earned worldwide fame for its dramatic evening gowns, masterful drapery, and the iconic hue known as Valentino Red. Combining classic Roman heritage with contemporary styling, the house offers haute couture, ready to wear fashion, bags, and luxury accessories. The label remains a major presence on international red carpets, appealing to people who love bold romance, striking colors, and classic luxury."
  },
  {
    "id": "ysl",
    "name": "Saint Laurent",
    "nameAr": "سان لوران",
    "backdropUrl": "/brand-pages/page_06.jpg",
    "description": "Established in Paris in 1961 by Yves Saint Laurent and Pierre Bergé, YSL is a legendary force that completely reshaped the modern wardrobe. The fashion house famously challenged style norms by introducing Le Smoking, the first tuxedo tailored specifically for women, effectively blending masculine power with feminine grace. The brand maintains its rebellious spirit and edgy attitude through sharp ready to wear lines, iconic leather goods, and a celebrated beauty collection. It continues to inspire individuals who embrace bold styles, sharp silhouettes, and effortless Parisian cool."
  },
  {
    "id": "cartier",
    "name": "Cartier",
    "nameAr": "كارتييه",
    "backdropUrl": "/brand-pages/page_11.jpg",
    "description": "Founded in Paris in 1847 by Louis-François Cartier, this legendary house earned its reputation as the jeweler of kings and the king of jewelers. The brand is celebrated worldwide for its incredible mastery of fine jewelry and luxury watchmaking, creating timeless icons like the Santos watch and the Panthère collection. By mixing classic French refinement with bold artistic design, the maison sets the global standard for prestige and elegance. It remains the ultimate choice for those who want to celebrate life's most meaningful milestones with unparalleled luxury."
  },
  {
    "id": "chloe",
    "name": "Chloé",
    "nameAr": "كلوي",
    "backdropUrl": "/brand-pages/page_12.jpg",
    "description": "Founded in Paris in 1952 by Gaby Aghion, Chloé pioneered a softer, more relaxed interpretation of French luxury fashion. The house became known for romantic silhouettes, feminine detailing, and an effortless sense of elegance. Its fragrances reflect this identity through delicate, modern compositions that emphasize femininity, freshness, and sophistication."
  },
  {
    "id": "coach",
    "name": "Coach",
    "nameAr": "كوتش",
    "backdropUrl": "/brand-pages/page_10.jpg",
    "description": "Originating in 1941 as a family run workshop in a Manhattan loft, Coach began with a simple mission to craft beautiful leather goods from high quality materials. The brand grew into a premier American fashion house, celebrated for its practical yet stylish designs and exceptional leather craftsmanship. Fusing its historic New York heritage with modern street style, the collections feature iconic bags, ready to wear apparel, and lifestyle accessories. Today, the label remains a global favorite for people who appreciate authentic craftsmanship, durable luxury, and effortless city style."
  }
];

export function getBrandById(id: string): Brand | undefined {
  return brands.find((brand) => brand.id === id);
}

export function getAllBrands(): Brand[] {
  return brands.filter((brand) => brand.isActive !== false);
}
