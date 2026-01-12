import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, AlertCircle, Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl?: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  error?: string;
}

interface ImageCardProps {
  image: GeneratedImage;
  index: number;
  onDownload?: (image: GeneratedImage) => void;
  onPreview?: (image: GeneratedImage) => void;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
}

export default function ImageCard({ image, index, onDownload, onPreview, isSelected = false, onSelect }: ImageCardProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const statusBadges = {
    pending: <Badge variant="secondary" className="text-xs">Pending</Badge>,
    generating: (
      <Badge variant="secondary" className="text-xs animate-pulse bg-primary/20 text-primary">
        Generating
      </Badge>
    ),
    completed: <Badge variant="secondary" className="text-xs bg-chart-2/20 text-chart-2">Done</Badge>,
    failed: <Badge variant="destructive" className="text-xs">Failed</Badge>
  };

  return (
    <div 
      className="group relative border rounded-md overflow-hidden bg-card"
      data-testid={`card-image-${image.id}`}
    >
      <div className="aspect-square relative bg-muted">
        {image.status === 'pending' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <span className="text-3xl font-bold">#{index + 1}</span>
            </div>
          </div>
        )}
        
        {image.status === 'generating' && (
          <Skeleton className="absolute inset-0" />
        )}
        
        {image.status === 'failed' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-destructive gap-2 p-4">
            <AlertCircle className="w-8 h-8" />
            <span className="text-xs text-center">{image.error || 'Generation failed'}</span>
          </div>
        )}
        
        {image.status === 'completed' && image.imageUrl && (
          <>
            {!imageLoaded && <Skeleton className="absolute inset-0" />}
            <img
              src={image.imageUrl}
              alt={image.prompt}
              className={`w-full h-full object-cover transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              data-testid={`img-generated-${image.id}`}
            />

            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-2 transition-opacity"
              style={{ opacity: showPrompt ? 1 : 0, visibility: showPrompt ? 'visible' : 'hidden' }}
              onMouseLeave={() => setShowPrompt(false)}
            >
              <p className="absolute inset-0 p-4 text-sm text-white overflow-y-auto">{image.prompt}</p>
            </div>

            {/* Selection checkbox */}
            <div className="absolute top-2 left-2">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onSelect?.(image.id, checked as boolean)}
                className="h-5 w-5 border-2 border-white bg-white/80 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                data-testid={`checkbox-select-${image.id}`}
              />
            </div>

            <div
              className="absolute top-2 right-2 flex gap-1 transition-opacity"
              style={{ opacity: 1, visibility: 'visible' }}
            >
              <Button
                size="icon"
                variant="secondary"
                className="bg-white/90 text-foreground"
                onClick={() => onPreview?.(image)}
                data-testid={`button-preview-${image.id}`}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="bg-white/90 text-foreground"
                onClick={() => onDownload?.(image)}
                data-testid={`button-download-${image.id}`}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>
      
      <div className="p-3 border-t">
        <div className="flex items-start justify-between gap-2">
          <p 
            className="text-xs text-muted-foreground line-clamp-2 flex-1 cursor-pointer"
            onClick={() => setShowPrompt(!showPrompt)}
          >
            {image.prompt}
          </p>
          {statusBadges[image.status]}
        </div>
      </div>
    </div>
  );
}
