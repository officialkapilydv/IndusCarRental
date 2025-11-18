import React, { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { readQuery, buildQuery } from "../lib/query";

const cars = [
  {
    id: "wagonr",
    name: "Wagon R",
    subtitle: "or equivalent | 4 seater AC Cab",
    img: "https://www.savaari.com/assets/img/cars/indica.png",
    perks: [
      { icon: "👨‍✈️", text: "Driver allowance included" },
      { icon: "🧭", text: "30 kms included | Post limit: ₹15.75/km" },
    ],
    price: 532,
    strike: 590,
    discount: "10% OFF",
    extra: "+ ₹312 Charges and Taxes",
    ribbons: ["New Car Promise - Model that is 2022 or newer @ ₹249"],
  },
  {
    id: "etios",
    name: "Toyota Etios",
    subtitle: "or equivalent | 4 seater AC Cab",
    img: "https://www.savaari.com/assets/img/cars/toyota_etios.png",
    perks: [
      { icon: "👨‍✈️", text: "Driver allowance included" },
      { icon: "🧭", text: "30 kms included | Post limit: ₹15.75/km" },
    ],
    price: 548,
    strike: 608,
    discount: "10% OFF",
    extra: "+ ₹313 Charges and Taxes",
    ribbons: ["New Car Promise - Model that is 2022 or newer @ ₹249", "Cab with Luggage Carrier @ ₹249"],
  },
  {
    id: "ertiga",
    name: "Ertiga",
    subtitle: "or equivalent | 6 seater AC Cab",
    img: "https://www.savaari.com/assets/img/cars/ertiga.png",
    perks: [
      { icon: "👨‍✈️", text: "Driver allowance included" },
      { icon: "🧭", text: "30 kms included | Post limit: ₹17.5/km" },
    ],
    price: 1028,
    strike: 1125,
    discount: "9% OFF",
    extra: "+ ₹343 Charges and Taxes",
    ribbons: ["New Car Promise - Model that is 2022 or newer @ ₹799"],
  },
];

export default function SelectCars() {
  const { search } = useLocation();
  const q = useMemo(() => readQuery(search), [search]);

  const nav = useNavigate();                                // ⬅️ init navigator

  // when user clicks "SELECT CAR"
  function goToBooking(car) {                               // ⬅️ handler
    const params = {
      ...q,                          // all current search params from the Select Cars page
      carId: car.id,
      carName: car.name,
      carPrice: car.price,
      carKms: 30,                    // mock included kms; adjust if you have real data
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
          <div className="grid grid-cols-3 gap-6 text-sm">
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
          </div>
          <Link
            to={{ pathname: "/", search }}
            className="text-purple-700 text-sm font-semibold bg-white border rounded-full px-3 py-1 hover:bg-purple-100"
          >
            Modify Booking
          </Link>
        </div>
      </div>

      {/* banner */}
      <div className="mx-auto max-w-7xl px-4 mt-4">
        <div className="bg-purple-600 text-white rounded-md px-6 py-3 text-sm grid sm:grid-cols-3 gap-3">
          <div>₹ Book Now at Zero Cost</div>
          <div>🛟 Free Cancellations Upto 1 Hour</div>
          <div>📞 24x7 Customer Support</div>
        </div>
      </div>

      {/* car list */}
      <div className="mx-auto max-w-7xl px-4 my-6 space-y-5">
        {cars.map((car) => (
          <div key={car.id} className="bg-white border rounded-xl shadow-sm">
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
                <div className="mt-2">
                  <button className="text-purple-700 text-sm">Inclusions and Exclusions ▾</button>
                </div>
              </div>

              <div className="w-full md:w-48 text-right md:text-left">
                <div className="text-emerald-600 text-xs font-semibold">
                  {car.discount} <span className="line-through text-slate-400">₹{car.strike}</span>
                </div>
                <div className="text-3xl font-extrabold text-purple-700 leading-tight">
                  ₹{car.price.toLocaleString("en-IN")}
                </div>
                <div className="text-xs text-slate-500">{car.extra}</div>

                {/* ⬇️ navigate to /booking with all params + car details */}
                <button
                  className="mt-3 bg-[#9333ea] hover:bg-[#7e22ce] text-white font-semibold px-4 py-2 rounded-md w-full"
                  onClick={() => goToBooking(car)}
                >
                  SELECT CAR
                </button>
              </div>
            </div>

            {car.ribbons?.map((r, i) => (
              <div key={i} className="text-purple-800 bg-purple-50 border-t px-4 py-2 text-xs rounded-b-xl">
                {r}
              </div>
            ))}
          </div>
        ))}
      </div>
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
