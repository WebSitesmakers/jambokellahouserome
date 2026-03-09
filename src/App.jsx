import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, MapPin, Instagram, Mail, Phone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Base path helper for Vite public assets
const base = import.meta.env.BASE_URL;
const getImg = (name) => `${base}${name}`.replace('//', '/');

// --- Utils ---

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

// --- Global UI Components ---

const Navbar = () => {
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
        { name: 'ESPERIENZE', path: '#' }
    ];

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-cream/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'}`}>
                <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
                    <Link to="/" className="z-50 font-serif text-3xl font-bold tracking-widest uppercase text-charcoal">
                        Jambo Kella
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-12 font-sans text-sm tracking-widest uppercase font-medium">
                        {links.map((link) => (
                            <Link key={link.name} to={link.path} className="text-charcoal/80 hover:text-gold transition-colors relative group">
                                {link.name}
                                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}
                        <Link to="/prenota" className="px-6 py-2 border border-gold text-gold hover:bg-gold hover:text-white transition-all duration-300 ml-4">
                            Prenota
                        </Link>
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
                    <Link to="/prenota" onClick={() => setIsOpen(false)} className="mt-8 px-8 py-3 bg-gold text-white text-lg tracking-widest uppercase font-sans hover:bg-charcoal transition-colors">
                        Prenota Ora
                    </Link>
                </div>
            </div>
        </>
    );
};

