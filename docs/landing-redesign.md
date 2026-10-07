# Landing page redesign

The homepage uses a white studio direction with warm terracotta accents, stronger text contrast, consistent spacing and separate image captions. Copy describes 3D printing, custom scale models, CAD design, prototyping and batch printing in plain language.

The entire “Our own ideas, printed layer by layer.” collection component, its images and its shared typography are preserved. The current order is Collection, Explore the possibilities, then Layer by layer, with “Thought through.” removed from that section’s label. The text animation controller, shared motion utilities and logo marquee timing are unchanged. The vase plays automatically once on laptops, then remains a static image until the page is refreshed. It responds to scrolling once per visit on phones and tablets. The closing section uses its earlier full-width studio video background and glass panel.

The hero heading has additional line height and expanded clipping margins on its animated line masks, keeping its letters fully visible without changing the animation timing.

The later [Figma layout adaptation](landing-layout-reference.md) centers section introductions and aligns padding and card gaps across the edited sections. The current mobile hero places its headline above the visual and its description below. The original collection and text motion files remain intact. The [responsive hero update](landing-hero-scroll.md) lets the laptop page scroll freely alongside automatic playback, while mobile printing follows the user's scrolling.

Ten new images were generated with the built-in image_gen tool. Original PNGs and optimized WebP assets are in `public/images/landing/redesign/`. Their complete prompt set is in [imagegen/landing-redesign.md](imagegen/landing-redesign.md). Authentic brand logos remain unchanged. Model concepts are described as examples rather than completed client projects.

SEO updates include a descriptive page title, description and canonical URL; a 1200 × 630 social preview; descriptive image alt text; a single H1 and clear section headings; Organization, WebSite, WebPage and Service structured data reflecting the visible content; visible project FAQs; and sitemap entries for Services, Industries and Contact. Broken footer policy links are corrected. The old hidden FAQ markup and unsupported precision and delivery claims were removed.

SEO decisions follow [Google’s image guidance](https://developers.google.com/search/docs/appearance/google-images) and [title guidance](https://developers.google.com/search/docs/appearance/title-link). FAQ content is intended to help visitors; it is not presented as eligibility for a FAQ rich result. See [Google’s documentation updates](https://developers.google.com/search/updates).

Verification: TypeScript and lint checks on the changed files, browser validation at desktop and mobile widths, generated-image loading, FAQ interaction, metadata and structured data inspection, and verification that the protected collection and text animation controller retain their original hashes.

Initial redesign checks passed at 1440 px and 390 px: all ten generated images loaded, no horizontal overflow, one H1, five working FAQ controls, and correct canonical and social metadata. The hero rendered its 3D canvas. Current interaction checks are recorded in the scroll-driven hero update.

Previews: [desktop hero](previews/landing-redesign-desktop.png), [services](previews/landing-redesign-services.png), [mobile hero](previews/landing-redesign-mobile.png), [restored closing section](previews/landing-closing-restored.png).
