import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Trash2, Images } from "lucide-react";
import ImageCard, { GeneratedImage } from "./ImageCard";

interface ImageGalleryProps {
  images: GeneratedImage[];
  onDownload: (image: GeneratedImage) => void;
  onDownloadAll: () => void;
  onClearAll: () => void;
  onPreview: (image: GeneratedImage) => void;
  isDownloading?: boolean;
}

export default function ImageGallery({ 
  images, 
  onDownload, 
  onDownloadAll, 
  onClearAll, 
  onPreview,
  isDownloading = false
}: ImageGalleryProps) {
  const completedCount = images.filter(img => img.status === 'completed').length;
  const hasCompleted = completedCount > 0;

  return (
    <Card className="h-full flex flex-col" data-testid="card-image-gallery">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <CardTitle className="text-lg flex items-center gap-2">
            <Images className="w-5 h-5 text-muted-foreground" />
            Generated Images
            {hasCompleted && (
              <span className="text-sm font-normal text-muted-foreground">
                ({completedCount})
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={onDownloadAll}
              disabled={!hasCompleted || isDownloading}
              data-testid="button-download-all"
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? 'Preparing...' : 'Download ZIP'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              disabled={images.length === 0}
              data-testid="button-clear-all"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {images.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-12">
            <Images className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">No images yet</p>
            <p className="text-sm mt-1">Enter prompts and click generate to create images</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pr-4">
              {images.map((image, index) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  index={index}
                  onDownload={onDownload}
                  onPreview={onPreview}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
