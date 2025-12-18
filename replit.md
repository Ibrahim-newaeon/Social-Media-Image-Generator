# Bulk AI Image Generator

## Overview

A web-based bulk AI image generation application that allows users to generate multiple images from text prompts using Google's Gemini AI. The application features a modern React frontend with a Node.js/Express backend, enabling users to input multiple prompts (one per line), generate images in bulk, track progress, preview results, and download all generated images as a ZIP file.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React useState for local state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite with React plugin

**Key Design Decisions**:
- Component-based architecture with dedicated components for each UI concern (PromptInput, ImageGallery, GenerationProgress, BrandGuidelines, etc.)
- Client-side image processing and ZIP creation using JSZip and FileSaver
- Real-time progress tracking during bulk generation with ref-based stop control
- Brand Style Guidelines feature allows users to define brand identity (colors, fonts, visual style) that automatically prefixes all image generation prompts
- Logo overlay feature: Users can upload a brand logo that is automatically composited onto all generated images in the bottom-right corner (25% width, with padding, preserving logo transparency)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **Build**: esbuild for production bundling with selective dependency bundling

**API Structure**:
- `POST /api/generate-image` - Generates a single image from a prompt using Gemini AI
- Returns base64-encoded image data with MIME type

**Key Design Decisions**:
- Uses Replit AI Integrations for Gemini API access (no external API key required)
- Modular route registration pattern with dedicated integration directories
- Batch processing utilities with rate limiting, retries, and progress callbacks

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for shared type definitions
- **Current Tables**: Users table (basic auth structure), Conversations/Messages (chat feature)
- **Storage Pattern**: In-memory storage class with interface for future database migration

### Image Generation Integration
- **Provider**: Google Gemini via Replit AI Integrations
- **Model**: `gemini-2.5-flash-image` for image generation
- **Output**: Base64-encoded images returned as data URLs
- **Rate Limiting**: Built-in batch processing with configurable concurrency and exponential backoff retries

## External Dependencies

### AI Services
- **Replit AI Integrations**: Provides Gemini API access through environment variables
  - `AI_INTEGRATIONS_GEMINI_API_KEY` - API key for Gemini
  - `AI_INTEGRATIONS_GEMINI_BASE_URL` - Base URL for API calls
- **Google GenAI SDK**: `@google/genai` for Gemini API interactions

### Database
- **PostgreSQL**: Primary database (configured via `DATABASE_URL` environment variable)
- **Drizzle Kit**: Database migrations and schema management

### Frontend Libraries
- **JSZip**: Client-side ZIP file creation for bulk downloads
- **FileSaver**: Browser file download handling
- **Radix UI**: Accessible component primitives (dialogs, tooltips, progress, etc.)
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Development server with HMR
- **Replit Plugins**: Error overlay, cartographer, and dev banner for Replit environment
- **TypeScript**: Full type safety across client and server