import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import PromptInput from "@/components/PromptInput";
import GenerationProgress, { GenerationStatus } from "@/components/GenerationProgress";
import ImageGallery from "@/components/ImageGallery";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import BrandGuidelines, { BrandStyle, getDefaultBrandStyle, formatBrandStyleForPrompt } from "@/components/BrandGuidelines";
import TargetAudience from "@/components/TargetAudience";
import LogoUploader, { LogoSettings, getDefaultLogoSettings } from "@/components/LogoUploader";
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
import { 
  getHistory, 
  addToHistory, 
  removeFromHistory, 
  clearHistory,
  type HistoryEntry 
} from "@/lib/imageHistoryStorage";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Download, Trash2, History, Images, ImagePlus, Sparkles, Square, Moon, Sun, PanelLeftClose, PanelLeft } from "lucide-react";
import { format } from "date-fns";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function Home() {
  // State
  const [prompts, setPrompts] = useState("");
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewImage, setPreviewImage] = useState<GeneratedImage | null>(null);
  const [brandStyle, setBrandStyle] = useState<BrandStyle>(getDefaultBrandStyle());
  const [savedProfiles, setSavedProfiles] = useState<BrandProfile[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"generated" | "history">("generated");
  const [logoSettings, setLogoSettings] = useState<LogoSettings>(getDefaultLogoSettings());
  const [isDark, setIsDark] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [genSettings, setGenSettings] = useState({
    applyBrandColors: true,
    applyAudienceRules: true,
    applyLogoWatermark: true,
    imagesPerPrompt: 1,
  });
  const [selectedAudience, setSelectedAudience] = useState<AudienceProfile | null>(null);
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
    setHistory(getHistory());
    const activeProfile = loadActiveProfile();
    if (activeProfile) {
      setBrandStyle({
        brandName: activeProfile.brandName,
        primaryColors: activeProfile.primaryColor,
        secondaryColors: activeProfile.secondaryColor,
        fontStyle: activeProfile.fontStyle,
        visualStyle: activeProfile.visualStyle,
        targetGender: activeProfile.targetGender || "",
        targetAgeRange: activeProfile.targetAgeRange || "",
        targetAudienceDescription: activeProfile.targetAudienceDescription || "",
        selectedAudienceProfileId: activeProfile.selectedAudienceProfileId || "",
        audiencePromptInsert: activeProfile.audiencePromptInsert || "",
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
      targetGender: brandStyle.targetGender,
      targetAgeRange: brandStyle.targetAgeRange,
      targetAudienceDescription: brandStyle.targetAudienceDescription,
      selectedAudienceProfileId: brandStyle.selectedAudienceProfileId,
      audiencePromptInsert: brandStyle.audiencePromptInsert,
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
      description: `Brand profile "${profile.brandName}" has been saved (includes brand style and target audience).`,
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
        targetGender: profile.targetGender || "",
        targetAgeRange: profile.targetAgeRange || "",
        targetAudienceDescription: profile.targetAudienceDescription || "",
        selectedAudienceProfileId: profile.selectedAudienceProfileId || "",
        audiencePromptInsert: profile.audiencePromptInsert || "",
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
              logoSizePercent: 25,
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
        
        const historyEntry: HistoryEntry = {
          id: image.id,
          prompt: image.prompt,
          imageDataUrl: imageUrl,
          mimeType: "image/png",
          generatedAt: Date.now(),
          brandName: brandStyle.brandName || undefined,
        };
        addToHistory(historyEntry);
        setHistory(getHistory());
        
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

  const handleRemoveFromHistory = (id: string) => {
    removeFromHistory(id);
    setHistory(getHistory());
    toast({
      title: "Removed from history",
      description: "Image has been removed from history.",
    });
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    toast({
      title: "History cleared",
      description: "All history has been cleared.",
    });
  };

  const handleDownloadFromHistory = (entry: HistoryEntry) => {
    if (!entry.imageDataUrl) return;
    
    try {
      const blob = base64ToBlob(entry.imageDataUrl);
      saveAs(blob, `image-${entry.id}.png`);
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download the image.",
        variant: "destructive",
      });
    }
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
            <TargetAudience
              data={{
                targetGender: brandStyle.targetGender,
                targetAgeRange: brandStyle.targetAgeRange,
                targetAudienceDescription: brandStyle.targetAudienceDescription,
                selectedAudienceProfileId: brandStyle.selectedAudienceProfileId,
                audiencePromptInsert: brandStyle.audiencePromptInsert,
              }}
              onChange={(audienceData) => setBrandStyle(prev => ({
                ...prev,
                targetGender: audienceData.targetGender,
                targetAgeRange: audienceData.targetAgeRange,
                targetAudienceDescription: audienceData.targetAudienceDescription,
                selectedAudienceProfileId: audienceData.selectedAudienceProfileId,
                audiencePromptInsert: audienceData.audiencePromptInsert,
              }))}
              disabled={isGenerating}
            />
            <PromptInput
              prompts={prompts}
              onChange={setPrompts}
              disabled={isGenerating}
            />

            <LogoUploader
              settings={logoSettings}
              onChange={setLogoSettings}
              disabled={isGenerating}
            />
          </div>
          
          <div>
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as "generated" | "history")}
              data-testid="tabs-gallery"
            >
              <TabsList className="mb-4" data-testid="tabs-list">
                <TabsTrigger value="generated" data-testid="tab-generated">
                  <Images className="w-4 h-4 mr-2" />
                  Generated
                </TabsTrigger>
                <TabsTrigger value="history" data-testid="tab-history">
                  <History className="w-4 h-4 mr-2" />
                  History
                  {history.length > 0 && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({history.length})
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="generated" data-testid="tab-content-generated">
                <ImageGallery
                  images={images}
                  onDownload={handleDownload}
                  onDownloadAll={handleDownloadAll}
                  onClearAll={handleClearAll}
                  onPreview={setPreviewImage}
                  isDownloading={isDownloading}
                />
              </TabsContent>
              
              <TabsContent value="history" data-testid="tab-content-history">
                <div className="h-full flex flex-col" data-testid="div-history">
                  <div className="pb-4 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <History className="w-5 h-5 text-muted-foreground" />
                      <h3 className="text-lg font-semibold">History</h3>
                      {history.length > 0 && (
                        <span className="text-sm font-normal text-muted-foreground">
                          ({history.length} items)
                        </span>
                      )}
                    </div>
                    {history.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearHistory}
                        data-testid="button-clear-history"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear All History
                      </Button>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    {history.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-12" data-testid="history-empty-state">
                        <History className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-medium">No history yet</p>
                        <p className="text-sm mt-1">Generated images will appear here</p>
                      </div>
                    ) : (
                      <ScrollArea className="h-[calc(100vh-300px)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pr-4">
                          {history.map((entry) => (
                            <Card key={entry.id} className="overflow-hidden" data-testid={`card-history-${entry.id}`}>
                              <div className="relative aspect-square">
                                <img 
                                  src={entry.imageDataUrl} 
                                  alt={entry.prompt}
                                  className="w-full h-full object-cover"
                                  data-testid={`img-history-${entry.id}`}
                                />
                              </div>
                              <div className="p-3 space-y-2">
                                <p 
                                  className="text-sm line-clamp-2" 
                                  title={entry.prompt}
                                  data-testid={`text-prompt-${entry.id}`}
                                >
                                  {entry.prompt}
                                </p>
                                <div className="flex items-center justify-between gap-2">
                                  <span 
                                    className="text-xs text-muted-foreground"
                                    data-testid={`text-date-${entry.id}`}
                                  >
                                    {format(new Date(entry.generatedAt), "MMM d, yyyy h:mm a")}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDownloadFromHistory(entry)}
                                      data-testid={`button-download-history-${entry.id}`}
                                    >
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleRemoveFromHistory(entry.id)}
                                      data-testid={`button-delete-history-${entry.id}`}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </aside>

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
