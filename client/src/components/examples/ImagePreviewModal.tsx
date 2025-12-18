import { useState } from 'react';
import ImagePreviewModal from '../ImagePreviewModal';
import { Button } from '@/components/ui/button';
import { GeneratedImage } from '../ImageCard';

export default function ImagePreviewModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  
  const image: GeneratedImage = {
    id: '1',
    prompt: 'A luxury skincare product on marble surface with rose petals and soft morning light streaming through a window',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop',
    status: 'completed'
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Preview</Button>
      <ImagePreviewModal
        image={image}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onDownload={(img) => console.log('Download:', img.id)}
      />
    </div>
  );
}
