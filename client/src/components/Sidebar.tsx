import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ImagePlus,
  Palette,
  Users,
  Sparkles,
  Images,
  Layers,
  Settings,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

type SidebarSection = "create" | "brand" | "audience" | "style" | "gallery" | "batch";

interface SidebarProps {
  activeSection: SidebarSection;
  onSectionChange: (section: SidebarSection) => void;
  totalGenerated: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const menuItems = [
  { id: "create" as SidebarSection, icon: ImagePlus, label: "New Image", description: "Create images" },
  { id: "brand" as SidebarSection, icon: Palette, label: "Brand Setup", description: "Brand identity" },
  { id: "audience" as SidebarSection, icon: Users, label: "Target Audience", description: "Define audience" },
  { id: "style" as SidebarSection, icon: Sparkles, label: "Style Library", description: "Visual presets" },
  { id: "gallery" as SidebarSection, icon: Images, label: "My Images", description: "View gallery" },
  { id: "batch" as SidebarSection, icon: Layers, label: "Batch Create", description: "Bulk generation" },
];

export default function Sidebar({
  activeSection,
  onSectionChange,
  totalGenerated,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <aside
      className={`
        flex flex-col bg-card border-r h-screen sticky top-0 transition-all duration-300
        ${isCollapsed ? "w-[72px]" : "w-[260px]"}
      `}
    >
      {/* Logo */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center w-full" : ""}`}>
          <div className="p-2 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg">
            <ImagePlus className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-lg">AI Studio</h1>
              <p className="text-xs text-muted-foreground">Image Generator</p>
            </div>
          )}
        </div>
        {onToggleCollapse && !isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onToggleCollapse}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Collapse button when collapsed */}
      {isCollapsed && onToggleCollapse && (
        <div className="px-3 py-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-full h-10"
            onClick={onToggleCollapse}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                  ${isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "" : ""}`} />
                {!isCollapsed && (
                  <div className="text-left">
                    <p className="font-medium text-sm">{item.label}</p>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Stats */}
      {!isCollapsed && totalGenerated > 0 && (
        <div className="mx-3 mb-3 p-3 rounded-lg bg-muted/50 border">
          <div className="flex items-center gap-2 text-sm">
            <Images className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Generated today:</span>
            <span className="font-bold text-primary">{totalGenerated}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t space-y-2">
        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "sm"}
          className={`${isCollapsed ? "" : "w-full justify-start"}`}
          onClick={toggleTheme}
          title={isCollapsed ? (isDark ? "Light Mode" : "Dark Mode") : undefined}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {!isCollapsed && <span className="ml-2">{isDark ? "Light Mode" : "Dark Mode"}</span>}
        </Button>
        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "sm"}
          className={`${isCollapsed ? "" : "w-full justify-start"}`}
          title={isCollapsed ? "Settings" : undefined}
        >
          <Settings className="w-4 h-4" />
          {!isCollapsed && <span className="ml-2">Settings</span>}
        </Button>
      </div>
    </aside>
  );
}

export type { SidebarSection };
