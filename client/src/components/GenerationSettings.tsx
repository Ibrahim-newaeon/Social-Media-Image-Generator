import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Palette, Users, Image } from "lucide-react";

export interface GenerationSettingsData {
  imagesPerPrompt: number;
  imageSize: string;
  applyBrandColors: boolean;
  applyAudienceRules: boolean;
  applyLogoWatermark: boolean;
}

interface GenerationSettingsProps {
  settings: GenerationSettingsData;
  onChange: (settings: GenerationSettingsData) => void;
  hasLogo: boolean;
  hasAudience: boolean;
  disabled?: boolean;
}

export function getDefaultGenerationSettings(): GenerationSettingsData {
  return {
    imagesPerPrompt: 1,
    imageSize: "1024x1024",
    applyBrandColors: true,
    applyAudienceRules: true,
    applyLogoWatermark: true,
  };
}

export default function GenerationSettings({
  settings,
  onChange,
  hasLogo,
  hasAudience,
  disabled = false,
}: GenerationSettingsProps) {
  const updateSetting = <K extends keyof GenerationSettingsData>(
    key: K,
    value: GenerationSettingsData[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Settings className="w-5 h-5 text-orange-500" />
          </div>
          Generation Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Images Per Prompt */}
        <div className="space-y-2">
          <Label className="text-sm">Images per prompt</Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => updateSetting("imagesPerPrompt", num)}
                disabled={disabled}
                className={`flex-1 py-2.5 rounded-lg border font-medium transition-all ${
                  settings.imagesPerPrompt === num
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 hover:bg-muted border-transparent"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Image Size */}
        <div className="space-y-2">
          <Label className="text-sm">Image size</Label>
          <Select
            value={settings.imageSize}
            onValueChange={(value) => updateSetting("imageSize", value)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1024x1024">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border rounded" />
                  1024×1024 (Square - Instagram)
                </div>
              </SelectItem>
              <SelectItem value="1024x1792">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-5 border rounded" />
                  1024×1792 (Portrait - Story)
                </div>
              </SelectItem>
              <SelectItem value="1792x1024">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-3 border rounded" />
                  1792×1024 (Landscape - Banner)
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-violet-500" />
              <Label htmlFor="brandColors" className="text-sm cursor-pointer">
                Apply brand colors
              </Label>
            </div>
            <Switch
              id="brandColors"
              checked={settings.applyBrandColors}
              onCheckedChange={(checked) => updateSetting("applyBrandColors", checked)}
              disabled={disabled}
            />
          </div>

          <div className={`flex items-center justify-between p-3 rounded-lg ${hasAudience ? "bg-muted/50" : "bg-muted/30 opacity-60"}`}>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-pink-500" />
              <Label htmlFor="audienceRules" className="text-sm cursor-pointer">
                Apply audience requirements
              </Label>
            </div>
            <Switch
              id="audienceRules"
              checked={settings.applyAudienceRules && hasAudience}
              onCheckedChange={(checked) => updateSetting("applyAudienceRules", checked)}
              disabled={disabled || !hasAudience}
            />
          </div>

          <div className={`flex items-center justify-between p-3 rounded-lg ${hasLogo ? "bg-muted/50" : "bg-muted/30 opacity-60"}`}>
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4 text-emerald-500" />
              <Label htmlFor="logoWatermark" className="text-sm cursor-pointer">
                Add logo watermark
              </Label>
            </div>
            <Switch
              id="logoWatermark"
              checked={settings.applyLogoWatermark && hasLogo}
              onCheckedChange={(checked) => updateSetting("applyLogoWatermark", checked)}
              disabled={disabled || !hasLogo}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
