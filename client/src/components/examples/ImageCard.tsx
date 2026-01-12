import ImageCard, { GeneratedImage } from '../ImageCard';

export default function ImageCardExample() {
  const completedImage: GeneratedImage = {
    id: '1',
    prompt: 'A luxury skincare product on marble surface with rose petals and soft lighting',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
    status: 'completed'
  };

  return (
    <div className="w-64">
      <ImageCard 
        image={completedImage} 
        index={0} 
        onDownload={(img) => console.log('Download:', img.id)}
        onPreview={(img) => console.log('Preview:', img.id)}
      />
    </div>
  );
}
