import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, MapPin, Instagram, Mail, Phone, ExternalLink, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import logo from './assets/logo.png';

gsap.registerPlugin(ScrollTrigger);

// Base path helper for Vite public assets
const base = import.meta.env.BASE_URL;
const getImg = (name) => `${base}${name}`.replace('//', '/');

// --- Utils ---

let lenisInstance = null;

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        if (lenisInstance) {
            lenisInstance.scrollTo(0, { immediate: true });
        } else {
            window.scrollTo(0, 0);
        }
    }, [pathname]);
    return null;
};

// --- Global UI Components ---

const BookingModal = ({ isOpen, onClose }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" });
            gsap.fromTo(".booking-content", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: "back.out(1.2)" });
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div ref={modalRef} className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-charcoal/95 backdrop-blur-xl">
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 z-[210] text-cream hover:text-gold transition-colors p-2 bg-charcoal/50 rounded-full"
            >
                <X size={32} />
            </button>
            
            <div className="booking-content w-full max-w-2xl bg-cream rounded-3xl p-10 md:p-14 shadow-2xl relative">
                <span className="font-sans tracking-widest uppercase text-gold text-sm font-bold mb-4 block text-center">Richiesta Informazioni</span>
                <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-8 text-center">Contattaci per maggiori informazioni</h2>
                <p className="font-sans font-light text-charcoal/60 mb-10 text-lg text-center">Siamo a tua disposizione per trovare la soluzione migliore per le tue date.</p>
                
                <div className="grid gap-4">
                    {[
                        { lang: 'Italiano', num: '+39 330 455163', tel: '+39330455163' },
                        { lang: 'English', num: '+39 334 2044493', tel: '+393342044493' },
                        { lang: 'Português', num: '+39 339 9909559', tel: '+393399909559' }
                    ].map((contact, idx) => (
                        <a 
                            key={idx}
                            href={`tel:${contact.tel}`}
                            className="flex items-center justify-between p-5 bg-white border border-neutral-200 rounded-2xl hover:border-gold hover:shadow-lg transition-all group"
                        >
                            <div className="flex flex-col items-start px-2">
                                <span className="text-[10px] uppercase tracking-widest text-gold font-bold mb-1">{contact.lang}</span>
                                <span className="font-serif text-2xl text-charcoal group-hover:text-gold transition-colors">{contact.num}</span>
                            </div>
                            <div className="w-10 h-10 flex items-center justify-center bg-neutral-50 rounded-full group-hover:bg-gold/10 transition-colors mr-2">
                                 <Phone className="text-charcoal group-hover:text-gold" size={20} />
                            </div>
                        </a>
                    ))}

                    <a 
                        href="mailto:jambokellahouseroma@gmail.com"
                        className="flex items-center justify-between p-5 bg-white border border-neutral-200 rounded-2xl hover:border-gold hover:shadow-lg transition-all group"
                    >
                        <div className="flex flex-col items-start px-2">
                            <span className="text-[10px] uppercase tracking-widest text-gold font-bold mb-1">Email</span>
                            <span className="font-serif text-xl md:text-2xl text-charcoal group-hover:text-gold transition-colors">jambokellahouseroma@gmail.com</span>
                        </div>
                        <div className="w-10 h-10 flex items-center justify-center bg-neutral-50 rounded-full group-hover:bg-gold/10 transition-colors mr-2">
                             <Mail className="text-charcoal group-hover:text-gold" size={20} />
                        </div>
                    </a>
                </div>

                <div className="mt-10 pt-8 border-t border-neutral-100 flex justify-center gap-6">
                    <p className="text-[10px] font-sans text-charcoal/40 uppercase tracking-[0.2em]">Disponibile su WhatsApp • Email • Telefono</p>
                </div>
            </div>
        </div>
    );
};

