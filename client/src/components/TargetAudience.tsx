import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useState } from "react";

export interface TargetAudienceData {
  targetGender: string;
  targetAgeRange: string;
  targetAudienceDescription: string;
  selectedAudienceProfileId: string;
  audiencePromptInsert: string;
}

interface TargetAudienceProps {
  data: TargetAudienceData;
  onChange: (data: TargetAudienceData) => void;
  disabled?: boolean;
}

interface ReadyProfile {
  id: string;
  name_en: string;
  name_ar: string;
  age_range: string;
  market: string;
  demographics_en: string;
  demographics_ar: string;
  style_en: string;
  style_ar: string;
  visual_requirements_en: string;
  visual_requirements_ar: string;
  prompt_insert: string;
}

const READY_AUDIENCE_PROFILES: ReadyProfile[] = [
  {
    id: "FUR_KW_01",
    name_en: "Kuwaiti Modern Families",
    name_ar: "العائلات الكويتية العصرية",
    age_range: "30-45",
    market: "Kuwait",
    demographics_en: "Families with 2-4 children, mid-high income (KD 1,500-3,500/month), modern apartments and mid-size villas",
    demographics_ar: "عائلات لديها 2-4 أطفال، دخل متوسط-عالي (1,500-3,500 د.ك شهرياً)، شقق عصرية وفلل متوسطة الحجم",
    style_en: "Contemporary with Arabic touches",
    style_ar: "عصري مع لمسات عربية",
    visual_requirements_en: "Family-friendly room setups, bright natural lighting, neutral warm colors, Arabic text primary + English, no human figures, majlis-style seating, kid-safe furniture, Kuwait Dinar pricing",
    visual_requirements_ar: "غرف مناسبة للعائلات، إضاءة طبيعية ساطعة، ألوان محايدة دافئة، نص عربي أساسي + إنجليزي، بدون صور بشرية، جلسات على طراز المجلس، أثاث آمن للأطفال، أسعار بالدينار الكويتي",
    prompt_insert: "SETTING: Modern Kuwaiti family living room, bright natural daylight. STYLING: Family-friendly with organized toy storage, geometric Arabic cushions, brass coffee table. COLORS: Neutral beiges, soft greys, warm whites, gold accents. CULTURAL: Majlis-style low seating visible, Arabic wall art, no human figures. TEXT: Arabic primary with English subtitle, KD pricing. AVOID: Alcohol, pets on furniture, shoes visible, overly minimalist cold spaces."
  },
  {
    id: "FUR_KW_02",
    name_en: "Kuwaiti Luxury Homeowners",
    name_ar: "أصحاب المنازل الفاخرة الكويتية",
    age_range: "35-55",
    market: "Kuwait",
    demographics_en: "Established families, luxury villas and penthouses, high income (KD 4,000+/month)",
    demographics_ar: "عائلات راسخة، فلل فاخرة وبنتهاوس، دخل عالي (4,000+ د.ك شهرياً)",
    style_en: "High-end European with Arabic elegance",
    style_ar: "أوروبي راقي مع أناقة عربية",
    visual_requirements_en: "Luxury villa interiors, premium materials (marble, brass, crystal), champagne gold and navy colors, traditional calligraphy art, bilingual text, no human presence, symmetrical composition",
    visual_requirements_ar: "تصميمات داخلية للفلل الفاخرة، مواد فاخرة (رخام، نحاس، كريستال)، ألوان ذهبي شامبانيا وأزرق داكن، فن الخط التقليدي، نص ثنائي اللغة، بدون حضور بشري، تكوين متماثل",
    prompt_insert: "SETTING: Luxury Kuwait villa, double-height ceilings, marble floors. STYLING: Premium Italian marble, brass inlays, crystal chandeliers, designer vases, fresh orchids. COLORS: Champagne gold, deep navy, ivory, charcoal, rose gold. CULTURAL: Arabic calligraphy art, Islamic geometric patterns subtle, no humans. TEXT: Bilingual Arabic-English, highlight European brands, premium materials. COMPOSITION: Symmetrical, 40% negative space, low angle for grandeur. AVOID: Budget materials, clutter, plastic, pop culture."
  },
  {
    id: "FUR_SA_01",
    name_en: "Saudi Young Professionals",
    name_ar: "الشباب المحترفون السعوديون",
    age_range: "25-38",
    market: "Saudi Arabia",
    demographics_en: "Newly married couples, 0-2 young children, modern apartments, mid-range income (SAR 8,000-15,000/month)",
    demographics_ar: "أزواج حديثو الزواج، 0-2 طفل صغير، شقق عصرية، دخل متوسط (8,000-15,000 ريال سعودي شهرياً)",
    style_en: "Scandinavian-modern minimalist",
    style_ar: "إسكندنافي-عصري بسيط",
    visual_requirements_en: "Compact modern apartments, multi-functional furniture, smart storage, clean whites and light woods, prayer corner visible, Arabic primary text, space-saving highlighted",
    visual_requirements_ar: "شقق عصرية مدمجة، أثاث متعدد الوظائف، تخزين ذكي، أبيض نظيف وخشب فاتح، ركن صلاة مرئي، نص عربي أساسي، تسليط الضوء على توفير المساحة",
    prompt_insert: "SETTING: Compact modern Saudi apartment, bright open plan, efficient space. STYLING: Multi-functional furniture, smart storage solutions, tech-integrated. COLORS: Clean whites, light woods, soft pastels, mint green, dusty rose. CULTURAL: Prayer corner space visible, Quran stand area, modest home office. TEXT: Arabic primary modern fonts, highlight space-saving. COMPOSITION: Clean lines, 35% negative space, minimal clutter. AVOID: Heavy dark woods, ornate traditional, large bulky, dated styles."
  },
  {
    id: "FUR_SA_02",
    name_en: "Saudi Traditional Families",
    name_ar: "العائلات السعودية التقليدية",
    age_range: "40-60",
    market: "Saudi Arabia",
    demographics_en: "Large families (4-8 members), traditional villas, mid-high income (SAR 12,000-25,000/month), heritage preference",
    demographics_ar: "عائلات كبيرة (4-8 أفراد)، فلل تقليدية، دخل متوسط-عالي (12,000-25,000 ريال سعودي شهرياً)، تفضيل تراثي",
    style_en: "Classic Arabic heritage-inspired",
    style_ar: "كلاسيكي عربي مستوحى من التراث",
    visual_requirements_en: "Traditional majlis, floor seating, rich textiles, deep burgundy and gold colors, dallah coffee pots, Arabic calligraphy, absolutely no human figures, symmetrical formal arrangements, classical Arabic script",
    visual_requirements_ar: "مجلس تقليدي، جلوس أرضي، أقمشة غنية، ألوان عنابي عميق وذهبي، دلال قهوة، خط عربي، بدون صور بشرية مطلقاً، ترتيبات رسمية متماثلة، خط عربي كلاسيكي",
    prompt_insert: "SETTING: Traditional Saudi majlis, rich warm interior, patterned carpet, formal symmetry. STYLING: Floor seating, traditional Arabic furniture, rich layered textiles, formal reception. COLORS: Deep burgundy, antique gold, forest green, warm browns, cream. CULTURAL: Majlis floor cushions, brass dallah, Arabic calligraphy frames, geometric rugs, prayer rugs nearby. TEXT: Classical Arabic script primary. COMPOSITION: Centered symmetry, 25% negative space, rich abundant. LIGHTING: Warm golden ambient. AVOID: Modern minimalist, bright neon, Western contemporary, mixed-gender casual."
  },
  {
    id: "FUR_QA_01",
    name_en: "Qatari Luxury Collectors",
    name_ar: "جامعو الأثاث الفاخر القطري",
    age_range: "35-50",
    market: "Qatar",
    demographics_en: "Wealthy established families, luxury villas/palaces, very high income (QAR 40,000+/month), designer furniture collectors",
    demographics_ar: "عائلات ثرية راسخة، فلل/قصور فاخرة، دخل عالٍ جداً (40,000+ ريال قطري شهرياً)، جامعو الأثاث المصمم",
    style_en: "Designer pieces, investment furniture, bespoke",
    style_ar: "قطع مصممة، أثاث استثماري، حسب الطلب",
    visual_requirements_en: "Museum-quality interiors, designer labels visible, limited edition pieces, sophisticated neutrals, pearl-inspired accents (Qatar heritage), minimal text, gallery presentation, 50%+ negative space",
    visual_requirements_ar: "تصميمات داخلية بجودة المتاحف، علامات المصممين مرئية، قطع محدودة الإصدار، ألوان محايدة راقية، لمسات مستوحاة من اللؤلؤ (تراث قطر)، نص بسيط، عرض معرضي، مساحة سلبية 50%+",
    prompt_insert: "SETTING: Museum-quality Qatar luxury villa, double-height ceiling, palazzo architecture. STYLING: Designer furniture as art, gallery presentation, ultra-premium materials, investment pieces. COLORS: Taupe, stone grey, platinum, black, white gold. CULTURAL: Subtle Islamic geometric brass inlay, pearl-inspired accents (Qatar heritage), museum-quality calligraphy. TEXT: Minimal elegant, Arabic-English equal, brand heritage highlighted. COMPOSITION: 50% negative space, gallery style, perfect symmetry. LIGHTING: Soft museum spotlight. AVOID: Mass-market, plastic, busy patterns, trend-focused."
  }
];

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "All Genders", label: "All Genders" },
];

