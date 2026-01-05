import { useRef, type ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Image, Upload, X, Info } from "lucide-react";

const POSITION_OPTIONS = [
  { value: "bottom-right", label: "Bottom-Right" },
  { value: "bottom-left", label: "Bottom-Left" },
  { value: "top-right", label: "Top-Right" },
  { value: "top-left", label: "Top-Left" },
];

export interface LogoSettings {
  url: string;
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  size: number;
  opacity: number;
}

interface LogoUploaderProps {
  settings: LogoSettings;
  onChange: (settings: LogoSettings) => void;
  disabled?: boolean;
}

export function getDefaultLogoSettings(): LogoSettings {
  return {
    url: "",
    position: "bottom-right",
    size: 25,
    opacity: 80,
  };
}

export default function LogoUploader({
  settings,
  onChange,
  disabled = false,
}: LogoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      onChange({ ...settings, url });
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange({ ...settings, url: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const updateSetting = <K extends keyof LogoSettings>(key: K, value: LogoSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Image className="h-4 w-4 text-primary" />
          <span className="text-primary">Business Logo</span>
        </CardTitle>
        {!settings.url && (
          <p className="text-xs text-muted-foreground mt-1">Add logo to generated images</p>
        )}
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-2 space-y-4">
        {/* Upload Area */}
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all
            ${settings.url ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/50"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {settings.url ? (
            <div className="space-y-3">
              <div
                className="mx-auto w-24 h-24 rounded-lg p-2 flex items-center justify-center"
                style={{
                  backgroundImage: "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                  backgroundSize: "8px 8px",
                  backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                  backgroundColor: "#fff",
                }}
              >
                <img
                  src={settings.url}
                  alt="Logo preview"
                  className="max-w-full max-h-full object-contain"
                  style={{ opacity: settings.opacity / 100 }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Click to replace</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-10 h-10 mx-auto text-muted-foreground/50" />
              <p className="font-medium text-sm">Drop your logo here</p>
              <p className="text-xs text-muted-foreground">or click to upload</p>
              <p className="text-xs text-muted-foreground/70">PNG with transparency recommended</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />
        </div>

        {/* Settings (only show if logo uploaded) */}
        {settings.url && (
          <>
            {/* Position */}
            <div className="space-y-2">
              <Label className="text-xs">Position</Label>
              <Input
                list="position-options"
                value={POSITION_OPTIONS.find(o => o.value === settings.position)?.label || settings.position}
                onChange={(e) => {
                  const val = e.target.value;
                  const option = POSITION_OPTIONS.find(o => o.label === val || o.value === val);
                  if (option) {
                    updateSetting("position", option.value as LogoSettings["position"]);
                  }
                }}
                disabled={disabled}
                className="h-9 text-sm"
              />
              <datalist id="position-options">
                {POSITION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.label} />
                ))}
              </datalist>
            </div>

            {/* Size */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Size</Label>
                <span className="text-xs text-muted-foreground">{settings.size}%</span>
              </div>
              <Slider
                value={[settings.size]}
                onValueChange={([value]) => updateSetting("size", value)}
                min={10}
                max={50}
                step={5}
                disabled={disabled}
              />
            </div>

            {/* Opacity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Opacity</Label>
                <span className="text-xs text-muted-foreground">{settings.opacity}%</span>
              </div>
              <Slider
                value={[settings.opacity]}
                onValueChange={([value]) => updateSetting("opacity", value)}
                min={20}
                max={100}
                step={10}
                disabled={disabled}
              />
            </div>

            {/* Info */}
            <div className="flex items-start gap-2 p-2 rounded-md bg-muted/50 text-xs">
              <Info className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-muted-foreground">
                Logo will be added to all generated images.
              </p>
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="w-3 h-3 mr-2" />
              Remove Logo
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
