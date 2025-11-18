import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bus, Users, Shield, Calendar, DollarSign, Star, CheckCircle, Clock, Award } from "lucide-react";

// ---------- small UI atoms ----------
function Card({ className = "", children }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}
function CardContent({ children, className = "" }) { 
  return <div className={`px-4 pb-4 ${className}`}>{children}</div>; 
}
function CardHeader({ children }) { 
  return <div className="px-4 pt-4">{children}</div>; 
}
function CardTitle({ children, className = "" }) { 
  return <div className={`text-xl font-bold ${className}`}>{children}</div>; 
}

export default function TempoTraveller() {
  const navigate = useNavigate();

  const tempoRates = [
    { city: "Bangalore", rate: "₹21/Km" },
    { city: "New Delhi", rate: "₹28/Km" },
    { city: "Hyderabad", rate: "₹28/Km" },
    { city: "Gurugram", rate: "₹28/Km" },
    { city: "Mumbai", rate: "₹25/Km" },
  ];

  const minibusRates = [
    { city: "Bangalore", rate: "₹34/Km" },
    { city: "Delhi", rate: "₹35/Km" },
    { city: "Hyderabad", rate: "₹43/Km" },
    { city: "Gurugram", rate: "₹35/Km" },
    { city: "Mumbai", rate: "₹29/Km" },
  ];

  const features = [
    { icon: <Users className="h-5 w-5" />, title: "Multiple Seating Options", desc: "12, 14, 16, 20, 22, 25 seater options" },
    { icon: <Shield className="h-5 w-5" />, title: "Safety First", desc: "Well-maintained vehicles with safety features" },
    { icon: <DollarSign className="h-5 w-5" />, title: "Transparent Pricing", desc: "No hidden charges or surprises" },
    { icon: <Clock className="h-5 w-5" />, title: "On-Time Service", desc: "Punctual pickups and drop-offs" },
    { icon: <Star className="h-5 w-5" />, title: "Expert Chauffeurs", desc: "Professional and courteous drivers" },
    { icon: <Award className="h-5 w-5" />, title: "Premium Amenities", desc: "AC, music system, LED TV & more" },
  ];

  const benefits = [
    "Wide range of vehicles with superior engines",
    "Transparent billing with no hidden charges",
    "Seamless online and offline booking",
    "On-time services with no delays",
    "Highly rated and professional chauffeurs",
    "First-class amenities in all vehicles",
    "Customizable packages for your needs",
    "24×7 customer support available",
  ];

  const idealFor = [
    "Family outstation trips and road trips",
    "Group travel with friends",
    "Corporate events and team outings",
    "Weddings and family gatherings",
    "Spiritual pilgrimages",
    "Local sightseeing tours",
    "Airport transfers for large groups",
    "Business meetings and conferences",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white text-slate-800">
      <TopBar onLogoClick={() => navigate("/")} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Bus className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-3xl md:text-5xl font-extrabold">TEMPO TRAVELLERS & MINIBUSES</h1>
            <p className="mt-4 text-lg text-purple-100 max-w-3xl mx-auto">
              Best Solution for Group Travel - Comfortable, Safe, and Affordable
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card>
            <CardContent className="p-8">
              <p className="text-slate-600 leading-relaxed text-lg mb-4">
                If you've always been someone doing a headcount, coordinating with drivers of the multiple cabs you booked, and heaving a sigh of relief when every family member reaches the desired location, we hear you. Here's a simple solution to ease your travel worries: booking a tempo traveller on rent or a minibus rental.
              </p>
              <p className="text-slate-600 leading-relaxed text-lg">
                Opting for a tempo traveller with a reliable and customer-centric company like Indus Car Rental, you can convert your travel into a memorable and enjoyable journey.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Pricing Tables */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8">
          TEMPO TRAVELLER & MINIBUS OPTIONS AND FARES
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Tempo Traveller Rates */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-700">Tempo Traveller Prices</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full">
                    <thead className="bg-purple-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">City Name</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Starting From</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {tempoRates.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-600">{item.city}</td>
                          <td className="px-4 py-3 text-right font-semibold text-purple-700">{item.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Minibus Rates */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-700">Minibus Rental Prices</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full">
                    <thead className="bg-purple-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">City Name</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Starting From</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {minibusRates.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-600">{item.city}</td>
                          <td className="px-4 py-3 text-right font-semibold text-purple-700">{item.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* What They're Ideal For */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8">
          WHAT ARE TEMPO TRAVELLERS & MINIBUSES IDEAL FOR?
        </h2>
        
        <Card>
          <CardContent className="p-8">
            <p className="text-slate-600 leading-relaxed mb-6">
              Tempo travellers are an excellent choice for group travel, especially for large groups of more than eight people. With spacious seating, ample leg space, sufficient aisle space, and a generous boot capacity, tempo travellers and minibuses are designed to enhance your travel experience. For instance, you can book a 12-seater tempo traveller with luxurious amenities for a small group or even consider hiring a 16-seater tempo to accommodate more members.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {idealFor.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-slate-600 leading-relaxed mt-6">
              Whether it's an outstation trip with family, a road trip with friends, picnic with loved ones to your favourite destination in the city, spiritual pilgrimage, or corporate events, the convenience and comfort of travelling together in a single vehicle is unparalleled. It not only ensures a stress-free journey but also creates a pleasant ambience where everyone can relax and enjoy each other's company. This is the experience that Indus Car Rental aims to provide with its tempo travellers and minibuses.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Key Features */}
      <section className="mx-auto max-w-7xl px-4 py-12 bg-gradient-to-b from-white to-purple-50">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8">
          WHY CHOOSE INDUS CAR RENTAL?
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="rounded-full bg-purple-50 w-12 h-12 flex items-center justify-center text-purple-600 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-slate-800">{feature.title}</h3>
                  <p className="text-slate-600">{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits List */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-6">
              Benefits of Choosing Our Services
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Services Offered */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8">
          OUR SERVICES
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-purple-700 flex items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  Local Hourly Rentals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  If you wish to explore a city and indulge in local sightseeing, go on a shopping spree, discover all the city's top shopping spots, or travel with family for weddings, get-togethers, and other functions, you can opt for local packages available for 8 hours and 12 hours. You can also book our minibuses and tempo travellers to attend corporate events, conferences, business meetings, and corporate outings with your colleagues and employees.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-purple-700 flex items-center gap-2">
                  <Bus className="h-6 w-6" />
                  Roundtrip Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  If you are planning outstation travels with your family, friends or colleagues, hire our cost-effective and economical roundtrip tempos or a minibus on rent. Apart from providing great comfort, it also costs less per person. Our roundtrip services ensure you have a comfortable journey both ways with no hassle.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="mx-auto max-w-7xl px-4 py-12 bg-purple-50 rounded-3xl">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-6">
          PREMIUM AMENITIES
        </h2>
        <p className="text-center text-slate-600 max-w-3xl mx-auto mb-8">
          Our tempo travellers and minibuses come equipped with premium amenities to ensure your journey is comfortable and enjoyable.
        </p>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "Plush Pushback Seats",
            "Air Conditioning",
            "LED TV & Music System",
            "Warm Lighting",
            "Ample Aisle Space",
            "First-Aid Kits",
            "Seat Belts for Safety",
            "Generous Boot Capacity"
          ].map((amenity, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 text-center shadow-sm">
              <CheckCircle className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">{amenity}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <Card className="bg-gradient-to-r from-purple-600 to-purple-800 text-white border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Book Your Group Travel?
            </h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Enjoy the best travel experience in our chauffeur-driven tempo travellers and minibuses. Focus on your journey while we handle the driving and navigation.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-white text-purple-700 hover:bg-purple-50 px-8 py-3 rounded-lg font-semibold transition"
            >
              Book Now
            </button>
          </CardContent>
        </Card>
      </section>

      <Footer onNavigate={navigate} />
    </div>
  );
}

// ---------- Components ----------
function TopBar({ onLogoClick }) {
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <button onClick={onLogoClick} className="flex items-center gap-2">
          <div className="bg-purple-600 text-white px-3 py-1 rounded-md font-bold tracking-wide">Indus Car Rental</div>
          <span className="hidden md:inline text-xs text-slate-500">India's top rated cab service</span>
        </button>
        <nav className="flex items-center gap-6 text-sm">
          <button onClick={onLogoClick} className="hover:text-purple-700">Home</button>
          <button onClick={() => navigate("/about")} className="hover:text-purple-700">About</button>
          <button onClick={() => navigate("/contact")} className="hover:text-purple-700">Contact</button>
        </nav>
      </div>
    </header>
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
          <div className="font-semibold">Services</div>
          <ul className="mt-2 space-y-1 text-sm text-purple-100/90">
            <li><button onClick={() => onNavigate("/tempo-traveller")} className="hover:text-white">Tempo Travellers & Minibuses</button></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Get in touch</div>
          <ul className="mt-2 space-y-1 text-sm text-purple-100/90">
            <li><button onClick={() => onNavigate("/contact")} className="hover:text-white">Contact</button></li>
            <li>Travel Agent</li>
            <li>Sitemap</li>
            <li>Report Vulnerability</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}