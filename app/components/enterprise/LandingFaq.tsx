import { Section, Eyebrow, Reveal } from './primitives';

const QUESTIONS = [
  {
    question: 'What should I send to start a 3D printing project?',
    answer: 'Share your CAD file, drawing, sketch or a clear reference photo. Include the approximate dimensions, quantity, intended use and preferred finish. We can discuss design support if you do not have a printable file yet.',
  },
  {
    question: 'Can you make a custom scale model of a machine?',
    answer: 'Yes. We create custom machinery miniatures and presentation models. Share reference images or drawings and tell us the scale, finish and any moving features you would like to explore.',
  },
  {
    question: 'Can you help with product design and prototyping?',
    answer: 'Yes. Our services include CAD design and 3D printed prototypes for exploring form, fit and function. We can discuss the design work needed and a suitable print process for your intended use.',
  },
  {
    question: 'Can I order a single piece or a production batch?',
    answer: 'We work on individual prototypes, custom models and batch printing projects. Share the quantity you have in mind so we can review the design, material and production requirements with you.',
  },
  {
    question: 'How are pricing and delivery time decided?',
    answer: 'Pricing and timing depend on the size, design complexity, print process, material, finishing and order quantity. Send your project details through our contact page for a project-specific discussion.',
  },
];

export default function LandingFaq() {
  return (
    <Section id="project-questions" className="landing-section landing-space landing-faq">
      <div className="grid gap-8 sm:gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <Eyebrow>A few good questions</Eyebrow>
          <h2 className="lp-lines m3-display landing-heading mt-5 sm:mt-6">
            Before the<br /><span className="text-[#737373]">first layer.</span>
          </h2>
          <p className="landing-copy mt-6 max-w-[340px] text-[14px] sm:text-[15px]">A little clarity goes a long way. Here’s what helps us get your project started.</p>
        </Reveal>
        <Reveal delay={100} className="lp-fade">
          <div className="divide-y divide-black/[0.1] border-y border-black/[0.1]">
            {QUESTIONS.map(({ question, answer }) => (
              <details key={question} className="group py-5 sm:py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-medium leading-relaxed tracking-tight sm:text-[17px]">
                  {question}
                  <span className="landing-faq-plus relative h-4 w-4 shrink-0 before:absolute before:left-0 before:top-[7px] before:h-px before:w-4 before:bg-black after:absolute after:left-[7px] after:top-0 after:h-4 after:w-px after:bg-black" aria-hidden="true" />
                </summary>
                <p className="landing-copy max-w-[580px] pt-4 pr-7 text-[14px]">{answer}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
