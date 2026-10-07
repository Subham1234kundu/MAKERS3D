# MAKERS3D search metadata and crawlability

The home page now introduces MAKERS3D as a provider of 3D printing services and products in India. Organization and WebSite structured data use MAKERS3D consistently and include the alternative spelling “Makers 3D”. The existing homepage design, text animations and protected MAKERS3D collection component are preserved.

| Page | Search intent | Current title |
| --- | --- | --- |
| Home | MAKERS3D / Makers 3D, services and products | MAKERS3D \| 3D Printing Services & Products in India |
| Services | Custom 3D printing, scale models, CAD, prototypes, scanning and production | 3D Printing & Prototyping Services in India \| MAKERS3D |
| Products | Shop 3D printed figurines, lamps, frames and gifts | 3D Printed Products, Decor & Gifts \| MAKERS3D |
| Collections | Browse products by type | 3D Printed Collections: Figurines, Lamps & Frames \| MAKERS3D |
| Individual product | The actual product name and purpose | Actual product name \| MAKERS3D |

Descriptions are plain-language summaries of the page. Search, Open Graph and Twitter descriptions match. Product pages use actual names, images and default prices in INR, and prefer an existing short description when available. Long marketing descriptions are preserved on the product page and in Product structured data. Social metadata uses the existing 1200 × 630 landing preview, or an actual product image without invented dimensions.

Product and collection routes now fetch the catalogue on the server and pass initial data to their existing interactive components. Product details no longer return an empty page until hydration. Names, photos, descriptions, prices and crawlable product links are included in the initial HTML; live refreshes, variant controls and cart behavior remain available. Google recommends supplying Product markup in the [initial HTML](https://developers.google.com/search/docs/appearance/structured-data/product-snippet). Offers contain actual prices and currency; unsupported inventory, shipping promises and ratings are not added.

The services page describes all six visible services with their real section URLs, a shared provider identity and breadcrumb data. The sitemap contains 13 public static pages and the current real product IDs; product last-modified dates come from stored update or creation dates. Unsupported category URLs were removed from the sitemap and their old links redirect to Products. Missing product IDs return 404 with noindex. The blank /home route redirects to /. Dashboard and theme-demo pages are noindex. Public services and products remain crawlable.

The footer wordmark now scales from the full page width instead of the padded shell. Its bottom padding is 8 px and its line height is compact. The existing large cursor marker remains on both footer brand texts.

Validation: [metadata, schema and crawler checks](seo-validation.json), [shopping checks](seo-shopping-browser-validation.json), [footer checks](seo-footer-browser-validation.json). The browser checks cover listings, detail pages, color selection, adding a product to the isolated guest cart and collection filtering at 1440 and 390 px. The footer was checked at 320, 390, 1440 and 1920 px, including hover expansion and normal-size restoration. No runtime exceptions or horizontal overflow were recorded. TypeScript and lint checks for the SEO modules, server routes, collection client and footer pass. The existing products and detail clients retain their legacy typing conventions.

The production build passed with Next.js 15.5.9 in a temporary isolated copy, without interrupting the development preview. It compiled successfully, passed its type validation, and generated all 55 static pages. Product, collection and sitemap routes are rendered dynamically so catalogue data is current. Build results are recorded in the validation report.

After deployment, submit https://makers3d.in/sitemap.xml in the site's Google Search Console property and request indexing for Home, Services, Products and product detail URLs. Inspect a detail URL with the Rich Results Test. The root layout supports GOOGLE_SITE_VERIFICATION if HTML-tag verification is chosen; set the actual Search Console token in the deployment environment. No verification token, deployment or Search Console submission was invented or performed in this change.

Google chooses ranking, titles and snippets. These changes improve page clarity and accessibility to crawlers; they do not guarantee first place for brand searches. See [Google's SEO guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [site-name guidance](https://developers.google.com/search/docs/appearance/site-names), [title guidance](https://developers.google.com/search/docs/appearance/title-link) and [description guidance](https://developers.google.com/search/docs/appearance/snippet). Meta keywords are not used by Google, so the priority pages focus on relevant titles, useful content and descriptions instead of a keyword list.
