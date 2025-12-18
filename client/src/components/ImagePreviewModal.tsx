import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { GeneratedImage } from "./ImageCard";

interface ImagePreviewModalProps {
  image: GeneratedImage | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (image: GeneratedImage) => void;
}

export default function ImagePreviewModal({ image, isOpen, onClose, onDownload }: ImagePreviewModalProps) {
  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden" data-testid="modal-image-preview">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-lg font-medium line-clamp-1 flex-1">
              Image Preview
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload(image)}
                data-testid="button-modal-download"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="p-4 pt-2">
          <div className="relative rounded-md overflow-hidden bg-muted">
            {image.imageUrl && (
              <img
                src={image.imageUrl}
                alt={image.prompt}
                className="w-full h-auto max-h-[70vh] object-contain"
                data-testid="img-preview"
              />
            )}
          </div>
          
          <p className="mt-4 text-sm text-muted-foreground" data-testid="text-preview-prompt">
            {image.prompt}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
