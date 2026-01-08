# Dependency Audit Report
## al-ai.ai Social Medias Creative Generator

**Date:** January 2026  
**Total Dependencies:** 634 (408 prod, 222 dev, 128 optional)

---

## 🔴 SECURITY VULNERABILITIES (3 High)

| Package | Severity | Issue | Fix |
|---------|----------|-------|-----|
| `express` | HIGH | Via qs/body-parser DoS vulnerability | Update to 4.22.1+ |
| `body-parser` | HIGH | qs arrayLimit bypass | Update express |
| `qs` | HIGH | Memory exhaustion DoS (CVE) | Update to 6.14.1+ |

**Action Required:** Run `npm audit fix` or update express to 4.22.1+

---

## 📦 DEPENDENCIES ANALYSIS

### ✅ KEEP - Essential (Currently Used)

| Package | Status | Purpose |
|---------|--------|---------|
| `@google/genai` | ✅ KEEP | Core AI image generation |
| `react` / `react-dom` | ✅ KEEP | UI framework |
| `express` | ✅ KEEP (UPDATE) | Backend server |
| `lucide-react` | ✅ KEEP | Icons |
| `tailwind-merge` | ✅ KEEP | CSS utilities |
| `clsx` | ✅ KEEP | Class names |
| `class-variance-authority` | ✅ KEEP | Component variants |
| `date-fns` | ✅ KEEP | Date formatting |
| `jszip` | ✅ KEEP | ZIP file creation |
| `file-saver` | ✅ KEEP | File downloads |
| `wouter` | ✅ KEEP | Routing |
| `zod` | ✅ KEEP | Validation |
| `@tanstack/react-query` | ✅ KEEP | Data fetching |

### ✅ KEEP - UI Components (Actively Used)

| Package | Used In |
|---------|---------|
| `@radix-ui/react-checkbox` | ImageCard selection |
| `@radix-ui/react-dialog` | Modals |
| `@radix-ui/react-label` | Form labels |
| `@radix-ui/react-progress` | Generation progress |
| `@radix-ui/react-scroll-area` | Scrollable areas |
| `@radix-ui/react-select` | Dropdowns |
| `@radix-ui/react-slider` | Logo size/opacity |
| `@radix-ui/react-tabs` | Generated/History tabs |
| `@radix-ui/react-toast` | Notifications |
| `@radix-ui/react-tooltip` | Tooltips |
| `@radix-ui/react-slot` | Component composition |

### ⚠️ KEEP - shadcn/ui Components (Future Use)

All other `@radix-ui/*` packages are part of the shadcn/ui component library.
**Recommendation:** KEEP all for future UI extensibility.

---

## 🔴 REMOVE - Not Used

| Package | Reason | Command |
|---------|--------|---------|
| `connect-pg-simple` | No PostgreSQL sessions | `npm uninstall connect-pg-simple` |
| `drizzle-orm` | No database used | `npm uninstall drizzle-orm` |
| `drizzle-zod` | No database used | `npm uninstall drizzle-zod` |
| `drizzle-kit` | No database used | `npm uninstall drizzle-kit` |
| `pg` | No PostgreSQL | `npm uninstall pg` |
| `passport` | No authentication | `npm uninstall passport` |
| `passport-local` | No authentication | `npm uninstall passport-local` |
| `express-session` | No sessions | `npm uninstall express-session` |
| `memorystore` | No sessions | `npm uninstall memorystore` |
| `input-otp` | No OTP feature | `npm uninstall input-otp` |

### Quick Remove Command:
```bash
npm uninstall connect-pg-simple drizzle-orm drizzle-zod drizzle-kit pg passport passport-local express-session memorystore input-otp
```

---

## 🟡 REVIEW - Consider Removing

| Package | Size | Used? | Recommendation |
|---------|------|-------|----------------|
| `recharts` | ~300KB | No | Remove if no charts |
| `framer-motion` | ~150KB | Minimal | Keep for animations |
| `embla-carousel-react` | ~30KB | No | Remove if no carousel |
| `react-resizable-panels` | ~20KB | No | Remove if no panels |
| `react-day-picker` | ~50KB | No | Remove if no dates |
| `vaul` | ~15KB | No | Remove if no drawers |
| `cmdk` | ~20KB | No | Remove if no command menu |
| `react-icons` | ~5KB | Maybe | lucide-react is sufficient |
| `ws` | ~10KB | No | Keep for future WebSocket |

### Optional Remove Command:
```bash
npm uninstall recharts embla-carousel-react react-resizable-panels react-day-picker vaul cmdk react-icons
```

---

## 🔧 REPLIT-SPECIFIC (Remove if not on Replit)

```bash
npm uninstall @replit/vite-plugin-cartographer @replit/vite-plugin-dev-banner @replit/vite-plugin-runtime-error-modal
```

---

## 📊 OUTDATED PACKAGES

### 🔴 Critical Updates (Security)

| Package | Current | Latest | Action |
|---------|---------|--------|--------|
| `express` | 4.21.2 | 4.22.1 | **UPDATE NOW** |

### 🟡 Recommended Updates

| Package | Current | Latest |
|---------|---------|--------|
| `lucide-react` | 0.453.0 | 0.562.0 |
| `@tanstack/react-query` | 5.60.5 | 5.90.16 |
| `typescript` | 5.6.3 | 5.9.3 |
| `wouter` | 3.3.5 | 3.9.0 |

---

## 📈 ESTIMATED SAVINGS

| Action | Packages | Est. Bundle Savings |
|--------|----------|---------------------|
| Remove DB packages | 5 | ~50KB |
| Remove Auth packages | 4 | ~30KB |
| Remove unused UI | 7 | ~150KB |
| **TOTAL** | 16 | **~230KB** |

---

## ✅ SUMMARY

### MUST DO
1. ✅ Run `npm audit fix` (security)
2. ✅ Update `express` to 4.22.1+

### RECOMMENDED
1. Remove database packages (not used)
2. Remove auth packages (not used)  
3. Remove `input-otp` (not used)

### OPTIONAL
1. Remove unused UI packages for smaller bundle
2. Remove Replit plugins if not on Replit

### KEEP EVERYTHING ELSE
All Radix UI, Tailwind, React ecosystem packages are essential or useful for future features.
