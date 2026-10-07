/**
 * Single source of truth for the enterprise landing page copy.
 * Editing marketing text should never require touching a component.
 */

export type Capability = {
  index: string;
  /** Anchor id used by the dedicated services page and footer links. */
  slug: string;
  title: string;
  summary: string;
  detail: string[];
  /** Longer form, shown only on the dedicated services page. */
  body?: string;
  deliverables?: string[];
  image?: string;
  /** Artwork for the corresponding section on the dedicated services page. */
  detailImage?: { src: string; alt: string };
};

export const CAPABILITIES: Capability[] = [
  {
    index: '01',
    slug: 'miniatures',
    title: 'Scale Miniatures of Heavy Machinery',
    summary:
      'Your excavator, scraper, crane or JCB — rebuilt in miniature, accurate to the last decal. The machine your sales team can carry into a meeting.',
    detail: ['Construction & mining', 'Exact livery match', 'Any scale'],
    body:
      'Your machine on a client’s desk is the closest thing to bringing the machine itself. We rebuild excavators, JCBs, scrapers, cranes, tractors and plant equipment at any scale, matching your paint, your decals and your model numbers. Most builds start from nothing more than photographs.',
    deliverables: [
      'Scales from 1:10 to 1:200',
      'Exact paint and decal match',
      'Optional lighting and detailing',
      'Custom display base and case',
    ],
    image: '/images/product-7.jpg',
    detailImage: {
      src: '/images/services/miniatures.webp',
      alt: 'Blue and white miniature mobile crane with a telescopic boom on a display base',
    },
  },
  {
    index: '02',
    slug: 'models',
    title: 'Functional & Display Models',
    summary:
      'Booms that lift. Wheels that turn. Or a flawless static piece built purely to hold a showroom. You choose how much of the real machine it inherits.',
    detail: ['Working mechanisms', 'Showroom finish', 'Cutaway builds'],
    body:
      'A functional model earns its keep in a demo: booms lift, wheels turn, tracks roll, hinges work. A display model earns its keep on a shelf, finished to a standard that survives close inspection. We build both, and often a pair — one to handle, one to show.',
    deliverables: [
      'Working mechanisms',
      'Cutaway and sectional builds',
      'Showroom-grade finishing',
      'Hand assembly and paint',
    ],
    image: '/images/product-1.jpg',
    detailImage: {
      src: '/images/services/models.webp',
      alt: 'Functional miniature lifting crane with articulated joints and a cutaway showing internal gears',
    },
  },
  {
    index: '03',
    slug: 'design',
    title: 'Product Design & Prototyping',
    summary:
      'Bring a sketch, an idea, or nothing but a conversation. We design it in CAD and hand you a working prototype you can test.',
    detail: ['Concept to CAD', 'Rapid prototyping', 'Production-ready files'],
    body:
      'Bring a sketch on paper, a rough idea, or a problem you have not solved yet. We take it into CAD, work through the shape and fit, and put a physical prototype in your hands before you spend anything on tooling.',
    deliverables: [
      'Concept to production CAD',
      'Working prototypes',
      'Design for manufacture review',
      'STEP, IGES and STL delivery',
    ],
    image: '/images/product-2.jpg',
    detailImage: {
      src: '/images/services/design.webp',
      alt: 'Handheld product prototypes with assembled enclosures, open shells and ergonomic trial models',
    },
  },
  {
    index: '04',
    slug: 'reverse',
    title: 'Reverse Engineering & 3D Scanning',
    summary:
      'A part with no drawings is not a dead end. We scan it, rebuild the 3D model, and hand back a file you can reprint, redesign or tool for tomorrow.',
    detail: ['3D scanning', 'Legacy part recovery', 'Editable CAD'],
    body:
      'Old machine, no drawings, supplier long gone. We scan the part, rebuild it as a clean editable 3D model, and hand you a file you can print today or tool for production tomorrow.',
    deliverables: [
      'High-resolution 3D scanning',
      'Editable CAD reconstruction',
      'Legacy and obsolete parts',
      'Dimensional accuracy report',
    ],
    image: '/images/product-4.jpg',
    detailImage: {
      src: '/images/services/reverse.webp',
      alt: 'Structured-light 3D scanner measuring a metal bearing housing beside its printed reproduction',
    },
  },
  {
    index: '05',
    slug: 'bulk',
    title: 'Bulk 3D Printing & Production',
    summary:
      'Dealer models, corporate gifts, trade-show pieces, spare parts. Ten units or ten thousand — the last one leaves identical to the first.',
    detail: ['Volume runs', 'Unit-level QC', 'Delivered on schedule'],
    body:
      'Dealer models across a network, corporate gifts at scale, trade-show giveaways, or ongoing spare parts. We lock the process once and run it, so unit ten thousand matches unit one.',
    deliverables: [
      'No minimum order',
      'Consistent batch output',
      'Per-unit quality checks',
      'Packaging and dispatch',
    ],
    image: '/images/product-6.jpg',
    detailImage: {
      src: '/images/services/bulk.webp',
      alt: 'Identical 3D printed enclosure housings arranged in production rows with inspection calipers',
    },
  },
  {
    index: '06',
    slug: 'collection',
    title: 'The MAKERS3D Collection',
    summary:
      'Our own range of 3D printed decor and desk pieces — designed in-house, made on the same machines, sold directly.',
    detail: ['Studio-designed', 'Limited runs', 'Buy direct'],
    body:
      'Between client work we design and print our own pieces — decor and desk objects made on the same industrial machines, in limited runs, sold directly from our store.',
    deliverables: [
      'Designed in-house',
      'Limited production runs',
      'Ships across India',
      'Available online now',
    ],
    image: '/images/product-8.jpg',
    detailImage: {
      src: '/images/services/collection.webp',
      alt: '3D printed ivory spiral vase, terracotta planter and charcoal sculptural desk piece',
    },
  },
];

