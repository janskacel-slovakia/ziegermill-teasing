'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// OPTIMIZATION 1: Import Next.js Image component for automatic WebP compression & lazy loading
import Image from 'next/image';

// 1. IMPORT GOOGLE FONTS
import { Lato, Playfair_Display } from 'next/font/google';

// OPTIMIZATION 2: Reduced font weights to match layout.tsx and share cache
const lato = Lato({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'], 
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600'], 
  display: 'swap',
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const galleryImages = [
  '/gallery-1.jpg',
  '/gallery-2.jpg',
  '/gallery-3.jpg',
  '/gallery-4.jpg',
  '/gallery-5.jpg',
  '/gallery-6.jpg',
  '/gallery-7.jpg',
  '/gallery-8.jpg',
  '/gallery-9.jpg',
  '/gallery-10.jpg',
];

// --- THE TRANSLATION DICTIONARY ---
const translations = {
  SK: {
    est: "od roku 1905",
    heroDesc: "Loftové byty a ateliéry v budove bývalého mlyna a taviarne v novom centre Petržalky. Ikonická architektúra Heinricha Ziegera zo začiatku 20. storočia ožíva v modernom duchu.",
    btnInterest: "Mám záujem",
    feat1T1: "O projekte",
    feat1P1: "Zieger Mill vzniká v historickom objekte bývalého mlyna a taviarne v industriálnom areáli Matador v Petržalke. Pôvodnú architektúru Heinricha Ziegera dopĺňa citlivá nadstavba a prístavba loftových bytov a ateliérov, ktoré zachovávajú autentický industriálny charakter miesta.",
    feat1P2: "Lokalita sa nachádza len kúsok od centra mesta a prechádza postupnou revitalizáciou s výrazným potenciálom do budúcnosti. V blízkosti sa nachádza železničná stanica s priamym spojením do Viedne.",
    feat2T1: "Unikátne priestory",
    feat2P1: "Projekt ponúkne limitovanú kolekciu 35 ateliérov a 3 bytov s vysokými stropmi, kvalitnými materiálmi a výrazným architektonickým riešením. Priznaný železobetón, nadštandardné svetlé výšky a obrovské pásové okná.",
    galT1: "Galéria",
    histT1: "História",
    histP1: "Projekt nadväzuje na priemyselnú históriu už z roku 1899, kedy bola založená továreň Petra Westena na smaltované nádoby. Pôvodné stavby však boli asanované a časť z nich poškodil požiar. Nové budovy v prvom desaťročí 20. storočia navrhol nemecký architekt Heinrich Zieger (1873 – 1943) a zrealizoval ich v spolupráci s firmou Wayss & Freytag. Ich súčasťou bola budova taviarne, mlynu a skladu.",
    mapT1: "Lokalita",
    mapT2: "Projektu",
    mapDesc: "Zieger Mill sa nachádza v strategickej lokalite s výbornou dostupnosťou do centra a kompletnou občianskou vybavenosťou na dosah.",
    formTitle: "Získať prednostný prístup",
    formDesc: "Zanechajte nám na seba kontakt a buďte medzi prvými, ktorí uvidia cenník a pôdorysy.",
    formThanks: "Ďakujeme za záujem",
    formThanksDesc: "Naše obchodné oddelenie vás bude čoskoro kontaktovať.",
    formNew: "Odoslať nový záujem",
    formName: "Meno a priezvisko *",
    formEmail: "E-mailová adresa *",
    formPhone: "Telefónne číslo",
    formError: "Nastala chyba. Skúste to prosím znova.",
    formSending: "Odosielam...",
    formSubmit: "Odoslať záujem",
    footer: "© 2026 Zieger Mill",
    privacy: "Ochrana osobných údajov",
    navHome: "Úvod",
    navProject: "O projekte",
    navGallery: "Galéria",
    navHistory: "História",
    navLocation: "Lokalita",
    navContact: "Kontakt"
  },
  EN: {
    est: "From 1905",
    heroDesc: "The Petržalka mill and smelter. Living with the soul of history. The iconic turn-of-the-century architecture of Heinrich Zieger comes alive in modern standards.",
    btnInterest: "I'm Interested",
    feat1T1: "Preserving",
    feat1T2: "Heritage",
    feat1P1: "The project sensitively builds on the industrial history from 1899. We are preserving the characteristic ochre-yellow facing brick from the original Durvay brickyard and respecting the unique structural solutions that defined this district.",
    feat1P2: "The unrepeatable atmosphere is completed by refurbished steel elements and typical sawtooth roofs, which let in perfect northern light – exactly as designed by the German architect Heinrich Zieger.",
    feat2T1: "Unique",
    feat2T2: "Space",
    feat2P1: "The historic double hall, once a technological marvel of Wayss & Freytag with its elevated arched structure, is transforming into generous loft spaces. Exposed reinforced concrete, above-standard ceiling heights, and massive ribbon windows.",
    feat2P2: "Living on Kopčianska and Údernícka streets today represents a perfect synergy between the rugged beauty of Petržalka's industrial past and the demands for modern, timeless comfort.",
    galT1: "Project",
    galT2: "Gallery",
    galDesc: "The unmistakable character of the enamel factory with typical sawtooth roofs and brick facades in every detail.",
    histT1: "Soul of",
    histT2: "History",
    histP1: "Peter Westen's enamelware factory was officially established in 1899. In the first decade of the 20th century, German architect Heinrich Zieger, in collaboration with Wayss & Freytag, rebuilt it into an architectural masterpiece.",
    histP2: "Today, over a century later, we are bringing this industrial gem back to life. The original bricks and concrete structures are becoming the foundation for modern community living that respects the legacy of the past.",
    mapT1: "Project",
    mapT2: "Location",
    mapDesc: "Zieger Mill is strategically located with excellent access to the city center and complete civic amenities within reach.",
    formTitle: "Get Priority Access",
    formDesc: "Leave us your contact details and be among the first to see the pricing and floor plans.",
    formThanks: "Thank you for your interest",
    formThanksDesc: "Our sales department will contact you shortly.",
    formNew: "Submit new interest",
    formName: "Full Name *",
    formEmail: "Email Address *",
    formPhone: "Phone Number",
    formError: "An error occurred. Please try again.",
    formSending: "Sending...",
    formSubmit: "Submit Interest",
    footer: "© 2026 Zieger Mill",
    privacy: "Privacy Policy",
    navHome: "Home",
    navProject: "Project",
    navGallery: "Gallery",
    navHistory: "History",
    navLocation: "Location",
    navContact: "Contact"
  },
  DE: {
    est: "Gegründet 1905",
    heroDesc: "Die Mühle und Schmelzerei Petržalka. Wohnen mit der Seele der Geschichte. Die ikonische Jahrhundertwende-Architektur von Heinrich Zieger erwacht in modernem Standard zu neuem Leben.",
    btnInterest: "Ich habe Interesse",
    feat1T1: "Erhaltung",
    feat1T2: "Des Erbes",
    feat1P1: "Das Projekt knüpft sensibel an die Industriegeschichte von 1899 an. Wir erhalten die charakteristischen ockergelben Verblendziegel der ursprünglichen Durvay-Ziegelei und respektieren die einzigartigen Konstruktionslösungen, die dieses Viertel geprägt haben.",
    feat1P2: "Die unwiederbringliche Atmosphäre wird durch aufgearbeitete Stahlelemente und typische Sheddächer vervollständigt, die perfektes Nordlicht hereinlassen – genau so, wie es der deutsche Architekt Heinrich Zieger entworfen hat.",
    feat2T1: "Einzigartiger",
    feat2T2: "Raum",
    feat2P1: "Die historische Doppelhalle, einst ein technologisches Wunderwerk von Wayss & Freytag mit ihrer überhöhten Bogenkonstruktion, verwandelt sich in großzügige Loftflächen. Sichtbarer Stahlbeton, überdurchschnittliche Raumhöhen und riesige Fensterbänder.",
    feat2P2: "Das Wohnen an der Kopčianska- und Údernícka-Straße stellt heute eine perfekte Synergie zwischen der rauen Schönheit der Petržalker Industrievergangenheit und den Ansprüchen an modernen, zeitlosen Komfort dar.",
    galT1: "Projekt",
    galT2: "Galerie",
    galDesc: "Der unverwechselbare Charakter der Emaillefabrik mit typischen Sheddächern und Ziegelfassaden in jedem Detail.",
    histT1: "Seele der",
    histT2: "Geschichte",
    histP1: "Die Emaillewarenfabrik von Peter Westen wurde 1899 offiziell gegründet. Im ersten Jahrzehnt des 20. Jahrhunderts baute der deutsche Architekt Heinrich Zieger sie in Zusammenarbeit mit Wayss & Freytag zu einem architektonischen Meisterwerk um.",
    histP2: "Heute, über ein Jahrhundert später, erwecken wir dieses Industriejuwel zu neuem Leben. Die originalen Ziegel- und Betonstrukturen bilden das Fundament für ein modernes Gemeinschaftswohnen, das das Erbe der Vergangenheit respektiert.",
    mapT1: "Projekt",
    mapT2: "Standort",
    mapDesc: "Die Zieger Mill befindet sich in einer strategischen Lage mit hervorragender Anbindung an das Stadtzentrum und allen wichtigen Einrichtungen in greifbarer Nähe.",
    formTitle: "Bevorzugten Zugang erhalten",
    formDesc: "Hinterlassen Sie uns Ihre Kontaktdaten und gehören Sie zu den Ersten, die die Preise und Grundrisse sehen.",
    formThanks: "Danke für Ihr Interesse",
    formThanksDesc: "Unsere Verkaufsabteilung wird sich in Kürze bei Ihnen melden.",
    formNew: "Neues Interesse einreichen",
    formName: "Vor- und Nachname *",
    formEmail: "E-Mail-Adresse *",
    formPhone: "Telefonnummer",
    formError: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    formSending: "Senden...",
    formSubmit: "Interesse Senden",
    footer: "© 2026 Zieger Mill",
    privacy: "Datenschutzerklärung",
    navHome: "Startseite",
    navProject: "Projekt",
    navGallery: "Galerie",
    navHistory: "Geschichte",
    navLocation: "Standort",
    navContact: "Kontakt"
  }
};

const FadeInSection = ({ children, delayMs = 0 }: { children: React.ReactNode, delayMs?: number }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (domRef.current) observer.unobserve(domRef.current);
        }
      });
    }, { threshold: 0.15 });

    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {children}
    </div>
  );
};

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Touch state for gallery swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50; 

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); 
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) showNextImage();
    if (isRightSwipe) showPrevImage();
  };

  // State for Menu Scroll Behavior
  const [showNav, setShowNav] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [language, setLanguage] = useState<'SK' | 'EN' | 'DE'>('SK'); 

  // Map refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isMapContainerVisible, setIsMapContainerVisible] = useState(false);

  const t = translations[language] as any;

  useEffect(() => {
    const detectUserLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const country = data.country_code;

        if (['SK', 'CZ'].includes(country)) {
          setLanguage('SK');
        } else if (['DE', 'AT', 'CH'].includes(country)) {
          setLanguage('DE');
        } else {
          setLanguage('EN'); 
        }
      } catch (error) {
        console.error("Location detection failed, defaulting to English.", error);
        setLanguage('EN'); 
      }
    };

    detectUserLocation();
  }, []);

  // OPTIMIZATION 3: Request Animation Frame for Scroll to stop lag on old machines
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setShowNav(false);
            setIsMenuOpen(false); 
          } else {
            setShowNav(true);
          }
          
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 8000); 
    return () => clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      
      if (e.key === 'ArrowRight') {
        showNextImage();
      } else if (e.key === 'ArrowLeft') {
        showPrevImage();
      } else if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex]);

  // OPTIMIZATION 4: LAZY LOAD MAPBOX
  // We first observe if the user scrolls near the map container
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsMapContainerVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '400px' }); // Load when they are 400px away from the map

    if (mapContainerRef.current) observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, []);

  // Only run Mapbox once `isMapContainerVisible` is true
  useEffect(() => {
    if (!isMapContainerVisible || !mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoiamFuc2thY2VsIiwiYSI6ImNtbXVlaTV5djF4cDkzMXNkZHlvZmJiaGQifQ.lHBxLmr5NR_QFhXjEXPkbQ';

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/janskacel/cmmutgfuo00ac01s9cznqfnaa', 
      center: [17.0950, 48.1250],
      zoom: 15.5, 
      pitch: 75, 
      bearing: 15, 
      scrollZoom: false,
      cooperativeGestures: true,
      attributionControl: false
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

    map.on('load', () => {
      if (!document.getElementById('mapbox-custom-styles')) {
        const style = document.createElement('style');
        style.id = 'mapbox-custom-styles';
        style.innerHTML = `
          @keyframes mapbox-pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 166, 43, 0.6); }
            70% { box-shadow: 0 0 0 20px rgba(255, 166, 43, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 166, 43, 0); }
          }
          .zieger-pulse {
            animation: mapbox-pulse 2s infinite;
          }
        `;
        document.head.appendChild(style);
      }

      const projectWrapper = document.createElement('div');
      projectWrapper.style.display = 'flex';
      projectWrapper.style.flexDirection = 'column';
      projectWrapper.style.alignItems = 'center';
      projectWrapper.style.cursor = 'pointer';
      projectWrapper.style.zIndex = '50';

      const projectPin = document.createElement('div');
      projectPin.className = 'zieger-pulse';
      projectPin.style.backgroundColor = '#ffa62b'; 
      projectPin.style.width = '52px';
      projectPin.style.height = '52px';
      projectPin.style.borderRadius = '50%';
      projectPin.style.display = 'flex';
      projectPin.style.alignItems = 'center';
      projectPin.style.justifyContent = 'center';
      projectPin.style.border = '3px solid #ffffff';
      
      projectPin.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 21h18"></path>
          <path d="M5 21V8l7-5 7 5v13"></path>
          <path d="M9 21v-5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5"></path>
        </svg>
      `;

      const projectLabel = document.createElement('div');
      projectLabel.innerHTML = 'ZIEGER MILL';
      projectLabel.style.backgroundColor = '#1c1917'; 
      projectLabel.style.color = '#ffffff';
      projectLabel.style.padding = '4px 12px';
      projectLabel.style.borderRadius = '6px';
      projectLabel.style.fontSize = '12px';
      projectLabel.style.fontWeight = '800';
      projectLabel.style.letterSpacing = '1px';
      projectLabel.style.marginTop = '-10px'; 
      projectLabel.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
      projectLabel.style.border = '1px solid #44403c';
      projectLabel.style.whiteSpace = 'nowrap';
      projectLabel.style.fontFamily = 'var(--font-lato), sans-serif';

      projectWrapper.appendChild(projectPin);
      projectWrapper.appendChild(projectLabel);

      new mapboxgl.Marker({ 
        element: projectWrapper, 
        anchor: 'bottom' 
      })
      .setLngLat([17.0935, 48.1201])
      .addTo(map);

      const landmarks = [
        { name: "Bratislavský hrad", coords: [17.1001, 48.1422], walkTime: "40 min", icon: "/icon-castle.png" },
        { name: "Sad Janka Kráľa & Aupark", coords: [17.1085, 48.1360], walkTime: "25 min", icon: "/icon-park.png" },
        { name: "Vienna Gate, Tesco, Lekáreň", coords: [17.0977, 48.1214], walkTime: "5 min",  icon: "/icon-shop-bus.png" },
        { name: "ŽST Bratislava-Petržalka", coords: [17.0989, 48.1217], walkTime: "6 min",  icon: "/icon-train.png" },
        { name: "Kúpalisko Matadorka", coords: [17.0933, 48.1228], walkTime: "4 min",  icon: "/icon-swim.png" },
      ];

      landmarks.forEach(poi => {
        const markerContainer = document.createElement('div');
        markerContainer.style.display = 'flex';
        markerContainer.style.flexDirection = 'column';
        markerContainer.style.alignItems = 'center';
        markerContainer.style.cursor = 'pointer';
        markerContainer.style.zIndex = '10';

        const tooltip = document.createElement('div');
        tooltip.innerHTML = poi.name;
        tooltip.style.position = 'absolute';
        tooltip.style.bottom = '100%'; 
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.marginBottom = '8px'; 
        tooltip.style.backgroundColor = '#1c1917'; 
        tooltip.style.color = '#ffffff';
        tooltip.style.padding = '6px 12px';
        tooltip.style.borderRadius = '6px';
        tooltip.style.fontSize = '12px';
        tooltip.style.fontWeight = '700';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.opacity = '0'; 
        tooltip.style.transition = 'opacity 0.2s ease-in-out'; 
        tooltip.style.pointerEvents = 'none'; 
        tooltip.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
        tooltip.style.zIndex = '20';
        tooltip.style.fontFamily = 'var(--font-lato), sans-serif';

        const iconDiv = document.createElement('div');
        iconDiv.style.width = '50px';
        iconDiv.style.height = '50px';
        iconDiv.style.backgroundImage = `url(${poi.icon})`;
        iconDiv.style.backgroundSize = 'contain';
        iconDiv.style.backgroundRepeat = 'no-repeat';
        iconDiv.style.backgroundPosition = 'center';
        iconDiv.style.borderRadius = '50%';
        iconDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)'; 

        const timeLabel = document.createElement('div');
        timeLabel.innerHTML = `
          <div style="color: #544740; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#544740" stroke="#544740" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/>
              <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/>
            </svg>
            ${poi.walkTime}
          </div>
        `;
        timeLabel.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        timeLabel.style.padding = '2px 8px';
        timeLabel.style.borderRadius = '12px';
        timeLabel.style.marginTop = '-10px'; 
        timeLabel.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
        timeLabel.style.border = '1px solid #e7e5e4';
        timeLabel.style.fontFamily = 'var(--font-lato), sans-serif';

        markerContainer.addEventListener('mouseenter', () => {
          tooltip.style.opacity = '1';
          markerContainer.style.zIndex = '30';
        });
        markerContainer.addEventListener('mouseleave', () => {
          tooltip.style.opacity = '0';
          markerContainer.style.zIndex = '10';
        });

        markerContainer.appendChild(tooltip); 
        markerContainer.appendChild(iconDiv);
        markerContainer.appendChild(timeLabel);

        new mapboxgl.Marker({ 
          element: markerContainer, 
          anchor: 'bottom' 
        })
        .setLngLat(poi.coords)
        .addTo(map);
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [isMapContainerVisible]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase.from('leads').insert([{ name, email, phone }]);
    if (error) {
      console.error(error);
      setStatus('error');
    } else {
      setStatus('success');
      setName(''); setEmail(''); setPhone('');
    }
  };

  const scrollToForm = () => {
    document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth' });
  };

  const showNextImage = () => {
    setSelectedImageIndex((prev) => prev !== null ? (prev + 1) % galleryImages.length : null);
  };

  const showPrevImage = () => {
    setSelectedImageIndex((prev) => prev !== null ? (prev === 0 ? galleryImages.length - 1 : prev - 1) : null);
  };

  return (
    <main className={`bg-stone-100 text-stone-800 selection:bg-amber-700 selection:text-white ${lato.className}`}>
      
      {/* CSS for Menu Staggered Animation */}
      <style jsx global>{`
        @keyframes menu-fade-in-down {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-menu-item {
          opacity: 0;
          animation: menu-fade-in-down 0.4s ease-out forwards;
        }
      `}</style>

      <div className="w-full h-1 bg-[#544740] fixed top-0 left-0 z-50"></div>

      {/* STICKY TOP MENU BAR */}
      <nav
        className={`fixed top-1 left-0 w-full h-30 z-40 bg-[#ffa62b]/40 backdrop-blur-sm shadow-md transition-transform duration-500 ease-in-out flex items-center px-6 md:px-12 ${
          showNav ? 'translate-y-0' : '-translate-y-[110%]'
        }`}
      >
        <div className="flex-1 relative">
          <div className="hidden md:block">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 text-[#544740] hover:text-white transition-colors focus:outline-none"
              aria-label="Menu"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute top-14 left-0 w-48 bg-[#544740]/70 rounded-lg shadow-xl border border-[#ffa62b]/30 py-2 overflow-hidden flex flex-col z-50">
                {[
                  { id: 'uvod', label: t.navHome },
                  { id: 'projekt', label: t.navProject },
                  { id: 'galeria', label: t.navGallery },
                  { id: 'historia', label: t.navHistory },
                  { id: 'lokalita', label: t.navLocation },
                  { id: 'kontakt', label: t.navContact }
                ].map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setIsMenuOpen(false);
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="animate-menu-item text-left px-6 py-3 text-stone-200 hover:bg-[#ffa62b] hover:text-[#544740] transition-colors font-bold tracking-wider text-sm uppercase"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div 
          className="flex-shrink-0 cursor-pointer]"
          onClick={() => {
            setIsMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >

          <img src="/logo.png" alt="Zieger Mill Logo" className="h-auto max-h-[40px] sm:max-h-none sm:h-16 w-auto max-w-full sm:max-w-none object-contain" />
        </div>
        <div className="flex-1"></div>
      </nav>

      {/* LIGHTBOX MODAL */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-stone-900/95 flex items-center justify-center backdrop-blur-md" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
          <button onClick={() => setSelectedImageIndex(null)} className="absolute top-8 right-8 text-stone-400 hover:text-amber-500 transition-colors z-50 p-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <button onClick={showPrevImage} className="absolute left-4 md:left-10 text-stone-400 hover:text-amber-500 transition-colors z-50 p-2">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          
          {/* OPTIMIZED LIGHTBOX IMAGE */}
          <div className="relative w-[85vw] h-[85vh]">
            <Image 
              src={galleryImages[selectedImageIndex]} 
              alt="Zväčšená vizualizácia" 
              fill 
              className="object-contain drop-shadow-2xl rounded-2xl" 
            />
          </div>

          <button onClick={showNextImage} className="absolute right-4 md:right-10 text-stone-400 hover:text-amber-500 transition-colors z-50 p-2">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path></svg>
          </button>
          <div className="absolute bottom-8 text-stone-400 tracking-widest text-xs">
            {selectedImageIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}

      {/* 1. HERO SECTION */}
      <section id="uvod" className="relative h-screen w-full flex flex-col items-center justify-center p-6 bg-stone-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {galleryImages.map((img, idx) => (
            // OPTIMIZED HERO IMAGES: <Image> with priority for the first frame
            <Image
              key={idx}
              src={img}
              alt="Hero background"
              fill
              priority={idx === 0}
              quality={80}
              className={`object-cover transition-opacity duration-[3000ms] ease-in-out ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-stone-900/30 z-20 pointer-events-none"></div>
        </div>

        <FadeInSection>
          <div className="relative z-30 text-center max-w-4xl mx-auto mt-[-5vh]">
            <div className="flex items-center justify-center gap-4 mb-6 opacity-90">
              <div className="w-12 h-[1px] bg-[#ffa62b]"></div>
              <span className={`text-[#ffa62b] tracking-[0.3em] uppercase text-xs sm:text-sm drop-shadow-md ${playfair.className}`}>{t.est}</span>
              <div className="w-12 h-[1px] bg-[#ffa62b]"></div>
            </div>
            
            <h1 className={`hidden md:block text-6xl sm:text-8xl lg:text-9xl font-normal text-white mb-6 tracking-wide uppercase drop-shadow-lg ${playfair.className}`}>
              ZIEGER MILL
            </h1>
            <p className="text-lg sm:text-xl text-stone-100 font-light max-w-2xl mx-auto leading-relaxed mb-10 drop-shadow-md">
              {t.heroDesc}
            </p>
            <button onClick={scrollToForm} className={`border border-white/50 text-white hover:bg-white hover:text-stone-900 uppercase tracking-widest text-sm px-12 py-4 transition-all duration-500 backdrop-blur-sm rounded-lg ${playfair.className}`}>
              {t.btnInterest}
            </button>
          </div>
        </FadeInSection>
      </section>

      {/* 2. VISUALIZATIONS & TEXT */}
      <section id="projekt" className="max-w-7xl mx-auto px-6 py-24 sm:py-32 overflow-hidden">
        <FadeInSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-24 sm:mb-32">
            <div className="order-2 lg:order-1">
              <h2 className={`text-4xl sm:text-5xl font-normal text-stone-800 mb-6 tracking-wide uppercase ${playfair.className}`}>
                {t.feat1T1} {t.feat1T2 && <><br/><span className="text-amber-700 italic">{t.feat1T2}</span></>}
              </h2>
              <div className="w-24 h-[1px] bg-[#ffa62b] mb-8"></div>
              {t.feat1P1 && <p className="text-stone-600 leading-relaxed text-lg mb-6">{t.feat1P1}</p>}
              {t.feat1P2 && <p className="text-stone-600 leading-relaxed text-lg">{t.feat1P2}</p>}
            </div>
            {/* OPTIMIZED FEATURE IMAGE */}
            <div className="order-1 lg:order-2 relative h-[400px] sm:h-[600px] w-full shadow-xl border-4 border-white rounded-2xl overflow-hidden bg-stone-200">
               <Image src="/feature-1.jpg" alt="Zieger Mill Exterior" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </div>
        </FadeInSection>

        <FadeInSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* OPTIMIZED FEATURE IMAGE */}
            <div className="relative h-[400px] sm:h-[600px] w-full shadow-xl border-4 border-white rounded-2xl overflow-hidden bg-stone-200">
               <Image src="/feature-2.jpg" alt="Zieger Mill Interior" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
            <div>
              <h2 className={`text-4xl sm:text-5xl font-normal text-stone-800 mb-6 tracking-wide uppercase ${playfair.className}`}>
                {t.feat2T1} {t.feat2T2 && <><br/><span className="text-amber-700 italic">{t.feat2T2}</span></>}
              </h2>
              <div className="w-24 h-[1px] bg-[#ffa62b] mb-8"></div>
              {t.feat2P1 && <p className="text-stone-600 leading-relaxed text-lg mb-6">{t.feat2P1}</p>}
              {t.feat2P2 && <p className="text-stone-600 leading-relaxed text-lg">{t.feat2P2}</p>}
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* 3. GALLERY SECTION */}
      <section id="galeria" className="bg-stone-200/50 py-24 border-y border-stone-300 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className={`text-4xl sm:text-5xl font-normal text-stone-800 mb-4 tracking-wide uppercase ${playfair.className}`}>
                {t.galT1} {t.galT2 && <span className="text-amber-700 italic">{t.galT2}</span>}
              </h2>
              <div className="w-24 h-[1px] bg-[#ffa62b] mx-auto"></div>
              {t.galDesc && <p className="text-stone-600 mt-6 max-w-2xl mx-auto">{t.galDesc}</p>}
            </div>
          </FadeInSection>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {galleryImages.map((img, index) => (
              <FadeInSection key={index} delayMs={index * 100}>
                <div className="aspect-square overflow-hidden cursor-pointer relative group bg-stone-300 rounded-2xl" onClick={() => setSelectedImageIndex(index)}>
                  <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/60 transition-all duration-300 z-10 flex items-center justify-center">
                    <svg className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                  </div>
                  {/* OPTIMIZED THUMBNAIL IMAGES */}
                  <Image 
                    src={img} 
                    alt={`Galéria ${index + 1}`} 
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                  />
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HISTORY SECTION */}
      <section id="historia" className="bg-white pt-24 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24 items-center">
              
              <div className="order-2 lg:order-1 lg:col-span-2 relative w-full h-[300px] sm:h-[450px] bg-stone-200 shadow-xl border-4 border-stone-100 rounded-2xl overflow-hidden">
                {/* OPTIMIZED HISTORY IMAGE */}
                <Image 
                  src="/history.png" 
                  alt="Historical photo" 
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover grayscale sepia-[.3]" 
                />
                <div className="absolute inset-0 bg-stone-900/10 mix-blend-multiply pointer-events-none"></div>
              </div>
              
              <div className="order-1 lg:order-2 lg:col-span-1">
                <h2 className={`text-4xl sm:text-5xl font-normal text-stone-800 mb-6 tracking-wide uppercase ${playfair.className}`}>
                  {t.histT1} {t.histT2 && <><br/><span className="text-amber-700 italic">{t.histT2}</span></>}
                </h2>
                <div className="w-24 h-[1px] bg-[#ffa62b] mb-8"></div>
                {t.histP1 && <p className="text-stone-600 leading-relaxed text-lg mb-6">{t.histP1}</p>}
                {t.histP2 && <p className="text-stone-600 leading-relaxed text-lg">{t.histP2}</p>}
              </div>

            </div>
          </FadeInSection>
        </div>
      </section>

      {/* 4.5 LOCATION MAP SECTION */}
      <section id="lokalita" className="bg-white pb-24 overflow-hidden">
        <FadeInSection>
          <div className="mt-12 relative w-full h-[520px] lg:h-[650px] shadow-xl">
            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full bg-stone-200 flex items-center justify-center">
              {!isMapContainerVisible && <span className="text-stone-500 font-bold uppercase tracking-widest text-sm">Načítavam mapu...</span>}
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* 5. LEAD CAPTURE FORM SECTION */}
      <section id="kontakt" className="bg-stone-100 py-24 px-6 overflow-hidden">
        <FadeInSection>
          <div className="max-w-2xl mx-auto">
            
            <div className="bg-[#544740]/90 p-8 sm:p-14 shadow-2xl border border-[#ffa62b] relative rounded-2xl overflow-hidden">
              <div className="absolute inset-2 border border-[#ffa62b] pointer-events-none rounded-xl"></div>

              <div className="text-center mb-10 relative z-10">
                <h2 className={`text-3xl font-normal text-white mb-4 tracking-wide uppercase ${playfair.className}`}>{t.formTitle}</h2>
                <div className="w-16 h-[1px] bg-[#ffa62b] mx-auto mb-6"></div>
                <p className="text-stone-400">{t.formDesc}</p>
              </div>

              {status === 'success' ? (
                <div className="py-12 text-center relative z-10">
                  <div className="w-20 h-20 border-2 border-amber-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className={`text-2xl font-normal text-white mb-3 uppercase tracking-wide ${playfair.className}`}>{t.formThanks}</h3>
                  <p className="text-stone-400">{t.formThanksDesc}</p>
                  <button onClick={() => setStatus('idle')} className="mt-8 text-sm text-amber-600 uppercase tracking-widest hover:text-amber-500 transition-colors border-b border-amber-600/30 pb-1">{t.formNew}</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-5 py-4 bg-stone-900/50 border border-stone-700 focus:border-amber-700 outline-none text-white transition-all placeholder-stone-500 rounded-lg" placeholder={t.formName} />
                  </div>
                  <div>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-4 bg-stone-900/50 border border-stone-700 focus:border-amber-700 outline-none text-white transition-all placeholder-stone-500 rounded-lg" placeholder={t.formEmail} />
                  </div>
                  <div>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-5 py-4 bg-stone-900/50 border border-stone-700 focus:border-amber-700 outline-none text-white transition-all placeholder-stone-500 rounded-lg" placeholder={t.formPhone} />
                  </div>
                  {status === 'error' && <p className="text-amber-700 text-sm text-center mt-2 bg-amber-900/20 py-3 border border-amber-900/50 rounded-md">{t.formError}</p>}
                  <button type="submit" disabled={status === 'loading'} className="w-full mt-6 bg-[#ffa62b] text-[#544740] uppercase tracking-widest text-sm py-5 hover:bg-[#ffa62b] transition-colors duration-300 disabled:opacity-50 rounded-lg font-bold">
                    {status === 'loading' ? t.formSending : t.formSubmit}
                  </button>
                </form>
              )}
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#544740]/90 py-16 text-center flex flex-col items-center gap-8">
        
        <div className="flex justify-center items-center gap-6 text-sm tracking-widest uppercase font-bold">
          {['SK', 'EN', 'DE'].map((lang) => (
            <button 
              key={lang}
              onClick={() => setLanguage(lang as 'SK' | 'EN' | 'DE')}
              className={`pb-1 transition-colors ${
                language === lang 
                  ? 'text-amber-500 border-b-2 border-amber-500' 
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="text-stone-700 text-xs tracking-widest uppercase">
            {t.footer}
          </div>
          <a 
            href="/ochrana-osobnych-udajov" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-stone-700 hover:text-amber-500 transition-colors text-xs tracking-widest uppercase underline underline-offset-4"
          >
            {t.privacy}
          </a>
        </div>
      </footer>
    </main>
  );
}