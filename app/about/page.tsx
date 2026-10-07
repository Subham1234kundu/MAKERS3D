'use client';

import Image from 'next/image';
import AboutBillboard from '../components/enterprise/AboutBillboard';
import EnterpriseNav from '../components/enterprise/EnterpriseNav';
import EnterpriseFooter from '../components/enterprise/EnterpriseFooter';
import PageMotion from '../components/enterprise/PageMotion';

const PILLARS = [
    { title: 'ATOM-PERFECT', desc: 'Every build is analyzed at the micron level to ensure structural integrity and visual purity.' },
    { title: 'NEO-MATERIAL', desc: 'We source and develop composite filaments that mimic the textures of fossilized light and liquid metal.' },
    { title: 'HYPER-STYLE', desc: 'Aesthetic isn\'t an afterthought; it is the fundamental code that drives every design choice.' }
];

/**
 * About — the original layout and copy, in the white theme. Motion comes
 * from PageMotion via the lp-* markers (see enterprise/motion.ts).
 */
export default function AboutPage() {
    return (
        <main className="bg-white min-h-screen text-black selection:bg-black selection:text-white">
            <PageMotion>
                <EnterpriseNav />

                {/* Hero Section */}
                <section className="about-hero lp-masthead lp-intro relative h-auto lg:h-[110vh] flex flex-col justify-center items-center overflow-hidden px-5 lg:px-6 pt-28 lg:pt-32 pb-20 lg:pb-24">
                    <div className="lp-masthead-field absolute inset-0 z-0 opacity-40">
                        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white z-10" />
                        <div
                            className="w-full h-full bg-cover bg-center grayscale scale-110 animate-slow-zoom"
                            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop')` }}
                        />
                    </div>

                    <div className="relative z-10 w-full lg:w-auto text-center max-w-4xl">
                        <h1 className="lp-masthead-title text-[clamp(2.5rem,12vw,4rem)] lg:text-9xl font-black tracking-tighter leading-[1.05] lg:leading-[0.8] mb-6 lg:mb-12 uppercase flex flex-col items-center">
                            <span className="block">DREAM IN</span>
                            <span className="block text-transparent stroke-text">GEOMETRY</span>
                        </h1>

                        <p className="lp-masthead-lede text-sm tracking-[0.025em] lg:tracking-[0.3em] normal-case lg:uppercase text-black/60 font-normal lg:font-light max-w-[22rem] lg:max-w-2xl mx-auto leading-[1.8] lg:leading-loose pb-0 lg:pb-20">
                            We don&apos;t just print objects; we materialize the impossible.
                            A collective of visionaries bridging the gap between digital etherealism and physical reality.
                        </p>
                    </div>

                    {/* Scroll Cue */}
                    <div className="absolute bottom-5 lg:bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 lg:gap-3 opacity-30 animate-pulse">
                        <div className="w-[1px] h-6 lg:h-14 bg-gradient-to-b from-black via-black/50 to-transparent" />
                        <span className="text-[7px] text-black tracking-[0.6em] uppercase font-bold">Scroll</span>
                    </div>
                </section>

                {/* Vision Section */}
                <section className="pt-12 lg:pt-48 pb-0 px-6 sm:px-12 bg-white border-t border-black/[0.05]">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div>
                            <h2 className="lp-lines text-3xl md:text-5xl font-thin tracking-tighter uppercase mb-12 leading-tight">
                                The core of <br />
                                <span className="font-black italic">Experimental</span> <br />
                                Design
                            </h2>
                            <div className="space-y-8 text-black/50 text-sm tracking-wide leading-relaxed font-light">
                                <p className="lp-words-slow">
                                    Born from the intersection of mathematics and art, Makers 3D started as a clandestine laboratory for 3D experimentation. Our mission was simple: to redefine the boundary of what can be held.
                                </p>
                                <p className="lp-words-slow">
                                    Today, we operate at the edge of architectural possibilities, using advanced multi-material deposition and parametric modeling to create pieces that feel like they&apos;ve been pulled from a higher dimension.
                                </p>
                            </div>
                        </div>

                        <div className="lp-media relative aspect-square overflow-hidden group">
                            <div className="lp-card-art absolute inset-0">
                                <AboutBillboard />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Ticker / Statement */}
                <div className="lp-fade bg-black text-white py-4 flex overflow-hidden whitespace-nowrap select-none">
                    <div className="flex animate-[marquee_20s_linear_infinite] gap-12 items-center pr-12">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <span key={i} className="text-[10px] tracking-[1em] uppercase font-black">Crafted in the Void — Precision Beyond Limits — Ethereal Aesthetics — Makers 3D Elite</span>
                        ))}
                    </div>
                </div>

                {/* Values Section */}
                <section className="pt-12 pb-8 md:pb-10 px-6 sm:px-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col gap-2 mb-12">
                            <h3 className="lp-lines text-xl sm:text-4xl font-thin tracking-tighter text-black uppercase">
                                Operational Pillars
                            </h3>
                            <div className="lp-rule w-16 h-[1px] bg-black/20"></div>
                        </div>

                        <div className="lp-stagger grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
                            {PILLARS.map((item, i) => (
                                <div key={item.title} className="flex flex-col gap-6 group">
                                    <span className="text-black text-xs font-mono">0{i + 1}.</span>
                                    <h4 className="text-xl font-black tracking-widest uppercase group-hover:text-black/60 transition-colors">{item.title}</h4>
                                    <p className="text-black/40 text-xs tracking-widest uppercase leading-loose font-light">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact CTA */}
                <section className="pt-8 md:pt-10 pb-12 lg:pb-48 px-6 text-center border-t border-black/[0.05]">
                    <div className="max-w-4xl mx-auto">
                        <div className="lp-media mb-16 relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-black/10" data-about-team>
                            <div className="lp-card-art absolute inset-0">
                                <Image
                                    src="/images/we.png"
                                    alt="MAKERS3D team beside a detailed JHEL industrial machinery scale model"
                                    fill
                                    sizes="(max-width: 895px) 100vw, 896px"
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        <h2 className="lp-lines text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8">Join the Vision</h2>
                        <p className="lp-words text-black/40 text-sm tracking-[0.2em] uppercase font-light mb-12 leading-relaxed max-w-2xl mx-auto">
                            Whether you&apos;re looking to own a masterpiece or collaborate on the next wave of design innovation, our studio doors are open.
                        </p>
                        <div className="lp-fade">
                            <a
                                href="/partner"
                                className="inline-block px-12 py-5 bg-black text-white text-[10px] font-bold tracking-[0.5em] uppercase hover:bg-black/85 hover:scale-105 transition-all duration-500 rounded-full"
                            >
                                Inquire Now
                            </a>
                        </div>
                    </div>
                </section>

                <EnterpriseFooter />
            </PageMotion>

            <style jsx global>{`
                @media (max-width: 1023px) {
                    .about-hero .lp-masthead-title > div {
                        overflow-clip-margin: 0.12em;
                    }
                }
                .stroke-text {
                    -webkit-text-stroke: 1px rgba(0, 0, 0, 0.35);
                }
                @keyframes slow-zoom {
                    from { transform: scale(1.1); }
                    to { transform: scale(1.2); }
                }
                .animate-slow-zoom {
                    animation: slow-zoom 20s infinite alternate linear;
                }
            `}</style>
        </main>
    );
}
