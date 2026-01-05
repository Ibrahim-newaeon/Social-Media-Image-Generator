import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Image,
  Palette,
  Target,
  Zap,
  Download,
  ArrowRight,
  CheckCircle2,
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
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Brand Consistency",
      description: "Maintain your brand identity with customizable colors, fonts, and visual styles across all images.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Target Audience",
      description: "Tailor your content to specific demographics, locations, and interests for maximum engagement.",
    },
    {
      icon: <Image className="w-6 h-6" />,
      title: "Reference Matching",
      description: "Upload reference images and let AI match the style, mood, and composition automatically.",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Bulk Generation",
      description: "Create multiple images at once with different prompts - perfect for content calendars.",
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Easy Export",
      description: "Download individual images or batch export as ZIP. Add your logo automatically to all images.",
    },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 shadow-lg shadow-teal-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white">al-ai.ai</h1>
              <p className="text-xs text-teal-400">Social Medias Creative Generator</p>
            </div>
          </div>
          <Button
            onClick={onGetStarted}
            className="bg-teal-600 hover:bg-teal-500 text-white"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm mb-8">
          <Sparkles className="w-4 h-4" />
          Powered by Google Gemini AI
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Create Stunning{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
            Social Media
          </span>{" "}
          Images with AI
        </h1>

        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
          Transform your ideas into professional social media content in seconds.
          Our AI-powered platform generates brand-consistent, audience-targeted images
          that engage and convert — no design experience needed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white text-lg px-8 py-6 shadow-lg shadow-teal-500/25"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Creating Free
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6"
            onClick={onGetStarted}
          >
            View Demo
          </Button>
        </div>

        {/* Benefits list */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-gray-400">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
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
            <span className="text-teal-400">Social Media Success</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our comprehensive toolkit helps you create, customize, and export
            professional images that align with your brand and resonate with your audience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Card
              key={i}
              className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 hover:border-teal-500/50 group"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center text-teal-400 mb-4 group-hover:from-teal-500/30 group-hover:to-cyan-500/30 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
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
          <p className="text-gray-400 text-lg">
            Three simple steps to create amazing content
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Set Your Brand",
              description: "Configure your brand colors, fonts, and visual style. Add your logo and define your target audience.",
            },
            {
              step: "02",
              title: "Write Prompts",
              description: "Enter your image ideas as text prompts. Use our AI suggestions for inspiration and optimization.",
            },
            {
              step: "03",
              title: "Generate & Export",
              description: "Click generate and watch AI create your images. Download individually or batch export as ZIP.",
            },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-6xl font-bold text-teal-500/20 mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {item.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="relative rounded-3xl bg-gradient-to-r from-teal-600 to-cyan-600 p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTItNC0yLTQtMi0yIDItMiA0IDIgNCAyIDQgNCAyIDQgMiAyLTIgMi00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
          <div className="relative z-10">
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
              className="bg-white text-teal-600 hover:bg-gray-100 text-lg px-8 py-6 shadow-lg"
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
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">al-ai.ai</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2024 al-ai.ai. Social Medias Creative Generator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