export type Sector = {
  id: string;
  name: string;
  thesis: string;
  applications: string[];
  /** Representative part photograph, shown in the sector detail panel. */
  image: string;
  /** Artwork for the corresponding section on the dedicated industries page. */
  detailImage?: { src: string; alt: string };
  /** Longer form, shown only on the dedicated industries page. */
  body?: string;
  outcomes?: string[];
};

export const SECTORS: Sector[] = [
  {
    id: 'manufacturing',
    name: 'Heavy Machinery',
    thesis:
      'Your equipment weighs forty tonnes and will never fit in a client meeting. The miniature will — and it sells the machine before the brochure is open.',
    applications: ['Dealer showpieces', 'Trade-show models', 'Sales demo units', 'Cutaway models'],
    body:
      'Plant equipment does not travel to meetings. A scale model does — and it does the selling before the brochure is open. We build dealer showpieces, trade-show models and cutaway units for equipment manufacturers and distributors across India.',
    outcomes: [
      'Dealer network showpieces',
      'Exhibition and trade-show models',
      'Training and cutaway units',
      'Long-service spare parts',
    ],
    image: '/images/product-7.jpg',
    detailImage: {
      src: '/images/partner/JhelPartner.png',
      alt: 'JHEL heavy machinery scale model with a truck tipper, hopper and material handling equipment',
    },
  },
  {
    id: 'automotive',
    name: 'Automotive',
    thesis:
      'Design reviews stop being arguments once the part is on the table. We print fitment hardware and interior components at the speed engineering actually moves.',
    applications: ['Fitment prototypes', 'Interior components', 'Concept models', 'Legacy spares'],
    body:
      'Arguments about fit end the moment the part is on the table. We print fitment hardware, interior components and concept models fast enough to keep pace with how engineering actually iterates.',
    outcomes: [
      'Fitment and clearance checks',
      'Interior trim prototypes',
      'Design review models',
      'Out-of-production spares',
    ],
    image: '/images/product-1.jpg',
    detailImage: {
      src: '/images/industries/automotive.webp',
      alt: '3D printed automotive console trim, intake manifold and mounting bracket prototypes',
    },
  },
  {
    id: 'architecture',
    name: 'Architecture',
    thesis:
      'Renders get scrolled past. A physical model gets walked around, pointed at and remembered — which is usually what wins the room.',
    applications: ['Presentation models', 'Massing studies', 'Facade details', 'Site context'],
    body:
      'A render gets scrolled past. A physical model gets circled, pointed at and remembered — which is usually what decides the room. We build presentation models, massing studies and facade details at competition standard.',
    outcomes: [
      'Client presentation models',
      'Competition submissions',
      'Massing and site studies',
      'Facade and detail sections',
    ],
    image: '/images/product-3.jpg',
    detailImage: {
      src: '/images/industries/architecture.webp',
      alt: 'Detailed architectural scale model of a contemporary residence with balconies and landscaping',
    },
  },
  {
    id: 'jewellery',
    name: 'Jewellery',
    thesis:
      'Castable masters printed at a resolution the craft respects, so the sample on the tray matches the render that sold it.',
    applications: ['Castable masters', 'Sizing samples', 'Design iteration', 'Small-batch runs'],
    body:
      'Castable masters printed at a resolution the craft respects, so what lands on the tray matches the render that sold it. Fast enough to iterate a collection inside one season.',
    outcomes: [
      'Castable resin masters',
      'Sizing and fit samples',
      'Rapid design iteration',
      'Small-batch production',
    ],
    image: '/images/product-5.jpg',
    detailImage: {
      src: '/images/industries/jewellery.webp',
      alt: 'Purple castable resin jewellery ring masters beside a finished gold ring',
    },
  },
  {
    id: 'product',
    name: 'Product Design',
    thesis:
      'Your product exists only as a sketch. We design it and hand you a prototype that works like the real thing — before you commit to tooling.',
    applications: ['Working prototypes', 'Enclosures & housings', 'Ergonomic models', 'Pre-production'],
    body:
      'Your product exists as a sketch and a hunch. We design it properly, prototype it, and let you hold the thing before you commit a rupee to tooling.',
    outcomes: [
      'Concept development',
      'Working prototypes',
      'Enclosures and housings',
      'Pre-production samples',
    ],
    image: '/images/product-2.jpg',
    detailImage: {
      src: '/images/industries/product-design.webp',
      alt: 'Handheld device housing and electronics enclosure prototypes with detached shells and lids',
    },
  },
];

