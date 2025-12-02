// Booking.js file with autocomplete feature 

import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { readQuery } from "../lib/query";
import { saveBookingToSheet } from "../lib/googleSheets";


function useAnimatedNumber(target, duration = 600) {
  const [value, setValue] = useState(target);
  const startValue = useRef(target);
  const startTime = useRef(null);

  useEffect(() => {
    const start = startValue.current;
    const diff = target - start;
    const step = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = start + diff * easeOutCubic(progress);
      setValue(Math.round(eased));
      if (progress < 1) requestAnimationFrame(step);
      else startValue.current = target;
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return value;
}
function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

/* -------------------------------------------------------
   Constants (stable between renders)
------------------------------------------------------- */
const INCLUSIONS = [
  "Base Fare and Fuel Charges",
  "Driver Allowance",
  "State Tax & Toll",
  "GST (5%)",
];
const EXCLUSIONS = [
  "Parking/Entry fees (if any)",
  "Pay ₹15/km after 30 km",
  "Waiting charges (if applicable)",
  "Multiple pickups/drops",
];
const TNC = [
  "Your Trip has a KM limit. If your usage exceeds this limit, you will be charged for the excess KM used.",
  "We promote cleaner fuel and thus your cab can be a CNG vehicle. The driver may need to fill CNG once or more during your trip. Please cooperate with the driver.",
  "The Airport Entry/Parking charge, if applicable is not included in the fare and will be charged extra.",
  "Your trip includes one pick up in Pick-up city and one drop to destination city. It does not include within city travel.",
  "If your Trip has Hill climbs, cab AC may be switched off during such climbs.",
];

/* -------------------------------------------------------
   Utilities
------------------------------------------------------- */
function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = ((h + 11) % 12) + 1;
  return `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
}
function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

/* -------------------------------------------------------
   Main Page
------------------------------------------------------- */
export default function Booking() {
  const { search } = useLocation();
  const q = useMemo(() => readQuery(search), [search]);

  // FIX: Use the correct base fare and taxes from query params
  const baseFare = Number(q.baseFare || 0);
  const taxAmount = Number(q.taxes || 0);
  const driverAllowance = Number(q.driverAllowance || 0);
  
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState("incl");

  // ADD THIS: Customer data state (lifted from StepContact)
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    pickup: "",
    drop: ""
  });

  const [selectedServices, setSelectedServices] = useState([]);
  // FIX: Initialize with correct total (base + driver allowance + taxes)
  const [totalFare, setTotalFare] = useState(baseFare + driverAllowance + taxAmount);
  const [toast, setToast] = useState(null);

  const routeTitle =
    q.tab === "local"
      ? q.localCity || "Local Trip"
      : q.tab === "airport"
      ? `${q.pickupAddress || "City"} ➜ ${q.airportName || "Airport"}`
      : `${q.from || "-"} ➜ ${q.to || "-"}`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="bg-purple-600 text-white px-3 py-1 rounded-md font-bold">
            Indus Car Rental
          </Link>
          <div className="flex items-center gap-2">
            <button className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-sm">
              Login
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="text-sm text-slate-500">Home &gt; Select Car &gt; Booking</div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-3">
          {/* LEFT: Steps */}
          <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm p-6">
            {step === 1 && (
              <StepContact 
                onNext={() => setStep(2)} 
                customerData={customerData}
                setCustomerData={setCustomerData}
              />
            )}
            {step === 2 && (
              <StepServices
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
                baseFare={baseFare}
                driverAllowance={driverAllowance}
                taxAmount={taxAmount}
                setTotalFare={setTotalFare}
                setSelectedServices={setSelectedServices}
                setToast={setToast}
              />
            )}
            {step === 3 && (
              <StepPayment
                onBack={() => setStep(2)}
                totalFare={totalFare}
                selectedServices={selectedServices}
                baseFare={baseFare}
                taxAmount={taxAmount}
                driverAllowance={driverAllowance}
                customerData={customerData}
                q={q}
              />
            )}
          </div>

          {/* RIGHT: Summary */}
          <RightSummary
            q={q}
            routeTitle={routeTitle}
            baseFare={baseFare}
            taxAmount={taxAmount}
            driverAllowance={driverAllowance}
            totalFare={totalFare}
            selectedServices={selectedServices}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            toast={toast}
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   Location Autocomplete Component
------------------------------------------------------- */
function LocationAutocomplete({ value, onChange, placeholder }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const autocompleteService = useRef(null);

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
    onChange(inputValue);

    if (!inputValue.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
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
          types: ["geocode", "establishment"],
        },
        (predictions, status) => {
          setLoading(false);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }
      );
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    onChange(suggestion.description);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        placeholder={placeholder}
        className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-600 outline-none"
      />

      {loading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full"></div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-purple-50 border-b last:border-b-0 transition-colors"
            >
              <div className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">📍</span>
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

/* -------------------------------------------------------
   Step 1: Contact Form
------------------------------------------------------- */
function StepContact({ onNext, customerData, setCustomerData }) {
  const handleSubmit = () => {
    if (!customerData.name || !customerData.email || !customerData.phone || 
        !customerData.pickup || !customerData.drop) {
      alert("Please fill all fields");
      return;
    }
    onNext();
  };

  return (
    <>
      <div className="text-center text-lg font-semibold mb-4">
        CONTACT & PICKUP DETAILS
      </div>

      <div className="space-y-5">
        <Field label="NAME">
          <input
            value={customerData.name}
            onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
            placeholder="Enter your name"
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-600 outline-none"
          />
        </Field>

        <Field label="EMAIL">
          <input
            type="email"
            value={customerData.email}
            onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
            placeholder="Enter your email"
            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-600 outline-none"
          />
        </Field>

        <Field label="MOBILE">
          <div className="flex gap-2">
            <select className="border rounded-md px-2 py-2">
              <option>India (+91)</option>
            </select>
            <input
              value={customerData.phone}
              onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
              placeholder="Enter phone number"
              className="flex-1 border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>
        </Field>

        <Field label="PICKUP">
          <LocationAutocomplete
            value={customerData.pickup}
            onChange={(val) => setCustomerData({...customerData, pickup: val})}
            placeholder="Search pickup location"
          />
        </Field>

        <Field label="DROP">
          <LocationAutocomplete
            value={customerData.drop}
            onChange={(val) => setCustomerData({...customerData, drop: val})}
            placeholder="Search drop location"
          />
        </Field>

        <button
          onClick={handleSubmit}
          className="w-full bg-[#9333ea] hover:bg-[#7e22ce] text-white font-semibold rounded-md py-3"
        >
          PROCEED
        </button>
      </div>
    </>
  );
}

/* -------------------------------------------------------
   Step 2: Special Services
------------------------------------------------------- */
function StepServices({ onBack, onNext, baseFare, driverAllowance, taxAmount, setTotalFare, setSelectedServices, setToast }) {
  const [selected, setSelected] = useState([]);
  const [langPref, setLangPref] = useState("english");

  const services = [
    {
      id: "newcar",
      title: "New Car Promise - Model that is 2022 or newer",
      price: 249,
      desc: "Experience the latest in comfort & reliability with our upgrade offer. Guarantee yourself a car model that is 2022 or newer.",
    },
    {
      id: "lang",
      title: "Chauffeurs who know your language",
      price: 199,
      desc: "Choose your preferred language & we'll assign a conversant driver for your comfort.",
      hasDropdown: true,
    },
    {
      id: "luggage",
      title: "Cab with Luggage Carrier",
      price: 149,
      desc: "Add a secure luggage carrier for extra comfort on your trip.",
    },
  ];

  const toggle = (id) => {
    setSelected((prev) => {
      let newSelected;
      const service = services.find((s) => s.id === id);

      if (prev.includes(id)) {
        newSelected = prev.filter((x) => x !== id);
        setToast({ type: "removed", price: service.price });
      } else {
        newSelected = [...prev, id];
        setToast({ type: "added", price: service.price });
      }

      const selectedDetails = services.filter((s) => newSelected.includes(s.id));
      const servicesTotal = selectedDetails.reduce((sum, s) => sum + s.price, 0);
      
      // FIX: Include driver allowance in total calculation
      setTotalFare(baseFare + driverAllowance + taxAmount + servicesTotal);
      setSelectedServices(selectedDetails);
      setTimeout(() => setToast(null), 1200);
      return newSelected;
    });
  };

  return (
    <>
      <div className="text-center text-lg font-semibold mb-4">SPECIAL SERVICES</div>
      <div className="space-y-4">
        {services.map((s) => (
          <div key={s.id} className="border rounded-lg p-4 transition-all">
            <div className="flex items-start justify-between">
              <label className="font-semibold text-slate-800 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  className="mr-2 accent-sky-600"
                  checked={selected.includes(s.id)}
                  onChange={() => toggle(s.id)}
                />
                {s.title}
              </label>
              <div className="text-slate-800 font-semibold">₹{s.price}</div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 mt-1">{s.desc}</p>

            {/* Language Dropdown (Only visible if 'lang' is selected) */}
            {s.hasDropdown && selected.includes("lang") && (
              <div className="mt-3 ml-6 border-t border-slate-200 pt-2 animate-fadeIn">
                <div className="text-sm text-slate-600 font-medium mb-1">
                  Please select the preferred language:
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="language"
                      value="english"
                      checked={langPref === "english"}
                      onChange={() => setLangPref("english")}
                    />
                    English
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="language"
                      value="hindi"
                      checked={langPref === "hindi"}
                      onChange={() => setLangPref("hindi")}
                    />
                    Hindi
                  </label>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm bg-slate-100 rounded hover:bg-slate-200"
        >
          ⟵ Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-[#9333ea] hover:bg-[#7e22ce] text-white rounded-md"
        >
          PROCEED
        </button>
      </div>
    </>
  );
}


/* -------------------------------------------------------
   Step 3: Payment
------------------------------------------------------- */
function StepPayment({ onBack, totalFare, selectedServices, baseFare, taxAmount, driverAllowance, customerData, q }) {
  const [payNow, setPayNow] = useState(25);
  const [gst, setGst] = useState(false);
  const [company, setCompany] = useState("");
  const [gstNo, setGstNo] = useState("");
  const animatedFare = useAnimatedNumber(totalFare);

  const opts = [
    { v: 0, label: `₹0 now\n₹${totalFare} later` },
    { v: 25, label: `25%\n₹${Math.round(totalFare * 0.25)} now` },
    { v: 50, label: `50%\n₹${Math.round(totalFare * 0.5)} now` },
    { v: 100, label: `100%\n₹${totalFare} now` },
  ];

  const onBook = async () => {
    try {
      // Generate booking ID
      const bookingId = `BK${Date.now()}`;
      
      // Prepare booking data for Google Sheets
      const bookingData = {
        // Row data in the order of your sheet columns
        bookingId: bookingId,
        timestamp: new Date().toLocaleString('en-IN'),
        
        // Customer Details
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
        pickupLocation: customerData.pickup,
        dropLocation: customerData.drop,
        
        // Trip Details
        tripType: q.tab || "oneway",
        fromCity: q.from || "",
        toCity: q.to || "",
        pickupDate: q.date || "",
        pickupTime: q.time || "",
        
        // Car Details
        carName: q.carName || "",
        carDistance: q.carKms || 0,
        
        // Pricing Details
        baseFare: baseFare,
        driverAllowance: driverAllowance,
        taxes: taxAmount,
        selectedServices: selectedServices.map(s => s.title).join(', ') || 'None',
        servicesTotal: selectedServices.reduce((sum, s) => sum + s.price, 0),
        totalFare: totalFare,
        
        // Payment Details
        paymentOption: payNow === 0 ? "Pay Later" : payNow === 25 ? "25%" : payNow === 50 ? "50%" : "100%",
        amountPaidNow: Math.round(totalFare * (payNow / 100)),
        amountPaidLater: totalFare - Math.round(totalFare * (payNow / 100)),
        
        // GST Details
        hasGST: gst ? "Yes" : "No",
        gstCompanyName: company || "-",
        gstNumber: gstNo || "-",
        
        // Status
        bookingStatus: "Confirmed",
        paymentStatus: payNow === 100 ? "Paid" : "Partial"
      };

      // Save to Google Sheets
      await saveBookingToSheet(bookingData);
      
      alert(`✅ Booking Confirmed!\n\nBooking ID: ${bookingId}\n\nYou will receive a confirmation email shortly.`);
      
      // Optionally redirect or reset form
      // window.location.href = '/';
      
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("❌ Failed to save booking. Please try again or contact support.");
    }
  };

  return (
    <>
      <div className="text-center text-lg font-semibold mb-4">PAYMENT DETAILS</div>

      <div className="border rounded-md p-4 mb-4 bg-purple-50">
        <div className="font-semibold text-slate-700 mb-2">Fare Breakdown</div>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>Base Fare</span>
            <span>₹{baseFare}</span>
          </div>
          {driverAllowance > 0 && (
            <div className="flex justify-between">
              <span>Driver Allowance</span>
              <span>₹{driverAllowance}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Taxes (GST)</span>
            <span>₹{taxAmount}</span>
          </div>
          {selectedServices.map((s) => (
            <div key={s.id} className="flex justify-between">
              <span>+ {s.title.split(" - ")[0]}</span>
              <span>₹{s.price}</span>
            </div>
          ))}
          <hr className="my-2 border-slate-300" />
          <div className="flex justify-between font-semibold text-purple-700">
            <span>Total Fare</span>
            <span>₹{animatedFare.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-2 mb-4">
        {opts.map((o) => (
          <button
            key={o.v}
            onClick={() => setPayNow(o.v)}
            className={`flex-1 border rounded-md py-3 text-center whitespace-pre ${
              payNow === o.v ? "bg-purple-600 text-white" : "bg-white text-slate-700"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="border rounded-md flex items-center justify-between px-3 py-2 text-sm">
        <input className="flex-1 outline-none" placeholder="Coupon Code" />
        <button className="text-purple-700 font-semibold">Apply</button>
      </div>

      <div className="mt-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={gst} onChange={() => setGst(!gst)} />
          I have a GST Number (Optional)
        </label>
        {gst && (
          <div className="mt-2 grid grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-slate-600">Company Name</div>
              <input value={company} onChange={(e) => setCompany(e.target.value)} className="w-full border rounded-md px-3 py-2" />
            </div>
            <div>
              <div className="text-sm text-slate-600">GST No.</div>
              <input value={gstNo} onChange={(e) => setGstNo(e.target.value)} className="w-full border rounded-md px-3 py-2" />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="px-4 py-2 text-sm bg-slate-100 rounded hover:bg-slate-200">⟵ Back</button>
        <button onClick={onBook} className="px-6 py-2 bg-[#9333ea] hover:bg-[#7e22ce] text-white rounded-md">BOOK NOW</button>
      </div>
    </>
  );
}

/* -------------------------------------------------------
   Right Panel Summary
------------------------------------------------------- */
function RightSummary({ q, routeTitle, baseFare, taxAmount, driverAllowance, totalFare, selectedServices, activeTab, setActiveTab, toast }) {
  const animatedFare = useAnimatedNumber(totalFare);

  return (
    <div className="bg-white rounded-xl border shadow-sm relative">
      <div className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-t-xl">
        YOUR BOOKING DETAILS
      </div>
      <div className="px-6 py-4 text-sm space-y-2">
        <Row label="Itinerary" value={routeTitle} />
        <Row label="Pickup Date" value={`${formatDate(q.date)} at ${formatTime(q.time)}`} />
        <Row label="Car Type" value={`${q.carName || "Car"} or Equivalent`} />
        <Row label="KMs Included" value={`${q.carKms || 30} km`} />
      </div>

      <div className="px-6 pb-4 text-sm text-slate-700 border-t">
        <div className="flex justify-between">
          <span>Base Fare</span>
          <span>₹{baseFare}</span>
        </div>
        {driverAllowance > 0 && (
          <div className="flex justify-between">
            <span>Driver Allowance</span>
            <span>₹{driverAllowance}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Taxes (GST)</span>
          <span>₹{taxAmount}</span>
        </div>

        {selectedServices.length > 0 && (
          <>
            <hr className="my-2 border-slate-200" />
            {selectedServices.map((s) => (
              <div key={s.id} className="flex justify-between text-slate-600">
                <span>+ {s.title.split(" - ")[0]}</span>
                <span>₹{s.price}</span>
              </div>
            ))}
          </>
        )}

        <hr className="my-2 border-slate-300" />
        <div className="relative flex justify-between font-semibold text-purple-700">
          <span>Total Fare</span>
          <span className="relative">
            ₹{animatedFare.toLocaleString("en-IN")}
            {toast && (
              <span
                className={`absolute right-0 -top-6 text-xs px-2 py-0.5 rounded-md ${
                  toast.type === "added"
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"
                } animate-fadeUp`}
              >
                {toast.type === "added" ? `+₹${toast.price}` : `–₹${toast.price}`}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t flex text-sm font-semibold">
        <TabButton id="incl" label="Inclusions" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton id="excl" label="Exclusions" activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton id="tnc" label="T&C" activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="px-6 py-4 text-sm">
        {activeTab === "incl" && <ul className="list-disc ml-5 space-y-1">{INCLUSIONS.map((x,i)=><li key={i}>{x}</li>)}</ul>}
        {activeTab === "excl" && <ul className="list-disc ml-5 space-y-1">{EXCLUSIONS.map((x,i)=><li key={i}>{x}</li>)}</ul>}
        {activeTab === "tnc" && <ul className="list-disc ml-5 space-y-1">{TNC.map((x,i)=><li key={i}>{x}</li>)}</ul>}
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   UI Helpers
------------------------------------------------------- */
function Field({ label, children }) {
  return (
    <div>
      <div className="text-sm font-semibold text-slate-600 mb-1">{label}</div>
      {children}
    </div>
  );
}
function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0">
      <div className="text-slate-500">{label} :</div>
      <div className="font-semibold text-right">{value}</div>
    </div>
  );
}
function TabButton({ id, label, activeTab, setActiveTab }) {
  const active = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-2 border-b ${
        active ? "text-purple-700 border-purple-700 bg-purple-50" : "text-slate-500"
      }`}
    >
      {label}
    </button>
  );
}