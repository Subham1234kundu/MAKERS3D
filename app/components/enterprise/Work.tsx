import Image from 'next/image';
import { Section, Eyebrow, Reveal, Cta } from './primitives';

const EXAMPLES = [
  { title: 'Architectural presentation models', description: 'Make the proportions, spaces and materials easier to explain.', image: 'model-architecture', alt: 'White architectural scale model of a modern two-storey home with wood facade details' },
  { title: 'Automotive fit-check parts', description: 'Explore a component’s shape and mounting points before production.', image: 'model-automotive', alt: 'Charcoal printed automotive air duct beside a white fit-check flange' },
  { title: 'Jewellery design masters', description: 'Bring fine forms and small details into a physical design study.', image: 'model-jewellery', alt: 'Purple castable resin ring masters arranged beside a plain gold ring' },
];

const IMAGE_STYLE = 'object-contain transition-[opacity,transform,filter] duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:scale-[1.06] group-hover:scale-100 group-hover:opacity-100 group-hover:blur-0';

export default function Work() {
  return (
    <Section id="model-concepts" className="landing-section landing-space">
      <Reveal>
        <div className="landing-intro">
          <div>
            <Eyebrow>Explore the possibilities</Eyebrow>
            <h2 className="lp-lines m3-display landing-heading mt-5 sm:mt-6">
              Small scale.<br /><span className="text-[#737373]">A bigger impression.</span>
            </h2>
          </div>
          <p className="lp-words landing-copy max-w-[620px] text-[14px] sm:text-[16px]">
            Show a machine. Explain a space. Test a product.
            These model concepts show a few ways a physical piece can
            make your next conversation clearer.
          </p>
        </div>
      </Reveal>

      <Reveal delay={80} className="lp-card">
        <div className="mt-8 grid overflow-hidden border border-black/[0.08] bg-white sm:mt-12 lg:grid-cols-[1.2fr_0.8fr]">
          <figure className="group relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[430px]">
            <div className="lp-card-art absolute inset-0">
              <Image src="/images/partner/JhelPartner.png" alt="JHEL industrial scale model with a yellow unloading truck and green material-handling arm" fill sizes="(max-width: 1023px) 100vw, 60vw" className={`${IMAGE_STYLE} p-3 sm:p-5`} />
            </div>
          </figure>
          <div className="flex flex-col justify-center border-t border-black/[0.08] p-5 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a614d]">Machinery model concept</span>
            <h3 className="mt-4 text-[clamp(1.5rem,3vw,2.5rem)] font-light leading-[1.15] tracking-tight">Give the whole machine<br />a place on the table.</h3>
            <p className="landing-copy mt-4 text-[14px] sm:text-[15px]">
              Custom machinery miniatures can bring your product into a
              showroom, a meeting or a trade display. Discuss the scale,
              moving parts and finish that tell your machine’s story.
            </p>
            <div className="mt-6 sm:mt-8"><Cta href="/contact" className="w-full justify-between sm:w-auto sm:justify-start">Discuss Your Model</Cta></div>
          </div>
        </div>
      </Reveal>

      <div className="mt-4 grid gap-4 md:grid-cols-3 lg:mt-[26px] lg:gap-[26px]">
        {EXAMPLES.map((example, i) => (
          <Reveal key={example.title} delay={140 + i * 70} className="lp-card">
            <figure className="group h-full border border-black/[0.08] bg-white">
              <div className="relative aspect-[16/10] overflow-hidden md:aspect-[4/3]">
                <div className="lp-card-art absolute inset-0">
                  <Image src={`/images/landing/redesign/${example.image}.webp`} alt={example.alt} fill sizes="(max-width: 767px) 100vw, 33vw" className={IMAGE_STYLE} />
                </div>
              </div>
              <figcaption className="border-t border-black/[0.08] p-5 sm:p-6">
                <h3 className="text-[18px] font-normal leading-snug tracking-tight">{example.title}</h3>
                <p className="landing-copy mt-3 text-[14px]">{example.description}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
