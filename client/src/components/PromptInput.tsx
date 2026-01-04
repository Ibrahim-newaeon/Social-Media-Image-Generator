import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FileText, Trash2, Sparkles, Loader2, Wand2 } from "lucide-react";
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
  const [showPromptCountDialog, setShowPromptCountDialog] = useState(false);
  const [promptCount, setPromptCount] = useState(10);

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

  const handleSuggestClick = () => {
    setShowPromptCountDialog(true);
  };

  const generateSuggestions = async () => {
    setShowPromptCountDialog(false);

    const hasBrandInfo = brandStyle && (
      brandStyle.brandName ||
      brandStyle.primaryColors ||
      brandStyle.visualStyle ||
      brandStyle.targetAudience
    );

    if (!hasBrandInfo) {
      const templates = [
        "Professional product photography of a luxury skincare item on marble surface with soft natural lighting and minimal aesthetic.",
        "Lifestyle flat lay featuring beauty products arranged artistically with fresh flowers and natural textures, warm golden hour light.",
        "Clean minimalist product shot with geometric shadows, neutral background, and elegant composition for social media.",
        "Behind-the-scenes creative workspace with products, mood boards, and design elements showing brand personality.",
        "Seasonal promotional image with festive elements and warm inviting atmosphere perfect for holiday marketing.",
        "Close-up texture shot highlighting product quality and craftsmanship with dramatic studio lighting.",
        "Lifestyle scene showing product in use, natural setting, authentic and relatable moment for target audience.",
        "Bold colorful composition with dynamic angles and contemporary styling for attention-grabbing social posts.",
        "Serene wellness-focused imagery with calming colors, natural materials, and peaceful atmosphere.",
        "Premium unboxing experience shot with elegant packaging, tissue paper, and anticipation-building composition.",
        "Artistic macro photography showcasing product details and textures with beautiful bokeh background.",
        "Modern studio setup with clean lines, professional lighting, and sophisticated brand presentation.",
        "Outdoor lifestyle photography with natural elements, authentic moments, and aspirational storytelling.",
        "Creative still life arrangement with complementary props and cohesive color palette.",
        "Dynamic action shot capturing product in motion with energy and excitement.",
      ];
      const defaultPrompts = Array.from({ length: promptCount }, (_, i) => templates[i % templates.length]);
      onChange(defaultPrompts.join("\n"));
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
          count: promptCount,
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
      const fallbackPrompts = `Professional product photography with brand colors, clean composition, and premium feel.
Lifestyle imagery featuring target audience, authentic moments, and brand personality.
Creative flat lay with products and complementary props, artistic styling, and cohesive color palette.`;
      onChange(fallbackPrompts);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const promptLines = prompts.split('\n').filter(line => line.trim().length > 0);

  return (
    <>
      <Card className="border-0 shadow-lg" data-testid="card-prompt-input">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span>Image Prompts</span>
                {lineCount > 0 && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({lineCount} prompt{lineCount !== 1 ? 's' : ''})
                  </span>
                )}
              </div>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleSuggestClick}
                disabled={disabled || isLoadingSuggestions}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md"
                data-testid="button-load-sample"
              >
                {isLoadingSuggestions ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    AI Suggest
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={disabled || !prompts}
                className="text-muted-foreground hover:text-destructive"
                data-testid="button-clear-prompts"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {lineCount === 0 ? (
            <div className="border-2 border-dashed rounded-xl p-8 text-center bg-muted/30">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-2">No prompts yet</p>
              <p className="text-sm text-muted-foreground/70 mb-4">
                Click "AI Suggest" to generate prompts based on your brand, or type your own below
              </p>
              <Textarea
                value={prompts}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter your prompts here (one per line)..."
                className="min-h-[120px] font-mono text-sm resize-y bg-background"
                disabled={disabled}
                data-testid="textarea-prompts"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid gap-2 max-h-[400px] overflow-y-auto pr-2">
                {promptLines.map((line, index) => (
                  <div
                    key={index}
                    className="group relative p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-border"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                        {index + 1}
                      </span>
                      <p className="text-sm flex-1 leading-relaxed">{line}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t">
                <Textarea
                  value={prompts}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="Add more prompts or edit existing ones..."
                  className="min-h-[100px] font-mono text-sm resize-y"
                  disabled={disabled}
                  data-testid="textarea-prompts"
                />
              </div>
            </div>
          )}

          {lineCount > 0 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Ready to generate
              </span>
              <span className="text-xs">~{charStats.avg} chars per prompt</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showPromptCountDialog} onOpenChange={setShowPromptCountDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-primary" />
              Generate AI Prompts
            </DialogTitle>
            <DialogDescription>
              How many image prompts would you like to generate based on your brand guidelines?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="promptCount">Number of prompts</Label>
              <Input
                id="promptCount"
                type="number"
                min={1}
                max={20}
                value={promptCount}
                onChange={(e) => setPromptCount(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                className="text-lg font-medium"
              />
              <p className="text-xs text-muted-foreground">
                Enter a number between 1 and 20
              </p>
            </div>

            {brandStyle && (brandStyle.brandName || brandStyle.targetAudience) && (
              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <p className="font-medium mb-1">Prompts will be tailored for:</p>
                {brandStyle.brandName && (
                  <p className="text-muted-foreground">Brand: {brandStyle.brandName}</p>
                )}
                {brandStyle.targetAudience && (
                  <p className="text-muted-foreground">Audience: {brandStyle.targetAudience}</p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPromptCountDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={generateSuggestions}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate {promptCount} Prompts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
