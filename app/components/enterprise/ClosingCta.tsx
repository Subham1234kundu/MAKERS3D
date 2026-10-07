import { Reveal, Cta } from './primitives';

export default function ClosingCta() {
  return (
    <section id="start-your-project" className="relative overflow-hidden border-t border-black/[0.08]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="lp-parallax absolute inset-0">
          <video
            src="/makersway.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
            style={{ filter: 'grayscale(1) contrast(1.35) brightness(0.82)' }}
          />
        </div>
      </div>
      <div className="m3-rails" aria-hidden="true" />

      <div className="m3-shell relative z-[1] grid gap-8 py-16 sm:gap-12 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:py-24">
        <Reveal>
          <span className="m3-eyebrow !text-white/70">Let’s make something</span>
          <h2 className="lp-lines m3-display mt-6 text-[clamp(2.125rem,4.2vw,3.25rem)] !leading-[1.15] text-white sm:mt-8">
            Have an idea?
            <br />
            <span className="text-white">Let’s give it shape.</span>
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <div
            className="lp-panel relative overflow-hidden p-5 sm:p-8"
            style={{
              background: 'rgba(255,255,255,0.13)',
              backdropFilter: 'blur(26px) saturate(155%)',
              WebkitBackdropFilter: 'blur(26px) saturate(155%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(255,255,255,0.18), 0 18px 48px rgba(0,0,0,0.26)',
            }}
          >
            <p className="text-[14px] font-light leading-relaxed text-white sm:text-[16px]">
              Share a sketch, a photo or your CAD file. Tell us what it needs
              to do, how many you need and the finish you have in mind.
              We’ll help you work out the next step.
            </p>
            <p className="mt-4 text-[13px] font-light leading-relaxed text-white/70">
              Early-stage idea? That’s a perfectly good place to start.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
              <Cta href="/contact" tone="solid" className="justify-between sm:justify-start">
                Tell Us About It
              </Cta>
              <Cta href="/partner" className="justify-between sm:justify-start !border-white/50 !text-white hover:!border-white hover:!bg-white/10">
                Become a Partner
              </Cta>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
