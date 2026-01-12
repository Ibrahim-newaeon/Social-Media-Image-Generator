import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Square } from "lucide-react";

interface GenerateControlsProps {
  onGenerate: () => void;
  onStop: () => void;
  isGenerating: boolean;
  promptCount: number;
}

export default function GenerateControls({ 
  onGenerate, 
  onStop, 
  isGenerating, 
  promptCount 
}: GenerateControlsProps) {
  return (
    <Card data-testid="card-generate-controls">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4 flex-wrap">
          {!isGenerating ? (
            <Button
              size="lg"
              onClick={onGenerate}
              disabled={promptCount === 0}
              className="flex-1 md:flex-none"
              data-testid="button-generate"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate {promptCount > 0 ? `${promptCount} Image${promptCount !== 1 ? 's' : ''}` : 'Images'}
            </Button>
          ) : (
            <Button
              size="lg"
              variant="destructive"
              onClick={onStop}
              className="flex-1 md:flex-none"
              data-testid="button-stop"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop Generation
            </Button>
          )}
          
          <p className="text-sm text-muted-foreground">
            {isGenerating 
              ? 'Images are being generated using AI...' 
              : 'Each prompt will generate one image'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
