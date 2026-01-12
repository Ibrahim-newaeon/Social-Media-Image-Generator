import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PromptInput from "@/components/PromptInput";
import GenerationProgress, { GenerationStatus } from "@/components/GenerationProgress";
import ImageGallery from "@/components/ImageGallery";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import BrandGuidelines, { BrandStyle, getDefaultBrandStyle, formatBrandStyleForPrompt } from "@/components/BrandGuidelines";
import TargetAudience from "@/components/TargetAudience";
import LogoUploader, { LogoSettings, getDefaultLogoSettings } from "@/components/LogoUploader";
import ReferenceImages, { ReferenceSettings, buildReferencePromptInsert } from "@/components/ReferenceImages";
import ChatAssistant from "@/components/ChatAssistant";
import LandingPage from "@/components/LandingPage";
import { GeneratedImage } from "@/components/ImageCard";
import { useToast } from "@/hooks/use-toast";
import { overlayLogoOnImage } from "@/lib/logoOverlay";
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
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import {
  ImagePlus,
  Sparkles,
  Square,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeft,
  Download,
  Trash2,
  History,
  Images,
  Home as HomeIcon,
} from "lucide-react";

export default function Home() {
  // State
  const [showLanding, setShowLanding] = useState(true);
  const [prompts, setPrompts] = useState("");
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewImage, setPreviewImage] = useState<GeneratedImage | null>(null);
  const [brandStyle, setBrandStyle] = useState<BrandStyle>(getDefaultBrandStyle());
  const [savedProfiles, setSavedProfiles] = useState<BrandProfile[]>([]);
  const [logoSettings, setLogoSettings] = useState<LogoSettings>(getDefaultLogoSettings());
  const [referenceSettings, setReferenceSettings] = useState<ReferenceSettings>({
    images: [],
    analyzeColors: true,
    analyzeStyle: true,
    analyzeComposition: false,
    analyzeMood: true,
    analysis: null,
    isAnalyzed: false,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"generated" | "history">("generated");
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(new Set());
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
    current: 0,
    total: 0,
    completed: 0,
    failed: 0,
  });
  const shouldStopRef = useRef(false);
  const [suggestDialogOpen, setSuggestDialogOpen] = useState(false);
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
        targetLocation: activeProfile.targetLocation || "",
        targetIncome: activeProfile.targetIncome || "",
        targetInterests: activeProfile.targetInterests || "",
        targetLanguage: activeProfile.targetLanguage || "",
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
      targetLocation: brandStyle.targetLocation,
      targetIncome: brandStyle.targetIncome,
      targetInterests: brandStyle.targetInterests,
      targetLanguage: brandStyle.targetLanguage,
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
        targetGender: profile.targetGender || "",
        targetAgeRange: profile.targetAgeRange || "",
        targetAudienceDescription: profile.targetAudienceDescription || "",
        selectedAudienceProfileId: profile.selectedAudienceProfileId || "",
        audiencePromptInsert: profile.audiencePromptInsert || "",
        additionalNotes: profile.additionalNotes,
        targetAudience: profile.targetAudience || "",
        logoDataUrl: profile.logoDataUrl || "",
        targetLocation: profile.targetLocation || "",
        targetIncome: profile.targetIncome || "",
        targetInterests: profile.targetInterests || "",
        targetLanguage: profile.targetLanguage || "",
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

  // Reference image analysis handler
  const handleAnalyzeReference = async () => {
    if (referenceSettings.images.length === 0) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze-reference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: referenceSettings.images.map((img) => img.dataUrl),
          options: {
            analyzeColors: referenceSettings.analyzeColors,
            analyzeStyle: referenceSettings.analyzeStyle,
            analyzeComposition: referenceSettings.analyzeComposition,
            analyzeMood: referenceSettings.analyzeMood,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const analysis = await response.json();
      setReferenceSettings((prev) => ({
        ...prev,
        analysis,
        isAnalyzed: true,
      }));

      toast({
        title: "Analysis complete",
        description: "Reference style has been extracted and will apply to all generated images.",
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Could not analyze reference images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Prompt parsing
  const parsePrompts = useCallback((): string[] => {
    return prompts
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }, [prompts]);

  // Build enhanced prompt with brand and reference style
  const buildEnhancedPrompt = (basePrompt: string): string => {
    let enhancedPrompt = basePrompt;
    const brandPrefix = formatBrandStyleForPrompt(brandStyle);
    if (brandPrefix) {
      enhancedPrompt = brandPrefix + enhancedPrompt;
    }
    if (brandStyle.audiencePromptInsert) {
      enhancedPrompt += `\n\n${brandStyle.audiencePromptInsert}`;
    }
    // Add reference style insert if analyzed (applies to all prompts)
    const referenceInsert = buildReferencePromptInsert(referenceSettings);
    if (referenceInsert) {
      enhancedPrompt += `\n\n${referenceInsert}`;
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

    const initialImages: GeneratedImage[] = promptList.map((prompt, i) => ({
      id: `img-${Date.now()}-${i}`,
      prompt,
      status: "pending" as const,
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

        if (logoSettings.url) {
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
      toast({ title: "Download failed", description: "Could not download the image.", variant: "destructive" });
    }
  };

  const handleDownloadAll = async () => {
    const completedImages = images.filter((img) => img.status === "completed" && img.imageUrl);
    if (completedImages.length === 0) {
      toast({ title: "No images to download", description: "Generate some images first.", variant: "destructive" });
      return;
    }

    // If some images are selected, download only selected; otherwise download all
    const imagesToDownload = selectedImageIds.size > 0
      ? completedImages.filter((img) => selectedImageIds.has(img.id))
      : completedImages;

    if (imagesToDownload.length === 0) {
      toast({ title: "No images selected", description: "Select images to download or download all.", variant: "destructive" });
      return;
    }

    setIsDownloading(true);
    try {
      const zip = new JSZip();
      for (let i = 0; i < imagesToDownload.length; i++) {
        const image = imagesToDownload[i];
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
      const downloadMsg = selectedImageIds.size > 0
        ? `Downloaded ${imagesToDownload.length} selected images as ZIP.`
        : `Downloaded ${imagesToDownload.length} images as ZIP.`;
      toast({ title: "Download complete", description: downloadMsg });
      // Clear selection after download
      if (selectedImageIds.size > 0) {
        setSelectedImageIds(new Set());
      }
    } catch (error) {
      toast({ title: "Download failed", description: "Could not create ZIP file.", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleImageSelect = (id: string, selected: boolean) => {
    setSelectedImageIds((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleClearAll = () => {
    setImages([]);
    setSelectedImageIds(new Set());
    setGenerationStatus({ current: 0, total: 0, completed: 0, failed: 0 });
  };

  const handleRemoveFromHistory = (id: string) => {
    removeFromHistory(id);
    setHistory(getHistory());
    toast({ title: "Removed from history", description: "Image has been removed from history." });
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    toast({ title: "History cleared", description: "All history has been cleared." });
  };

  const handleDownloadFromHistory = (entry: HistoryEntry) => {
    if (!entry.imageDataUrl) return;
    try {
      const blob = base64ToBlob(entry.imageDataUrl);
      saveAs(blob, `image-${entry.id}.png`);
    } catch (error) {
      toast({ title: "Download failed", description: "Could not download the image.", variant: "destructive" });
    }
  };

  const promptCount = parsePrompts().length;
  const totalGenerated = images.filter((img) => img.status === "completed").length;

  // Show landing page
  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <aside
        className={`sidebar-gradient-rail flex flex-col bg-[#0B1530] border-r border-white/10 h-screen sticky top-0 transition-all duration-300 ${sidebarCollapsed ? "w-0 overflow-hidden" : "w-[340px] min-w-[340px]"}`}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 shadow-lg neon-glow-cyan">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">al-ai.ai</h1>
              <p className="text-xs text-cyan-400">Social Medias Creative Generator</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarCollapsed(true)} className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10">
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
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
                targetLocation: brandStyle.targetLocation,
                targetIncome: brandStyle.targetIncome,
                targetInterests: brandStyle.targetInterests,
                targetLanguage: brandStyle.targetLanguage,
              }}
              onChange={(audienceData) => setBrandStyle(prev => ({
                ...prev,
                targetGender: audienceData.targetGender,
                targetAgeRange: audienceData.targetAgeRange,
                targetAudienceDescription: audienceData.targetAudienceDescription,
                selectedAudienceProfileId: audienceData.selectedAudienceProfileId,
                audiencePromptInsert: audienceData.audiencePromptInsert,
                targetLocation: audienceData.targetLocation,
                targetIncome: audienceData.targetIncome,
                targetInterests: audienceData.targetInterests,
                targetLanguage: audienceData.targetLanguage,
              }))}
              disabled={isGenerating}
            />
            <ReferenceImages
              data={referenceSettings}
              onChange={setReferenceSettings}
              onAnalyze={handleAnalyzeReference}
              isAnalyzing={isAnalyzing}
              disabled={isGenerating}
            />
            <LogoUploader settings={logoSettings} onChange={setLogoSettings} disabled={isGenerating} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-white/10 space-y-3">
          {!isGenerating ? (
            <Button
              onClick={() => setSuggestDialogOpen(true)}
              className="w-full h-11 text-base font-semibold btn-gradient rounded-xl"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Prompts
            </Button>
          ) : (
            <Button onClick={handleStop} variant="destructive" className="w-full h-11 text-base font-semibold">
              <Square className="w-4 h-4 mr-2" />
              Stop Generation
            </Button>
          )}
          {totalGenerated > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              <span className="font-bold text-primary">{totalGenerated}</span> images generated
            </div>
          )}
        </div>

        <div className="p-3 border-t border-white/10 space-y-2">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <input
              type="checkbox"
              id="addToProfiles"
              checked={brandStyle.brandName.trim().length > 0}
              onChange={() => {
                if (brandStyle.brandName.trim().length > 0) {
                  handleSaveProfile();
                }
              }}
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500"
              disabled={brandStyle.brandName.trim().length === 0}
            />
            <label htmlFor="addToProfiles" className="text-sm text-[#A7B6D6] cursor-pointer">
              Add to profiles
            </label>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-[#A7B6D6] hover:text-white hover:bg-white/10" onClick={() => setShowLanding(true)}>
            <HomeIcon className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-[#A7B6D6] hover:text-white hover:bg-white/10" onClick={toggleTheme}>
            {isDark ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>
      </aside>

      {sidebarCollapsed && (
        <Button variant="outline" size="icon" onClick={() => setSidebarCollapsed(false)} className="fixed top-4 left-4 z-50 shadow-lg">
          <PanelLeft className="w-4 h-4" />
        </Button>
      )}

      <main className="flex-1 min-h-screen">
        <header className="sticky top-0 z-10 bg-[#0B1530]/80 backdrop-blur-sm border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gradient">Create Images</h2>
              <p className="text-sm text-[#A7B6D6]">Enter your prompts and generate AI images in bulk</p>
            </div>
            {isGenerating && (
              <div className="flex items-center gap-2 text-sm text-[#A7B6D6]">
                <Sparkles className="w-4 h-4 animate-pulse text-cyan-400" />
                <span>Generating...</span>
              </div>
            )}
          </div>
        </header>

        <div className="p-6 space-y-6">
          <div className="grid xl:grid-cols-2 gap-6">
            <div className="space-y-6">
              <PromptInput prompts={prompts} onChange={setPrompts} disabled={isGenerating} brandStyle={brandStyle} suggestDialogOpen={suggestDialogOpen} onSuggestDialogChange={setSuggestDialogOpen} onGenerateImage={handleGenerate} />
              <GenerationProgress status={generationStatus} isVisible={isGenerating || generationStatus.total > 0} />
            </div>

            <div>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "generated" | "history")}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Images className="w-5 h-5 text-muted-foreground" />
                    Generated Images
                    {images.filter(img => img.status === 'completed').length > 0 && (
                      <span className="text-sm font-normal text-muted-foreground">
                        ({images.filter(img => img.status === 'completed').length})
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-3">
                    {selectedImageIds.size > 0 && (
                      <span className="text-sm text-emerald-400 font-medium">
                        {selectedImageIds.size} selected
                      </span>
                    )}
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleDownloadAll}
                      disabled={images.filter(img => img.status === 'completed').length === 0 || isDownloading}
                      className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isDownloading ? 'Preparing...' : selectedImageIds.size > 0 ? `Download ${selectedImageIds.size} Selected` : 'Download ZIP'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAll}
                      disabled={images.length === 0}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <TabsList>
                      <TabsTrigger value="generated">
                        <Images className="w-4 h-4 mr-2" />
                        Generated
                      </TabsTrigger>
                      <TabsTrigger value="history">
                        <History className="w-4 h-4 mr-2" />
                        History
                        {history.length > 0 && <span className="ml-2 text-xs text-muted-foreground">({history.length})</span>}
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>

                <TabsContent value="generated">
                  <ImageGallery
                    images={images}
                    onDownload={handleDownload}
                    onDownloadAll={handleDownloadAll}
                    onClearAll={handleClearAll}
                    onPreview={setPreviewImage}
                    isDownloading={isDownloading}
                    selectedIds={selectedImageIds}
                    onSelect={handleImageSelect}
                  />
                </TabsContent>

                <TabsContent value="history">
                  <div className="h-full flex flex-col">
                    <div className="pb-4 flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">History</h3>
                        {history.length > 0 && <span className="text-sm font-normal text-muted-foreground">({history.length} items)</span>}
                      </div>
                      {history.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={handleClearHistory}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear All History
                        </Button>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      {history.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-12">
                          <History className="w-16 h-16 mb-4 opacity-20" />
                          <p className="text-lg font-medium">No history yet</p>
                          <p className="text-sm mt-1">Generated images will appear here</p>
                        </div>
                      ) : (
                        <ScrollArea className="h-[calc(100vh-300px)]">
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pr-4">
                            {history.map((entry) => (
                              <Card key={entry.id} className="overflow-hidden">
                                <div className="relative aspect-square">
                                  <img src={entry.imageDataUrl} alt={entry.prompt} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-3 space-y-2">
                                  <p className="text-sm line-clamp-2" title={entry.prompt}>{entry.prompt}</p>
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs text-muted-foreground">{format(new Date(entry.generatedAt), "MMM d, yyyy h:mm a")}</span>
                                    <div className="flex items-center gap-1">
                                      <Button variant="ghost" size="icon" onClick={() => handleDownloadFromHistory(entry)}>
                                        <Download className="w-4 h-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" onClick={() => handleRemoveFromHistory(entry.id)}>
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
          </div>
        </div>
      </main>

      <ImagePreviewModal image={previewImage} isOpen={!!previewImage} onClose={() => setPreviewImage(null)} onDownload={handleDownload} />
      <ChatAssistant />
    </div>
  );
}
