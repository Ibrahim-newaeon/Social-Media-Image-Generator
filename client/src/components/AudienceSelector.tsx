import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Check, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { audiences, type AudienceProfile } from "@/data/audiences";

interface AudienceSelectorProps {
  selected: AudienceProfile | null;
  onSelect: (audience: AudienceProfile | null) => void;
  disabled?: boolean;
}

type Market = "All" | "Kuwait" | "Saudi Arabia" | "Qatar" | "All GCC";

export default function AudienceSelector({
  selected,
  onSelect,
  disabled = false,
}: AudienceSelectorProps) {
  const [market, setMarket] = useState<Market>("All");
  const [expanded, setExpanded] = useState(false);

  const markets: Market[] = ["All", "Kuwait", "Saudi Arabia", "Qatar", "All GCC"];

  const filteredAudiences = market === "All"
    ? audiences
    : audiences.filter(a => a.market === market);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="p-2 rounded-lg bg-pink-500/10">
            <Users className="w-5 h-5 text-pink-500" />
          </div>
          Target Audience
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Market Filter */}
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Market</Label>
          <div className="flex flex-wrap gap-1">
            {markets.map((m) => (
              <button
                key={m}
                onClick={() => setMarket(m)}
                disabled={disabled}
                className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                  market === m
                    ? "bg-pink-500 text-white"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Audience Display */}
        {selected ? (
          <div className="p-4 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/30 dark:to-purple-950/30 border border-pink-200 dark:border-pink-800">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-sm">{selected.nameEn}</p>
                <p className="text-sm text-right mt-1" dir="rtl">{selected.nameAr}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{selected.market}</span>
                  <span>•</span>
                  <span>{selected.ageRange} years</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelect(null)}
                disabled={disabled}
                className="text-xs"
              >
                Clear
              </Button>
            </div>

            <div className="mt-3 pt-3 border-t border-pink-200 dark:border-pink-800">
              <p className="text-xs font-medium mb-2 flex items-center gap-1">
                <Check className="w-3 h-3 text-green-500" />
                Auto-Applied Requirements:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {selected.requirements.slice(0, 4).map((req, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-pink-500">•</span>
                    {req}
                  </li>
                ))}
                {selected.requirements.length > 4 && (
                  <li className="text-pink-500">
                    +{selected.requirements.length - 4} more
                  </li>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border-2 border-dashed text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No audience selected</p>
            <p className="text-xs text-muted-foreground/70">
              Select an audience to auto-apply requirements
            </p>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          disabled={disabled}
          className="w-full"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Hide Audiences
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              {selected ? "Change Audience" : "Select Audience"}
            </>
          )}
        </Button>

        {/* Audience List */}
        {expanded && (
          <ScrollArea className="h-64">
            <div className="space-y-2 pr-2">
              {filteredAudiences.map((audience) => (
                <button
                  key={audience.id}
                  onClick={() => {
                    onSelect(audience);
                    setExpanded(false);
                  }}
                  disabled={disabled}
                  className={`w-full text-left p-3 rounded-lg border transition-all hover:border-pink-500 ${
                    selected?.id === audience.id
                      ? "border-pink-500 bg-pink-50 dark:bg-pink-950/30"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{audience.nameEn}</p>
                    {selected?.id === audience.id && (
                      <Check className="w-4 h-4 text-pink-500" />
                    )}
                  </div>
                  <p className="text-sm text-right mt-1 text-muted-foreground" dir="rtl">
                    {audience.nameAr}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span className="px-1.5 py-0.5 bg-muted rounded">{audience.market}</span>
                    <span>{audience.ageRange}</span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
