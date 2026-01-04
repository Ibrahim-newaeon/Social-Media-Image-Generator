import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Trash2, Sparkles, Loader2 } from "lucide-react";
import type { BrandStyle } from "./BrandGuidelines";

interface PromptInputProps {
  prompts: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  brandStyle?: BrandStyle;
}

export default function PromptInput({ prompts, onChange, disabled = false, brandStyle }: PromptInputProps) {
  const [lineCount, setLineCount] = useState(0);
  const [charStats, setCharStats] = useState({ total: 0, avg: 0 });
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  useEffect(() => {
    const lines = prompts.split('\n').filter(line => line.trim().length > 0);
    setLineCount(lines.length);
    
    const totalChars = lines.reduce((sum, line) => sum + line.trim().length, 0);
    const avgChars = lines.length > 0 ? Math.round(totalChars / lines.length) : 0;
    setCharStats({ total: totalChars, avg: avgChars });
  }, [prompts]);

  const handleClear = () => {
    onChange('');
  };

  const loadSamplePrompts = async () => {
    // If no brand guidelines are set, use default samples
    const hasBrandInfo = brandStyle && (
      brandStyle.brandName ||
      brandStyle.primaryColors ||
      brandStyle.visualStyle ||
      brandStyle.targetAudience
    );

    if (!hasBrandInfo) {
      const defaultPrompts = `Professional product photography of a luxury skincare item on marble surface with soft natural lighting and minimal aesthetic.
Lifestyle flat lay featuring beauty products arranged artistically with fresh flowers and natural textures, warm golden hour light.
Clean minimalist product shot with geometric shadows, neutral background, and elegant composition for social media.
Behind-the-scenes creative workspace with products, mood boards, and design elements showing brand personality.
Seasonal promotional image with festive elements and warm inviting atmosphere perfect for holiday marketing.
Close-up texture shot highlighting product quality and craftsmanship with dramatic studio lighting.
Lifestyle scene showing product in use, natural setting, authentic and relatable moment for target audience.
Bold colorful composition with dynamic angles and contemporary styling for attention-grabbing social posts.
Serene wellness-focused imagery with calming colors, natural materials, and peaceful atmosphere.
Premium unboxing experience shot with elegant packaging, tissue paper, and anticipation-building composition.`;
      onChange(defaultPrompts);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch("/api/suggest-prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandStyle: {
            brandName: brandStyle.brandName,
            primaryColors: brandStyle.primaryColors,
            secondaryColors: brandStyle.secondaryColors,
            fontStyle: brandStyle.fontStyle,
            visualStyle: brandStyle.visualStyle,
            additionalNotes: brandStyle.additionalNotes,
            targetAudience: brandStyle.targetAudience,
          },
          count: 10,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate suggestions");
      }

      const data = await response.json();
      if (data.prompts && Array.isArray(data.prompts)) {
        onChange(data.prompts.join("\n"));
      }
    } catch (error) {
      console.error("Error loading suggestions:", error);
      // Fallback to default prompts on error
      const fallbackPrompts = `Professional product photography with brand colors, clean composition, and premium feel.
Lifestyle imagery featuring target audience, authentic moments, and brand personality.
Creative flat lay with products and complementary props, artistic styling, and cohesive color palette.`;
      onChange(fallbackPrompts);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  return (
    <Card data-testid="card-prompt-input">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            Prompts
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadSamplePrompts}
              disabled={disabled || isLoadingSuggestions}
              data-testid="button-load-sample"
            >
              {isLoadingSuggestions ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Suggest Prompts
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={disabled || !prompts}
              data-testid="button-clear-prompts"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={prompts}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your prompts here (one per line)...

Example:
A luxury skincare product on marble surface
Professional product photography with soft lighting
Elegant serum bottle with rose petals"
          className="min-h-[280px] font-mono text-sm resize-y"
          disabled={disabled}
          data-testid="textarea-prompts"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground flex-wrap gap-2">
          <span data-testid="text-line-count">{lineCount} prompt{lineCount !== 1 ? 's' : ''}</span>
          <div className="flex items-center gap-4 text-xs">
            {lineCount > 0 && (
              <span data-testid="text-char-stats">
                ~{charStats.avg} chars/prompt
              </span>
            )}
            <span>One prompt per line</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
