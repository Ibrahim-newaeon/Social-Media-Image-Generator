# Dependency Audit Report

**Date:** January 3, 2026
**Project:** Social-Media-Image-Generator

---

## Executive Summary

This audit identified **3 high-severity security vulnerabilities**, **19+ unused packages** contributing to bloat, and several outdated dependencies requiring updates.

---

## 1. Security Vulnerabilities (CRITICAL)

### High Severity Issues

| Package | Vulnerability | Severity | Fix |
|---------|--------------|----------|-----|
| `qs` | arrayLimit bypass allows DoS via memory exhaustion | **HIGH** | Update to >=6.14.1 |
| `body-parser` | Depends on vulnerable `qs` | **HIGH** | Update to >1.20.3 |
| `express` | Depends on vulnerable `body-parser` and `qs` | **HIGH** | Update to >=4.22.1 or 5.x |

### Recommended Fix

```bash
# Option 1: Quick fix via npm audit
npm audit fix

# Option 2: Update express to latest v4 (recommended)
npm install express@^4.22.1

# Option 3: Upgrade to Express 5 (major version change)
npm install express@^5.2.1
```

---

## 2. Unused Dependencies (BLOAT)

### Radix UI Components - Unused (19 packages)

These packages have wrapper files in `client/src/components/ui/` but the wrappers are **never imported** by actual application code:

| Package | Status | Recommendation |
|---------|--------|----------------|
| `@radix-ui/react-accordion` | Unused | Remove |
| `@radix-ui/react-alert-dialog` | Unused | Remove |
| `@radix-ui/react-aspect-ratio` | Unused | Remove |
| `@radix-ui/react-avatar` | Unused | Remove |
| `@radix-ui/react-checkbox` | Unused | Remove |
| `@radix-ui/react-collapsible` | Unused | Remove |
| `@radix-ui/react-context-menu` | Unused | Remove |
| `@radix-ui/react-dropdown-menu` | Unused | Remove |
| `@radix-ui/react-hover-card` | Unused | Remove |
| `@radix-ui/react-menubar` | Unused | Remove |
| `@radix-ui/react-navigation-menu` | Unused | Remove |
| `@radix-ui/react-popover` | Unused | Remove |
| `@radix-ui/react-radio-group` | Unused | Remove |
| `@radix-ui/react-separator` | Unused | Remove |
| `@radix-ui/react-slider` | Unused | Remove |
| `@radix-ui/react-switch` | Unused | Remove |
| `@radix-ui/react-tabs` | Unused | Remove |
| `@radix-ui/react-toggle` | Unused | Remove |
| `@radix-ui/react-toggle-group` | Unused | Remove |

### Other Unused Dependencies (7 packages)

| Package | Status | Notes |
|---------|--------|-------|
| `date-fns` | Unused | Only in build allowlist, no actual imports |
| `react-icons` | Unused | No imports found (using `lucide-react` instead) |
| `next-themes` | Unused | No imports found |
| `framer-motion` | Unused | No imports found |
| `passport` | Unused | Only in build allowlist, no actual imports |
| `passport-local` | Unused | Only in build allowlist, no actual imports |
| `@jridgewell/trace-mapping` | Unused | No imports found (may be transitive dep) |

### Cleanup Command

```bash
npm uninstall \
  @radix-ui/react-accordion \
  @radix-ui/react-alert-dialog \
  @radix-ui/react-aspect-ratio \
  @radix-ui/react-avatar \
  @radix-ui/react-checkbox \
  @radix-ui/react-collapsible \
  @radix-ui/react-context-menu \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-hover-card \
  @radix-ui/react-menubar \
  @radix-ui/react-navigation-menu \
  @radix-ui/react-popover \
  @radix-ui/react-radio-group \
  @radix-ui/react-separator \
  @radix-ui/react-slider \
  @radix-ui/react-switch \
  @radix-ui/react-tabs \
  @radix-ui/react-toggle \
  @radix-ui/react-toggle-group \
  date-fns \
  react-icons \
  next-themes \
  framer-motion \
  passport \
  passport-local \
  @jridgewell/trace-mapping
```

**Estimated reduction:** ~26 packages removed

---

## 3. Outdated Dependencies

### Major Version Updates Available

