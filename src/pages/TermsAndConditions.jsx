import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Scale, Shield, RefreshCw, DollarSign, AlertCircle } from "lucide-react";

// ---------- small UI atoms ----------
function Card({ className = "", children }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}
function CardContent({ children, className = "" }) { 
  return <div className={`px-4 pb-4 ${className}`}>{children}</div>; 
}

export default function TermsAndConditions() {
  const navigate = useNavigate();

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
            <Scale className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-3xl md:text-5xl font-extrabold">TERMS AND CONDITIONS</h1>
            <p className="mt-4 text-lg text-purple-100 max-w-3xl mx-auto">
              Please read these terms carefully before using our services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card>
            <CardContent className="p-8 space-y-8">
              {/* Introduction */}
              <div>
                <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Introduction
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  Welcome to our website. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern Indus Car Rental's relationship with you in relation to this website. If you disagree with any part of these terms and conditions, please do not use our website.
                </p>
              </div>

              <hr className="border-slate-200" />

              {/* Ownership */}
              <div>
                <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                  <Shield className="h-6 w-6" />
                  Ownership
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  The term 'Indus Car Rental' or 'us' or 'we' refers to Indus Car Rentals Private Limited whose registered office is located in India. The term 'you' refers to the user or viewer of our website.
                </p>
              </div>

              <hr className="border-slate-200" />

              {/* Terms of Use */}
              <div>
                <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-6 w-6" />
                  Terms of Use
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  The use of this website is subject to the following terms of use:
                </p>
                
                <div className="space-y-4">
                  <div className="pl-4 border-l-4 border-purple-200">
                    <p className="text-slate-700 font-semibold mb-2">1. Content Usage</p>
                    <p className="text-slate-600 leading-relaxed">
                      The content of the pages of this website is for your general information and use only. It is subject to change without notice.
                    </p>
                  </div>

                  <div className="pl-4 border-l-4 border-purple-200">
                    <p className="text-slate-700 font-semibold mb-2">2. Cookies</p>
                    <p className="text-slate-600 leading-relaxed">
                      This website uses cookies to monitor browsing preferences. If you do allow cookies to be used, the following personal information may be stored by us for use by third parties: IP Address, Location.
                    </p>
                  </div>

                  <div className="pl-4 border-l-4 border-purple-200">
                    <p className="text-slate-700 font-semibold mb-2">3. Warranty Disclaimer</p>
                    <p className="text-slate-600 leading-relaxed">
                      Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
                    </p>
                  </div>

                  <div className="pl-4 border-l-4 border-purple-200">
                    <p className="text-slate-700 font-semibold mb-2">4. User Responsibility</p>
                    <p className="text-slate-600 leading-relaxed">
                      Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through this website meet your specific requirements.
                    </p>
                  </div>

                  <div className="pl-4 border-l-4 border-purple-200">
                    <p className="text-slate-700 font-semibold mb-2">5. Intellectual Property</p>
                    <p className="text-slate-600 leading-relaxed">
                      This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
                    </p>
                  </div>

                  <div className="pl-4 border-l-4 border-purple-200">
                    <p className="text-slate-700 font-semibold mb-2">6. Trademarks</p>
                    <p className="text-slate-600 leading-relaxed">
                      All trademarks reproduced in this website which are not the property of, or licensed to, the operator are acknowledged on the website.
                    </p>
                  </div>

                  <div className="pl-4 border-l-4 border-purple-200">
                    <p className="text-slate-700 font-semibold mb-2">7. Unauthorized Use</p>
                    <p className="text-slate-600 leading-relaxed">
                      Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offence.
                    </p>
                  </div>

                  <div className="pl-4 border-l-4 border-purple-200">
                    <p className="text-slate-700 font-semibold mb-2">8. External Links</p>
                    <p className="text-slate-600 leading-relaxed">
                      From time to time this website may also include links to other websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s). We have no responsibility for the content of the linked website(s).
                    </p>
                  </div>

                  <div className="pl-4 border-l-4 border-purple-200">
                    <p className="text-slate-700 font-semibold mb-2">9. Governing Law</p>
                    <p className="text-slate-600 leading-relaxed">
                      Your use of this website and any dispute arising out of such use of the website is subject to the laws of India.
                    </p>
                  </div>

                  <div className="pl-4 border-l-4 border-purple-200">
                    <p className="text-slate-700 font-semibold mb-2">10. Special Offers</p>
                    <p className="text-slate-600 leading-relaxed">
                      Specific offers will have might have additional Terms & Conditions which the user has to comply with in case he chooses to avail that offer.
                    </p>
                  </div>
                </div>
              </div>

              <hr className="border-slate-200" />

              {/* Cancellation and Returns */}
              <div>
                <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                  <RefreshCw className="h-6 w-6" />
                  Cancellation and Returns
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  You may cancel the booking up to 1 hour before the journey without any cancellation charges for all services. However, last-minute cancellations might cause a loss to the driver. Therefore, we recommend canceling as soon as you have learned of the change in your travel plans.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  You can cancel your booking online or through Indus Car Rental App.
                </p>
              </div>

              <hr className="border-slate-200" />

              {/* Refunds */}
              <div>
                <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  Refunds
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  If you are eligible for refunds based on the "Cancellation and Returns" policy above, then the refund will be remitted back to you in 5-7 working days.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  In case of any issues, write to us at info@induscarrental.com or call us at 90 4545 0000.
                </p>
                <p className="text-slate-600 leading-relaxed mt-4">
                  In case you have upgraded to our special services like car with luggage carrier or Driver preferred language, additional terms and conditions may apply.
                </p>
              </div>

              <hr className="border-slate-200" />

              {/* Contact */}
              <div className="bg-purple-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-purple-700 mb-4">Questions?</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  If you have any questions regarding these terms and conditions, please feel free to contact us.
                </p>
                <button
                  onClick={() => navigate("/contact")}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  Contact Us
                </button>
              </div>

              {/* Last Updated */}
              <div className="text-center pt-4">
                <p className="text-sm text-slate-500">
                  © {new Date().getFullYear()} Indus Car Rental. All rights reserved.
                </p>
              </div>
            </CardContent>
          </Card>
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