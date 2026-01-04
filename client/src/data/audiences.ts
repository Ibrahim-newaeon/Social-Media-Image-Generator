export interface AudienceProfile {
  id: string;
  nameEn: string;
  nameAr: string;
  market: "Kuwait" | "Saudi Arabia" | "Qatar" | "All GCC";
  ageRange: string;
  promptAddition: string;
  requirements: string[];
}

export const audiences: AudienceProfile[] = [
  {
    id: "FUR_KW_01",
    nameEn: "Kuwaiti Modern Families",
    nameAr: "العائلات الكويتية العصرية",
    market: "Kuwait",
    ageRange: "30-45",
    promptAddition: "Target: Kuwaiti families 30-45. Style: Modern contemporary with Arabic touches. Requirements: Family-friendly bright interiors, neutral warm colors, Arabic text primary + English, no humans, majlis elements, kid-safe furniture. Currency: KD.",
    requirements: [
      "Family-friendly room setups",
      "Bright natural lighting",
      "Neutral warm color palette",
      "Arabic text primary + English",
      "No human figures",
      "Majlis-style elements"
    ]
  },
  {
    id: "FUR_KW_02",
    nameEn: "Kuwaiti Luxury Homeowners",
    nameAr: "أصحاب المنازل الفاخرة الكويتية",
    market: "Kuwait",
    ageRange: "35-55",
    promptAddition: "Target: Kuwait luxury villa owners 35-55. Style: High-end European with Arabic elegance. Requirements: Premium materials (marble/brass/crystal), champagne gold & navy palette, traditional calligraphy, symmetrical composition, 40% negative space, no humans, bilingual. Currency: KD.",
    requirements: [
      "Premium materials (marble, brass, crystal)",
      "Champagne gold & navy colors",
      "Traditional Arabic calligraphy art",
      "Symmetrical luxury composition",
      "40% negative space",
      "Bilingual text"
    ]
  },
  {
    id: "FUR_SA_01",
    nameEn: "Saudi Young Professionals",
    nameAr: "الشباب المحترفون السعوديون",
    market: "Saudi Arabia",
    ageRange: "25-38",
    promptAddition: "Target: Saudi young professionals 25-38, newly married. Style: Scandinavian-modern minimalist. Requirements: Compact apartments, multi-functional furniture, clean whites & light woods, prayer corner visible, Arabic primary text, space-saving highlighted, modern lifestyle no humans. Currency: SAR.",
    requirements: [
      "Compact modern apartments",
      "Multi-functional furniture",
      "Clean whites & light woods",
      "Prayer corner visible",
      "Space-saving solutions",
      "Arabic primary text"
    ]
  },
  {
    id: "FUR_SA_02",
    nameEn: "Saudi Traditional Families",
    nameAr: "العائلات السعودية التقليدية",
    market: "Saudi Arabia",
    ageRange: "40-60",
    promptAddition: "Target: Saudi traditional families 40-60, large households. Style: Classic Arabic heritage. Requirements: Traditional majlis floor seating, burgundy & gold textiles, brass dallah, Arabic calligraphy, ABSOLUTELY NO HUMANS, centered symmetry, classical Arabic script, warm golden light. Currency: SAR.",
    requirements: [
      "Traditional majlis floor seating",
      "Burgundy & gold textiles",
      "Brass dallah coffee pots",
      "Arabic calligraphy frames",
      "Absolutely no human figures",
      "Centered symmetrical composition"
    ]
  },
  {
    id: "FUR_QA_01",
    nameEn: "Qatari Luxury Collectors",
    nameAr: "جامعو الأثاث الفاخر القطري",
    market: "Qatar",
    ageRange: "35-50",
    promptAddition: "Target: Qatari luxury collectors 35-50, ultra-high income. Style: Designer investment bespoke. Requirements: Museum-quality interiors, furniture as art, designer labels visible, sophisticated neutrals (taupe/platinum/white gold), pearl-inspired Qatar heritage accents, 50%+ negative space, gallery presentation, minimal elegant text Arabic-English equal. Currency: QAR.",
    requirements: [
      "Museum-quality interiors",
      "Designer furniture as art",
      "Sophisticated neutral palette",
      "Pearl-inspired accents (Qatar heritage)",
      "50%+ negative space",
      "Gallery-style presentation"
    ]
  },
  {
    id: "FUR_QA_02",
    nameEn: "Qatar Expat Professionals",
    nameAr: "المحترفون المغتربون في قطر",
    market: "Qatar",
    ageRange: "28-45",
    promptAddition: "Target: Qatar expat professionals 28-45, rental properties. Style: International modern. Requirements: Contemporary apartments, rental-friendly modular, international neutrals, English primary/Arabic secondary, highlight delivery & assembly, culturally neutral with Arabic location touches. Currency: QAR.",
    requirements: [
      "Contemporary apartments",
      "Rental-friendly modular furniture",
      "International neutral colors",
      "English primary, Arabic secondary",
      "Delivery & assembly highlighted",
      "Culturally neutral design"
    ]
  },
  {
    id: "FUR_GCC_01",
    nameEn: "Gulf Wedding/Newlyweds",
    nameAr: "العرسان الجدد في الخليج",
    market: "All GCC",
    ageRange: "22-32",
    promptAddition: "Target: GCC newlyweds 22-32, first home. Style: Romantic modern. Requirements: Complete coordinated packages, bedroom suites, soft romantic colors (blush/champagne/rose gold), fresh flowers, prayer corner, modest bedroom (no intimate implication), Arabic primary, emphasize package deals & payment plans, wedding gift messaging.",
    requirements: [
      "Complete coordinated home packages",
      "Soft romantic colors (blush, champagne, rose gold)",
      "Fresh flowers styling",
      "Prayer corner consideration",
      "Modest bedroom presentation",
      "Package deals emphasized"
    ]
  },
  {
    id: "FUR_GCC_02",
    nameEn: "Corporate/Office Buyers",
    nameAr: "المشترون المؤسسيون",
    market: "All GCC",
    ageRange: "30-50",
    promptAddition: "Target: B2B corporate buyers 30-50, procurement managers. Style: Professional durable. Requirements: Office environments, ergonomic furniture, corporate neutrals (charcoal/navy/white), tech integration visible, gender-neutral professional, prayer room furniture options, bilingual professional, highlight bulk pricing & warranties, multiple configurations.",
    requirements: [
      "Professional office environments",
      "Ergonomic furniture",
      "Corporate neutral colors",
      "Technology integration",
      "Gender-neutral spaces",
      "Bulk pricing highlighted"
    ]
  }
];
