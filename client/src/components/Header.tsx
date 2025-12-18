import { ImagePlus, Sparkles } from "lucide-react";

interface HeaderProps {
  totalGenerated?: number;
  isGenerating?: boolean;
}

export default function Header({ totalGenerated = 0, isGenerating = false }: HeaderProps) {
  return (
    <header className="border-b bg-card" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-primary/10">
            <ImagePlus className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold" data-testid="text-app-title">Bulk Image Generator</h1>
            <p className="text-sm text-muted-foreground">Generate AI images in bulk</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {isGenerating && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 animate-pulse text-primary" />
              <span>Generating...</span>
            </div>
          )}
          {totalGenerated > 0 && (
            <div className="text-sm text-muted-foreground" data-testid="text-total-generated">
              <span className="font-medium text-foreground">{totalGenerated}</span> images generated
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