export type ProcessStep = {
  index: string;
  title: string;
  body: string;
};

export const PROCESS: ProcessStep[] = [
  {
    index: '01',
    title: 'Share what you have',
    body:
      'A photo, a drawing, a CAD file or the part itself. We come back with what is possible, at what scale, in what material — and what it will cost.',
  },
  {
    index: '02',
    title: 'Approve the model',
    body:
      'We build it in 3D and show you before anything is printed. Change the scale, the finish, the detail level — this is the cheap stage to change your mind.',
  },
  {
    index: '03',
    title: 'We build it',
    body:
      'Printed on industrial machines, then assembled, sanded and painted by hand. Every unit in a run comes off the same locked-in process.',
  },
  {
    index: '04',
    title: 'Delivered and yours',
    body:
      'Checked against the approved model, packed and shipped — with the source CAD files transferred to your name.',
  },
];

/**
 * Brands MAKERS3D has built for. Logos are trimmed copies of the files in
 * public/images/PartnerLogo (see strip/). `height` is the display height in
 * px, tuned per logo so wide wordmarks and square badges read at a similar
 * visual weight.
 */
export type Client = {
  name: string;
  logo: string;
  width: number;
  height: number;
  displayHeight: number;
};

export const CLIENTS: Client[] = [
  { name: 'Flipkart', logo: '/images/PartnerLogo/strip/flipkart.png', width: 822, height: 240, displayHeight: 30 },
  { name: 'Vishnu Forge Industries', logo: '/images/PartnerLogo/strip/vishnu-forge.png', width: 209, height: 200, displayHeight: 52 },
  { name: 'A3M', logo: '/images/PartnerLogo/strip/a3m.png', width: 266, height: 99, displayHeight: 34 },
  { name: 'Jaypee Engineering & Hydraulic Equipment', logo: '/images/PartnerLogo/strip/jehel.png', width: 166, height: 240, displayHeight: 50 },
  { name: 'ZapTick', logo: '/images/PartnerLogo/strip/zaptick.png', width: 350, height: 102, displayHeight: 30 },
];

export type Metric = { value: string; label: string; note: string };

export const METRICS: Metric[] = [
  {
    value: '1:1 to 1:200',
    label: 'any scale you need',
    note: 'From a life-size part to a palm-sized machine model.',
  },
  {
    value: '3–7 days',
    label: 'typical first sample',
    note: 'Most prototypes ship within a week of approval.',
  },
  {
    value: '40+',
    label: 'materials available',
    note: 'Tough plastics, fine resins and flexible rubbers.',
  },
  {
    value: '1 to 10,000',
    label: 'pieces per order',
    note: 'One sample or a full production run — same price logic.',
  },
];

export const NAV = [
  { label: 'Services', href: '/services' },
  { label: 'Industries', href: '/industries' },
  { label: 'Partners', href: '/partner' },
  { label: 'About Us', href: '/about' },
];
