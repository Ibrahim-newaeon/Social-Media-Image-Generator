import { useRef, type ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image, Upload, X, Info } from "lucide-react";

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
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Image className="w-5 h-5 text-emerald-500" />
          </div>
          Logo Watermark
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
            ${settings.url ? "border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20" : "border-muted-foreground/25 hover:border-emerald-400"}
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
              <Select
                value={settings.position}
                onValueChange={(value) => updateSetting("position", value as LogoSettings["position"])}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bottom-right">Bottom-Right</SelectItem>
                  <SelectItem value="bottom-left">Bottom-Left</SelectItem>
                  <SelectItem value="top-right">Top-Right</SelectItem>
                  <SelectItem value="top-left">Top-Left</SelectItem>
                </SelectContent>
              </Select>
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
            <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-xs">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-muted-foreground">
                Logo will be automatically added to all generated images at the selected position.
              </p>
            </div>

            {/* Remove Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
              className="w-full text-destructive hover:text-destructive"
            >
              <X className="w-4 h-4 mr-2" />
              Remove Logo
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
