import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Images } from "lucide-react";
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
  onPreview,
}: ImageGalleryProps) {
  return (
    <Card className="h-full flex flex-col border-0 shadow-none bg-transparent" data-testid="card-image-gallery">
      <CardContent className="flex-1 overflow-hidden p-0">
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
