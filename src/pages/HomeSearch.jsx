import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar as CalendarIcon,
  Clock3,
  ShieldCheck,
  BadgeCheck,
  UserRoundCheck,
  ArrowLeftRight,
  Plane,
  Landmark,
  Gauge,
  ChevronDown,
} from "lucide-react";
import { buildQuery } from "../lib/query";
import "../index.css";
import heroBg from '../assets/background.jpg?url';

// ---------- utils ----------
const todayISO = () => new Date().toISOString().slice(0, 10);
const addDaysISO = (iso, days) => {
  const d = iso ? new Date(iso) : new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const tiers = [
  { key: "oneway", label: "ONE WAY", icon: <ArrowLeftRight className="h-4 w-4" /> },
  { key: "roundtrip", label: "OUTSTATION", icon: <Gauge className="h-4 w-4" /> },
  { key: "local", label: "LOCAL NCR", icon: <Landmark className="h-4 w-4" /> },
  { key: "airport", label: "AIRPORT", icon: <Plane className="h-4 w-4" /> },
];

const cities = ["Gurugram","Jaipur","Delhi","Noida","Mumbai","Bengaluru","Hyderabad","Pune","Chandigarh"];

// ---------- small UI atoms ----------
function Button({ className = "", disabled, children, ...props }) {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold transition
      ${disabled ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-[#9333ea] hover:bg-[#7e22ce] text-white"} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
function Card({ className = "", children }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}
function CardHeader({ children }) { return <div className="px-4 pt-4">{children}</div>; }
function CardTitle({ children, className = "" }) { return <div className={`text-xl font-bold ${className}`}>{children}</div>; }
function CardContent({ children, className = "" }) { return <div className={`px-4 pb-4 ${className}`}>{children}</div>; }

// ---------- page ----------
export default function HomeSearch() {
  const nav = useNavigate();

  // tab + fields
  const [tab, setTab] = useState("oneway");
  const [from, setFrom] = useState("Gurugram");
  const [to, setTo] = useState("Jaipur");
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("07:00");
  const [returnDate, setReturnDate] = useState(addDaysISO(todayISO(), 1));
  const [localCity, setLocalCity] = useState("");

  // airport
  const [airportTripType, setAirportTripType] = useState("drop"); // 'drop' | 'pickup'
  const [pickupAddress, setPickupAddress] = useState("");
  const [airportName, setAirportName] = useState("");

  const canSearch = useMemo(() => {
    if (tab === "local") return localCity && date && time;
    if (tab === "roundtrip") return from && to && date && returnDate && time;
    if (tab === "airport") return pickupAddress && airportName && date && time;
    return from && to && date && time;
  }, [tab, from, to, date, time, localCity, returnDate, pickupAddress, airportName]);

  const onSwap = () => {
    if (tab === "local" || tab === "airport") return;
    setFrom(to); setTo(from);
  };

  const go = () => {
    const q = buildQuery({
      tab, from, to, date, time,
      returnDate: tab === "roundtrip" ? returnDate : "",
      localCity: tab === "local" ? localCity : "",
      airportTripType: tab === "airport" ? airportTripType : "",
      pickupAddress: tab === "airport" ? pickupAddress : "",
      airportName: tab === "airport" ? airportName : "",
    });
    nav(`/select-cars?${q}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white text-slate-800">
      <TopBar />

      {/* ===== HERO + SEARCH ===== */}
      <section className="relative">
        {/* background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="mx-auto max-w-7xl px-4 pt-12 pb-16 relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                     className="text-3xl md:text-5xl font-extrabold text-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            SERVICES ACROSS <span className="text-purple-300">20+ CITIES</span>
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
                      className="mt-8 bg-white/90 backdrop-blur rounded-2xl shadow-xl border p-4">
            <div className="grid grid-cols-4 gap-2 sm:max-w-xl mx-auto">
              {tiers.map((t) => (
                <button key={t.key} onClick={() => setTab(t.key)}
                        className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold border transition ${
                          tab === t.key ? "bg-purple-600 text-white border-purple-600" : "bg-white hover:bg-slate-50 border-slate-200"
                        }`}>
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            {/* Dynamic form area */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              {(tab === "oneway" || tab === "roundtrip") && (
                <>
                  <Field label="FROM" className="md:col-span-3"><CitySelect value={from} onChange={setFrom} /></Field>
                  <div className="md:col-span-1 flex justify-center">
                    <button onClick={onSwap} className="p-2 rounded-full border bg-white hover:bg-slate-50" aria-label="Swap">
                      <ArrowLeftRight className="h-5 w-5" />
                    </button>
                  </div>
                  <Field label="TO" className="md:col-span-3"><CitySelect value={to} onChange={setTo} /></Field>
                  <Field label="PICK UP DATE" className="md:col-span-2"><DateInput value={date} onChange={setDate} /></Field>
                  {tab === "roundtrip" && (
                    <Field label="RETURN DATE" className="md:col-span-2"><DateInput min={date} value={returnDate} onChange={setReturnDate} /></Field>
                  )}
                  <Field label="PICK UP TIME" className="md:col-span-2"><TimeInput value={time} onChange={setTime} /></Field>
                </>
              )}

              {tab === "local" && (
                <>
                  <Field label="ENTER CITY" className="md:col-span-4"><CitySelect value={localCity} onChange={setLocalCity} /></Field>
                  <Field label="PICK UP DATE" className="md:col-span-4"><DateInput value={date} onChange={setDate} /></Field>
                  <Field label="PICK UP TIME" className="md:col-span-4"><TimeInput value={time} onChange={setTime} /></Field>
                </>
              )}

              {tab === "airport" && (
                <>
                  <Field label="TRIP" className="md:col-span-3">
                    <div className="relative">
                      <select value={airportTripType} onChange={(e) => setAirportTripType(e.target.value)}
                              className="w-full rounded-lg border px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-600">
                        <option value="drop">Drop to Airport</option>
                        <option value="pickup">Pickup from Airport</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    </div>
                  </Field>
                  <Field label="PICKUP ADDRESS" className="md:col-span-3">
                    <input className="w-full rounded-lg border pl-3 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                           placeholder="Enter Pickup Location" value={pickupAddress} onChange={(e)=>setPickupAddress(e.target.value)} />
                  </Field>
                  <Field label={airportTripType === "drop" ? "DROP AIRPORT" : "PICKUP AIRPORT"} className="md:col-span-3">
                    <input className="w-full rounded-lg border pl-3 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                           placeholder="Start typing airport name or city" value={airportName} onChange={(e)=>setAirportName(e.target.value)} />
                  </Field>
                  <Field label="PICK UP DATE" className="md:col-span-2"><DateInput value={date} onChange={setDate} /></Field>
                  <Field label="PICK UP TIME" className="md:col-span-2"><TimeInput value={time} onChange={setTime} /></Field>
                </>
              )}

              <div className="md:col-span-12 flex justify-center md:justify-center">
                <Button className="w-full md:w-auto px-8" disabled={!canSearch} onClick={go}>EXPLORE CABS</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== Why us ===== */}
      <section id="why" className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center text-purple-700">WHAT SETS INDUS CAR APART?</h2>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Feature icon={<ShieldCheck className="h-6 w-6" />} title="Clean & Hygienic" subtitle="Cars" />
          <Feature icon={<BadgeCheck className="h-6 w-6" />} title="Transparent" subtitle="Billing" />
          <Feature icon={<UserRoundCheck className="h-6 w-6" />} title="Expert" subtitle="Chauffeurs" />
          <Feature icon={<MapPin className="h-6 w-6" />} title="20+" subtitle="Cities" />
        </div>
      </section>

      {/* ===== Services ===== */}
      <OurServices />

      {/* ===== Story block ===== */}
      <section id="story" className="mx-auto max-w-7xl px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="text-2xl font-bold text-purple-700">India's Largest Intercity and Local Cab Services</h3>
          <p className="mt-3 text-slate-600">
            We are India's leading chauffeur-driven car rental company, offering premium travel experiences across 20+ cities nationwide.
            Our services span Intercity Travel — including One-Way and Round-Trip journeys — Local Rentals, and Airport Transfers, ensuring comfort and convenience wherever you go.
          </p>
          <p className="mt-3 text-slate-600">
            With over a decade of excellence, we take pride in being India's largest chauffeur-driven car rental network, unmatched in our geographical reach and trusted by thousands of travelers for our reliability, professionalism, and personalized service.
          </p>
        </div>
        <div
          className="aspect-video rounded-2xl overflow-hidden shadow-lg"
          style={{ aspectRatio: 'unset' }}
        >
          <img className="h-full w-full object-cover" alt="Cab interior"
               src="https://www.savaari.com/assets/img/homepage/website-banner-last.webp" />
        </div>
      </section>

      {/* ===== Exploring India Section ===== */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <img 
                className="rounded-2xl shadow-lg w-full h-full object-cover" 
                alt="Road trip experience"
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80"
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl md:text-3xl font-bold text-purple-700">Exploring India, one road trip at a time</h3>
              <p className="mt-4 text-slate-600">
                To us, a road trip is one of the most exhilarating ways to travel the length and breadth of India. There's always something to look at, something to explore and to experience. Because we love travelling by road so much, we've been striving to make sure you have a great experience too. We wanted more of you to go on a road trip, and more of you to experience the same joys of travel that we do. Instead of driving, why not sit back and take our <span className="font-semibold text-slate-800">chauffeur driven cabs</span> on your next vacation? We believe that the time you spend on your vacation should be entirely yours. So now, we are in <span className="font-semibold text-purple-700">20+ cities across India</span> - to help you travel to wherever your heart desires.
              </p>
              <p className="mt-3 text-slate-600">
                We love that you're free to stop to breathe in clean air, learn about cultures and taste local food when you travel by cabs. We love that these wholesome experiences make travelling better and enrich our lives. We live for the surprises we find on road trips.
              </p>
              <p className="mt-3 text-slate-600">
                No city is too big or too small. We know travellers and wanderers like us are everywhere. You live near Khajuraho, you live near Aleppey, and you live near Alibag and near Tranquebar. We want you to visit them all. Pack your bags every weekend and explore everything there is to see around you.
              </p>
              <p className="mt-3 text-slate-600">
                To make planning your vacation easier, you can book a cab with ease on our website, or call us on <a href="tel:01244200022" className="text-purple-700 font-semibold hover:underline">0124-4200022</a> if you'd like to discuss your itinerary with our executives in detail. When you book an outstation cab with us, we'll send you a travel kit and help you plan your itinerary. We also have a handy cab booking app that will further reduce the hassles of booking a trip with us. Our expert drivers will guide you through some of the best experiences India has to offer. From the time you make a booking with us, to the time you get back home, we'll make sure you have a great road trip.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== No Matter Where Section ===== */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h3 className="text-2xl md:text-3xl font-bold text-center text-purple-700">No matter where you travel - we've got a cab for you</h3>
        <div className="mt-8 space-y-4 text-slate-600 max-w-5xl mx-auto">
          <p>
            Planning a weekend getaway? Our outstation cab services will help you explore the best destinations, visit all the must-see places and taste the best local food. Did you just land at an airport or railway station closest to your destination? No problem! You can use our airport taxi, the transit pick up service to cover the last mile. We'll get you to your destination and show you some of the best sights along the way. Planning on traveling home for a family get-together? Try our newly introduced one-way cab services - no matter where you live, get dropped to your hometown by paying only one-side fare. Decided to take a personal day and spend the whole day exploring your city? Our local taxi packages will help you explore the best places to eat and drink at, some of the city's majestic monuments, greenest parks and oldest temples. You'll never have to worry about an empty travel itinerary again. Are you an offbeat traveller? Do you just hit the road and decide to take it from there? We offer one-way drops on several routes, in case you only want to be dropped to a destination and don't want to look back.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ---------- support components ----------
function TopBar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-purple-600 text-white px-3 py-1 rounded-md font-bold tracking-wide">Indus Car Rental</div>
          <span className="hidden md:inline text-xs text-slate-500">India's top rated cab service</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a className="hover:text-purple-700 cursor-pointer" href="#services">Services</a>
          <a className="hover:text-purple-700 cursor-pointer" href="#why">Why us</a>
          <button onClick={() => navigate("/about")} className="hover:text-purple-700">About</button>
          <button onClick={() => navigate("/contact")} className="hover:text-purple-700">Contact</button>
          <button 
            onClick={() => navigate("/admin")} 
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-md font-medium transition"
          >
            🔐 Admin
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-slate-100 rounded-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="px-4 py-4 space-y-3">
            <a 
              className="block py-2 hover:text-purple-700 cursor-pointer" 
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </a>
            <a 
              className="block py-2 hover:text-purple-700 cursor-pointer" 
              href="#why"
              onClick={() => setMobileMenuOpen(false)}
            >
              Why us
            </a>
            <button 
              onClick={() => { navigate("/about"); setMobileMenuOpen(false); }} 
              className="block w-full text-left py-2 hover:text-purple-700"
            >
              About
            </button>
            <button 
              onClick={() => { navigate("/contact"); setMobileMenuOpen(false); }} 
              className="block w-full text-left py-2 hover:text-purple-700"
            >
              Contact
            </button>
            <button 
              onClick={() => { navigate("/admin"); setMobileMenuOpen(false); }} 
              className="flex items-center gap-2 w-full text-left py-2 px-3 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-md font-medium transition"
            >
              🔐 Admin
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <div className="text-xs font-semibold text-slate-600 mb-1">{label}</div>
      {children}
    </div>
  );
}

function DateInput({ value, onChange, min }) {
  return (
    <div className="relative">
      <input type="date" className="w-full rounded-lg border p-2 pr-9 focus:outline-none focus:ring-2 focus:ring-purple-600"
             value={value} min={min || todayISO()} onChange={(e) => onChange(e.target.value)} />
      <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
    </div>
  );
}

function TimeInput({ value, onChange }) {
  return (
    <div className="relative">
      <input type="time" className="w-full rounded-lg border p-2 pr-9 focus:outline-none focus:ring-2 focus:ring-purple-600"
             value={value} onChange={(e) => onChange(e.target.value)} />
      <Clock3 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
    </div>
  );
}

function CitySelect({ value, onChange }) {
  const [q, setQ] = useState(value);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const autocompleteService = useRef(null);

  // Load Google Maps script
  useEffect(() => {
    loadGoogleMapsScript();
  }, []);

  const loadGoogleMapsScript = async () => {
    if (window.google?.maps) return;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("Google Maps API key not found");
      return;
    }

    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        const checkInterval = setInterval(() => {
          if (window.google?.maps) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const handleInputChange = async (e) => {
    const inputValue = e.target.value;
    setQ(inputValue);
    setOpen(true);

    if (!inputValue.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      await loadGoogleMapsScript();

      if (!autocompleteService.current && window.google?.maps) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
      }

      if (!autocompleteService.current) {
        console.error("Autocomplete service not available");
        setLoading(false);
        return;
      }

      autocompleteService.current.getPlacePredictions(
        {
          input: inputValue,
          componentRestrictions: { country: "in" },
          types: ["(cities)"],
        },
        (predictions, status) => {
          setLoading(false);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
          }
        }
      );
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setLoading(false);
    }
  };

  const selectItem = (suggestion) => {
    const cityName = suggestion.structured_formatting.main_text;
    onChange(cityName);
    setQ(cityName);
    setSuggestions([]);
    setOpen(false);
  };

  const showList = open && q && suggestions.length > 0;

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><MapPin className="h-4 w-4" /></div>
      <input
        className="w-full rounded-lg border pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
        placeholder="Search city" 
        value={q || ""}
        onFocus={() => setOpen(true)}
        onChange={handleInputChange}
        onBlur={() => { 
          setTimeout(() => {
            setOpen(false);
            if (q && q !== value) onChange(q);
          }, 200);
        }}
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full"></div>
        </div>
      )}
      {showList && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border bg-white shadow-lg max-h-56 overflow-auto">
          {suggestions.map((suggestion) => (
            <button 
              key={suggestion.place_id} 
              type="button" 
              className="w-full text-left px-3 py-2 hover:bg-purple-50 border-b last:border-b-0 transition-colors"
              onMouseDown={(e) => { 
                e.preventDefault(); 
                selectItem(suggestion); 
              }}
            >
              <div className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">📍</span>
                <div className="flex-1">
                  <div className="font-medium text-sm text-slate-800">
                    {suggestion.structured_formatting.main_text}
                  </div>
                  <div className="text-xs text-slate-500">
                    {suggestion.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Feature({ icon, title, subtitle }) {
  return (
    <Card className="border-slate-200">
      <CardContent className="flex flex-col items-center gap-2 py-6">
        <div className="rounded-full border p-3 text-purple-700 bg-purple-50">{icon}</div>
        <div className="text-sm font-bold text-slate-800">{title}</div>
        <div className="text-xs text-slate-500">{subtitle}</div>
      </CardContent>
    </Card>
  );
}

function OurServices() {
  const cards = [
    { title: "ROUNDTRIP CABS", desc:
      "Our premium roundtrip services will pamper you with an absolutely comfortable drive from your doorstep & back.",
      points: ["Expert Chauffeurs", "Safety Certified", "Multiple Stops"],
      img: "https://earthcabservice.com/wp-content/uploads/2025/05/One-Way-1-1024x576.jpg" },
    { title: "ONEWAY DROPS", desc:
      "Our network of over 15 lakh one way routes ensures there is no corner of the country that you can't travel with us.",
      points: ["15 Lakh Routes", "Lowest Fares", "All Inclusive"],
      img: "https://chennaionewaycab.com/wp-content/uploads/2024/02/Business-Transport.jpg" },
    { title: "LOCAL RENTALS", desc:
      "Book our flexible hourly rental cabs and get chauffeured within the city for your business meetings or shopping chores.",
      points: ["Flexible Packages", "Cab At Disposal", "Multiple Stops"],
      img: "https://chennaionewaycab.com/wp-content/uploads/2024/02/Regular-Transport.jpg" },
    { title: "AIRPORT TRANSFERS", desc:
      "We care about your flight as much as you do. Reliable pickups & drops with complete peace of mind.",
      points: ["Reliability", "Lowest Fares", "Courteous Chauffeurs"],
      img: "https://chennaionewaycab.com/wp-content/uploads/2024/02/Airport-Transport.jpg" },
  ];
  return (
    <section id="services" className="mx-auto max-w-7xl px-4 pb-6">
      <h2 className="text-2xl md:text-3xl font-extrabold text-center text-purple-700">OUR SERVICES</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (<ServiceCard key={c.title} {...c} />))}
      </div>
    </section>
  );
}

function ServiceCard({ title, desc, points, img }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <Card className="overflow-hidden group">
        <div className="h-40 w-full bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
        <CardHeader><CardTitle className="text-lg">{title}</CardTitle></CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-slate-600 min-h-[72px]">{desc}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-600">
            {points.map((p) => (<div key={p} className="rounded-lg border px-2 py-1">{p}</div>))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Footer() {
  const navigate = useNavigate();
  
  return (
    <footer id="contact" className="bg-purple-700 text-white mt-8">
      <div className="mx-auto max-w-7xl px-4 py-12 grid sm:grid-cols-4 gap-8">
        <div>
          <div className="text-lg font-bold">Indus Car Rental</div>
          <p className="mt-2 text-sm text-purple-100/90">© {new Date().getFullYear()} Indus Car Rental. All rights reserved.</p>
        </div>
        <div>
          <div className="font-semibold">Company</div>
          <ul className="mt-2 space-y-1 text-sm text-purple-100/90">
            <li><button onClick={() => navigate("/about")} className="hover:text-white">About Us</button></li>
            <li>Careers</li>
            <li><button onClick={() => navigate("/privacy-policy")} className="hover:text-white">Privacy Policy</button></li>
            <li><button onClick={() => navigate("/terms-conditions")} className="hover:text-white">Terms & Conditions</button></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Services</div>
          <ul className="mt-2 space-y-1 text-sm text-purple-100/90">
            <li><button onClick={() => navigate("/tempo-traveller")} className="hover:text-white">Tempo Travellers & Minibuses</button></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Get in touch</div>
          <ul className="mt-2 space-y-1 text-sm text-purple-100/90">
            <li><button onClick={() => navigate("/contact")} className="hover:text-white">Contact</button></li>
            <li>Travel Agent</li>
            
          </ul>
        </div>
      </div>
    </footer>
  );
}