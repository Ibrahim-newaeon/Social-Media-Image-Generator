# Design Guidelines: AI Image Bulk Generator

## Design Approach
**Design System Approach** - Using a modern, utility-focused design pattern inspired by Linear and Vercel's clean aesthetics combined with Material Design's clarity for data-heavy interfaces. This tool prioritizes efficiency, clear visual feedback, and batch processing workflows.

## Core Design Elements

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Headings**: font-semibold to font-bold
  - H1: text-3xl (main title)
  - H2: text-xl (section headers)
  - H3: text-lg (card headers)
- **Body**: text-sm to text-base, font-normal
- **Labels**: text-xs to text-sm, font-medium, uppercase tracking-wide for emphasis

### Layout System
**Spacing Units**: Use Tailwind units of **2, 4, 8, 12, and 16** for consistent rhythm
- Component padding: p-4 to p-8
- Section spacing: space-y-8 to space-y-12
- Card gaps: gap-4 to gap-8
- Container max-width: max-w-7xl with mx-auto

### Component Structure

**Main Layout**
- Header: Fixed top bar with app title and generation stats
- Primary workspace: Two-column layout on desktop (lg:grid-cols-2)
  - Left: Input controls and queue management
  - Right: Generated images gallery
- Mobile: Stack vertically (grid-cols-1)

**Bulk Prompt Input**
- Large textarea with monospace font (font-mono) for clarity
- Placeholder text: "Enter prompts (one per line)..."
- Character/line counter below textarea
- Height: min-h-[300px]
- Border with focus state

**Generation Controls**
- Primary action button: "Generate Images" (large, prominent)
- Settings row: Model selector dropdown, batch size input
- Clear controls layout with labels above inputs

**Progress Tracking**
- Linear progress bar showing overall completion
- Queue list displaying each prompt with status badges:
  - Pending (neutral)
  - Generating (animated, pulsing)
  - Complete (success)
  - Failed (error)
- Status icons using Heroicons

**Image Gallery**
- Responsive grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Each image card contains:
  - Generated image with aspect-ratio-square wrapper
  - Prompt text overlay on hover (with blurred background)
  - Download icon button (top-right corner)
  - Loading skeleton during generation
- gap-4 between cards
- Smooth transitions on hover

**Bulk Actions Bar**
- Fixed bottom bar or section below gallery
- "Download All as ZIP" primary button
- "Clear All" secondary button
- Batch counter showing total generated images

### Visual Patterns
- **Cards**: Subtle borders (border), no shadows initially, hover:shadow-md
- **Buttons**: 
  - Primary: Solid with rounded-lg
  - Secondary: Border with transparent background
  - Icon buttons: Circular or square with hover:bg-gray-100
- **Form inputs**: border with rounded-md, focus ring
- **Status badges**: Pill-shaped (rounded-full), small text with padding px-2 py-1

### Animations
**Minimal and Purposeful**
- Progress bar: Smooth width transition
- Generating status: Subtle pulse animation
- Hover states: transition-all duration-200
- Image load: Fade-in effect
- NO scroll animations, NO parallax effects

### Icons
**Heroicons** (via CDN)
- Download: arrow-down-tray
- Clear/Delete: trash
- Status check: check-circle
- Loading: arrow-path (with spin animation)
- Settings: cog-6-tooth

### Images Section
**No Hero Image** - This is a utility application
- Generated images are the primary visual content
- Empty state: Simple illustration or icon indicating "No images yet"
- Placeholder during generation: Skeleton loader matching image card dimensions

### Accessibility
- Proper label associations for all form inputs
- ARIA live regions for progress updates
- Keyboard navigation support for gallery
- Focus indicators on all interactive elements
- Status announcements for screen readers

---

**Design Philosophy**: Clean, distraction-free interface that puts user workflow first. Visual feedback is immediate and clear. Every element serves the function of efficient batch image generation and management.