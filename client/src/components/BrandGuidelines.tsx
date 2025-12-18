import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Palette, Type, Sparkles, ChevronDown, ChevronUp, Upload, X, Image } from "lucide-react";
import { useState, useRef } from "react";

export interface BrandStyle {
  brandName: string;
  primaryColors: string;
  secondaryColors: string;
  fontStyle: string;
  visualStyle: string;
  additionalNotes: string;
  logoDataUrl: string;
}

interface BrandGuidelinesProps {
  brandStyle: BrandStyle;
  onChange: (style: BrandStyle) => void;
  disabled?: boolean;
}

const defaultBrandStyle: BrandStyle = {
  brandName: "",
  primaryColors: "",
  secondaryColors: "",
  fontStyle: "",
  visualStyle: "",
  additionalNotes: "",
  logoDataUrl: "",
};

export function getDefaultBrandStyle(): BrandStyle {
  return { ...defaultBrandStyle };
}

export function formatBrandStyleForPrompt(style: BrandStyle): string {
  const parts: string[] = [];
  
  if (style.brandName) {
    parts.push(`Brand: ${style.brandName}`);
  }
  if (style.primaryColors) {
    parts.push(`Primary colors: ${style.primaryColors}`);
  }
  if (style.secondaryColors) {
    parts.push(`Secondary colors: ${style.secondaryColors}`);
  }
  if (style.fontStyle) {
    parts.push(`Typography style: ${style.fontStyle}`);
  }
  if (style.visualStyle) {
    parts.push(`Visual style: ${style.visualStyle}`);
  }
  if (style.additionalNotes) {
    parts.push(`Additional requirements: ${style.additionalNotes}`);
  }
  
  if (parts.length === 0) return "";
  
  return `[Brand Guidelines: ${parts.join(". ")}] `;
}

export default function BrandGuidelines({
  brandStyle,
  onChange,
  disabled = false,
}: BrandGuidelinesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof BrandStyle, value: string) => {
    onChange({ ...brandStyle, [field]: value });
  };

  const handleClear = () => {
    onChange(getDefaultBrandStyle());
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onChange({ ...brandStyle, logoDataUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    onChange({ ...brandStyle, logoDataUrl: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hasContent = Object.values(brandStyle).some((v) => v.length > 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="h-5 w-5 text-muted-foreground" />
            Brand Style Guidelines
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            {hasContent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={disabled}
                data-testid="button-clear-brand"
              >
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              data-testid="button-toggle-brand"
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
        {!isExpanded && hasContent && (
          <div className="flex items-center gap-3 mt-2">
            {brandStyle.logoDataUrl && (
              <img 
                src={brandStyle.logoDataUrl} 
                alt="Brand logo" 
                className="h-6 w-6 object-contain rounded"
              />
            )}
            <p className="text-sm text-muted-foreground">
              Brand guidelines{brandStyle.logoDataUrl ? " and logo" : ""} will be applied to all generated images
            </p>
          </div>
        )}
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Define your brand's visual identity. These guidelines will be automatically applied to every image generation prompt.
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Brand Logo
              </Label>
              <p className="text-xs text-muted-foreground">
                Your logo will be placed in the bottom-right corner of all generated images (5-8% of image width, with padding).
              </p>
              
              {brandStyle.logoDataUrl ? (
                <div className="flex items-center gap-4 p-3 border rounded-md bg-muted/30">
                  <img 
                    src={brandStyle.logoDataUrl} 
                    alt="Brand logo preview" 
                    className="h-12 w-12 object-contain rounded bg-white p-1"
                    data-testid="img-logo-preview"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Logo uploaded</p>
                    <p className="text-xs text-muted-foreground">Will appear on all generated images</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveLogo}
                    disabled={disabled}
                    data-testid="button-remove-logo"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-md cursor-pointer hover-elevate"
                  onClick={() => !disabled && fileInputRef.current?.click()}
                  data-testid="div-logo-upload"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload your logo</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, or SVG recommended</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                disabled={disabled}
                data-testid="input-logo-file"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandName">Brand Name</Label>
              <Input
                id="brandName"
                placeholder="e.g., Acme Corp"
                value={brandStyle.brandName}
                onChange={(e) => handleChange("brandName", e.target.value)}
                disabled={disabled}
                data-testid="input-brand-name"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColors" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Primary Colors
                </Label>
                <Input
                  id="primaryColors"
                  placeholder="e.g., Deep blue (#1a365d), White"
                  value={brandStyle.primaryColors}
                  onChange={(e) => handleChange("primaryColors", e.target.value)}
                  disabled={disabled}
                  data-testid="input-primary-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColors" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Secondary Colors
                </Label>
                <Input
                  id="secondaryColors"
                  placeholder="e.g., Gold accents, Light gray"
                  value={brandStyle.secondaryColors}
                  onChange={(e) => handleChange("secondaryColors", e.target.value)}
                  disabled={disabled}
                  data-testid="input-secondary-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontStyle" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Typography / Font Style
              </Label>
              <Input
                id="fontStyle"
                placeholder="e.g., Modern sans-serif, clean and minimal"
                value={brandStyle.fontStyle}
                onChange={(e) => handleChange("fontStyle", e.target.value)}
                disabled={disabled}
                data-testid="input-font-style"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visualStyle" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Visual Style / Aesthetic
              </Label>
              <Textarea
                id="visualStyle"
                placeholder="e.g., Professional, corporate, tech-forward with clean lines and subtle gradients"
                value={brandStyle.visualStyle}
                onChange={(e) => handleChange("visualStyle", e.target.value)}
                disabled={disabled}
                className="resize-none"
                rows={2}
                data-testid="input-visual-style"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                placeholder="e.g., Always include subtle geometric patterns, avoid cluttered compositions"
                value={brandStyle.additionalNotes}
                onChange={(e) => handleChange("additionalNotes", e.target.value)}
                disabled={disabled}
                className="resize-none"
                rows={2}
                data-testid="input-additional-notes"
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