const Footer = () => {
    return (
        <footer className="bg-charcoal text-cream pt-24 pb-12 mt-24">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid md:grid-cols-3 gap-16 mb-20 text-center md:text-left">
                    
                    {/* Brand */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="font-serif text-3xl mb-6 tracking-widest uppercase text-gold">Jambo Kella</h3>
                        <p className="text-cream/60 font-sans font-light max-w-sm leading-relaxed mb-6">
                            L'eleganza dell'ospitalità romana.<br/>
                            Un rifugio esclusivo nel cuore della Città Eterna, dove storia e comfort contemporaneo si fondono.
                        </p>
                    </div>

                    {/* Contatti */}
                    <div className="flex flex-col items-center md:items-start font-sans font-light text-cream/80">
                        <h4 className="font-serif text-xl mb-6 uppercase tracking-widest text-gold text-sm">Contatti</h4>
                        <div className="space-y-4">
                            <a href="https://maps.google.com/?q=Via+N.Corsi,+4,+Roma" target="_blank" rel="noreferrer" className="flex items-start gap-3 hover:text-gold transition-colors group">
                                <MapPin className="w-5 h-5 text-gold shrink-0 mt-1" />
                                <span>Via N. Corsi, 4<br/>00152 Roma RM, Italia</span>
                            </a>
                            <a href="tel:+393342044493" className="flex items-center gap-3 hover:text-gold transition-colors">
                                <Phone className="w-5 h-5 text-gold" />
                                <span>(+39) 334 2044493</span>
                            </a>
                            <a href="tel:+393349909559" className="flex items-center gap-3 hover:text-gold transition-colors">
                                <Phone className="w-5 h-5 text-gold" />
                                <span>(+39) 334 9909559</span>
                            </a>
                            <a href="mailto:jambokellahouseroma@gmail.com" className="flex items-center gap-3 hover:text-gold transition-colors">
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
                        <Link to="/prenota" className="px-8 py-3 bg-gold text-charcoal tracking-widest uppercase font-sans text-xs font-bold hover:bg-cream hover:text-charcoal transition-colors">
                            Prenota il tuo soggiorno
                        </Link>
                    </div>
                </div>

                <div className="pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center text-xs font-sans text-cream/40 px-4">
                    <p>© {new Date().getFullYear()} Jambo Kella House Rome. Tutti i diritti riservati.</p>
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

const Home = () => {
    const mainRef = useRef(null);

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
            gsap.to(".hero-image", {
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
            gsap.from(".reveal-up", {
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
        }, mainRef);
        return () => ctx.revert();
    }, []);

    return (
        <main ref={mainRef}>
            <Helmet>
                <title>Jambo Kella House Rome | La tua dimora a Roma</title>
                <meta name="description" content="Jambo Kella House: l'eleganza dell'ospitalità romana. Un B&B esclusivo nel cuore di Roma." />
            </Helmet>

            {/* HERO SECTION */}
            <section className="hero-section relative h-[100dvh] w-full overflow-hidden flex items-center justify-center rounded-b-[3rem] shadow-2xl z-10 mx-auto bg-charcoal">
                <div className="absolute inset-0 bg-charcoal/40 z-10"></div>
                <img 
                    src={getImg("hero.jpg")} 
                    alt="Jambo Kella House Rome" 
                    className="hero-image absolute inset-0 w-full h-full object-cover z-0 opacity-80"
                />
                
                <div className="relative z-20 text-center text-cream px-6 max-w-4xl mx-auto flex flex-col items-center">
                    <span className="hero-subtitle font-sans tracking-widest uppercase text-gold text-sm md:text-base font-bold mb-8 block drop-shadow-md">
                        Bed & Breakfast Roma
                    </span>
                    <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-8 drop-shadow-2xl leading-tight">
                        <span className="block">Jambo Kella</span>
                        <span className="block italic font-light text-4xl md:text-6xl text-gold mt-2">La tua dimora a Roma.</span>
                    </h1>
                    
                    <Link to="/prenota" className="hero-subtitle mt-8 px-10 py-4 bg-gold text-charcoal font-sans text-sm tracking-widest uppercase font-bold hover:bg-cream hover:scale-105 transition-all duration-300 shadow-xl">
                        Prenota il tuo soggiorno
                    </Link>
                </div>
            </section>

            {/* PHILOSOPHY SECTION */}
            <section className="philosophy-section py-32 md:py-48 px-6 bg-cream text-charcoal relative z-20">
                <div className="container mx-auto max-w-5xl text-center">
                    <span className="reveal-up font-sans tracking-widest uppercase text-gold text-sm font-bold mb-6 block">L'Arte dell'Ospitalità</span>
                    <h2 className="reveal-up text-4xl md:text-5xl lg:text-6xl font-serif leading-tight mb-12 text-balance">
                        La maggior parte degli alloggi offre un posto dove dormire.<br/>
                        <span className="italic text-gold mt-4 block">Noi offriamo una storia da vivere.</span>
                    </h2>
                    
                    <p className="reveal-up text-lg md:text-xl font-sans font-light text-charcoal/70 max-w-3xl mx-auto leading-relaxed mb-16">
                        Situata nel cuore pulsante di Roma, Jambo Kella House è il perfetto equilibrio tra eleganza e calore domestico. 
                        Camere dal design classico-contemporaneo, cura nei dettagli e un'ospitalità autentica ti faranno sentire cittadino romano dal primo istante.
                    </p>

                    <div className="grid md:grid-cols-3 gap-12 mt-24">
                        <div className="reveal-up flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full border border-gold flex items-center justify-center mb-6 text-gold">
                                <span className="font-serif text-2xl italic">I</span>
                            </div>
                            <h3 className="font-serif text-2xl mb-4">Comfort Assoluto</h3>
                            <p className="font-sans font-light text-charcoal/60 text-sm leading-relaxed">
                                Suite curate nei minimi dettagli, con materiali nobili e lenzuola pregiate per un riposo perfetto.
                            </p>
                        </div>
                        <div className="reveal-up flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full border border-gold flex items-center justify-center mb-6 text-gold">
                                <span className="font-serif text-2xl italic">II</span>
                            </div>
                            <h3 className="font-serif text-2xl mb-4">Posizione Perfetta</h3>
                            <p className="font-sans font-light text-charcoal/60 text-sm leading-relaxed">
                                A pochi passi dalla storia. Esplora le meraviglie di Roma partendo dal cuore della città.
                            </p>
                        </div>
                        <div className="reveal-up flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full border border-gold flex items-center justify-center mb-6 text-gold">
                                <span className="font-serif text-2xl italic">III</span>
                            </div>
                            <h3 className="font-serif text-2xl mb-4">Design Classico</h3>
                            <p className="font-sans font-light text-charcoal/60 text-sm leading-relaxed">
                                Un incontro tra architettura storica e linee moderne, per un soggiorno indimenticabile.
                            </p>
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
                                Uno spazio esclusivo per la tua <span className="italic text-gold">tranquillità.</span>
                            </h2>
                        </div>
                        <Link to="/camere" className="reveal-up hidden md:inline-block border-b border-charcoal pb-1 uppercase font-sans tracking-widest text-sm hover:text-gold hover:border-gold transition-colors">
                            Scopri l'intero appartamento
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                        {/* Room 1 */}
                        <div className="reveal-up group cursor-pointer mt-0 lg:mt-16">
                            <div className="overflow-hidden aspect-[4/5] object-cover relative mb-6">
                                <img 
                                    src={getImg("room1.jpg")} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                                    alt="Camera Padronale" 
                                />
                            </div>
                            <h3 className="font-serif text-2xl mb-2 text-charcoal group-hover:text-gold transition-colors">Camera Padronale</h3>
                            <p className="font-sans font-light text-charcoal/60 text-sm">Vista incantevole e massimo comfort.</p>
                        </div>

                        {/* Room 2 */}
                        <div className="reveal-up group cursor-pointer mt-0 lg:mt-8">
                            <div className="overflow-hidden aspect-[4/5] object-cover relative mb-6">
                                <img 
                                    src={getImg("room2.jpg")} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                                    alt="Camera Matrimoniale" 
                                />
                            </div>
                            <h3 className="font-serif text-2xl mb-2 text-charcoal group-hover:text-gold transition-colors">Seconda Camera</h3>
                            <p className="font-sans font-light text-charcoal/60 text-sm">Ampi spazi e luce naturale.</p>
                        </div>

                        {/* Room 3 */}
                        <div className="reveal-up group cursor-pointer mb-0">
                            <div className="overflow-hidden aspect-[4/5] object-cover relative mb-6">
                                <img 
                                    src={getImg("room3.jpg")} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                                    alt="Terza Camera" 
                                />
                            </div>
                            <h3 className="font-serif text-2xl mb-2 text-charcoal group-hover:text-gold transition-colors">Terza Camera</h3>
                            <p className="font-sans font-light text-charcoal/60 text-sm">Confort essenziale e relax.</p>
                        </div>
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
                        <span className="reveal-up font-sans tracking-widest uppercase text-gold text-sm font-bold mb-4 block">Il Quartiere</span>
                        <h2 className="reveal-up text-4xl md:text-5xl lg:text-6xl font-serif leading-tight mb-8">
                            Il cuore di <span className="italic text-gold">Roma</span> fuori dalla porta.
                        </h2>
                        <p className="reveal-up font-sans font-light text-cream/70 text-lg leading-relaxed mb-10 max-w-lg">
                            Non sei solo un ospite, sei parte della vita romana. A pochi passi dal Colosseo, tra vicoli storici e scorci che tolgono il fiato.
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

const CamerePage = () => {
    const mainRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".page-title", { y: 50, opacity: 0, duration: 1, ease: "power2.out" });
            gsap.from(".room-card", {
                y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power2.out",
                scrollTrigger: { trigger: ".rooms-grid", start: "top 80%" }
            });
        }, mainRef);
        return () => ctx.revert();
    }, []);

    const rooms = [
        { name: 'Camera Padronale', desc: 'Ampia e luminosa, arredata con gusto ed eleganza classica.', img: getImg('room1.jpg') },
        { name: 'Seconda Camera', desc: 'Accogliente e spaziosa, perfetta per chi cerca riservatezza e relax.', img: getImg('room2.jpg') },
        { name: 'Terza Camera', desc: 'Atmosfera intima, comfort essenziale e curata nei dettagli.', img: getImg('room3.jpg') }
    ];

    return (
        <main ref={mainRef} className="pt-32 pb-24 bg-cream min-h-screen">
            <Helmet>
                <title>L'Appartamento | Jambo Kella House Rome</title>
                <meta name="description" content="Scopri l'intero appartamento. Tre comode camere matrimoniali dotate di ogni comfort." />
            </Helmet>
            <div className="container mx-auto px-6 lg:px-12">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="page-title text-5xl md:text-6xl font-serif text-charcoal mb-6">L'Appartamento</h1>
                    <p className="page-title font-sans font-light text-charcoal/70 text-lg leading-relaxed">
                        Jambo Kella House è un appartamento spazioso e finemente arredato, messo interamente a tua disposizione. 
                        Comprende tre ampie camere matrimoniali ideali per famiglie o piccoli gruppi che desiderano vivere la capitale come dei veri romani.
                    </p>
                </div>
                <div className="rooms-grid grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {rooms.map((room, idx) => (
                        <div key={idx} className="room-card group">
                            <div className="overflow-hidden aspect-[4/5] mb-6 relative">
                                <img src={room.img} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 pointer-events-none" />
                            </div>
                            <h3 className="font-serif text-3xl mb-2 text-charcoal">{room.name}</h3>
                            <p className="font-sans font-light text-charcoal/60">{room.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

const LocationPage = () => {
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
                <title>Dove Siamo | Jambo Kella House Rome</title>
                <meta name="description" content="Siamo nel centro di Roma. Scopri come raggiungerci e vivi la vera atmosfera romana." />
            </Helmet>
            <div className="container mx-auto px-6 lg:px-12 page-content max-w-4xl mx-auto">
                <span className="font-sans tracking-widest uppercase text-gold text-sm font-bold mb-4 block text-center">La Posizione</span>
                <h1 className="text-5xl md:text-6xl font-serif text-charcoal mb-12 text-center text-balance">Al centro della Storia.</h1>
                <div className="overflow-hidden h-[400px] mb-12 shadow-2xl relative group">
                    <img src={getImg("location.jpg")} alt="Mappa Roma" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 object-center" />
                    <div className="absolute inset-0 bg-charcoal/20 flex items-center justify-center">
                         <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="px-8 py-3 bg-white/90 text-charcoal uppercase tracking-widest text-sm font-bold hover:bg-gold hover:text-white transition-colors">Apri su Google Maps</a>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-12 font-sans font-light text-charcoal/80">
                    <div>
                        <h3 className="font-serif text-2xl mb-4 text-charcoal">Indirizzo</h3>
                        <p className="leading-relaxed">Via N. Corsi, 4<br/>00152 Roma (RM)<br/>Italia</p>
                    </div>
                    <div>
                        <h3 className="font-serif text-2xl mb-4 text-charcoal">Come Raggiungerci</h3>
                        <p className="leading-relaxed mb-4"><strong>In Treno:</strong> Dalla Stazione Trastevere è facilmente raggiungibile con i tram 8 o 3 o il bus H.</p>
                        <p className="leading-relaxed"><strong>In Aereo:</strong> Dall'aeroporto di Fiumicino, il treno diretto ferma a Trastevere in soli 26 minuti.</p>
                    </div>
                </div>
            </div>
        </main>
    );
};

// --- App ---

const App = () => {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Connect Lenis to ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(gsap.ticker.add);
        };
    }, []);

    return (
        <HelmetProvider>
            <Router>
                <ScrollToTop />
                <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <div className="flex-grow">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/camere" element={<CamerePage />} />
                            <Route path="/location" element={<LocationPage />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </Router>
        </HelmetProvider>
    );
};

export default App;
