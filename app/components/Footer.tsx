'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/10" suppressHydrationWarning>
            {/* Top Section - Features */}
            <div className="max-w-7xl mx-auto px-8 py-16">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 text-center">
                    {/* Free Delivery */}
                    <div className="flex flex-col items-center gap-3">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 17C9 17.5304 8.78929 18.0391 8.41421 18.4142C8.03914 18.7893 7.53043 19 7 19C6.46957 19 5.96086 18.7893 5.58579 18.4142C5.21071 18.0391 5 17.5304 5 17M9 17C9 16.4696 8.78929 15.9609 8.41421 15.5858C8.03914 15.2107 7.53043 15 7 15C6.46957 15 5.96086 15.2107 5.58579 15.5858C5.21071 15.9609 5 16.4696 5 17M9 17H15M5 17H3V6C3 5.73478 3.10536 5.48043 3.29289 5.29289C3.48043 5.10536 3.73478 5 4 5H16V8M16 17C16 17.5304 16.2107 18.0391 16.5858 18.4142C16.9609 18.7893 17.4696 19 18 19C18.5304 19 19.0391 18.7893 19.4142 18.4142C19.7893 18.0391 20 17.5304 20 17M16 17C16 16.4696 16.2107 15.9609 16.5858 15.5858C16.9609 15.2107 17.4696 15 18 15C18.5304 15 19.0391 15.2107 19.4142 15.5858C19.7893 15.9609 20 16.4696 20 17M20 17H21V12L18 8H16V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="text-white/70 font-thin text-sm tracking-wide">Nationwide Shipping<br />Free Delivery Across India</p>
                    </div>

                    {/* Easy Exchange */}
                    <div className="flex flex-col items-center gap-3">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 12H20M20 12L16 8M20 12L16 16M4 12L8 8M4 12L8 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="text-white/70 font-thin text-sm tracking-wide">Exchange Protocol<br />24-Hour Request Window</p>
                    </div>

                    {/* Customer Support */}
                    <div className="flex flex-col items-center gap-3">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="text-white/70 font-thin text-sm tracking-wide">Premium Support<br />Dedicated Customer Assistance</p>
                    </div>

                    {/* Happy Customers */}
                    <div className="flex flex-col items-center gap-3">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="text-white/70 font-thin text-sm tracking-wide">Verified Satisfaction<br />Trusted by 100+ Happy Customers</p>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Middle Section - Brand Name */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 text-center overflow-hidden">
                <h2
                    className="text-white font-semibold tracking-wider text-[12vw] sm:text-[14vw] md:text-[12rem] leading-none cursor-none select-none whitespace-nowrap"
                    data-cursor-size="large"
                >
                    MAKERS3D
                </h2>
                <p className="text-white/40 font-thin text-[10px] sm:text-xs md:text-sm tracking-[0.3em] md:tracking-[0.6em] uppercase mt-4">
                    Crafting the Future, One Layer at a Time
                </p>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Bottom Section - Links and Social */}
            <div className="max-w-7xl mx-auto px-8 py-16" suppressHydrationWarning>
                {/* Social Media Icons - Centered at Top */}
                <div className="flex justify-center gap-6 mb-12" suppressHydrationWarning>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110" suppressHydrationWarning>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110" suppressHydrationWarning>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110" suppressHydrationWarning>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                    </a>
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110" suppressHydrationWarning>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                    </a>
                    <a href="https://threads.net" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-all duration-300 hover:scale-110" suppressHydrationWarning>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.781 3.631 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142l-.126 1.974a11.881 11.881 0 0 0-2.588-.12c-1.014.055-1.858.355-2.436.866-.563.498-.84 1.133-.804 1.834.033.589.353 1.094.898 1.42.53.317 1.253.463 2.033.41 1.066-.058 1.956-.457 2.65-1.186.616-.648 1.007-1.622 1.161-2.896.009-.074.017-.148.024-.223.007-.068.014-.135.02-.203.007-.07.013-.14.018-.21.004-.07.008-.14.011-.21v-.02a3.126 3.126 0 0 0-.011-.242c-.004-.07-.009-.14-.015-.21-.007-.08-.015-.159-.024-.238-.01-.07-.02-.14-.03-.21-.01-.08-.023-.159-.037-.238-.013-.07-.027-.14-.042-.21-.016-.08-.034-.159-.053-.238-.02-.07-.04-.14-.062-.21-.023-.08-.048-.159-.073-.238-.025-.07-.052-.14-.08-.21-.03-.08-.062-.159-.095-.238-.033-.07-.068-.14-.105-.21-.037-.08-.076-.159-.117-.238-.041-.07-.084-.14-.128-.21-.046-.08-.093-.159-.142-.238-.049-.07-.1-.14-.153-.21-.054-.08-.11-.159-.168-.238-.058-.07-.118-.14-.18-.21-.062-.08-.126-.159-.192-.238-.066-.07-.135-.14-.206-.21-.071-.08-.144-.159-.219-.238-.075-.07-.153-.14-.233-.21-.08-.08-.162-.159-.246-.238-.084-.07-.171-.14-.26-.21-.09-.08-.181-.159-.274-.238-.093-.07-.189-.14-.287-.21-.098-.08-.198-.159-.3-.238-.102-.07-.207-.14-.314-.21-.107-.08-.216-.159-.327-.238-.111-.07-.225-.14-.341-.21-.116-.08-.234-.159-.354-.238-.12-.07-.243-.14-.368-.21-.125-.08-.252-.159-.381-.238-.129-.07-.26-.14-.394-.21-.134-.08-.27-.159-.408-.238-.138-.07-.278-.14-.421-.21-.143-.08-.288-.159-.435-.238-.147-.07-.296-.14-.447-.21-.151-.08-.304-.159-.459-.238-.155-.07-.312-.14-.471-.21-.159-.08-.32-.159-.483-.238-.163-.07-.328-.14-.495-.21-.167-.08-.336-.159-.507-.238-.171-.07-.344-.14-.519-.21-.175-.08-.352-.159-.531-.238-.179-.07-.36-.14-.543-.21-.183-.08-.368-.159-.555-.238-.187-.07-.376-.14-.567-.21-.191-.08-.384-.159-.579-.238-.195-.07-.392-.14-.591-.21-.199-.08-.4-.159-.603-.238-.203-.07-.408-.14-.615-.21-.207-.08-.416-.159-.627-.238-.211-.07-.424-.14-.639-.21-.215-.08-.432-.159-.651-.238-.219-.07-.44-.14-.663-.21-.223-.08-.448-.159-.675-.238-.227-.07-.456-.14-.687-.21-.231-.08-.464-.159-.699-.238-.235-.07-.472-.14-.711-.21-.239-.08-.48-.159-.723-.238-.243-.07-.488-.14-.735-.21-.247-.08-.496-.159-.747-.238-.251-.07-.504-.14-.759-.21-.255-.08-.512-.159-.771-.238-.259-.07-.52-.14-.783-.21-.263-.08-.528-.159-.795-.238-.267-.07-.536-.14-.807-.21-.271-.08-.544-.159-.819-.238-.275-.07-.552-.14-.831-.21-.279-.08-.56-.159-.843-.238-.283-.07-.568-.14-.855-.21-.287-.08-.576-.159-.867-.238-.291-.07-.584-.14-.879-.21-.295-.08-.592-.159-.891-.238-.299-.07-.6-.14-.903-.21-.303-.08-.608-.159-.915-.238-.307-.07-.616-.14-.927-.21-.311-.08-.624-.159-.939-.238-.315-.07-.632-.14-.951-.21-.319-.08-.64-.159-.963-.238-.323-.07-.648-.14-.975-.21-.327-.08-.656-.159-.987-.238-.331-.07-.664-.14-.999-.21-.335-.08-.672-.159-1.011-.238-.339-.07-.68-.14-1.023-.21-.343-.08-.688-.159-1.035-.238-.347-.07-.696-.14-1.047-.21-.351-.08-.704-.159-1.059-.238-.355-.07-.712-.14-1.071-.21-.359-.08-.72-.159-1.083-.238-.363-.07-.728-.14-1.095-.21-.367-.08-.736-.159-1.107-.238-.371-.07-.744-.14-1.119-.21-.375-.08-.752-.159-1.131-.238-.379-.07-.76-.14-1.143-.21-.383-.08-.768-.159-1.155-.238-.387-.07-.776-.14-1.167-.21-.391-.08-.784-.159-1.179-.238-.395-.07-.792-.14-1.191-.21-.399-.08-.8-.159-1.203-.238-.403-.07-.808-.14-1.215-.21-.407-.08-.816-.159-1.227-.238-.411-.07-.824-.14-1.239-.21-.415-.08-.832-.159-1.251-.238-.419-.07-.84-.14-1.263-.21-.423-.08-.848-.159-1.275-.238-.427-.07-.856-.14-1.287-.21-.431-.08-.864-.159-1.299-.238-.435-.07-.872-.14-1.311-.21-.439-.08-.88-.159-1.323-.238-.443-.07-.888-.14-1.335-.21-.447-.08-.896-.159-1.347-.238-.451-.07-.904-.14-1.359-.21-.455-.08-.912-.159-1.371-.238-.459-.07-.92-.14-1.383-.21-.463-.08-.928-.159-1.395-.238-.467-.07-.936-.14-1.407-.21-.471-.08-.944-.159-1.419-.238-.475-.07-.952-.14-1.431-.21-.479-.08-.96-.159-1.443-.238-.483-.07-.968-.14-1.455-.21-.487-.08-.976-.159-1.467-.238-.491-.07-.984-.14-1.479-.21-.495-.08-1.992-.159-1.491-.238" />
                        </svg>
                    </a>
                </div>

                {/* Links - Two Balanced Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto" suppressHydrationWarning>
                    {/* Left Column - Customer Service */}
                    <div className="text-center md:text-left" suppressHydrationWarning>
                        <h3 className="text-white/40 font-thin text-xs uppercase tracking-[0.2em] mb-6">Customer Service</h3>
                        <div className="flex flex-col gap-4" suppressHydrationWarning>
                            <Link href="/shipping-policy#tracking" className="text-white/70 font-thin text-sm tracking-wide hover:text-white transition-colors hover:translate-x-1 inline-block" suppressHydrationWarning>
                                Track My Order
                            </Link>
                            <Link href="/return-policy" className="text-white/70 font-thin text-sm tracking-wide hover:text-white transition-colors hover:translate-x-1 inline-block" suppressHydrationWarning>
                                Return Policies
                            </Link>
                            <Link href="/shipping-policy" className="text-white/70 font-thin text-sm tracking-wide hover:text-white transition-colors hover:translate-x-1 inline-block" suppressHydrationWarning>
                                Shipping Policy
                            </Link>
                            <Link href="/privacy-policy" className="text-white/70 font-thin text-sm tracking-wide hover:text-white transition-colors hover:translate-x-1 inline-block" suppressHydrationWarning>
                                Privacy Policy
                            </Link>
                            <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                                <a href="mailto:support@makers3d.in" className="text-white/40 font-thin text-[10px] tracking-widest hover:text-white transition-colors">
                                    SUPPORT@MAKERS3D.IN
                                </a>
                                <a href="tel:+917863983914" className="text-white/40 font-thin text-[10px] tracking-widest hover:text-white transition-colors">
                                    +91 7863983914
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Company */}
                    <div className="text-center md:text-right" suppressHydrationWarning>
                        <h3 className="text-white/40 font-thin text-xs uppercase tracking-[0.2em] mb-6">Company</h3>
                        <div className="flex flex-col gap-4 items-center md:items-end" suppressHydrationWarning>
                            <Link href="/about" className="text-white/70 font-thin text-sm tracking-wide hover:text-white transition-colors hover:translate-x-1 inline-block" suppressHydrationWarning>
                                About Us
                            </Link>
                            <Link href="/terms" className="text-white/70 font-thin text-sm tracking-wide hover:text-white transition-colors hover:translate-x-1 inline-block" suppressHydrationWarning>
                                Terms and Services
                            </Link>
                            <Link href="/partner" className="text-white/70 font-thin text-sm tracking-wide hover:text-white transition-colors hover:translate-x-1 inline-block" suppressHydrationWarning>
                                Partner With Us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-8 py-6 text-center">
                    <p className="text-white/40 font-thin text-xs tracking-wide">
                        © 2024 MAKERS3D. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
