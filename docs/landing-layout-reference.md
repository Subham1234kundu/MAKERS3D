# Landing layout reference

Placement and spacing were reviewed through the Figma plugin using the supplied [Grobird Website Revamp](https://www.figma.com/design/WjUUMy333VKSSyyI6vvUgA/Grobird-Website-Revamp?node-id=0-1) file. The desktop landing frame (`46:3392`, 1440 px) and mobile landing frame (`649:8398`, 430 px) were inspected through screenshots and detailed section context.

The reference guides the arrangement of the existing MAKERS3D content. Its logos, software copy, illustrations and dark palette are not used on this page.

| Reference pattern | MAKERS3D adaptation |
| --- | --- |
| Desktop hero: copy on the left, visual on the right; 32 px between copy groups | Two columns at 1024 px and above; 24–32 px between the heading, description and actions |
| Mobile hero: illustration before the text; 20 px side padding; 24 px copy gaps | The latest requested order is headline, product visual, then description below 1024 px; responsive shell gutters and full-width phone actions |
| Centered section introductions, desktop maximum width 772 px | Centered Services, Layer by layer and Model Concepts introductions; 16 px between heading and description |
| Desktop service-card gutters of 26 px; mobile card gaps of 16 px | Matching grid gaps, compact phone card padding, and contained model imagery |
| Smaller mobile headings and shorter image areas | 30 px section headings, 40 px hero heading and 16:10 card images on phones; three model cards start at 768 px |
| Compact two-column closing area | Existing full-width studio video and glass panel retained, with reduced padding and a comfortable heading line height |

Section padding is consistent across the edited sections: 48 px on phones, 80 px from 640 px and 112 px from 1024 px. The intro uses copy on the left and the studio photograph on the right on desktop.

The product collection component is preserved in full. The subsequent requested section order is Collection, Explore the possibilities, then Layer by layer. The text animation controller and shared motion utilities are unchanged; the [hero printing scene](landing-hero-scroll.md) plays automatically once until refresh on laptops and follows scrolling once per page visit on mobile. The existing hero mask clipping margin and comfortable line height remain in place.

Initial layout validation covers 320, 390, 430, 768, 1024 and 1440 px: no horizontal overflow or overlapping header items, correct hero order, consistent section and card spacing, and a single H1. The phone menu opens and closes, FAQ details open, and all ten landing images decode successfully. TypeScript and lint checks pass for the edited components. Later section-order and hero-interaction checks are recorded in the scroll-driven hero update.

In a separate check with normal motion enabled and asset caching disabled at 390 and 1440 px, the 3D canvas renders and both animated heading lines fit inside their masks. The phone masks have 4.8 px of clipping allowance and the desktop masks have 9.1 px. Switching motion preferences during automated navigation was unreliable in the local development preview, so responsive and normal-motion results were verified separately.

The local preview also logged an authentication-session fetch error. Authentication was outside this layout change and remains unchanged.

Previews: [desktop hero](previews/landing-figma-desktop.png), [desktop services](previews/landing-figma-desktop-services.png), [mobile hero](previews/landing-figma-mobile.png), [mobile services](previews/landing-figma-mobile-services.png), [mobile model concept](previews/landing-figma-mobile-work.png), [mobile closing](previews/landing-figma-mobile-closing.png).