| Package | Current | Latest | Breaking Changes Expected |
|---------|---------|--------|--------------------------|
| `express` | 4.21.2 | 5.2.1 | Yes - Express 5 has API changes |
| `react` | 18.3.1 | 19.2.3 | Yes - React 19 has breaking changes |
| `react-dom` | 18.3.1 | 19.2.3 | Yes - Must match React version |
| `zod` | 3.25.76 | 4.3.4 | Yes - Zod 4 has new API |
| `zod-validation-error` | 3.5.4 | 5.0.0 | Yes - Major version jump |
| `framer-motion` | 11.13.1 | 12.23.26 | Yes - Major version change |
| `date-fns` | 3.6.0 | 4.1.0 | Yes - API changes |
| `recharts` | 2.15.2 | 3.6.0 | Yes - Major rewrite |
| `react-day-picker` | 8.10.1 | 9.13.0 | Yes - New API |
| `react-resizable-panels` | 2.1.7 | 4.2.0 | Yes - Major changes |
| `tailwind-merge` | 2.6.0 | 3.4.0 | Yes - API changes |

### Minor/Patch Updates (Safe to Update)

| Package | Current | Latest | Risk |
|---------|---------|--------|------|
| `@hookform/resolvers` | 3.10.0 | 5.2.2 | Low |
| `drizzle-orm` | 0.39.3 | 0.45.1 | Low |
| `drizzle-zod` | 0.7.1 | 0.8.3 | Low |
| `lucide-react` | 0.453.0 | 0.562.0 | Low |
| `wouter` | 3.3.5 | 3.9.0 | Low |
| `typescript` | 5.6.3 | Latest | Low |

### Safe Update Command

```bash
npm update @hookform/resolvers drizzle-orm drizzle-zod lucide-react wouter typescript
```

---

## 4. Duplicate/Redundant Functionality

| Packages | Issue | Recommendation |
|----------|-------|----------------|
| `react-icons` + `lucide-react` | Duplicate icon libraries | Remove `react-icons` (unused) |
| `tailwindcss-animate` + `tw-animate-css` | Possibly redundant animation utilities | Consolidate to one |

---

## 5. Recommended Action Plan

### Priority 1: Security (Do Immediately)

```bash
npm audit fix
# OR
npm install express@^4.22.1
```

### Priority 2: Remove Unused Dependencies

1. Remove unused Radix UI packages
2. Remove unused utility packages (`react-icons`, `next-themes`, etc.)
3. Remove unused wrapper component files from `client/src/components/ui/`

### Priority 3: Update Safe Dependencies

```bash
npm update @hookform/resolvers drizzle-orm drizzle-zod lucide-react wouter
```

### Priority 4: Evaluate Major Upgrades (Plan Separately)

- **React 19**: Evaluate compatibility with Radix UI and other React libraries
- **Express 5**: Review middleware compatibility
- **Zod 4**: Check schema migrations needed

---

## 6. Dependencies Actually In Use

### Radix UI (8 packages - KEEP)

- `@radix-ui/react-dialog`
- `@radix-ui/react-label`
- `@radix-ui/react-progress`
- `@radix-ui/react-scroll-area`
- `@radix-ui/react-select`
- `@radix-ui/react-slot`
- `@radix-ui/react-toast`
- `@radix-ui/react-tooltip`

### Core Application Dependencies (KEEP)

- `@google/genai` - AI integration
- `@tanstack/react-query` - Data fetching
- `express` / `express-session` - Backend server
- `drizzle-orm` / `drizzle-zod` / `drizzle-kit` - Database ORM
- `pg` / `connect-pg-simple` - PostgreSQL
- `react` / `react-dom` / `react-hook-form` - Frontend framework
- `lucide-react` - Icons
- `jszip` / `file-saver` - Download functionality
- `zod` / `zod-validation-error` - Validation
- `wouter` - Routing
- `ws` - WebSockets
- `tailwindcss` / `tailwind-merge` - Styling
- `vite` / `typescript` / `tsx` - Build tools

---

## Summary Statistics

| Category | Count |
|----------|-------|
| Security vulnerabilities | 3 (high) |
| Unused packages | 26 |
| Major updates available | 11 |
| Safe updates available | 6 |
| Total dependencies | 69 (prod) + 18 (dev) = 87 |
| Recommended to remove | 26 (~30% reduction) |
