# Refactor Homepage Header & Cards + Category Routing

1.  **Extract reusable homepage components**

    - Move the header/nav tree (in `app/(public)/page.tsx` lines 229-417) into a new `components/home/HomeHeader.tsx` client component.
    - The component should accept `session`, `categories`, `currentPath`, and `activeCategory` props, manage menu + dropdown state internally, and reuse styles from `app/(public)/homepage.module.css`.
    - Create additional presentational components (`components/home/BreakingNews.tsx`, `FeaturedNews.tsx`, `LatestTabs.tsx`, `HighlightsSection.tsx`, `SidebarTopics.tsx`) so `page.tsx` only orchestrates data/handlers.

2.  **Extract highlight & sponsored cards**

    - Create `components/home/HighlightCard.tsx` and `components/home/SponsoredCard.tsx` wrapping the markup around lines 706-786 and 889-975 respectively.
    - Props: `article`, `isBookmarked`, `onToggleBookmark`, `bookmarkLoading`.
    - Keep bookmark button styles from `homepage.module.css` and ensure the card buttons call `handleBookmarkToggle` via props.

3.  **Update `components/layout/Footer.tsx`**

    - Let `Footer` accept an optional `categories` prop (array of `{ name, count }`).
    - When provided, render the first four categories linking to `/kategori/${encodeURIComponent(name)}`; otherwise fall back to the static list.
    - Adjust `Footer.module.css` if needed for dynamic data.

4.  **Change category links to `/kategori/[nama]`**

    - Replace every `/artikel?category=...` link in `HomeHeader`, sidebar topics, footer, etc. with `/kategori/${encodeURIComponent(category.name)}`.
    - Update active state logic in `HomeHeader` to check `pathname.startsWith("/kategori/")` and compare the decoded slug.

5.  **Implement `app/(public)/kategori/[slug]/page.tsx`**

    - Use `useArticles({ category: decodeURIComponent(params.slug) })` to fetch articles for the category.
    - Reuse the new card/section components for listing results, include `HomeHeader` + `Footer`, and add loading/empty states similar to the main page.

6.  **Wire everything together**
    - Update `app/(public)/page.tsx` to import/use the new components, passing down handlers/data (bookmarks, newsletter form, etc.).
    - Ensure types stay consistent (e.g., share an `ArticleCardProps` if needed) and run `npm run lint`/`npm run build` to verify.
    - Update any imports affected by the refactor and keep CSS centralized in `homepage.module.css`.
