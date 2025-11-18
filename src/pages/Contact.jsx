import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, User, MessageSquare } from "lucide-react";

// ---------- small UI atoms ----------
function Card({ className = "", children }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}
function CardContent({ children, className = "" }) { 
  return <div className={`px-4 pb-4 ${className}`}>{children}</div>; 
}

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    alert("Thank you for contacting us! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
            GET IN TOUCH
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mt-4 text-lg text-purple-100 max-w-3xl mx-auto"
          >
            We're here to help with all your travel needs
          </motion.p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-purple-700 mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              {/* Phone Numbers */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-purple-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-3">Phone Numbers</h3>
                      <div className="space-y-2">
                        <a href="tel:9717618797" className="block text-purple-600 hover:text-purple-800 font-medium">
                          9717618797
                        </a>
                        <a href="tel:9355361005" className="block text-purple-600 hover:text-purple-800 font-medium">
                          9355361005
                        </a>
                        <a href="tel:01244200022" className="block text-purple-600 hover:text-purple-800 font-medium">
                          0124-4200022
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-purple-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-3">Email</h3>
                      <a href="mailto:induscarrental@gmail.com" className="text-purple-600 hover:text-purple-800 font-medium break-all">
                        induscarrental@gmail.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-purple-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-3">Office Address</h3>
                      <p className="text-slate-600 leading-relaxed">
                        Radha Palace, 126<br />
                        Gurudwara Road, Civil Lines<br />
                        Gurugram, Haryana - 122001
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-purple-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-3">Business Hours</h3>
                      <p className="text-slate-600">
                        24/7 Available<br />
                        <span className="text-sm text-slate-500">Round-the-clock service</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-purple-700 mb-6">Send Us a Message</h2>
            
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <User className="inline h-4 w-4 mr-1" />
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <MessageSquare className="inline h-4 w-4 mr-1" />
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Send className="h-5 w-5" />
                    Send Message
                  </button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">Find Us Here</h2>
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video rounded-2xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.8842436476886!2d77.02664207548195!3d28.458245475762545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19eaf2a5a6d9%3A0x965c47990528b205!2sIndus%20Car%20Rental!5e0!3m2!1sen!2sin!4v1731070000000!5m2!1sen!2sin"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Indus Car Rental Location"
                />
              </div>
            </CardContent>
          </Card>
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
            Don't wait! Book your cab now and experience premium travel with Gurgaon's most trusted taxi service.
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