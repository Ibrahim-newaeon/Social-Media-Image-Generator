import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Trash2 } from "lucide-react";

interface PromptInputProps {
  prompts: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function PromptInput({ prompts, onChange, disabled = false }: PromptInputProps) {
  const [lineCount, setLineCount] = useState(0);
  const [charStats, setCharStats] = useState({ total: 0, avg: 0 });

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

  const loadSamplePrompts = () => {
    const samplePrompts = `A luxury skincare product on marble surface with rose petals
Professional product photography of moisturizer with gold accents
Elegant serum bottle with soft pink lighting and silk fabric
Anti-aging cream jar on clean white background with natural shadows
Beauty product with botanical elements and morning dew drops
Skincare routine flatlay with neutral tones and minimal styling
Premium face oil in amber glass bottle with soft focus background
Night cream with starry reflections and deep blue accents
Vitamin C serum with citrus slices and fresh green leaves
Eye cream in minimalist packaging with soft pastel backdrop`;
    onChange(samplePrompts);
  };

  return (
    <Card data-testid="card-prompt-input">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            Prompts
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadSamplePrompts}
              disabled={disabled}
              data-testid="button-load-sample"
            >
              Load Sample
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={disabled || !prompts}
              data-testid="button-clear-prompts"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={prompts}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your prompts here (one per line)...

Example:
A luxury skincare product on marble surface
Professional product photography with soft lighting
Elegant serum bottle with rose petals"
          className="min-h-[280px] font-mono text-sm resize-y"
          disabled={disabled}
          data-testid="textarea-prompts"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground flex-wrap gap-2">
          <span data-testid="text-line-count">{lineCount} prompt{lineCount !== 1 ? 's' : ''}</span>
          <div className="flex items-center gap-4 text-xs">
            {lineCount > 0 && (
              <span data-testid="text-char-stats">
                ~{charStats.avg} chars/prompt
              </span>
            )}
            <span>One prompt per line</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
