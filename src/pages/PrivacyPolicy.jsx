import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, UserX } from "lucide-react";

// ---------- small UI atoms ----------
function Card({ className = "", children }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}
function CardContent({ children, className = "" }) { 
  return <div className={`px-4 pb-4 ${className}`}>{children}</div>; 
}

export default function PrivacyPolicy() {
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
            <Shield className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-3xl md:text-5xl font-extrabold">PRIVACY POLICY</h1>
            <p className="mt-4 text-lg text-purple-100 max-w-3xl mx-auto">
              Your privacy is important to us. Learn how we protect your information.
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
                <p className="text-slate-600 leading-relaxed mb-4">
                  This privacy policy sets out how Indus Car Rental uses and protects any information that you give Indus Car Rental when you use this website.
                </p>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Indus Car Rental is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this privacy statement.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Indus Car Rental may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are happy with any changes. This policy is effective from 31st July 2006.
                </p>
              </div>

              <hr className="border-slate-200" />

              {/* Information We Collect */}
              <div>
                <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                  <Eye className="h-6 w-6" />
                  Information We Collect
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  We may collect the following information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
                  <li>Name and job title</li>
                  <li>Contact information including email address</li>
                  <li>Demographic information such as postcode, preferences and interests</li>
                  <li>Other information relevant to customer surveys and/or offers</li>
                </ul>
                
                <p className="text-slate-600 leading-relaxed mt-4 mb-4">
                  In addition to any protected information or other information that you choose to submit to us, we collect certain information whenever you visit or interact with the services ("usage information"). This usage information may include the browser that you are using, the URL that referred you to our services, all of the areas within our services that you visit, and the time of day, among other information. In addition, we collect your device identifier for your device. A device identifier is a number that is automatically assigned to your device used to access the services, and our computers identify your device by its device identifier. In case of booking via call center, Indus Car Rental may record calls for quality and training purposes.
                </p>

                <p className="text-slate-600 leading-relaxed mb-4">
                  In addition, tracking information is collected as you navigate through our services, including, but not limited to geographic areas. The driver's mobile phone will send your GPS coordinates, during the ride, to our servers. Most GPS enabled mobile devices can define one's location to within 50 feet. When you use any of our mobile applications, the mobile application may automatically collect and store some or all of the following information from your mobile device ("mobile device information"), in addition to the device information, including without limitation:
                </p>

                <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
                  <li>Your preferred language and country site (if applicable)</li>
                  <li>The manufacturer and model of your mobile device</li>
                  <li>Your mobile operating system</li>
                  <li>The type of mobile internet browsers you are using</li>
                  <li>Your geolocation</li>
                  <li>Information about how you interact with the mobile application and any of our web sites to which the mobile application links</li>
                  <li>Information to allow us to personalize the services and content available through the mobile application</li>
                  <li>Data from SMS/text messages upon receiving device permissions for the purposes of (i) issuing and receiving one time passwords and other device verification, and (ii) automatically filling verification details during financial transactions</li>
                </ul>

                <p className="text-slate-600 leading-relaxed mt-4">
                  We require this information to understand your needs and provide you with a better service, and in particular for several reasons including the following but not limited to:
                </p>

                <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4 mt-4">
                  <li>Internal record keeping</li>
                  <li>We may use the information to improve our products and services</li>
                  <li>We may periodically send promotional emails, WhatsApp messages, SMS, and RCS communication about new products, special offers or other information which we think you may find interesting</li>
                  <li>From time to time, we may also use your information to contact you for market research purposes</li>
                  <li>We may use the information to customize the website according to your interests</li>
                </ul>
              </div>

              <hr className="border-slate-200" />

              {/* Security */}
              <div>
                <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                  <Lock className="h-6 w-6" />
                  Security
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure we have put in place suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online.
                </p>
              </div>

              <hr className="border-slate-200" />

              {/* How We Use Cookies */}
              <div>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">How We Use Cookies</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  A cookie is a small file which asks permission to be placed on your computer's hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.
                </p>
                <p className="text-slate-600 leading-relaxed mb-4">
                  We use traffic log cookies to identify which pages are being used. This helps us analyze data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.
                </p>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.
                </p>
              </div>

              <hr className="border-slate-200" />

              {/* Links to Other Websites */}
              <div>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">Links to Other Websites</h2>
                <p className="text-slate-600 leading-relaxed">
                  Our website may contain links to other websites of interest. However, once you have used these links to leave our site, you should note that we do not have any control over that other website. Therefore, we cannot be responsible for the protection and privacy of any information which you provide whilst visiting such sites and such sites are not governed by this privacy statement. You should exercise caution and look at the privacy statement applicable to the website in question.
                </p>
              </div>

              <hr className="border-slate-200" />

              {/* Data Sharing */}
              <div>
                <h2 className="text-2xl font-bold text-purple-700 mb-4">Data Sharing</h2>
                <p className="text-slate-600 leading-relaxed">
                  We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.
                </p>
              </div>

              <hr className="border-slate-200" />

              {/* Account Deletion */}
              <div>
                <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                  <UserX className="h-6 w-6" />
                  Account Deletion
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Account deletion can be done through Indus Car Rental App. Please follow the following steps:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-slate-600 ml-4 mb-4">
                  <li>Go to Profile Section (Top right corner) and click on Edit Account</li>
                  <li>Click on Delete Account Tab</li>
                  <li>Answer 3 simple feedback questions</li>
                </ol>
                <p className="text-slate-600 leading-relaxed mb-2">
                  After deletion, the user account will be completely removed from Indus Car Rental's database including user details and booking history.
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
                  <li>There will be no communications from Indus Car Rental to the deleted users with regards to any offers or marketing campaigns</li>
                  <li>In case the user creates another account with the same credentials, the old booking data won't be available since this account will be considered as a fresh sign-up</li>
                </ul>
              </div>

              <hr className="border-slate-200" />

              {/* Contact */}
              <div className="bg-purple-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-purple-700 mb-4">Contacting Us</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  If there are any questions regarding this privacy policy you may contact us using the information on the Contact Us page.
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
                  Last Updated: July 31, 2006 | © {new Date().getFullYear()} Indus Car Rental. All rights reserved.
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