const GalleryModal = ({ isOpen, onClose, images, roomName }) => {
    const modalRef = useRef(null);
    const [selectedIdx, setSelectedIdx] = useState(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" });
            gsap.fromTo(".modal-content", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: "back.out(1.2)" });
        } else {
            document.body.style.overflow = 'auto';
            setSelectedIdx(null);
        }
    }, [isOpen]);

    // Handle Keyboard Navigation for Lightbox
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedIdx === null) return;
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') setSelectedIdx(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIdx]);

    const handleNext = () => {
        setSelectedIdx((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setSelectedIdx((prev) => (prev - 1 + images.length) % images.length);
    };

    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) handleNext();
        if (isRightSwipe) handlePrev();
    };

    if (!isOpen) return null;

    return (
        <div ref={modalRef} className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-charcoal/95 backdrop-blur-xl">
            {/* Main Modal Close */}
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 z-[110] text-cream hover:text-gold transition-colors p-2 bg-charcoal/50 rounded-full"
            >
                <X size={32} />
            </button>
            
            <div className="modal-content w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-cream rounded-3xl p-8 md:p-12 shadow-2xl custom-scrollbar relative">
                <div className="text-center mb-12">
                    <span className="font-sans tracking-widest uppercase text-gold text-sm font-bold mb-4 block">Galleria Fotografica</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-charcoal">{roomName}</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => setSelectedIdx(idx)}
                            className="gallery-item overflow-hidden rounded-xl aspect-square bg-neutral-200 shadow-sm transition-transform duration-500 hover:scale-[1.02] cursor-pointer group relative"
                        >
                            <img 
                                src={img} 
                                alt={`${roomName} shot ${idx + 1}`} 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Maximize2 className="text-white" size={24} />
                            </div>
                        </div>
                    ))}
                    {images.length === 0 && (
                        <div className="col-span-full py-20 text-center opacity-40 font-serif italic text-xl">
                            Caricamento immagini in corso...
                        </div>
                    )}
                </div>
                
                <div className="mt-16 text-center">
                    <button onClick={onClose} className="px-12 py-4 bg-gold text-charcoal tracking-widest uppercase font-sans text-xs font-bold hover:bg-charcoal hover:text-white transition-all duration-300 rounded-full shadow-lg">
                        Chiudi Galleria
                    </button>
                </div>
            </div>

            {/* LIGHTBOX OVERLAY */}
            {selectedIdx !== null && (
                <div 
                    className="fixed inset-0 z-[300] bg-charcoal animate-fadeIn flex flex-col items-center justify-center p-4"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <button 
                        onClick={() => setSelectedIdx(null)}
                        className="absolute top-6 right-6 text-cream/70 hover:text-white transition-colors p-3 bg-white/10 rounded-full z-[310]"
                    >
                        <X size={32} />
                    </button>

                    <button 
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        className="absolute left-4 md:left-8 text-cream/70 hover:text-white transition-all p-4 bg-white/5 hover:bg-white/10 rounded-full z-[310] hidden md:flex"
                    >
                        <ChevronLeft size={48} />
                    </button>

                    <button 
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        className="absolute right-4 md:right-8 text-cream/70 hover:text-white transition-all p-4 bg-white/5 hover:bg-white/10 rounded-full z-[310] hidden md:flex"
                    >
                        <ChevronRight size={48} />
                    </button>

                    <div className="relative w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.target === e.currentTarget && setSelectedIdx(null)}>
                        <img 
                            src={images[selectedIdx]} 
                            alt={`Fullscreen ${roomName}`} 
                            className="max-h-[85vh] max-w-[95vw] object-contain shadow-2xl animate-zoomIn pointer-events-none"
                        />
                        <div className="mt-6 text-cream/60 font-sans tracking-widest uppercase text-xs">
                            {roomName} — {selectedIdx + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


const Navbar = ({ onOpenBooking }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { name: 'IL B&B', path: '/' },
        { name: 'L\'APPARTAMENTO', path: '/camere' },
        { name: 'DOVE SIAMO', path: '/location' },
        { name: 'ESPERIENZE', path: '/esperienze' }
    ];

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-cream/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'}`}>
                <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
                    <Link to="/" className="z-50 flex items-center group">
                        <img src={logo} alt="Jambokella Logo" className="h-12 md:h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-12 font-sans text-sm tracking-widest uppercase font-medium">
                        {links.map((link) => (
                            <Link key={link.name} to={link.path} className="text-charcoal/80 hover:text-gold transition-colors relative group">
                                {link.name}
                                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}
                        <button onClick={onOpenBooking} className="px-6 py-2 border border-gold text-gold hover:bg-gold hover:text-white transition-all duration-300 ml-4 font-bold">
                            Ottieni maggiori informazioni
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <button className="md:hidden z-50 text-charcoal" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 bg-cream z-40 flex flex-col items-center justify-center transition-transform duration-500 ease-in-out ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="flex flex-col items-center gap-8 font-serif text-3xl text-charcoal">
                    {links.map((link) => (
                        <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="hover:text-gold transition-colors">
                            {link.name}
                        </Link>
                    ))}
                    <button onClick={() => { setIsOpen(false); onOpenBooking(); }} className="mt-8 px-8 py-3 bg-gold text-white text-lg tracking-widest uppercase font-sans hover:bg-charcoal transition-colors">
                        Ottieni maggiori informazioni
                    </button>
                </div>
            </div>
        </>
    );
};

const Footer = ({ onOpenBooking }) => {
    return (
        <footer className="bg-charcoal text-cream pt-24 pb-12 mt-24">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid md:grid-cols-3 gap-16 mb-20 text-center md:text-left">
                    
                    {/* Brand */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-3 mb-6">
                            <img src={logo} alt="Jambokella Logo" className="h-12 w-auto object-contain brightness-0 invert" />
                        </div>
                        <p className="text-cream/60 font-sans font-light max-w-sm leading-relaxed mb-6">
                            Jambokella è nata per accogliere.<br/>
                            Una vera casa romana dove abbiamo curato ogni dettaglio per farvi staccare la spina alla fine della giornata.
                        </p>
                    </div>

                    {/* Contatti */}
                    <div className="flex flex-col items-center md:items-start font-sans font-light text-cream/80">
                        <h4 className="font-serif text-xl mb-6 uppercase tracking-widest text-gold text-sm">Contatti</h4>
                        <div className="space-y-4">
                            <a href="https://maps.app.goo.gl/Vd8wodjyoFZS9FF28" target="_blank" rel="noreferrer" className="flex items-start gap-3 hover:text-gold transition-colors group">
                                <MapPin className="w-5 h-5 text-gold shrink-0 mt-1" />
                                <span>Via N. Corsi, 4<br/>00152 Roma RM, Italia</span>
                            </a>
                            <a href="tel:+39330455163" className="flex items-center gap-3 hover:text-gold transition-colors group">
                                <Phone className="w-5 h-5 text-gold" />
                                <span className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest text-gold/60 font-bold mb-0.5">Italiano</span>
                                    <span>(+39) 330 455163</span>
                                </span>
                            </a>
                            <a href="tel:+393342044493" className="flex items-center gap-3 hover:text-gold transition-colors group">
                                <Phone className="w-5 h-5 text-gold" />
                                <span className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest text-gold/60 font-bold mb-0.5">English</span>
                                    <span>(+39) 334 2044493</span>
                                </span>
                            </a>
                            <a href="tel:+393399909559" className="flex items-center gap-3 hover:text-gold transition-colors group">
                                <Phone className="w-5 h-5 text-gold" />
                                <span className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest text-gold/60 font-bold mb-0.5">Português</span>
                                    <span>(+39) 339 9909559</span>
                                </span>
                            </a>
                            <a href="mailto:jambokellahouseroma@gmail.com" className="flex items-center gap-3 hover:text-gold transition-colors mt-2">
                                <Mail className="w-5 h-5 text-gold" />
                                <span>jambokellahouseroma@gmail.com</span>
                            </a>
                        </div>
                    </div>

                    {/* Social & Links */}
                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="font-serif text-xl mb-6 uppercase tracking-widest text-gold text-sm">Seguici</h4>
                        <a href="https://www.instagram.com/JambokellaHouserome/" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-gold transition-colors text-cream/80 font-sans font-light mb-8">
                            <Instagram className="w-5 h-5" />
                            <span>@JambokellaHouserome</span>
                        </a>
                        <button onClick={onOpenBooking} className="px-8 py-3 bg-gold text-charcoal tracking-widest uppercase font-sans text-xs font-bold hover:bg-cream hover:text-charcoal transition-colors">
                            Ottieni maggiori informazioni
                        </button>
                    </div>
                </div>

                <div className="pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center text-xs font-sans text-cream/40 px-4">
                    <p>© {new Date().getFullYear()} Jambokella House Rome. Tutti i diritti riservati.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-cream transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-cream transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// --- Pages ---

const Home = ({ onOpenBooking }) => {
    const mainRef = useRef(null);
    const videoRef = useRef(null);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [activeGallery, setActiveGallery] = useState({ name: '', images: [] });

    // Initial setting on first render
    const [videoSrc, setVideoSrc] = useState(() => {
        const isMobile = window.innerWidth < 769;
        return getImg(isMobile ? "hero-video-mobile.mp4" : "hero-video.mp4");
    });

    // Detect screen size on resize
    useEffect(() => {
        const checkMobile = () => {
            const isMobile = window.innerWidth < 769;
            setVideoSrc(getImg(isMobile ? "hero-video-mobile.mp4" : "hero-video.mp4"));
        };
        
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Force play on source change
    useEffect(() => {
        if (videoRef.current && videoSrc) {
            videoRef.current.load(); // Reload sources
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Autoplay prevented:", error);
                });
            }
        }
    }, [videoSrc]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".hero-title > span", {
                y: 50,
                opacity: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: "power3.out",
                delay: 0.2
            });
            gsap.from(".hero-subtitle", {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: "power2.out",
                delay: 0.8
            });


            gsap.to(".hero-image-container", {
                scrollTrigger: {
                    trigger: ".hero-section",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                },
                y: 150,
                scale: 1.1,
                ease: "none"
            });
            gsap.from(".philosophy-section .reveal-up", {
                scrollTrigger: {
                    trigger: ".philosophy-section",
                    start: "top 80%",
                },
                y: 60,
                opacity: 0,
                duration: 1.2,
                ease: "power2.out",
                stagger: 0.2
            });

            gsap.from(".rooms-preview .reveal-up", {
                scrollTrigger: {
                    trigger: ".rooms-preview",
                    start: "top 70%",
                },
                y: 60,
                opacity: 0,
                duration: 1.2,
                ease: "power2.out",
                stagger: 0.2
            });

            gsap.from(".location-teaser .reveal-up", {
                scrollTrigger: {
                    trigger: ".location-teaser",
                    start: "top 80%",
                },
                y: 60,
                opacity: 0,
                duration: 1.2,
                ease: "power2.out",
                stagger: 0.2
            });

            // New asymmetric animations
            gsap.from(".philosophy-img-1", {
                scrollTrigger: {
                    trigger: ".philosophy-section",
                    start: "top 60%",
                    scrub: 1
                },
                y: -100,
                ease: "none"
            });
            gsap.from(".philosophy-img-2", {
                scrollTrigger: {
                    trigger: ".philosophy-section",
                    start: "top 40%",
                    scrub: 1.5
                },
                y: 100,
                ease: "none"
            });
            gsap.from(".philosophy-img-3", {
                scrollTrigger: {
                    trigger: ".philosophy-section",
                    start: "top 20%",
                    scrub: 2
                },
                y: -50,
                ease: "none"
            });
            gsap.from(".room-card-preview", {
                scrollTrigger: {
                    trigger: ".rooms-preview",
                    start: "top 70%",
                },
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power2.out"
            });
        }, mainRef);
        return () => ctx.revert();
    }, []);

    return (
        <main ref={mainRef}>
            <GalleryModal 
                isOpen={isGalleryOpen} 
                onClose={() => setIsGalleryOpen(false)} 
                images={activeGallery.images} 
                roomName={activeGallery.name} 
            />
            <Helmet>
                <title>Jambokella House Rome | La tua dimora a Roma</title>
                <meta name="description" content="Jambo Kella House: l'eleganza dell'ospitalità romana. Un B&B esclusivo nel cuore di Roma." />
            </Helmet>

            {/* HERO SECTION */}
            <section className="hero-section relative h-[100dvh] w-full overflow-hidden flex items-center justify-center rounded-b-[3rem] shadow-2xl z-10 mx-auto bg-charcoal pt-32 pb-16 md:p-0">
                <div className="absolute inset-0 bg-charcoal/40 z-10"></div>
                <div className="hero-image-container absolute inset-0 w-full h-full object-cover z-0 opacity-80">
                    <video 
                        ref={videoRef}
                        autoPlay
                        muted 
                        loop 
                        playsInline 
                        disablePictureinPicture
                        controlsList="nopictureinpicture"
                        className="w-full h-full object-cover"
                    >
                        {videoSrc && <source src={videoSrc} type="video/mp4" />}
                    </video>
                </div>
                <div className="relative z-30 text-center text-cream px-6 max-w-4xl mx-auto flex flex-col items-center mt-12 md:mt-0">
                    <span className="hero-subtitle font-sans tracking-widest uppercase text-gold text-sm md:text-base font-bold mb-4 md:mb-8 block drop-shadow-md">
                        Riposo autentico nel cuore di Roma
                    </span>
                    <h1 className="hero-title mb-6 md:mb-8 drop-shadow-2xl flex flex-col items-center">
                        <img src={logo} alt="Jambokella Logo" className="h-20 md:h-28 lg:h-32 w-auto object-contain brightness-0 invert drop-shadow-2xl mb-4" />
                        <span className="block italic font-light text-3xl md:text-5xl lg:text-6xl text-gold">La vostra oasi di pace a Monteverde.</span>
                    </h1>
                    
                    <div className="reveal-up mt-4 md:mt-8 flex flex-col items-center gap-3">
                        <button onClick={onOpenBooking} className="px-8 md:px-10 py-3 md:py-4 bg-gold text-charcoal font-sans text-xs md:text-sm tracking-widest uppercase font-bold hover:bg-cream hover:scale-105 transition-all duration-300 shadow-xl inline-block">
                            Ottieni maggiori informazioni
                        </button>
                        <p className="text-cream/80 text-[10px] md:text-xs font-sans tracking-[0.15em] uppercase drop-shadow-md pb-1 border-b border-cream/20">
                            Contatto diretto senza commissioni • Cancellazione flessibile
                        </p>
                    </div>
                </div>
            </section>

            {/* PHILOSOPHY SECTION - REDESIGNED */}
            <section className="philosophy-section py-32 md:py-56 px-6 bg-cream text-charcoal relative z-20 overflow-hidden">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        
                        {/* Asymmetric Gallery */}
                        <div className="w-full lg:w-1/2 relative h-[600px] md:h-[800px]">
                            <div className="philosophy-img-1 absolute left-0 top-0 w-3/4 h-2/3 shadow-2xl rounded-2xl overflow-hidden z-20">
                                <img src={getImg("philosophy-1.jpg")} alt="Interiors" className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-[2s] ease-out shadow-inner" />
                                <div className="absolute inset-0 bg-charcoal/10 mix-blend-multiply"></div>
                            </div>
                            <div className="philosophy-img-2 absolute right-0 top-1/4 w-3/5 h-1/2 shadow-2xl rounded-2xl overflow-hidden z-30 border-8 border-cream group">
                                <img src={getImg("philosophy-2.jpg")} alt="Details" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2s] ease-out" />
                                <div className="absolute inset-0 bg-charcoal/5 group-hover:bg-transparent transition-colors duration-700"></div>
                            </div>
                            <div className="philosophy-img-3 absolute left-10 bottom-0 w-1/2 h-1/3 shadow-2xl rounded-2xl overflow-hidden z-10">
                                <img src={getImg("philosophy-3.jpg")} alt="Atmosphere" className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-[2s] ease-out" />
                                <div className="absolute inset-0 bg-charcoal/15"></div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="w-full lg:w-1/2 text-left space-y-12">
                            <div>
                                <span className="reveal-up font-sans tracking-widest uppercase text-gold text-sm font-bold mb-6 block">Il Nostro Approccio</span>
                                <h2 className="reveal-up text-4xl md:text-5xl lg:text-7xl font-serif leading-tight mb-8">
                                    Più che un bed & breakfast,<br/>
                                    <span className="text-gold">la vostra ricarica quotidiana.</span>
                                </h2>
                            </div>
                            
                            <div className="reveal-up space-y-6 max-w-xl">
                                <p className="text-lg md:text-xl font-sans font-light text-charcoal/80 leading-relaxed italic border-l-2 border-gold pl-8 py-4">
                                    "Questo luminoso ed elegante appartamento nel cuore di Monteverde è stato progettato per rendere il vostro soggiorno a Roma indimenticabile e senza stress."
                                </p>
                                <p className="text-base md:text-lg font-sans font-light text-charcoal/60 leading-relaxed">
                                    Recentemente ristrutturato con arredi moderni, l'intero appartamento è a vostra esclusiva disposizione e dispone di ogni comfort, dal Wi-Fi ad alta velocità agli spazi ampi. È la soluzione ideale per coppie e famiglie, potendo accogliere comodamente fino a cinque persone con la possibilità di richiedere un letto aggiuntivo o una culla. L'appartamento dispone inoltre di un ampio spazio esterno con tavolo da pranzo con 6 posti.
                                </p>
                            </div>

                            <div className="reveal-up pt-8 flex flex-wrap gap-8">
                                <div className="flex flex-col gap-2">
                                    <span className="font-serif text-3xl text-gold">01</span>
                                    <span className="font-sans uppercase tracking-[0.2em] text-[10px] font-bold">Sonni tranquilli garantiti</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="font-serif text-3xl text-gold">02</span>
                                    <span className="font-sans uppercase tracking-[0.2em] text-[10px] font-bold">Posizione strategica (No auto)</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="font-serif text-3xl text-gold">03</span>
                                    <span className="font-sans uppercase tracking-[0.2em] text-[10px] font-bold">Host professionali</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ROOMS PREVIEW SECTION */}
            <section className="rooms-preview py-32 bg-white text-charcoal">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20">
                        <div className="max-w-xl">
                            <span className="reveal-up font-sans tracking-widest uppercase text-gold text-sm font-bold mb-4 block">L'Appartamento</span>
                            <h2 className="reveal-up text-4xl md:text-5xl font-serif leading-tight">
                                Tre camere, zero pensieri. Spazi indipendenti dove ricaricare davvero le energie prima della prossima <span className="italic text-gold">passeggiata romana.</span>
                            </h2>
                        </div>
                        <Link to="/camere" className="reveal-up hidden md:inline-block border-b border-charcoal pb-1 uppercase font-sans tracking-widest text-sm hover:text-gold hover:border-gold transition-colors">
                            Vedi gli spazi
                        </Link>
                    </div>

                    <div className="reveal-up grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                        {/* Room 1 */}
                        <div onClick={() => { setActiveGallery({ name: 'Camera Matrimoniale 1', images: m1Images }); setIsGalleryOpen(true); }} className="room-card-preview group cursor-pointer lg:mt-16 relative">
                            <div className="overflow-hidden aspect-[4/5] object-cover relative mb-6 rounded-2xl shadow-lg">
                                <img 
                                    src={getImg("room1.jpg")} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                                    alt="Camera Matrimoniale 1" 
                                />
                                <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                    <span className="px-6 py-2 border border-white text-white uppercase tracking-widest text-xs font-bold">Guarda Galleria</span>
                                </div>
                            </div>
                            <h3 className="font-serif text-2xl mb-2 text-charcoal group-hover:text-gold transition-colors">Camera Matrimoniale 1</h3>
                            <p className="font-sans font-light text-charcoal/60 text-sm mb-6">Spaziosa, con dettagli di design e un materasso premium per farvi dimenticare i chilometri percorsi a piedi.</p>
                            <button 
                                onClick={() => { setActiveGallery({ name: 'Camera Matrimoniale 1', images: m1Images }); setIsGalleryOpen(true); }}
                                className="text-gold uppercase tracking-tighter font-bold border-b border-gold pb-1 hover:text-charcoal hover:border-charcoal transition-colors"
                            >
                                Guarda Galleria
                            </button>
                        </div>

                        {/* Room 2 */}
                        <div onClick={() => { setActiveGallery({ name: 'Camera Matrimoniale 2', images: m2Images }); setIsGalleryOpen(true); }} className="room-card-preview group cursor-pointer lg:mt-8 relative">
                            <div className="overflow-hidden aspect-[4/5] object-cover relative mb-6 rounded-2xl shadow-lg">
                                <img 
                                    src={getImg("room2.jpg")} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                                    alt="Camera Matrimoniale 2" 
                                />
                                <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                    <span className="px-6 py-2 border border-white text-white uppercase tracking-widest text-xs font-bold">Guarda Galleria</span>
                                </div>
                            </div>
                            <h3 className="font-serif text-2xl mb-2 text-charcoal group-hover:text-gold transition-colors">Camera Matrimoniale 2</h3>
                            <p className="font-sans font-light text-charcoal/60 text-sm mb-6">Silenziosa e luminosa, con un armadio grande e una scrivania per lavorare.</p>
                            <button 
                                onClick={() => { setActiveGallery({ name: 'Camera Matrimoniale 2', images: m2Images }); setIsGalleryOpen(true); }}
                                className="text-gold uppercase tracking-tighter font-bold border-b border-gold pb-1 hover:text-charcoal hover:border-charcoal transition-colors"
                            >
                                Guarda Galleria
                            </button>
                        </div>

                        {/* Room 3 */}
                        <div onClick={() => { setActiveGallery({ name: 'Camera Singola', images: sImages }); setIsGalleryOpen(true); }} className="room-card-preview group cursor-pointer relative">
                            <div className="overflow-hidden aspect-[4/5] object-cover relative mb-6 rounded-2xl shadow-lg">
                                <img 
                                    src={getImg("EMP_8299.jpg")} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                                    alt="Camera Singola"
                                />
                                <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                    <span className="px-6 py-2 border border-white text-white uppercase tracking-widest text-xs font-bold">Guarda Galleria</span>
                                </div>
                            </div>
                            <h3 className="font-serif text-2xl mb-2 text-charcoal group-hover:text-gold transition-colors">Camera Singola</h3>
                            <p className="font-sans font-light text-charcoal/60 text-sm mb-6">Compatta ma ben organizzata. Intimità totale e spazio per lasciare le valige.</p>
                            <button 
                                onClick={() => { setActiveGallery({ name: 'Camera Singola', images: sImages }); setIsGalleryOpen(true); }}
                                className="text-gold uppercase tracking-tighter font-bold border-b border-gold pb-1 hover:text-charcoal hover:border-charcoal transition-colors"
                            >
                                Guarda Galleria
                            </button>
                        </div>

                        {/* Common Areas - Integrated */}
                        {[
                            { name: 'Sala da Pranzo e Cucina', desc: 'Soggiorno con cucina attrezzata e ogni comfort.', img: salaImages[0], gallery: salaImages },
                            { name: 'Bagni comfort', desc: 'Due comodi bagni con doccia e lavasciuga.', img: bagniImages[0], gallery: bagniImages },
                            { name: 'Ampio Balcone', desc: 'Tavolo per 6 persone ideale per colazioni e cene.', img: balconeImages[0], gallery: balconeImages }
                        ].map((area, idx) => (
                            <div key={idx} onClick={() => { setActiveGallery({ name: area.name, images: area.gallery }); setIsGalleryOpen(true); }} className="room-card-preview group cursor-pointer relative">
                                <div className="overflow-hidden aspect-[4/5] object-cover relative mb-6 rounded-2xl shadow-lg">
                                    <img 
                                        src={area.img} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                                        alt={area.name} 
                                    />
                                    <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                        <span className="px-6 py-2 border border-white text-white uppercase tracking-widest text-xs font-bold">Guarda Galleria</span>
                                    </div>
                                </div>
                                <h3 className="font-serif text-2xl mb-2 text-charcoal group-hover:text-gold transition-colors">{area.name}</h3>
                                <p className="font-sans font-light text-charcoal/60 text-sm mb-6">{area.desc}</p>
                                <button 
                                    onClick={() => { setActiveGallery({ name: area.name, images: area.gallery }); setIsGalleryOpen(true); }}
                                    className="text-gold uppercase tracking-tighter font-bold border-b border-gold pb-1 hover:text-charcoal hover:border-charcoal transition-colors"
                                >
                                    Guarda Galleria
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center md:hidden">
                        <Link to="/camere" className="inline-block border-b border-charcoal pb-1 uppercase font-sans tracking-widest text-sm hover:text-gold hover:border-gold transition-colors">
                            Scopri l'intero appartamento
                        </Link>
                    </div>
                </div>
            </section>

            {/* LOCATION TEASER SECTION */}
            <section className="location-teaser relative py-32 bg-charcoal text-cream overflow-hidden">
                <div className="container mx-auto px-6 lg:px-12 relative z-20 flex flex-col md:flex-row items-center gap-16">
                    <div className="md:w-1/2">
                        <span className="reveal-up font-sans tracking-widest uppercase text-gold text-sm font-bold mb-4 block">La Zona</span>
                        <h2 className="reveal-up text-4xl md:text-5xl lg:text-6xl font-serif leading-tight mb-8">
                            A 15 minuti da tutto, <span className="italic text-gold">a chilometri dal caos.</span>
                        </h2>
                        <p className="reveal-up font-sans font-light text-cream/70 text-lg leading-relaxed mb-10 max-w-lg">
                            La zona è strategica: il tram 8 vi porta direttamente nel centro storico in pochi minuti. La vicinanza con la stazione Trastevere è ideale per chi arriva dall'aeroporto. Avrete tutto a portata di mano: supermercati, ristoranti tipici e la splendida Villa Doria Pamphili per i vostri momenti di relax nel verde.
                        </p>
                        <Link to="/location" className="reveal-up inline-flex items-center gap-3 border border-gold px-8 py-3 text-gold hover:bg-gold hover:text-charcoal transition-colors tracking-widest uppercase font-sans text-xs font-bold">
                            Esplora la mappa
                        </Link>
                    </div>
                    <div className="md:w-1/2 w-full h-[500px] relative overflow-hidden group">
                        <img 
                            src={getImg("location.jpg")} 
                            alt="Roma" 
                            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 border border-gold/30 m-4 pointer-events-none"></div>
                    </div>
                </div>
            </section>
        </main>
    )
}


// --- Pages ---

// Dynamically import all images from src/assets
const allAssets = import.meta.glob('./assets/*.{jpg,jpeg,png,JPG,JPEG,PNG}', { eager: true });
const galleryImages = Object.entries(allAssets)
    .filter(([path]) => !path.toLowerCase().includes('logo.png'))
    .map(([_, mod]) => mod.default || mod);

// Individual Room Assets
const m1Assets = import.meta.glob('./assets/Camera matrimoniale 1/*.{jpg,jpeg,png,JPG,JPEG,PNG}', { eager: true });
const m2Assets = import.meta.glob('./assets/Camera matrimoniale 2/*.{jpg,jpeg,png,JPG,JPEG,PNG}', { eager: true });
const sAssets = import.meta.glob('./assets/Camera singola/*.{jpg,jpeg,png,JPG,JPEG,PNG}', { eager: true });
const salaAssets = import.meta.glob('./assets/Sala da pranzo/*.{jpg,jpeg,png,JPG,JPEG,PNG}', { eager: true });
const bagniAssets = import.meta.glob('./assets/Bagni/*.{jpg,jpeg,png,JPG,JPEG,PNG}', { eager: true });
const balconeAssets = import.meta.glob('./assets/Balcone/*.{jpg,jpeg,png,JPG,JPEG,PNG}', { eager: true });

const m1Images = Object.values(m1Assets).map(mod => mod.default || mod);
const m2Images = Object.values(m2Assets).map(mod => mod.default || mod);
const sImages = Object.values(sAssets).map(mod => mod.default || mod);
const salaImages = Object.values(salaAssets).map(mod => mod.default || mod);
const bagniImages = Object.values(bagniAssets).map(mod => mod.default || mod);
const balconeImages = Object.values(balconeAssets).map(mod => mod.default || mod);

const CamerePage = ({ onOpenBooking }) => {
    const mainRef = useRef(null);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [activeGallery, setActiveGallery] = useState({ name: '', images: [] });

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".page-title", { y: 50, opacity: 0, duration: 1, ease: "power2.out" });
            gsap.from(".room-card", {
                y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power2.out",
                scrollTrigger: { trigger: ".rooms-grid", start: "top 80%" }
            });
            gsap.from(".gallery-item", {
                y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: "power2.out",
                scrollTrigger: { trigger: ".photo-gallery", start: "top 85%" }
            });
        }, mainRef);
        return () => ctx.revert();
    }, []);

    const rooms = [
        { id: 'm1', name: 'Camera Matrimoniale 1', desc: 'Comoda e grande camera matrimoniale completa di grandi armadi, scrivania, Smart TV, Clima, Balcone e possibilità di Letto Aggiuntivo.', img: getImg('room1.jpg'), gallery: m1Images },
        { id: 'm2', name: 'Camera Matrimoniale 2', desc: 'Grande camera matrimoniale completa di spazioso armadio, scrivania, Smart TV, clima, Balcone e possibilità di Culla.', img: getImg('room2.jpg'), gallery: m2Images },
        { id: 's', name: 'Camera 3 (Singola)', desc: 'Camera spaziosa con letto singolo, completa di armadio, Smart TV, clima e balcone.', img: getImg('EMP_8299.jpg'), gallery: sImages },
        { id: 'sala', name: 'Sala da Pranzo e Cucina', desc: 'Spazioso soggiorno con induzione, lavastoviglie e ogni comfort.', img: salaImages[0], gallery: salaImages },
        { id: 'bagni', name: 'Bagni', desc: 'Due bagni completi di doccia, phon e lavasciuga.', img: bagniImages[0], gallery: bagniImages },
        { id: 'balcone', name: 'Balcone', desc: 'Spazio esterno con tavolo per 6 persone ideale per cenare.', img: balconeImages[0], gallery: balconeImages }
    ];

    return (
        <main ref={mainRef} className="pt-32 pb-24 bg-cream min-h-screen">
            <GalleryModal 
                isOpen={isGalleryOpen} 
                onClose={() => setIsGalleryOpen(false)} 
                images={activeGallery.images} 
                roomName={activeGallery.name} 
            />
            <Helmet>
                <title>L'Appartamento | Jambokella House Rome</title>
                <meta name="description" content="Scopri l'intero appartamento a tua disposizione. Tre comode camere e spazi ampi dotati di ogni comfort." />
            </Helmet>
            <div className="container mx-auto px-6 lg:px-12">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="page-title text-5xl md:text-6xl font-serif text-charcoal mb-6">Esclusivo per voi</h1>
                    <p className="page-title font-sans font-light text-charcoal/70 text-lg leading-relaxed">
                        L'intera casa è a vostra disposizione. Ogni spazio è stato ristrutturato per offrirvi il massimo del comfort, della tecnologia e della privacy.
                    </p>
                </div>
                <div className="rooms-grid grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-32">
                    {rooms.map((room, idx) => (
                        <div key={idx} className="room-card group">
                            <div className="overflow-hidden aspect-[4/5] mb-6 relative cursor-pointer" onClick={() => { setActiveGallery({ name: room.name, images: room.gallery }); setIsGalleryOpen(true); }}>
                                <img src={room.img} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                    <span className="px-6 py-2 border border-white text-white uppercase tracking-widest text-xs font-bold">Guarda Galleria</span>
                                </div>
                            </div>
                            <h3 className="font-serif text-3xl mb-2 text-charcoal">{room.name}</h3>
                            <p className="font-sans font-light text-charcoal/60 mb-6 leading-relaxed">{room.desc}</p>
                            <button 
                                onClick={() => { setActiveGallery({ name: room.name, images: room.gallery }); setIsGalleryOpen(true); }}
                                className="text-gold uppercase tracking-tighter font-bold border-b border-gold pb-1 hover:text-charcoal hover:border-charcoal transition-colors"
                            >
                                Guarda Galleria
                            </button>
                        </div>
                    ))}
                </div>

                <div className="photo-gallery pt-24 mt-24 border-t border-charcoal/5">
                    <div className="text-center mb-16">
                        <span className="font-sans tracking-widest uppercase text-gold text-sm font-bold mb-4 block">Sguardo d'insieme</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-charcoal">Galleria Fotografica</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {galleryImages.map((img, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => { setActiveGallery({ name: 'Jambokella House', images: galleryImages }); setIsGalleryOpen(true); }}
                                className="gallery-item overflow-hidden aspect-square group shadow-md hover:shadow-xl transition-shadow duration-500 cursor-pointer"
                            >
                                <img 
                                    src={img} 
                                    alt={`Gallery photo ${idx + 1}`} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[20%] hover:grayscale-0" 
                                />
                                <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Maximize2 className="text-white" size={24} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
};

