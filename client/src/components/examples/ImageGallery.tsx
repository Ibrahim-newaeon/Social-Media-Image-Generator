import ImageGallery from '../ImageGallery';
import { GeneratedImage } from '../ImageCard';

export default function ImageGalleryExample() {
  const images: GeneratedImage[] = [
    {
      id: '1',
      prompt: 'A luxury skincare product on marble surface',
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
      status: 'completed'
    },
    {
      id: '2',
      prompt: 'Professional product photography with soft lighting',
      status: 'generating'
    },
    {
      id: '3',
      prompt: 'Elegant serum bottle with rose petals',
      status: 'pending'
    }
  ];

  return (
    <div className="h-96">
      <ImageGallery
        images={images}
        onDownload={(img) => console.log('Download:', img.id)}
        onDownloadAll={() => console.log('Download all')}
        onClearAll={() => console.log('Clear all')}
        onPreview={(img) => console.log('Preview:', img.id)}
      />
    </div>
  );
}
