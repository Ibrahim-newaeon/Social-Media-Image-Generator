import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Type, Sparkles, ChevronDown, ChevronUp, Upload, X, Image, Save, Trash2, Plus } from "lucide-react";
import { useState, useRef, type ChangeEvent } from "react";
import type { BrandProfile } from "@/lib/brandProfilesStorage";

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
  savedProfiles: BrandProfile[];
  onSaveProfile: () => void;
  onLoadProfile: (brandName: string) => void;
  onDeleteProfile: (brandName: string) => void;
  onNewProfile: () => void;
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

const TYPOGRAPHY_OPTIONS = [
  { value: "Cormorant Garamond - Ultra-elegant, high contrast, fashion-forward", label: "Cormorant Garamond", description: "Ultra-elegant, high contrast, fashion-forward" },
  { value: "Lora - Balanced serif, calligraphic roots, moderate contrast", label: "Lora", description: "Balanced serif, calligraphic roots, moderate contrast" },
  { value: "Libre Baskerville - Classic traditional serif, strong readability", label: "Libre Baskerville", description: "Classic traditional serif, strong readability" },
  { value: "Crimson Text - Book-style serif, gentle curves, scholarly", label: "Crimson Text", description: "Book-style serif, gentle curves, scholarly" },
  { value: "Cinzel - Roman-inspired capitals, all-caps luxury feel", label: "Cinzel", description: "Roman-inspired capitals, all-caps luxury feel" },
];

const VISUAL_STYLE_OPTIONS = [
  { value: "Minimalist Luxury - Clean white space, muted neutrals, subtle gold accents, refined simplicity", label: "Minimalist Luxury", description: "Clean white space, muted neutrals, subtle gold accents, refined simplicity" },
  { value: "Romantic Editorial - Soft pastels, dreamy overlays, magazine-style layouts, organic textures", label: "Romantic Editorial", description: "Soft pastels, dreamy overlays, magazine-style layouts, organic textures" },
  { value: "Modern Classic - Timeless black & white, structured grids, sophisticated contrast, editorial balance", label: "Modern Classic", description: "Timeless black & white, structured grids, sophisticated contrast, editorial balance" },
  { value: "Botanical Elegance - Delicate florals, sage greens, cream tones, nature-inspired organic elements", label: "Botanical Elegance", description: "Delicate florals, sage greens, cream tones, nature-inspired organic elements" },
  { value: "Parisian Chic - Soft blush & charcoal, vintage-inspired, café aesthetics, European sophistication", label: "Parisian Chic", description: "Soft blush & charcoal, vintage-inspired, café aesthetics, European sophistication" },
];

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
  savedProfiles,
  onSaveProfile,
  onLoadProfile,
  onDeleteProfile,
  onNewProfile,
}: BrandGuidelinesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const canSave = brandStyle.brandName.trim().length > 0;

  const handleChange = (field: keyof BrandStyle, value: string) => {
    onChange({ ...brandStyle, [field]: value });
  };

  const handleClear = () => {
    onChange(getDefaultBrandStyle());
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleNewProfileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onNewProfile();
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
        
        {savedProfiles && savedProfiles.length > 0 && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <Label className="text-sm text-muted-foreground">Saved Profiles:</Label>
            <Select
              value={brandStyle.brandName || ""}
              onValueChange={(value) => onLoadProfile(value)}
              disabled={disabled}
            >
              <SelectTrigger className="w-48" data-testid="select-brand-profile">
                <SelectValue placeholder="Select a profile" />
              </SelectTrigger>
              <SelectContent>
                {savedProfiles.map((profile) => (
                  <SelectItem key={profile.brandName} value={profile.brandName}>
                    {profile.brandName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNewProfileClick}
              disabled={disabled}
              title="New profile"
              data-testid="button-new-profile"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
        
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
              <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/30 rounded-md">
                <p className="font-medium">Logo Specifications:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-1">
                  <li>Position: Bottom-right corner</li>
                  <li>Size: 25% of image width</li>
                  <li>Padding: 3% from edges</li>
                  <li>Format: PNG with transparency recommended</li>
                </ul>
              </div>
              
              {brandStyle.logoDataUrl ? (
                <div className="flex items-center gap-4 p-3 border rounded-md bg-muted/30">
                  <div 
                    className="h-12 w-12 rounded p-1"
                    style={{
                      backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                      backgroundSize: '8px 8px',
                      backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                      backgroundColor: '#fff'
                    }}
                  >
                    <img 
                      src={brandStyle.logoDataUrl} 
                      alt="Brand logo preview" 
                      className="h-full w-full object-contain"
                      data-testid="img-logo-preview"
                    />
                  </div>
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
              <div className="flex gap-2">
                <Input
                  id="brandName"
                  placeholder="e.g., Acme Corp"
                  value={brandStyle.brandName}
                  onChange={(e) => handleChange("brandName", e.target.value)}
                  disabled={disabled}
                  data-testid="input-brand-name"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onSaveProfile}
                  disabled={disabled || !canSave}
                  title="Save profile"
                  data-testid="button-save-profile"
                >
                  <Save className="h-4 w-4" />
                </Button>
                {savedProfiles && savedProfiles.some(p => p.brandName.toLowerCase() === brandStyle.brandName.toLowerCase()) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteProfile(brandStyle.brandName)}
                    disabled={disabled}
                    title="Delete profile"
                    data-testid="button-delete-profile"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Enter a brand name and click save to store this profile for later use
              </p>
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
              <Select
                value={brandStyle.fontStyle}
                onValueChange={(value) => handleChange("fontStyle", value)}
                disabled={disabled}
              >
                <SelectTrigger data-testid="select-font-style">
                  <SelectValue placeholder="Select a typography style" />
                </SelectTrigger>
                <SelectContent>
                  {TYPOGRAPHY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visualStyle" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Visual Style / Aesthetic
              </Label>
              <Select
                value={brandStyle.visualStyle}
                onValueChange={(value) => handleChange("visualStyle", value)}
                disabled={disabled}
              >
                <SelectTrigger data-testid="select-visual-style">
                  <SelectValue placeholder="Select a visual style" />
                </SelectTrigger>
                <SelectContent>
                  {VISUAL_STYLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
