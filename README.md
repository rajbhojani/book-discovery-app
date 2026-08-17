# Shelf — Book Discovery App

**Shelf** is a book discovery web application built with **Nuxt 4**, **Vue 3 (Composition API, `<script setup>`)**, **TypeScript**, and **Tailwind CSS v4**, featuring presentational component stories powered by **Storybook 10**.

---

## Features

1. **Search**: Search millions of books by title, author, or keywords via the Google Books API. Displays responsive book cards showing cover art, title, author(s), and publication year with smooth loading skeletons and debounced queries.
2. **Detail Page (`/book/:id`)**: Dedicated volume detail route displaying large cover images, author metadata, publication dates, publishers, page counts, category tags, star ratings, and sanitized book descriptions.
3. **Shortlist**: Users can bookmark/shortlist books from either the search grid or detail pages. The shortlist is persisted in `localStorage` and accessible anytime via a slide-out drawer in the global navigation bar.
4. **Secure Server Proxy**: Google Books API keys are kept strictly on the Nitro server via `runtimeConfig.googleBooksApiKey`, ensuring credentials are never leaked to the client bundle or browser network tab.
5. **Theme Support**: Seamless Light/Dark mode with automatic system-preference detection, manual toggle, and `localStorage` persistence.
6. **Design System & Micro-animations**: Warm neutral aesthetics, Playfair Display & Inter typography, glassmorphism headers, responsive grids, and subtle hover animations.

---

## Getting Started Locally

### Prerequisites

- **Node.js**: v22.x or newer (tested on Node v24 / v22)
- **npm**: v10.x or newer

### 1. Clone the Repository

```bash
git clone https://github.com/rajbhojani/book-discovery-app.git
cd book-discovery-app
```

### 2. Environment Setup

Copy `.env.example` to `.env` and supply your Google Books API key:

```bash
cp .env.example .env
```

Open `.env` and set your key:

```env
GOOGLE_BOOKS_API_KEY=your_google_books_api_key_here
```

> **Note**: To obtain a free Google Books API key, navigate to the [Google Cloud Console](https://console.cloud.google.com/), create a project, enable the **Books API**, and create an API key in **Credentials**.

### 3. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 4. Run the Development Server

```bash
npm run dev
```

The application will be running at [http://localhost:3000](http://localhost:3000).

### 5. Run Storybook

Storybook showcases the presentational components (`BookCard` and `BookCover`) with various states (default, missing cover, long title, size variants):

```bash
npm run storybook
```

Storybook will open at [http://localhost:6006](http://localhost:6006).

To build the static Storybook bundle:

```bash
npm run build-storybook
```

### 6. Production Build & Preview

```bash
npm run build
npm run preview
```

---

## Assumptions Made (and Why)

1. **Shortlist UX (Global Drawer vs Dedicated Route)**:
   - *Assumption*: Users browsing books benefit most from quick, non-disruptive access to their shortlist without losing their search state or scroll position.
   - *Decision*: Implemented a slide-out drawer accessible from the global header, paired with instant heart/bookmark toggle buttons on book cards and detail views. A reactive badge displays the shortlist item count.
2. **Server-Side API Proxy for Key Protection**:
   - *Assumption*: The Google Books API key must remain strictly confidential in public repositories and deployments.
   - *Decision*: Created Nitro server routes (`/api/books/search` and `/api/books/:id`) that read `runtimeConfig.googleBooksApiKey` server-side. The browser only communicates with internal `/api/books/*` endpoints.
3. **Defensive Normalization of Inconsistent API Responses**:
   - *Assumption*: The Google Books API often returns incomplete data (missing covers, missing authors, non-standard date formats like `2021-05` or `1985`, HTML tags in descriptions).
   - *Decision*: Built a centralized normalizer (`shared/types/book.ts`) that guarantees clean types, extracts 4-digit publication years, upgrades HTTP image URLs to HTTPS, and generates deterministic color gradients for books without cover art.
4. **Storybook Standalone Integration**:
   - *Assumption*: Nuxt 4 and Vite 8 toolchains currently have compatibility gaps with legacy Nuxt-Storybook wrapper modules.
   - *Decision*: Configured Storybook 10 with `@storybook/vue3-vite` and `@vitejs/plugin-vue` directly, ensuring fast, isolated testing of presentational components (`BookCard`, `BookCover`).

---

## Tradeoffs Accepted & What We Would Do With More Time

### Tradeoffs Accepted
- **LocalStorage Persistence**: Used client-side `localStorage` for shortlist storage. While simple and zero-setup, it does not sync across devices.
- **Client-Triggered Pagination ("Load More")**: Google Books API uses `startIndex` and `maxResults`. A simple "Load more" button was chosen over infinite scroll to prevent unexpected layout jumps and rate limit exhaustion.
- **HTML Description Rendering**: Google Books descriptions include inline formatting tags (`<b>`, `<i>`, `<br>`). Styled with scoped typography rules rather than a heavy full DOMPurify sanitization library.

### What We Would Do With More Time
- **Advanced Filtering & Sorting**: Add facet filters for categories, language, print type (books vs magazines), and sort order (relevance vs newest).
- **Shortlist Export / Sharing**: Allow users to export their reading list as JSON/Markdown or generate a shareable URL.
- **Offline / PWA Support**: Implement IndexedDB caching with service workers so previously viewed books and shortlists work offline.
- **Automated Testing Suite**: Add Vitest unit tests for composables (`useShortlist`, `useBookSearch`, normalizers) and Playwright end-to-end tests for search and shortlist user flows.
- **Reading Status & Notes**: Allow users to mark books as "Want to Read", "Currently Reading", or "Completed", with personal notes and star ratings.

---

## What Is Unfinished or Broken (Stated Plainly)

- **API Rate Limiting Without Key**: When running without a valid `GOOGLE_BOOKS_API_KEY` in `.env`, Google Books severely rate-limits queries (returning `429 Too Many Requests` or `502 Bad Gateway` after a few rapid requests). Supplying a valid key resolves this.
- **Low-Resolution Covers**: Some older books in Google Books only have thumbnail images (`zoom=1` or `zoom=5`) without high-res scans. While `BookCover` intelligently requests the largest zoom level available, image sharpness depends on Google's scan quality.
---

## Where AI Tooling Was Used

AI tooling was used throughout development to accelerate implementation:
1. **Scaffolding & Architecture**: Initializing the Nuxt 4 project structure, defining the server proxy architecture, and setting up TypeScript interfaces matching the Google Books API schemas.
2. **Design System & Tailwind v4 Configuration**: Generating the modern color palette (warm neutrals, amber/teal accents) and CSS variables for dark mode support and micro-animations.
3. **Resolving Toolchain Incompatibilities**: Diagnosing and fixing Vite 8 + Storybook 10 Vue SFC compilation settings (`@vitejs/plugin-vue` integration) and Nuxt 4 `#shared` module aliases.
4. **Data Normalization & Resilience**: Writing defensive normalizer functions to handle missing fields, HTTP-to-HTTPS upgrades, and gradient fallbacks for missing cover images.