const AGE_RANGE_OPTIONS = [
  { value: "18-24", label: "18-24" },
  { value: "25-34", label: "25-34" },
  { value: "35-44", label: "35-44" },
  { value: "45-54", label: "45-54" },
  { value: "55+", label: "55+" },
  { value: "All Ages", label: "All Ages" },
];

export default function TargetAudience({
  data,
  onChange,
  disabled = false,
}: TargetAudienceProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (field: keyof TargetAudienceData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleClear = () => {
    onChange({
      targetGender: "",
      targetAgeRange: "",
      targetAudienceDescription: "",
      selectedAudienceProfileId: "",
      audiencePromptInsert: "",
    });
  };

  const handleSelectReadyProfile = (profileId: string) => {
    if (profileId === "custom") {
      onChange({
        ...data,
        selectedAudienceProfileId: "",
        audiencePromptInsert: "",
      });
      return;
    }

    const profile = READY_AUDIENCE_PROFILES.find(p => p.id === profileId);
    if (profile) {
      onChange({
        targetGender: "All Genders",
        targetAgeRange: profile.age_range,
        targetAudienceDescription: `${profile.name_en} | ${profile.name_ar}\n${profile.demographics_en}`,
        selectedAudienceProfileId: profile.id,
        audiencePromptInsert: profile.prompt_insert,
      });
    }
  };

  const selectedProfile = READY_AUDIENCE_PROFILES.find(p => p.id === data.selectedAudienceProfileId);
  const hasContent = data.targetGender || data.targetAgeRange || data.targetAudienceDescription || data.selectedAudienceProfileId;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-muted-foreground" />
              Target Audience
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Saved with your brand profile</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {hasContent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={disabled}
                data-testid="button-clear-audience"
              >
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              data-testid="button-toggle-audience"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Collapse
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Expand
                </>
              )}
            </Button>
          </div>
        </div>
        {!isExpanded && selectedProfile && (
          <p className="text-sm text-muted-foreground mt-2">
            {selectedProfile.name_ar} | {selectedProfile.name_en} ({selectedProfile.age_range})
          </p>
        )}
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Ready Profiles (Furniture E-Commerce)
            </Label>
            <Select
              value={data.selectedAudienceProfileId || "custom"}
              onValueChange={handleSelectReadyProfile}
              disabled={disabled}
            >
              <SelectTrigger data-testid="select-ready-profile">
                <SelectValue placeholder="Choose a ready profile or customize" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom (Manual Entry)</SelectItem>
                {READY_AUDIENCE_PROFILES.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.name_ar} | {profile.name_en} ({profile.age_range})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedProfile && (
              <div className="p-3 bg-muted/50 rounded-md space-y-2 text-sm">
                <p><span className="font-medium">Market:</span> {selectedProfile.market}</p>
                <p><span className="font-medium">Style:</span> {selectedProfile.style_en} | {selectedProfile.style_ar}</p>
                <p className="text-muted-foreground text-xs">{selectedProfile.visual_requirements_en}</p>
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetGender">Gender</Label>
              <Select
                value={data.targetGender}
                onValueChange={(value) => handleChange("targetGender", value)}
                disabled={disabled}
              >
                <SelectTrigger data-testid="select-target-gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAgeRange">Age Range</Label>
              <Select
                value={data.targetAgeRange}
                onValueChange={(value) => handleChange("targetAgeRange", value)}
                disabled={disabled}
              >
                <SelectTrigger data-testid="select-target-age">
                  <SelectValue placeholder="Select age range" />
                </SelectTrigger>
                <SelectContent>
                  {AGE_RANGE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAudienceDescription">Description</Label>
            <Textarea
              id="targetAudienceDescription"
              placeholder="e.g., Health-conscious professionals interested in organic skincare"
              value={data.targetAudienceDescription}
              onChange={(e) => handleChange("targetAudienceDescription", e.target.value)}
              disabled={disabled}
              className="resize-none"
              rows={2}
              data-testid="input-target-audience-description"
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