const EsperienzePage = ({ onOpenBooking }) => {
    const mainRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".page-content > *", { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: "power2.out" });
            gsap.from(".experience-card", {
                scrollTrigger: {
                    trigger: ".experiences-grid",
                    start: "top 80%",
                },
                y: 60,
                opacity: 0,
                duration: 1.2,
                ease: "power2.out",
                stagger: 0.3
            });
        }, mainRef);
        return () => ctx.revert();
    }, []);

    const experiences = [
        {
            title: "Mangiare come noi",
            category: "Gastronomia",
            desc: "Vi indicheremo le trattorie nascoste dove mangiano i romani. Carbonara vera, zero fila, menù senza foto per turisti.",
            img: getImg("experience-food.jpg")
        },
        {
            title: "Le passeggiate giuste",
            category: "Panorami",
            desc: "A pochi passi dall'abitazione ci si può immergere nel verde di Villa Pamphili o nel cuore dell'antico mercato di Porta Portese.",
            img: getImg("experience-views.jpg")
        },
        {
            title: "Arte senza stress",
            category: "Cultura",
            desc: "Musei e chiese gratuiti che custodiscono capolavori immensi, sconosciuti al turismo di massa.",
            img: getImg("experience-culture.jpg")
        }
    ];

    return (
        <main ref={mainRef} className="pt-32 pb-24 bg-cream min-h-screen">
            <Helmet>
                <title>Esperienze | Jambokella House Rome</title>
                <meta name="description" content="Vivi Roma come un locale. I nostri consigli per scoprire i segreti della Città Eterna." />
            </Helmet>
            <div className="container mx-auto px-6 lg:px-12 page-content max-w-6xl">
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <span className="font-sans tracking-widest uppercase text-gold text-sm font-bold mb-4 block">Vivere Roma</span>
                    <h1 className="text-5xl md:text-6xl font-serif text-charcoal mb-8">Godetevi Roma, senza cadere nelle trappole per turisti.</h1>
                    <p className="font-sans font-light text-charcoal/70 text-lg leading-relaxed">
                        Viviamo questa città e ci fa piacere condividere con voi i nostri posti del cuore. Dalla trattoria sincera ai panorami che non stancano mai. Chiedeteci pure.
                    </p>
                </div>

                <div className="experiences-grid space-y-32 mb-40">
                    {experiences.map((exp, idx) => (
                        <div key={idx} className={`experience-card flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24`}>
                            <div className="w-full lg:w-3/5 overflow-hidden rounded-2xl shadow-2xl aspect-[16/9] relative group">
                                <img src={exp.img} alt={exp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-charcoal/20"></div>
                            </div>
                            <div className="w-full lg:w-2/5 space-y-6">
                                <span className="font-sans tracking-widest uppercase text-gold text-xs font-bold">{exp.category}</span>
                                <h3 className="font-serif text-4xl text-charcoal">{exp.title}</h3>
                                <p className="font-sans font-light text-charcoal/70 text-lg leading-relaxed italic">
                                    "{exp.desc}"
                                </p>
                                <div className="pt-4">
                                    <Link to="/location" className="inline-block border-b border-gold pb-1 text-gold font-sans text-sm tracking-widest uppercase font-bold hover:text-charcoal transition-colors">
                                        Scopri sulla mappa
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* I Nostri Consigli - Museum Tips */}
                <div className="mt-40 pt-24 border-t border-charcoal/10">
                    <div className="flex flex-col lg:flex-row gap-16">
                        <div className="lg:w-1/3">
                            <span className="font-sans tracking-widest uppercase text-gold text-sm font-bold mb-4 block">Consigli Utili</span>
                            <h2 className="text-4xl font-serif text-charcoal mb-6">I musei gratuiti</h2>
                            <p className="font-sans font-light text-charcoal/60 leading-relaxed mb-6">
                                Ogni prima domenica del mese, l'ingresso è gratuito in molti dei principali musei statali, aree archeologiche e monumenti di Roma. Vi consigliamo di arrivare presto perché non si può prenotare online.
                            </p>
                            <div className="p-6 bg-gold/5 border border-gold/20 rounded-2xl">
                                <p className="text-gold text-sm font-bold uppercase tracking-widest mb-2">Da non perdere:</p>
                                <ul className="text-charcoal/70 text-sm space-y-2 font-sans">
                                    <li>• Colosseo, Foro Romano e Palatino</li>
                                    <li>• Galleria Borghese (richiesta info su ingresso)</li>
                                    <li>• Castel Sant'Angelo</li>
                                    <li>• Pantheon</li>
                                    <li>• Terme di Caracalla</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="lg:w-2/3">
                            <span className="font-sans tracking-widest uppercase text-gold text-sm font-bold mb-4 block">Muoversi a Roma</span>
                            <h2 className="text-4xl font-serif text-charcoal mb-8">Tempi di percorrenza</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { place: "Piazza Venezia", time: "~20 min", detail: "Tram 8 diretto" },
                                    { place: "Trastevere", time: "~10 min", detail: "Tram 8 diretto" },
                                    { place: "Campo de' Fiori / Piazza Navona", time: "~25 min", detail: "Tram 8 + 5 min a piedi" },
                                    { place: "Colosseo", time: "~35 min", detail: "Tram 8 + camminata" },
                                    { place: "San Pietro / Vaticano", time: "~30-35 min", detail: "Bus 982/870" },
                                    { place: "Stazione Termini", time: "~35-40 min", detail: "Bus H" },
                                    { place: "Aeroporto Fiumicino", time: "~30 min", detail: "Treno da Stazione Trastevere" },
                                    { place: "Bocca della Verità", time: "~25 min", detail: "Bus 44" }
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 border-b border-charcoal/5 font-sans">
                                        <div>
                                            <p className="font-bold text-charcoal">{item.place}</p>
                                            <p className="text-[10px] text-charcoal/40 uppercase tracking-widest">{item.detail}</p>
                                        </div>
                                        <p className="text-gold font-bold">{item.time}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-40 text-center bg-charcoal rounded-[3rem] p-16 md:p-24 text-cream relative overflow-hidden">
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl md:text-5xl font-serif">Chiedeteci il vostro piano perfetto</h2>
                        <p className="font-sans font-light text-cream/70 text-lg max-w-2xl mx-auto">
                            Viviamo Roma ogni giorno e conosciamo bene i luoghi da non perdere. Scriveteci per qualsiasi suggerimento.
                        </p>
                        <div className="pt-8 text-center flex justify-center">
                             <a href="mailto:jambokellahouseroma@gmail.com" className="inline-block bg-gold text-charcoal px-10 py-4 font-sans text-sm tracking-widest uppercase font-bold hover:bg-cream transition-all duration-300 shadow-xl">
                                Contattaci
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

const LocationPage = ({ onOpenBooking }) => {
    const mainRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".page-content > *", { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: "power2.out" });
        }, mainRef);
        return () => ctx.revert();
    }, []);

    return (
        <main ref={mainRef} className="pt-32 pb-24 bg-cream min-h-screen">
            <Helmet>
                <title>Dove Siamo | Jambokella House Rome</title>
                <meta name="description" content="Siamo nel centro di Roma. Scopri come raggiungerci e vivi la vera atmosfera romana." />
            </Helmet>
            <div className="container mx-auto px-6 lg:px-12 page-content max-w-4xl mx-auto">
                <span className="font-sans tracking-widest uppercase text-gold text-sm font-bold mb-4 block text-center">La Posizione</span>
                <h1 className="text-5xl md:text-6xl font-serif text-charcoal mb-8 text-center text-balance">Al centro della Storia.</h1>
                <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
                    <p className="font-sans font-light text-charcoal/70 text-lg leading-relaxed">
                        Questo luminoso ed elegante appartamento situato nel cuore di Monteverde è stato recentemente ristrutturato e progettato con arredi moderni e nuovissimi per rendere il vostro soggiorno confortevole, dotato di tutti i comfort compreso Wi-Fi.
                    </p>
                    <p className="font-sans font-light text-charcoal/70 text-lg leading-relaxed">
                        Ideale per coppie e famiglie, l'appartamento può accogliere comodamente cinque persone con la possibilità di richiedere un letto aggiuntivo e/o culla.
                    </p>
                </div>
                <div className="overflow-hidden h-[400px] mb-12 shadow-2xl relative group">
                    <img src={getImg("location.jpg")} alt="Mappa Roma" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 object-center" />
                    <div className="absolute inset-0 bg-charcoal/20 flex items-center justify-center">
                         <a href="https://maps.app.goo.gl/Vd8wodjyoFZS9FF28" target="_blank" rel="noreferrer" className="px-8 py-3 bg-white/90 text-charcoal uppercase tracking-widest text-sm font-bold hover:bg-gold hover:text-white transition-colors">Apri su Google Maps</a>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-12 font-sans font-light text-charcoal/80">
                    <div>
                        <h3 className="font-serif text-2xl mb-4 text-charcoal">Indirizzo</h3>
                        <p className="leading-relaxed">Via N. Corsi, 4<br/>00152 Roma (RM)<br/>Italia</p>
                    </div>
                    <div>
                        <h3 className="font-serif text-2xl mb-4 text-charcoal">Come Raggiungerci</h3>
                        <p className="leading-relaxed mb-4"><strong>In Treno:</strong> Dalla Stazione Trastevere il nostro B&B a Monteverde è facilmente raggiungibile con il tram 8 o il bus H. Da Termini con il bus H in 30 minuti</p>
                        <p className="leading-relaxed mb-4"><strong>In Aereo:</strong> Dall'aeroporto di Fiumicino, il treno diretto ferma alla Stazione Trastevere (porta di Monteverde) in soli 26 minuti.</p>
                        <p className="leading-relaxed"><strong>Con il nostro servizio:</strong> Su richiesta, offriamo un servizio di transfer in macchina dal vostro punto di arrivo a Roma direttamente fino all'appartamento.</p>
                    </div>
                </div>
            </div>
        </main>
    );
};

// --- App ---

const App = () => {
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1.2,
            touchMultiplier: 1.5,
            lerp: 0.08,
        });

        lenisInstance = lenis;

        // Connect Lenis to ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        const updateLenis = (time) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(updateLenis);
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(updateLenis);
            lenisInstance = null;
        };
    }, []);

    return (
        <HelmetProvider>
            <Router>
                <ScrollToTop />
                <div className="min-h-screen flex flex-col">
                    <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
                    <Navbar onOpenBooking={() => setIsBookingOpen(true)} />
                    <div className="flex-grow">
                        <Routes>
                            <Route path="/" element={<Home onOpenBooking={() => setIsBookingOpen(true)} />} />
                            <Route path="/camere" element={<CamerePage onOpenBooking={() => setIsBookingOpen(true)} />} />
                            <Route path="/location" element={<LocationPage onOpenBooking={() => setIsBookingOpen(true)} />} />
                            <Route path="/esperienze" element={<EsperienzePage onOpenBooking={() => setIsBookingOpen(true)} />} />
                        </Routes>
                    </div>
                    <Footer onOpenBooking={() => setIsBookingOpen(true)} />
                </div>
            </Router>
        </HelmetProvider>
    );
};

export default App;
