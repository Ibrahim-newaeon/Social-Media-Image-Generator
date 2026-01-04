import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export interface TargetAudienceData {
  targetGender: string;
  targetAgeRange: string;
  targetAudienceDescription: string;
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
    });
  };

  const hasContent = data.targetGender || data.targetAgeRange || data.targetAudienceDescription;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-muted-foreground" />
            Target Audience
          </CardTitle>
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
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
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
