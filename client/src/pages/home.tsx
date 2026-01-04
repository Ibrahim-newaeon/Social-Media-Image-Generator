import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import PromptInput from "@/components/PromptInput";
import GenerationProgress, { GenerationStatus } from "@/components/GenerationProgress";
import ImageGallery from "@/components/ImageGallery";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import BrandGuidelines, { BrandStyle, getDefaultBrandStyle, formatBrandStyleForPrompt } from "@/components/BrandGuidelines";
import AudienceSelector from "@/components/AudienceSelector";
import LogoUploader, { LogoSettings, getDefaultLogoSettings } from "@/components/LogoUploader";
import GenerationSettings, { GenerationSettingsData, getDefaultGenerationSettings } from "@/components/GenerationSettings";
import ChatAssistant from "@/components/ChatAssistant";
import { GeneratedImage } from "@/components/ImageCard";
import { useToast } from "@/hooks/use-toast";
import { overlayLogoOnImage } from "@/lib/logoOverlay";
import { type AudienceProfile } from "@/data/audiences";
import {
  getAllProfiles,
  saveProfile,
  deleteProfile,
  loadActiveProfile,
  setActiveProfileName,
  type BrandProfile
} from "@/lib/brandProfilesStorage";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  ImagePlus,
  Sparkles,
  Square,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

