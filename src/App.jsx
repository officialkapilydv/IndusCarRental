import React from "react";
import { Routes, Route } from "react-router-dom";
import HomeSearch from "./pages/HomeSearch";
import SelectCars from "./pages/SelectCars";
import Booking from "./pages/Booking";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import TempoTraveller from "./pages/TempoTraveller";
import AdminPanel from "./pages/AdminPanel";
import Queries from './pages/Queries';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeSearch />} />
      <Route path="/select-cars" element={<SelectCars />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-conditions" element={<TermsAndConditions />} />
      <Route path="/tempo-traveller" element={<TempoTraveller />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/queries" element={<Queries />} />
    </Routes>
  );
}