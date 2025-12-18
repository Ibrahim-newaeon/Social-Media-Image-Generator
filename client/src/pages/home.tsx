import { useState, useCallback, useRef } from "react";
import Header from "@/components/Header";
import PromptInput from "@/components/PromptInput";
import GenerateControls from "@/components/GenerateControls";
import GenerationProgress, { GenerationStatus } from "@/components/GenerationProgress";
import ImageGallery from "@/components/ImageGallery";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import BrandGuidelines, { BrandStyle, getDefaultBrandStyle, formatBrandStyleForPrompt } from "@/components/BrandGuidelines";
import { GeneratedImage } from "@/components/ImageCard";
import { useToast } from "@/hooks/use-toast";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function Home() {
  const [prompts, setPrompts] = useState("");
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewImage, setPreviewImage] = useState<GeneratedImage | null>(null);
  const [brandStyle, setBrandStyle] = useState<BrandStyle>(getDefaultBrandStyle());
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
    current: 0,
    total: 0,
    completed: 0,
    failed: 0,
  });
  const shouldStopRef = useRef(false);
  const { toast } = useToast();

  const parsePrompts = useCallback((): string[] => {
    return prompts
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }, [prompts]);

  const handleGenerate = async () => {
    const promptList = parsePrompts();
    if (promptList.length === 0) {
      toast({
        title: "No prompts",
        description: "Please enter at least one prompt to generate images.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    shouldStopRef.current = false;
    
    const initialImages: GeneratedImage[] = promptList.map((prompt, index) => ({
      id: `img-${Date.now()}-${index}`,
      prompt,
      status: "pending",
    }));
    
    setImages(initialImages);
    setGenerationStatus({
      current: 0,
      total: promptList.length,
      completed: 0,
      failed: 0,
    });

    let completed = 0;
    let failed = 0;

    for (let i = 0; i < initialImages.length; i++) {
      if (shouldStopRef.current) break;

      const image = initialImages[i];
      
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id ? { ...img, status: "generating" } : img
        )
      );
      
      setGenerationStatus((prev) => ({
        ...prev,
        current: i + 1,
        currentPrompt: image.prompt,
      }));

      try {
        const brandPrefix = formatBrandStyleForPrompt(brandStyle);
        const fullPrompt = brandPrefix + image.prompt;
        
        const response = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: fullPrompt }),
        });

        if (!response.ok) {
          throw new Error("Generation failed");
        }

        const data = await response.json();
        const imageUrl = `data:${data.mimeType};base64,${data.b64_json}`;
        
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? { ...img, status: "completed", imageUrl }
              : img
          )
        );
        completed++;
      } catch (error) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id
              ? { ...img, status: "failed", error: "Generation failed" }
              : img
          )
        );
        failed++;
      }

      setGenerationStatus((prev) => ({
        ...prev,
        completed,
        failed,
      }));
    }

    setIsGenerating(false);
    if (!shouldStopRef.current) {
      toast({
        title: "Generation complete",
        description: `Generated ${completed} image${completed !== 1 ? "s" : ""} successfully.`,
      });
    }
  };

  const handleStop = () => {
    shouldStopRef.current = true;
    setIsGenerating(false);
    toast({
      title: "Generation stopped",
      description: "Image generation has been stopped.",
    });
  };

  const base64ToBlob = (dataUrl: string): Blob => {
    const [header, base64Data] = dataUrl.split(',');
    const mimeMatch = header.match(/data:([^;]+);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type: mimeType });
  };

  const handleDownload = (image: GeneratedImage) => {
    if (!image.imageUrl) return;
    
    try {
      const blob = base64ToBlob(image.imageUrl);
      saveAs(blob, `image-${image.id}.png`);
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download the image.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadAll = async () => {
    const completedImages = images.filter(
      (img) => img.status === "completed" && img.imageUrl
    );

    if (completedImages.length === 0) {
      toast({
        title: "No images to download",
        description: "Generate some images first.",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);

    try {
      const zip = new JSZip();

      for (let i = 0; i < completedImages.length; i++) {
        const image = completedImages[i];
        if (!image.imageUrl) continue;

        try {
          const blob = base64ToBlob(image.imageUrl);
          zip.file(`image-${i + 1}.png`, blob);
        } catch (error) {
          console.error(`Failed to add image ${i + 1} to ZIP`);
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `generated-images-${Date.now()}.zip`);
      
      toast({
        title: "Download complete",
        description: `Downloaded ${completedImages.length} images as ZIP.`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not create ZIP file.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleClearAll = () => {
    setImages([]);
    setGenerationStatus({
      current: 0,
      total: 0,
      completed: 0,
      failed: 0,
    });
  };

  const promptCount = parsePrompts().length;
  const totalGenerated = images.filter((img) => img.status === "completed").length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header totalGenerated={totalGenerated} isGenerating={isGenerating} />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <BrandGuidelines
              brandStyle={brandStyle}
              onChange={setBrandStyle}
              disabled={isGenerating}
            />
            <PromptInput
              prompts={prompts}
              onChange={setPrompts}
              disabled={isGenerating}
            />
            <GenerateControls
              onGenerate={handleGenerate}
              onStop={handleStop}
              isGenerating={isGenerating}
              promptCount={promptCount}
            />
            <GenerationProgress
              status={generationStatus}
              isVisible={isGenerating || generationStatus.total > 0}
            />
          </div>
          
          <div>
            <ImageGallery
              images={images}
              onDownload={handleDownload}
              onDownloadAll={handleDownloadAll}
              onClearAll={handleClearAll}
              onPreview={setPreviewImage}
              isDownloading={isDownloading}
            />
          </div>
        </div>
      </main>
      
      <ImagePreviewModal
        image={previewImage}
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        onDownload={handleDownload}
      />
    </div>
  );
}