export default function Home() {
  // State
  const [prompts, setPrompts] = useState("");
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewImage, setPreviewImage] = useState<GeneratedImage | null>(null);
  const [brandStyle, setBrandStyle] = useState<BrandStyle>(getDefaultBrandStyle());
  const [savedProfiles, setSavedProfiles] = useState<BrandProfile[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<AudienceProfile | null>(null);
  const [logoSettings, setLogoSettings] = useState<LogoSettings>(getDefaultLogoSettings());
  const [genSettings, setGenSettings] = useState<GenerationSettingsData>(getDefaultGenerationSettings());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
    current: 0,
    total: 0,
    completed: 0,
    failed: 0,
  });
  const shouldStopRef = useRef(false);
  const { toast } = useToast();

  // Load saved profile on mount
  useEffect(() => {
    setSavedProfiles(getAllProfiles());
    const activeProfile = loadActiveProfile();
    if (activeProfile) {
      setBrandStyle({
        brandName: activeProfile.brandName,
        primaryColors: activeProfile.primaryColor,
        secondaryColors: activeProfile.secondaryColor,
        fontStyle: activeProfile.fontStyle,
        visualStyle: activeProfile.visualStyle,
        additionalNotes: activeProfile.additionalNotes,
        targetAudience: activeProfile.targetAudience || "",
        logoDataUrl: activeProfile.logoDataUrl || "",
      });
      if (activeProfile.logoDataUrl) {
        setLogoSettings(prev => ({ ...prev, url: activeProfile.logoDataUrl || "" }));
      }
    }
  }, []);

  // Theme toggle
  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  // Profile handlers
  const handleSaveProfile = () => {
    const trimmedName = brandStyle.brandName.trim();
    if (!trimmedName) return;

    const profile: BrandProfile = {
      brandName: trimmedName,
      primaryColor: brandStyle.primaryColors,
      secondaryColor: brandStyle.secondaryColors,
      fontStyle: brandStyle.fontStyle,
      visualStyle: brandStyle.visualStyle,
      additionalNotes: brandStyle.additionalNotes,
      targetAudience: brandStyle.targetAudience,
      logoDataUrl: logoSettings.url || null,
      lastModified: Date.now(),
    };

    setBrandStyle(prev => ({ ...prev, brandName: trimmedName }));
    saveProfile(profile);
    setActiveProfileName(profile.brandName);
    setSavedProfiles(getAllProfiles());

    toast({
      title: "Profile saved",
      description: `Brand profile "${profile.brandName}" has been saved.`,
    });
  };

  const handleLoadProfile = (brandName: string) => {
    const profiles = getAllProfiles();
    const profile = profiles.find(p => p.brandName === brandName);
    if (profile) {
      setBrandStyle({
        brandName: profile.brandName,
        primaryColors: profile.primaryColor,
        secondaryColors: profile.secondaryColor,
        fontStyle: profile.fontStyle,
        visualStyle: profile.visualStyle,
        additionalNotes: profile.additionalNotes,
        targetAudience: profile.targetAudience || "",
        logoDataUrl: profile.logoDataUrl || "",
      });
      if (profile.logoDataUrl) {
        setLogoSettings(prev => ({ ...prev, url: profile.logoDataUrl || "" }));
      }
      setActiveProfileName(profile.brandName);
    }
  };

  const handleDeleteProfile = (brandName: string) => {
    deleteProfile(brandName);
    setSavedProfiles(getAllProfiles());
    setBrandStyle(getDefaultBrandStyle());
    setLogoSettings(getDefaultLogoSettings());

    toast({
      title: "Profile deleted",
      description: `Brand profile "${brandName}" has been deleted.`,
    });
  };

  const handleNewProfile = () => {
    setBrandStyle(getDefaultBrandStyle());
    setLogoSettings(getDefaultLogoSettings());
  };

  // Prompt parsing
  const parsePrompts = useCallback((): string[] => {
    return prompts
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }, [prompts]);

  // Build enhanced prompt with brand + audience
  const buildEnhancedPrompt = (basePrompt: string): string => {
    let enhancedPrompt = basePrompt;

    // Add brand context
    if (genSettings.applyBrandColors) {
      const brandPrefix = formatBrandStyleForPrompt(brandStyle);
      if (brandPrefix) {
        enhancedPrompt = brandPrefix + enhancedPrompt;
      }
    }

    // Add audience requirements
    if (genSettings.applyAudienceRules && selectedAudience) {
      enhancedPrompt += `\n\n${selectedAudience.promptAddition}`;
    }

    return enhancedPrompt;
  };

  // Generation handler
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

    const totalImages = promptList.length * genSettings.imagesPerPrompt;
    const initialImages: GeneratedImage[] = [];

    for (let i = 0; i < promptList.length; i++) {
      for (let j = 0; j < genSettings.imagesPerPrompt; j++) {
        initialImages.push({
          id: `img-${Date.now()}-${i}-${j}`,
          prompt: promptList[i],
          status: "pending",
        });
      }
    }

    setImages(initialImages);
    setGenerationStatus({
      current: 0,
      total: totalImages,
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
        const enhancedPrompt = buildEnhancedPrompt(image.prompt);

        const response = await fetch("/api/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: enhancedPrompt }),
        });

        if (!response.ok) {
          throw new Error("Generation failed");
        }

        const data = await response.json();
        let imageUrl = `data:${data.mimeType};base64,${data.b64_json}`;

        // Apply logo watermark if enabled
        if (genSettings.applyLogoWatermark && logoSettings.url) {
          try {
            imageUrl = await overlayLogoOnImage({
              logoDataUrl: logoSettings.url,
              imageDataUrl: imageUrl,
              logoSizePercent: logoSettings.size,
              paddingPercent: 3,
              position: logoSettings.position,
              opacity: logoSettings.opacity,
            });
          } catch (overlayError) {
            console.error("Logo overlay failed:", overlayError);
          }
        }

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

  // Download handlers
  const base64ToBlob = (dataUrl: string): Blob => {
    const [header, base64Data] = dataUrl.split(",");
    const mimeMatch = header.match(/data:([^;]+);/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/png";
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
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <aside
        className={`
          flex flex-col bg-card border-r h-screen sticky top-0 transition-all duration-300
          ${sidebarCollapsed ? "w-0 overflow-hidden" : "w-[320px]"}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg">
              <ImagePlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">AI Studio</h1>
              <p className="text-xs text-muted-foreground">Bulk Image Generator</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(true)}
            className="h-8 w-8"
          >
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        </div>

        {/* Sidebar Content */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <BrandGuidelines
              brandStyle={brandStyle}
              onChange={setBrandStyle}
              disabled={isGenerating}
              savedProfiles={savedProfiles}
              onSaveProfile={handleSaveProfile}
              onLoadProfile={handleLoadProfile}
              onDeleteProfile={handleDeleteProfile}
              onNewProfile={handleNewProfile}
            />

            <AudienceSelector
              selected={selectedAudience}
              onSelect={setSelectedAudience}
              disabled={isGenerating}
            />

            <LogoUploader
              settings={logoSettings}
              onChange={setLogoSettings}
              disabled={isGenerating}
            />
          </div>
        </ScrollArea>

        {/* Generate Button */}
        <div className="p-4 border-t space-y-3">
          {!isGenerating ? (
            <Button
              onClick={handleGenerate}
              disabled={promptCount === 0}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate {promptCount > 0 ? `${promptCount * genSettings.imagesPerPrompt} Images` : "Images"}
            </Button>
          ) : (
            <Button
              onClick={handleStop}
              variant="destructive"
              className="w-full h-12 text-lg font-semibold"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop Generation
            </Button>
          )}

          {/* Stats */}
          {totalGenerated > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              <span className="font-bold text-primary">{totalGenerated}</span> images generated
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <div className="p-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={toggleTheme}
          >
            {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>
      </aside>

      {/* Collapse Button (when sidebar is hidden) */}
      {sidebarCollapsed && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarCollapsed(false)}
          className="fixed top-4 left-4 z-50 shadow-lg"
        >
          <PanelLeft className="w-4 h-4" />
        </Button>
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Create Images</h2>
              <p className="text-sm text-muted-foreground">
                Enter your prompts and generate AI images in bulk
              </p>
            </div>
            {isGenerating && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 animate-pulse text-primary" />
                <span>Generating...</span>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 space-y-6">
          <div className="grid xl:grid-cols-2 gap-6">
            {/* Left Column - Prompts & Settings */}
            <div className="space-y-6">
              <PromptInput
                prompts={prompts}
                onChange={setPrompts}
                disabled={isGenerating}
                brandStyle={brandStyle}
              />

              <GenerationSettings
                settings={genSettings}
                onChange={setGenSettings}
                hasLogo={!!logoSettings.url}
                hasAudience={!!selectedAudience}
                disabled={isGenerating}
              />

              <GenerationProgress
                status={generationStatus}
                isVisible={isGenerating || generationStatus.total > 0}
              />
            </div>

            {/* Right Column - Gallery */}
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
        </div>
      </main>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        image={previewImage}
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        onDownload={handleDownload}
      />

      {/* AI Chat Assistant */}
      <ChatAssistant />
    </div>
  );
}
