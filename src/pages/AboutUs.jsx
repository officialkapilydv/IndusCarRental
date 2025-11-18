import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ShieldCheck, BadgeCheck, UserRoundCheck, Clock, Car, Award, Users } from "lucide-react";
import { motion } from "framer-motion";

// ---------- small UI atoms ----------
function Card({ className = "", children }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}
function CardContent({ children, className = "" }) { 
  return <div className={`px-4 pb-4 ${className}`}>{children}</div>; 
}

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white text-slate-800">
      <TopBar onLogoClick={() => navigate("/")} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-extrabold text-center"
          >
            ABOUT GURGAON TAXI SERVICE
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mt-4 text-lg text-purple-100 max-w-3xl mx-auto"
          >
            20 Years of Excellence in Transportation Services
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-purple-700 mb-4">20 Years of Trusted Service in Gurgaon</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We at <strong>Gurgaon Taxi Service</strong> have been serving you for <strong>20 years</strong>, providing reliable and affordable transportation solutions. 
              Looking for the best taxi service? Start your journey with ease by booking with us. Whether you need airport transportation, city tours, 
              or just a quick ride across town, we ensure a seamless experience every time.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Compare our top-rated services online, check customer reviews and ratings. We offer convenient mobile booking for instant confirmation 
              and real-time tracking. Consider factors like competitive pricing, diverse vehicle types, and special services such as wheelchair 
              accessibility or child seats.
            </p>
            <p className="text-slate-600 leading-relaxed">
              For the best experience, book in advance for important trips, provide clear pickup and drop-off details, and confirm the fare before riding. 
              With these commitments, we ensure a safe, comfortable, and efficient taxi ride every time.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden shadow-xl"
          >
            <img className="h-full w-full object-cover" alt="Cab fleet"
                 src="https://www.savaari.com/assets/img/homepage/website-banner-last.webp" />
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <StatCard icon={<Clock className="h-8 w-8" />} number="20+" label="Years Experience" />
          <StatCard icon={<Users className="h-8 w-8" />} number="10K+" label="Happy Customers" />
          <StatCard icon={<Car className="h-8 w-8" />} number="24/7" label="Availability" />
          <StatCard icon={<Award className="h-8 w-8" />} number="100%" label="Safe Rides" />
        </motion.div>

        {/* Fleet Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8">OUR PREMIUM FLEET</h2>
          <Card className="bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="p-8">
              <p className="text-slate-700 leading-relaxed mb-4 text-lg">
                A reliable taxi service provider with a diverse fleet of premium cars including <strong>Innova Crysta, Swift Dzire, Etios, 
                XUV 700, Innova Hycross</strong>, and many more. Experience ultimate comfort and reliability with our premium Innova cab service.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Perfect for both city travel and long-distance journeys, our fleet of well-maintained vehicles offers spacious interiors and smooth rides. 
                Whether you're planning a family trip, corporate travel, or airport transfers, our cabs provide the ideal balance of luxury and practicality.
              </p>
              <p className="text-slate-700 leading-relaxed mb-6">
                Our professional drivers, trained in customer service and safety protocols, ensure a seamless travel experience. Book online or through 
                our user-friendly mobile app for instant confirmation and real-time tracking. With competitive rates, <strong>24/7 availability</strong>, 
                and a range of amenities including Wi-Fi and bottled water, our service is the smart choice for discerning travelers.
              </p>
              
              {/* Fleet Types */}
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <FleetCard name="Innova Crysta" features={["7 Seater", "Premium Comfort", "Long Distance"]} />
                <FleetCard name="Swift Dzire" features={["4 Seater", "Fuel Efficient", "City Rides"]} />
                <FleetCard name="XUV 700" features={["7 Seater", "Luxury", "All Terrain"]} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8">WHY CHOOSE US?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Feature icon={<ShieldCheck className="h-6 w-6" />} title="Clean & Hygienic" subtitle="Cars" />
            <Feature icon={<BadgeCheck className="h-6 w-6" />} title="Transparent" subtitle="Billing" />
            <Feature icon={<UserRoundCheck className="h-6 w-6" />} title="Expert" subtitle="Chauffeurs" />
            <Feature icon={<MapPin className="h-6 w-6" />} title="20+" subtitle="Cities" />
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-2xl p-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Book Your Ride?</h2>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Experience the comfort and reliability of Gurgaon's most trusted taxi service. Book now and enjoy a seamless journey.
          </p>
          <button 
            onClick={() => navigate("/")}
            className="bg-white text-purple-700 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition"
          >
            BOOK NOW
          </button>
        </motion.div>
      </section>

      <Footer onNavigate={navigate} />
    </div>
  );
}

// ---------- Components ----------
function TopBar({ onLogoClick }) {
  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <button onClick={onLogoClick} className="flex items-center gap-2">
          <div className="bg-purple-600 text-white px-3 py-1 rounded-md font-bold tracking-wide">Indus Car Rental</div>
          <span className="hidden md:inline text-xs text-slate-500">India's top rated cab service</span>
        </button>
        <nav className="flex items-center gap-6 text-sm">
          <button onClick={onLogoClick} className="hover:text-purple-700">Home</button>
        </nav>
      </div>
    </header>
  );
}

function StatCard({ icon, number, label }) {
  return (
    <Card className="text-center">
      <CardContent className="py-8">
        <div className="flex justify-center text-purple-600 mb-3">{icon}</div>
        <div className="text-3xl font-bold text-slate-800">{number}</div>
        <div className="text-sm text-slate-600 mt-2">{label}</div>
      </CardContent>
    </Card>
  );
}

function FleetCard({ name, features }) {
  return (
    <Card className="border-purple-200">
      <CardContent className="py-6">
        <div className="flex justify-center mb-3">
          <Car className="h-10 w-10 text-purple-600" />
        </div>
        <h3 className="text-lg font-bold text-center mb-3">{name}</h3>
        <ul className="space-y-2">
          {features.map((f, i) => (
            <li key={i} className="text-sm text-slate-600 text-center">✓ {f}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
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

function Footer({ onNavigate }) {
  return (
    <footer className="bg-purple-700 text-white mt-8">
      <div className="mx-auto max-w-7xl px-4 py-12 grid sm:grid-cols-4 gap-8">
        <div>
          <div className="text-lg font-bold">Indus Car Rental</div>
          <p className="mt-2 text-sm text-purple-100/90">© {new Date().getFullYear()} Indus Car Rental. All rights reserved.</p>
        </div>
        <div>
          <div className="font-semibold">Company</div>
          <ul className="mt-2 space-y-1 text-sm text-purple-100/90">
            <li><button onClick={() => onNavigate("/about")} className="hover:text-white">About Us</button></li>
            <li>Careers</li>
            <li><button onClick={() => onNavigate("/privacy-policy")} className="hover:text-white">Privacy Policy</button></li>
            <li><button onClick={() => onNavigate("/terms-conditions")} className="hover:text-white">Terms & Conditions</button></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Get in touch</div>
          <ul className="mt-2 space-y-1 text-sm text-purple-100/90">
            <li><button onClick={() => onNavigate("/contact")} className="hover:text-white">Contact</button></li>
            <li>Travel Agent</li>
            
          </ul>
        </div>
      </div>
    </footer>
  );
}