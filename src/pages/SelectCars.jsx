import React, { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { readQuery, buildQuery } from "../lib/query";
import { getCarsWithPricing } from "../lib/distanceService";

export default function SelectCars() {
  const { search } = useLocation();
  const q = useMemo(() => readQuery(search), [search]);
  const nav = useNavigate();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distanceInfo, setDistanceInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCarsWithPricing() {
      try {
        setLoading(true);
        setError(null);

        let from = q.from;
        let to = q.to;

        // Handle different trip types
        if (q.tab === "local") {
          from = q.localCity;
          to = q.localCity;
        } else if (q.tab === "airport") {
          from = q.pickupAddress || "Gurugram";
          to = q.airportName || "Delhi Airport";
        }

        if (!from || !to) {
          setError("Please select pickup and drop locations");
          setLoading(false);
          return;
        }

        // Get cars with dynamic pricing
        const result = await getCarsWithPricing(from, to, q.tab || "oneway");
        
        setCars(result.cars);
        setDistanceInfo({
          distance: result.distance,
          duration: result.duration,
          estimated: result.estimated
        });
      } catch (err) {
        console.error("Error loading cars:", err);
        setError("Unable to calculate pricing. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadCarsWithPricing();
  }, [q.from, q.to, q.tab, q.localCity, q.pickupAddress, q.airportName]);

  function goToBooking(car) {
    const params = {
      ...q,
      carId: car.id,
      carName: car.name,
      carPrice: car.price,
      carKms: car.distance,
      baseFare: car.baseFare,
      taxes: car.taxes,
      distance: car.distance,
      driverAllowance: car.driverAllowance,
    };
    nav(`/booking?${buildQuery(params)}`);
  }

  const titleRoute = (() => {
    if (q.tab === "local") return q.localCity || "Local Trip";
    if (q.tab === "airport") return `${q.pickupAddress || "City"} ➜ ${q.airportName || "Airport"}`;
    return `${q.from || "From"} - ${q.to || "To"}`;
  })();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Topbar */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="bg-purple-600 text-white px-3 py-1 rounded-md font-bold">
            Indus Car Rental
          </Link>
          <div className="flex items-center gap-2">
            <button className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-sm">Login</button>
          </div>
        </div>
      </div>

      {/* breadcrumb + route title */}
      <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-slate-500">Home &gt; Select Car</div>
      <div className="mx-auto max-w-7xl px-4 text-xl font-semibold">{titleRoute}</div>

      {/* summary strip */}
      <div className="mx-auto max-w-7xl px-4 mt-3">
        <div className="bg-purple-50 border rounded-xl p-4 flex items-center justify-between">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <div className="text-slate-500">Trip Type</div>
              <div className="font-semibold capitalize">{q.tab || "oneway"}</div>
            </div>
            <div>
              <div className="text-slate-500">Pick up</div>
              <div className="font-semibold">{q.date || "-"}</div>
            </div>
            <div>
              <div className="text-slate-500">Time</div>
              <div className="font-semibold">{formatTime(q.time) || "-"}</div>
            </div>
            {distanceInfo && (
              <div>
                <div className="text-slate-500">Distance</div>
                <div className="font-semibold">
                  {distanceInfo.distance} km
                  {distanceInfo.estimated && <span className="text-xs text-slate-400"> (est.)</span>}
                </div>
              </div>
            )}
          </div>
          <Link
            to={{ pathname: "/", search }}
            className="text-purple-700 text-sm font-semibold bg-white border rounded-full px-3 py-1 hover:bg-purple-100"
          >
            Modify
          </Link>
        </div>
      </div>

      {/* banner */}
      <div className="mx-auto max-w-7xl px-4 mt-4">
        <div className="bg-purple-600 text-white rounded-md px-6 py-3 text-sm grid sm:grid-cols-3 gap-3">
          <div>💰 Transparent Pricing</div>
          <div>🛟 Free Cancellations Up to 1 Hour</div>
          <div>📞 24x7 Customer Support</div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="mx-auto max-w-7xl px-4 my-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-slate-600">Calculating best prices for you...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mx-auto max-w-7xl px-4 my-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-semibold">{error}</p>
            <Link to="/" className="mt-4 inline-block text-purple-600 hover:underline">
              Go back to search
            </Link>
          </div>
        </div>
      )}

      {/* car list */}
      {!loading && !error && cars.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 my-6 space-y-5">
          {cars.map((car) => (
            <div key={car.id} className="bg-white border rounded-xl shadow-sm hover:shadow-md transition">
              <div className="flex flex-col md:flex-row gap-4 p-4">
                <img
                  src={car.img}
                  alt={car.name}
                  className="w-44 h-28 object-cover rounded-md self-center md:self-start"
                />
                <div className="flex-1">
                  <div className="text-lg font-bold">
                    {car.name}{" "}
                    <span className="ml-1 text-xs bg-slate-100 px-1.5 py-0.5 rounded">4.5 ★</span>
                  </div>
                  <div className="text-xs text-slate-500">{car.subtitle}</div>
                  <ul className="mt-2 text-sm text-slate-700 space-y-1">
                    {car.perks.map((p, i) => (
                      <li key={i}>
                        {p.icon} {p.text}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Fare Breakdown Preview */}
                  <div className="mt-3 text-xs text-slate-500 bg-slate-50 rounded p-2">
                    <div className="flex justify-between">
                      <span>Base Fare:</span>
                      <span>₹{car.baseFare}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Driver Allowance:</span>
                      <span>₹{car.driverAllowance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes (GST):</span>
                      <span>₹{car.taxes}</span>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-48 text-right md:text-left">
                  <div className="text-emerald-600 text-xs font-semibold mb-1">
                    📍 {car.distance} km trip
                  </div>
                  <div className="text-3xl font-extrabold text-purple-700 leading-tight">
                    ₹{car.price.toLocaleString("en-IN")}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">All inclusive</div>

                  <button
                    className="mt-3 bg-[#9333ea] hover:bg-[#7e22ce] text-white font-semibold px-4 py-2 rounded-md w-full transition"
                    onClick={() => goToBooking(car)}
                  >
                    SELECT CAR
                  </button>
                </div>
              </div>

              <div className="text-purple-800 bg-purple-50 border-t px-4 py-2 text-xs rounded-b-xl">
                ✓ Distance-based pricing | ✓ No hidden charges | ✓ Transparent billing
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pricing Disclaimer */}
      {!loading && !error && (
        <div className="mx-auto max-w-7xl px-4 my-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            <p className="font-semibold mb-2">📌 Important Notes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>State/RTO tax and toll charges will be charged extra</li>
              <li>Minimum 250 km per day charged for outstation trips</li>
              <li>Cancellation charges: ₹1000 if cancelled after booking</li>
              <li>Prices subject to change based on actual route and traffic conditions</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = ((h + 11) % 12) + 1;
  return `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
}