import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Image,
  Palette,
  Users,
  Zap,
  Download,
  ArrowRight,
  CheckCircle2,
  Play,
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Generation",
      description: "Generate stunning social media images using advanced AI technology with simple text prompts.",
      glowClass: "group-hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]",
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Brand Consistency",
      description: "Maintain your brand identity with customizable colors, fonts, and visual styles across all images.",
      glowClass: "group-hover:shadow-[0_0_30px_rgba(167,139,250,0.3)]",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Audience Targeting",
      description: "Tailor your content to specific demographics, markets/locations, and interests for maximum engagement.",
      glowClass: "group-hover:shadow-[0_0_30px_rgba(244,114,182,0.3)]",
    },
    {
      icon: <Image className="w-6 h-6" />,
      title: "Reference Matching",
      description: "Upload reference images (if available) and let AI match the style, mood, and composition automatically.",
      glowClass: "group-hover:shadow-[0_0_30px_rgba(52,211,153,0.3)]",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Bulk Generation",
      description: "Create multiple images at once with different prompts - perfect for content calendars.",
      glowClass: "group-hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]",
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Easy Export",
      description: "Download individual images or batch export as ZIP. Add your logo automatically to all images.",
      glowClass: "group-hover:shadow-[0_0_30px_rgba(167,139,250,0.3)]",
    },
  ];

  const promptChips = [
    "New product launch",
    "Ramadan offer",
    "Minimal luxury",
    "Bold neon tech",
    "Real estate listing",
    "Before/after promo",
  ];

  const benefits = [
    "No design skills required",
    "Save hours on content creation",
    "Consistent brand aesthetics",
    "Multiple social media formats",
    "AI-powered suggestions",
    "Unlimited creativity",
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-lg shadow-violet-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white">al-ai.ai</h1>
              <p className="text-xs text-cyan-400">Social Medias Creative Generator</p>
            </div>
          </div>
          <Button
            onClick={onGetStarted}
            className="btn-gradient rounded-xl px-6"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center">
          {/* Left: Content */}
          <div>
            <div className="hero-pill mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Powered by Google Gemini AI
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              Generate{" "}
              <span className="text-gradient">scroll-stopping</span>
              <br />
              social creatives in seconds
            </h1>

            <p className="text-lg text-[#A7B6D6] max-w-[56ch] mb-8 leading-relaxed">
              Upload your brand, type prompts, and generate consistent social images in bulk —
              ready to download as a ZIP.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="btn-gradient rounded-2xl text-lg px-8 py-6"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Creating Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/10 bg-white/[0.03] text-white hover:bg-white/10 hover:border-white/20 rounded-2xl text-lg px-8 py-6"
                onClick={onGetStarted}
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Prompt Chips */}
            <div className="flex flex-wrap gap-2">
              {promptChips.map((chip, i) => (
                <button
                  key={i}
                  onClick={onGetStarted}
                  className="chip text-sm text-white/90"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Preview Mock */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[460px]">
              {/* Glow effect */}
              <div className="absolute -inset-4 mock-glow rounded-3xl"></div>
              {/* Frame */}
              <div className="relative glass-card rounded-2xl overflow-hidden">
                <div className="p-6 min-h-[320px] flex flex-col">
                  {/* Mini app preview */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                  </div>
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="h-8 bg-white/5 rounded-lg w-3/4"></div>
                    <div className="h-4 bg-white/5 rounded w-1/2"></div>
                    <div className="flex-1 grid grid-cols-2 gap-3 mt-4">
                      <div className="bg-gradient-to-br from-cyan-500/20 to-violet-500/20 rounded-lg"></div>
                      <div className="bg-gradient-to-br from-violet-500/20 to-pink-500/20 rounded-lg"></div>
                      <div className="bg-gradient-to-br from-pink-500/20 to-cyan-500/20 rounded-lg"></div>
                      <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-lg"></div>
                    </div>
                  </div>
                  <div className="mt-4 h-10 btn-gradient rounded-lg flex items-center justify-center text-sm font-semibold">
                    Generate Prompts
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits list */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-16 text-[#A7B6D6]">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need for{" "}
            <span className="text-gradient">Social Media Success</span>
          </h2>
          <p className="text-[#A7B6D6] text-lg max-w-2xl mx-auto">
            Our comprehensive toolkit helps you create, customize, and export
            professional images that align with your brand and resonate with your audience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Card
              key={i}
              className={`group bg-white/[0.03] border-white/10 hover:bg-white/[0.06] transition-all duration-300 hover:border-white/20 ${feature.glowClass}`}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 via-violet-500/20 to-pink-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:from-cyan-500/30 group-hover:via-violet-500/30 group-hover:to-pink-500/30 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#A7B6D6] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-[#A7B6D6] text-lg">
            Three simple steps to create amazing content
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Set Your Brand",
              description: "Configure your brand colors, fonts, and visual style. Add your logo and define your target audience.",
              color: "text-cyan-400",
            },
            {
              step: "02",
              title: "Write Prompts",
              description: "Enter your image ideas as text prompts. Use our AI suggestions for inspiration and optimization.",
              color: "text-violet-400",
            },
            {
              step: "03",
              title: "Generate & Export",
              description: "Click generate and watch AI create your images. Download individually or batch export as ZIP.",
              color: "text-pink-400",
            },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className={`text-6xl font-bold ${item.color} opacity-30 mb-4`}>
                {item.step}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {item.title}
              </h3>
              <p className="text-[#A7B6D6] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-violet-600 to-pink-600"></div>
          {/* Pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTItNC0yLTQtMi0yIDItMiA0IDIgNCAyIDQgNCAyIDQgMiAyLTIgMi00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>

          <div className="relative z-10 p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Social Media?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of creators and businesses using al-ai.ai to produce
              stunning visual content that drives engagement and grows their audience.
            </p>
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-6 rounded-2xl shadow-lg font-semibold"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Creating Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">al-ai.ai</span>
          </div>
          <p className="text-[#A7B6D6] text-sm">
            © 2024 al-ai.ai. Social Medias Creative Generator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
