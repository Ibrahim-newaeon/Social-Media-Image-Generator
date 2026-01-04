import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ImagePlus,
  X,
  Palette,
  Wand2,
  Layout,
  Heart,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Eye
} from "lucide-react";

export interface ReferenceAnalysis {
  colors: string[];
  style: string;
  composition: string;
  mood: string;
  summary: string;
}

export interface ReferenceImageData {
  id: string;
  dataUrl: string;
  name: string;
}

export interface ReferenceSettings {
  images: ReferenceImageData[];
  analyzeColors: boolean;
  analyzeStyle: boolean;
  analyzeComposition: boolean;
  analyzeMood: boolean;
  analysis: ReferenceAnalysis | null;
  isAnalyzed: boolean;
}

interface ReferenceImagesProps {
  data: ReferenceSettings;
  onChange: (data: ReferenceSettings) => void;
  onAnalyze: () => Promise<void>;
  isAnalyzing: boolean;
  disabled?: boolean;
}

const MAX_IMAGES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ReferenceImages({
  data,
  onChange,
  onAnalyze,
  isAnalyzing,
  disabled = false,
}: ReferenceImagesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_IMAGES - data.images.length;
    if (remainingSlots <= 0) return;

    const newImages: ReferenceImageData[] = [];

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i];

      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_FILE_SIZE) continue;

      const dataUrl = await readFileAsDataUrl(file);
      newImages.push({
        id: `ref-${Date.now()}-${i}`,
        dataUrl,
        name: file.name,
      });
    }

    if (newImages.length > 0) {
      onChange({
        ...data,
        images: [...data.images, ...newImages],
        isAnalyzed: false,
        analysis: null,
      });
    }
  };

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (id: string) => {
    onChange({
      ...data,
      images: data.images.filter((img) => img.id !== id),
      isAnalyzed: false,
      analysis: null,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleOptionChange = (field: keyof ReferenceSettings, value: boolean) => {
    onChange({
      ...data,
      [field]: value,
      isAnalyzed: false,
      analysis: null,
    });
  };

  const handleClear = () => {
    onChange({
      images: [],
      analyzeColors: true,
      analyzeStyle: true,
      analyzeComposition: false,
      analyzeMood: true,
      analysis: null,
      isAnalyzed: false,
    });
  };

  const hasImages = data.images.length > 0;
  const hasAnyOption = data.analyzeColors || data.analyzeStyle || data.analyzeComposition || data.analyzeMood;
  const canAnalyze = hasImages && hasAnyOption && !data.isAnalyzed;

  const getSummary = () => {
    if (data.isAnalyzed && data.analysis) {
      return `Analyzed: ${data.analysis.summary.substring(0, 50)}...`;
    }
    if (hasImages) {
      return `${data.images.length} image${data.images.length > 1 ? "s" : ""} uploaded`;
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-5 w-5 text-muted-foreground" />
              Reference Images
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Upload images to match their style
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {hasImages && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={disabled || isAnalyzing}
              >
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
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
        {!isExpanded && getSummary() && (
          <p className="text-sm text-muted-foreground mt-2">{getSummary()}</p>
        )}
        {!isExpanded && data.isAnalyzed && (
          <div className="flex items-center gap-1 mt-1">
            <Sparkles className="h-3 w-3 text-green-500" />
            <span className="text-xs text-green-600">Style analyzed</span>
          </div>
        )}
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            } ${disabled || isAnalyzing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            onClick={() => !disabled && !isAnalyzing && fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
              disabled={disabled || isAnalyzing || data.images.length >= MAX_IMAGES}
            />
            <ImagePlus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {data.images.length >= MAX_IMAGES
                ? "Maximum images reached"
                : "Click or drag images here"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Up to {MAX_IMAGES} images, max 5MB each
            </p>
          </div>

          {/* Image Previews */}
          {hasImages && (
            <div className="grid grid-cols-3 gap-2">
              {data.images.map((img) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.dataUrl}
                    alt={img.name}
                    className="w-full h-20 object-cover rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(img.id)}
                    disabled={disabled || isAnalyzing}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Analysis Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">What to extract:</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="analyzeColors"
                  checked={data.analyzeColors}
                  onCheckedChange={(checked) =>
                    handleOptionChange("analyzeColors", checked as boolean)
                  }
                  disabled={disabled || isAnalyzing}
                />
                <Label
                  htmlFor="analyzeColors"
                  className="text-sm flex items-center gap-1 cursor-pointer"
                >
                  <Palette className="h-3 w-3" />
                  Colors
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="analyzeStyle"
                  checked={data.analyzeStyle}
                  onCheckedChange={(checked) =>
                    handleOptionChange("analyzeStyle", checked as boolean)
                  }
                  disabled={disabled || isAnalyzing}
                />
                <Label
                  htmlFor="analyzeStyle"
                  className="text-sm flex items-center gap-1 cursor-pointer"
                >
                  <Wand2 className="h-3 w-3" />
                  Style
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="analyzeComposition"
                  checked={data.analyzeComposition}
                  onCheckedChange={(checked) =>
                    handleOptionChange("analyzeComposition", checked as boolean)
                  }
                  disabled={disabled || isAnalyzing}
                />
                <Label
                  htmlFor="analyzeComposition"
                  className="text-sm flex items-center gap-1 cursor-pointer"
                >
                  <Layout className="h-3 w-3" />
                  Composition
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="analyzeMood"
                  checked={data.analyzeMood}
                  onCheckedChange={(checked) =>
                    handleOptionChange("analyzeMood", checked as boolean)
                  }
                  disabled={disabled || isAnalyzing}
                />
                <Label
                  htmlFor="analyzeMood"
                  className="text-sm flex items-center gap-1 cursor-pointer"
                >
                  <Heart className="h-3 w-3" />
                  Mood
                </Label>
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          <Button
            onClick={onAnalyze}
            disabled={!canAnalyze || disabled || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : data.isAnalyzed ? (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Re-analyze Images
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze Images
              </>
            )}
          </Button>

          {/* Analysis Results */}
          {data.isAnalyzed && data.analysis && (
            <div className="p-3 bg-muted/50 rounded-md space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Extracted style (applies to all prompts):
              </p>

              {data.analyzeColors && data.analysis.colors.length > 0 && (
                <div className="flex items-center gap-2">
                  <Palette className="h-3 w-3 text-muted-foreground" />
                  <div className="flex gap-1">
                    {data.analysis.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {data.analyzeStyle && data.analysis.style && (
                <div className="flex items-start gap-2">
                  <Wand2 className="h-3 w-3 text-muted-foreground mt-0.5" />
                  <span className="text-xs">{data.analysis.style}</span>
                </div>
              )}

              {data.analyzeComposition && data.analysis.composition && (
                <div className="flex items-start gap-2">
                  <Layout className="h-3 w-3 text-muted-foreground mt-0.5" />
                  <span className="text-xs">{data.analysis.composition}</span>
                </div>
              )}

              {data.analyzeMood && data.analysis.mood && (
                <div className="flex items-start gap-2">
                  <Heart className="h-3 w-3 text-muted-foreground mt-0.5" />
                  <span className="text-xs">{data.analysis.mood}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// Helper function to build prompt insert from reference analysis
export function buildReferencePromptInsert(settings: ReferenceSettings): string {
  if (!settings.isAnalyzed || !settings.analysis) return "";

  const parts: string[] = [];

  if (settings.analyzeColors && settings.analysis.colors.length > 0) {
    parts.push(`Color palette: ${settings.analysis.colors.join(", ")}`);
  }
  if (settings.analyzeStyle && settings.analysis.style) {
    parts.push(`Visual style: ${settings.analysis.style}`);
  }
  if (settings.analyzeComposition && settings.analysis.composition) {
    parts.push(`Composition: ${settings.analysis.composition}`);
  }
  if (settings.analyzeMood && settings.analysis.mood) {
    parts.push(`Mood: ${settings.analysis.mood}`);
  }

  if (parts.length === 0) return "";

  return `[REFERENCE STYLE: ${parts.join(". ")}]`;
}
