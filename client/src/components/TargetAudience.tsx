import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, ChevronDown, ChevronUp, Globe, MapPin } from "lucide-react";
import { useState } from "react";

export interface TargetAudienceData {
  targetGender: string;
  targetAgeRange: string;
  targetAudienceDescription: string;
  selectedAudienceProfileId: string;
  audiencePromptInsert: string;
  // New fields for generic business
  targetLocation: string;
  targetIncome: string;
  targetInterests: string;
  targetLanguage: string;
}

interface TargetAudienceProps {
  data: TargetAudienceData;
  onChange: (data: TargetAudienceData) => void;
  disabled?: boolean;
}

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "All Genders", label: "All Genders" },
];

const AGE_RANGE_OPTIONS = [
  { value: "18-24", label: "18-24 (Gen Z)" },
  { value: "25-34", label: "25-34 (Millennials)" },
  { value: "35-44", label: "35-44 (Gen X)" },
  { value: "45-54", label: "45-54" },
  { value: "55-64", label: "55-64" },
  { value: "65+", label: "65+ (Seniors)" },
  { value: "All Ages", label: "All Ages" },
];

const INCOME_OPTIONS = [
  { value: "Budget-conscious", label: "Budget-conscious" },
  { value: "Mid-range", label: "Mid-range" },
  { value: "Upper mid-range", label: "Upper mid-range" },
  { value: "Premium/Luxury", label: "Premium/Luxury" },
  { value: "All income levels", label: "All income levels" },
];

const LANGUAGE_OPTIONS = [
  { value: "English", label: "English" },
  { value: "Arabic", label: "Arabic (العربية)" },
  { value: "Arabic + English", label: "Arabic + English (Bilingual)" },
  { value: "Spanish", label: "Spanish (Español)" },
  { value: "French", label: "French (Français)" },
  { value: "German", label: "German (Deutsch)" },
  { value: "Chinese", label: "Chinese (中文)" },
  { value: "Other", label: "Other" },
];

// Build prompt insert from audience data
function buildPromptInsert(data: TargetAudienceData): string {
  const parts: string[] = [];

  if (data.targetGender && data.targetGender !== "All Genders") {
    parts.push(`Target gender: ${data.targetGender}`);
  }
  if (data.targetAgeRange && data.targetAgeRange !== "All Ages") {
    parts.push(`Age group: ${data.targetAgeRange}`);
  }
  if (data.targetLocation) {
    parts.push(`Location/Market: ${data.targetLocation}`);
  }
  if (data.targetIncome && data.targetIncome !== "All income levels") {
    parts.push(`Income level: ${data.targetIncome}`);
  }
  if (data.targetInterests) {
    parts.push(`Interests: ${data.targetInterests}`);
  }
  if (data.targetLanguage) {
    parts.push(`Language: ${data.targetLanguage}`);
  }
  if (data.targetAudienceDescription) {
    parts.push(`Audience details: ${data.targetAudienceDescription}`);
  }

  if (parts.length === 0) return "";

  return `[TARGET AUDIENCE: ${parts.join(". ")}]`;
}

export default function TargetAudience({
  data,
  onChange,
  disabled = false,
}: TargetAudienceProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (field: keyof TargetAudienceData, value: string) => {
    const newData = { ...data, [field]: value };
    // Auto-generate prompt insert
    newData.audiencePromptInsert = buildPromptInsert(newData);
    onChange(newData);
  };

  const handleClear = () => {
    onChange({
      targetGender: "",
      targetAgeRange: "",
      targetAudienceDescription: "",
      selectedAudienceProfileId: "",
      audiencePromptInsert: "",
      targetLocation: "",
      targetIncome: "",
      targetInterests: "",
      targetLanguage: "",
    });
  };

  const hasContent = data.targetGender || data.targetAgeRange || data.targetAudienceDescription ||
                     data.targetLocation || data.targetIncome || data.targetInterests || data.targetLanguage;

  // Summary for collapsed view
  const getSummary = () => {
    const parts: string[] = [];
    if (data.targetGender && data.targetGender !== "All Genders") parts.push(data.targetGender);
    if (data.targetAgeRange && data.targetAgeRange !== "All Ages") parts.push(data.targetAgeRange);
    if (data.targetLocation) parts.push(data.targetLocation);
    if (data.targetIncome && data.targetIncome !== "All income levels") parts.push(data.targetIncome);
    return parts.length > 0 ? parts.join(" • ") : null;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-muted-foreground" />
              Target Audience
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Define who your images are for</p>
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
        {!isExpanded && getSummary() && (
          <p className="text-sm text-muted-foreground mt-2">{getSummary()}</p>
        )}
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Demographics Row */}
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

          {/* Location & Income Row */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetLocation" className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                Location / Market
              </Label>
              <Input
                id="targetLocation"
                placeholder="e.g., USA, GCC, Europe, Global"
                value={data.targetLocation || ""}
                onChange={(e) => handleChange("targetLocation", e.target.value)}
                disabled={disabled}
                data-testid="input-target-location"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetIncome">Income Level</Label>
              <Select
                value={data.targetIncome || ""}
                onValueChange={(value) => handleChange("targetIncome", value)}
                disabled={disabled}
              >
                <SelectTrigger data-testid="select-target-income">
                  <SelectValue placeholder="Select income level" />
                </SelectTrigger>
                <SelectContent>
                  {INCOME_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label htmlFor="targetLanguage" className="flex items-center gap-2">
              <Globe className="h-3 w-3" />
              Primary Language
            </Label>
            <Select
              value={data.targetLanguage || ""}
              onValueChange={(value) => handleChange("targetLanguage", value)}
              disabled={disabled}
            >
              <SelectTrigger data-testid="select-target-language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <Label htmlFor="targetInterests">Interests / Lifestyle</Label>
            <Input
              id="targetInterests"
              placeholder="e.g., Health & fitness, Technology, Fashion, Home decor"
              value={data.targetInterests || ""}
              onChange={(e) => handleChange("targetInterests", e.target.value)}
              disabled={disabled}
              data-testid="input-target-interests"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="targetAudienceDescription">Additional Details</Label>
            <Textarea
              id="targetAudienceDescription"
              placeholder="e.g., Working professionals who value quality, eco-conscious shoppers, luxury seekers"
              value={data.targetAudienceDescription}
              onChange={(e) => handleChange("targetAudienceDescription", e.target.value)}
              disabled={disabled}
              className="resize-none"
              rows={2}
              data-testid="input-target-audience-description"
            />
          </div>

          {/* Preview of generated prompt insert */}
          {data.audiencePromptInsert && (
            <div className="p-3 bg-muted/50 rounded-md">
              <p className="text-xs font-medium text-muted-foreground mb-1">Auto-generated for AI:</p>
              <p className="text-xs text-muted-foreground">{data.audiencePromptInsert}</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
