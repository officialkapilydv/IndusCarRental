// distanceService.js - Distance calculation with Google Maps JavaScript API

// Rate card based on your image
const RATE_CARD = {
  wagonr: {
    id: "wagonr",
    name: "Swift Dzire/Wagon R",
    fullDay: { base: 1600, hours: 8, kms: 80 },
    extraHour: 150,
    extraKm: 13,
    outstationPerKm: 13,
    driverAllowance: 300,
    img: "https://www.savaari.com/assets/img/cars/indica.png"
  },
  etios: {
    id: "etios",
    name: "Toyota Etios",
    fullDay: { base: 1600, hours: 8, kms: 80 },
    extraHour: 150,
    extraKm: 14,
    outstationPerKm: 13,
    driverAllowance: 300,
    img: "https://www.savaari.com/assets/img/cars/toyota_etios.png"
  },
  crysta: {
    id: "crysta",
    name: "Innova Crysta",
    fullDay: { base: 2700, hours: 8, kms: 80 },
    extraHour: 200,
    extraKm: 20,
    outstationPerKm: 20,
    driverAllowance: 400,
    img: "https://www.savaari.com/assets/img/cars/innova.png"
  },
  hycross: {
    id: "hycross",
    name: "Innova Hycross",
    fullDay: { base: 3000, hours: 8, kms: 80 },
    extraHour: 300,
    extraKm: 25,
    outstationPerKm: 22,
    driverAllowance: 400,
    img: "https://www.savaari.com/assets/img/cars/crysta.png"
  },
  traveller: {
    id: "traveller",
    name: "Traveller 12 Seater",
    fullDay: { base: 6000, hours: 8, kms: 80 },
    extraHour: 200,
    extraKm: 28,
    outstationPerKm: 28,
    driverAllowance: 400,
    img: "https://www.savaari.com/assets/img/cars/tempo_traveller.png"
  },
  urbania: {
    id: "urbania",
    name: "Force Urbania",
    fullDay: { base: 8000, hours: 8, kms: 80 },
    extraHour: 700,
    extraKm: 35,
    outstationPerKm: 35,
    driverAllowance: 400,
    img: "https://www.savaari.com/assets/img/cars/tempo_traveller.png"
  }
};

// Comprehensive distance database for major Indian cities (FALLBACK)
const CITY_DISTANCES = {
  "gurugram-delhi": 310, "gurugram-noida": 45, "gurugram-jaipur": 250,
  "gurugram-agra": 240, "gurugram-chandigarh": 250, "gurugram-mumbai": 1420,
  "gurugram-pune": 1460, "gurugram-bengaluru": 2150, "gurugram-bangalore": 2150,
  "gurugram-hyderabad": 1580, "gurugram-kolkata": 1500, "gurugram-ahmedabad": 950,
  "gurugram-lucknow": 550, "gurugram-indore": 750, "gurugram-dehradun": 250,
  "gurugram-haridwar": 220, "gurugram-rishikesh": 240, "gurugram-shimla": 350,
  "gurugram-manali": 520, "gurugram-amritsar": 450,
  
  "delhi-noida": 25, "delhi-gurugram": 30, "delhi-gurgaon": 30,
  "delhi-jaipur": 280, "delhi-agra": 230, "delhi-chandigarh": 250,
  "delhi-mumbai": 1400, "delhi-pune": 1450, "delhi-bengaluru": 2150,
  "delhi-bangalore": 2150, "delhi-hyderabad": 1570, "delhi-kolkata": 1480,
  
  "mumbai-pune": 150, "mumbai-nashik": 165, "mumbai-goa": 580,
  "mumbai-ahmedabad": 530, "mumbai-surat": 280, "mumbai-bangalore": 980,
  "mumbai-bengaluru": 980, "mumbai-hyderabad": 710, "mumbai-delhi": 1400,
  
  "bangalore-mysore": 145, "bengaluru-mysore": 145, "bangalore-chennai": 350,
  "bengaluru-chennai": 350, "bangalore-hyderabad": 570, "bengaluru-hyderabad": 570,
  
  "jaipur-delhi": 280, "jaipur-gurugram": 250, "jaipur-agra": 240,
  "jaipur-udaipur": 400, "jaipur-jodhpur": 335, "jaipur-ajmer": 135,
  
  "pune-mumbai": 150, "pune-nashik": 210, "pune-goa": 450,
  "pune-bangalore": 840, "pune-bengaluru": 840, "pune-hyderabad": 560,
};

/**
 * Normalize city name for comparison
 */
function normalizeCity(city) {
  return city.toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/gurgaon/g, 'gurugram')
    .replace(/bangalore/g, 'bengaluru');
}

/**
 * Get distance from database (fallback)
 */
function getDistanceFromDatabase(from, to) {
  const fromNorm = normalizeCity(from);
  const toNorm = normalizeCity(to);
  
  const key1 = `${fromNorm}-${toNorm}`;
  const key2 = `${toNorm}-${fromNorm}`;
  
  return CITY_DISTANCES[key1] || CITY_DISTANCES[key2] || null;
}

/**
 * Get API key - works with Vite
 */
function getApiKey() {
  // Vite uses import.meta.env
  if (import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  }
  
  // Fallback for window object (for inline config)
  if (window.GOOGLE_MAPS_API_KEY) {
    return window.GOOGLE_MAPS_API_KEY;
  }
  
  console.error("❌ Google Maps API key not found!");
  console.error("Make sure you have VITE_GOOGLE_MAPS_API_KEY in your .env file");
  return null;
}

/**
 * Load Google Maps API script dynamically
 */
function loadGoogleMapsScript() {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google && window.google.maps) {
      resolve(window.google);
      return;
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Wait for it to load
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkInterval);
          resolve(window.google);
        }
      }, 100);
      return;
    }

    const apiKey = getApiKey();
    
    if (!apiKey) {
      reject(new Error("Google Maps API key not found. Please add REACT_APP_GOOGLE_MAPS_API_KEY to your .env file"));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (window.google && window.google.maps) {
        resolve(window.google);
      } else {
        reject(new Error("Google Maps failed to load"));
      }
    };
    
    script.onerror = () => reject(new Error("Failed to load Google Maps script"));
    
    document.head.appendChild(script);
  });
}

/**
 * Calculate distance using Google Maps Distance Matrix Service (JavaScript API)
 */
async function calculateDistanceWithGoogleMaps(from, to) {
  const apiKey = getApiKey();
  console.log("🔍 Attempting Google Maps API call...");
  console.log("API Key exists:", !!apiKey);
  console.log("API Key preview:", apiKey ? apiKey.substring(0, 15) + "..." : "NOT FOUND");
  
  try {
    // Load Google Maps API
    console.log("Loading Google Maps script...");
    await loadGoogleMapsScript();
    console.log("✅ Google Maps script loaded successfully");
    
    return new Promise((resolve, reject) => {
      const service = new window.google.maps.DistanceMatrixService();
      console.log("📡 Making Distance Matrix API request...");
      console.log("From:", from, "To:", to);
      
      service.getDistanceMatrix(
        {
          origins: [`${from}, India`],
          destinations: [`${to}, India`],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          console.log("📥 API Response Status:", status);
          console.log("Full Response:", response);
          
          if (status === 'OK') {
            const result = response.rows[0].elements[0];
            console.log("Element Status:", result.status);
            
            if (result.status === 'OK') {
              const distanceKm = Math.round(result.distance.value / 1000);
              const durationMinutes = Math.round(result.duration.value / 60);
              
              console.log(`✅ SUCCESS! Google Maps API: ${from} → ${to} = ${distanceKm} km`);
              
              resolve({
                distance: distanceKm,
                duration: durationMinutes,
                distanceText: result.distance.text,
                durationText: result.duration.text
              });
            } else {
              console.error(`❌ Route element status: ${result.status}`);
              reject(new Error(`Route element status: ${result.status}`));
            }
          } else if (status === 'REQUEST_DENIED') {
            console.error("❌ REQUEST_DENIED - Check API key and restrictions");
            console.error("Response:", response);
            reject(new Error(`REQUEST_DENIED: ${response.errorMessage || 'Check API key'}`));
          } else {
            console.error(`❌ Google Maps API Error: ${status}`);
            console.error("Response:", response);
            reject(new Error(`API returned status: ${status}`));
          }
        }
      );
    });
  } catch (error) {
    console.error("❌ Error initializing Google Maps:", error);
    console.error("Error details:", error.message);
    throw error; // Re-throw to be caught in calculateDistance
  }
}

/**
 * Main function: Calculate distance between two cities
 * Priority: 1. Google Maps API, 2. Local Database, 3. Conservative estimate
 */
export async function calculateDistance(from, to) {
  console.log(`Calculating distance: ${from} → ${to}`);
  
  try {
    // 1. Try Google Maps API first (most accurate)
    const googleResult = await calculateDistanceWithGoogleMaps(from, to);
    if (googleResult) {
      return {
        ...googleResult,
        from: from,
        to: to,
        source: "google_maps"
      };
    }
  } catch (error) {
    console.warn("Google Maps API unavailable, using fallback:", error.message);
  }

  // 2. Fallback to local database
  const dbDistance = getDistanceFromDatabase(from, to);
  if (dbDistance) {
    console.log(`✅ Database: ${dbDistance} km`);
    return {
      distance: dbDistance,
      duration: Math.round(dbDistance / 60 * 60),
      from: from,
      to: to,
      source: "database",
      estimated: true
    };
  }

  // 3. Final fallback - conservative estimate
  console.warn(`⚠️ No data found for ${from} → ${to}. Using estimate.`);
  return {
    distance: 500,
    duration: 480,
    from: from,
    to: to,
    source: "fallback",
    estimated: true,
    warning: "Distance estimate - please verify"
  };
}

/**
 * Calculate fare based on trip type and distance
 */
export function calculateFare(tripType, carId, distance, hours = 8) {
  const car = RATE_CARD[carId] || RATE_CARD.wagonr;
  let baseFare = 0;
  let breakdown = {
    baseFare: 0,
    extraKm: 0,
    extraHours: 0,
    driverAllowance: car.driverAllowance,
    taxes: 0,
    total: 0
  };

  switch (tripType) {
    case "oneway":
      baseFare = distance * car.outstationPerKm;
      breakdown.baseFare = baseFare;
      breakdown.driverAllowance = car.driverAllowance;
      break;

    case "roundtrip":
      const roundTripDistance = distance * 2;
      baseFare = roundTripDistance * car.outstationPerKm;
      breakdown.baseFare = baseFare;
      breakdown.driverAllowance = car.driverAllowance;
      break;

    case "local":
      baseFare = car.fullDay.base;
      breakdown.baseFare = baseFare;
      
      if (distance > car.fullDay.kms) {
        const extraKms = distance - car.fullDay.kms;
        breakdown.extraKm = extraKms * car.extraKm;
      }
      
      if (hours > car.fullDay.hours) {
        const extraHrs = hours - car.fullDay.hours;
        breakdown.extraHours = extraHrs * car.extraHour;
      }
      
      breakdown.driverAllowance = car.driverAllowance;
      break;

    case "airport":
      const airportBase = 500;
      baseFare = airportBase + (distance * car.outstationPerKm);
      breakdown.baseFare = baseFare;
      breakdown.driverAllowance = Math.round(car.driverAllowance * 0.5);
      break;

    default:
      baseFare = car.fullDay.base;
      breakdown.baseFare = baseFare;
  }

  const subtotal = breakdown.baseFare + breakdown.extraKm + breakdown.extraHours + breakdown.driverAllowance;
  breakdown.taxes = Math.round(subtotal * 0.05);
  breakdown.total = subtotal + breakdown.taxes;

  return {
    ...breakdown,
    distance: distance,
    carName: car.name,
    carId: car.id,
    perKmRate: car.outstationPerKm
  };
}

/**
 * Get all cars with calculated fares for a route
 */
export async function getCarsWithPricing(from, to, tripType, hours = 8) {
  const distanceData = await calculateDistance(from, to);
  const distance = distanceData.distance;

  const carsWithPricing = Object.keys(RATE_CARD).map(carId => {
    const fareData = calculateFare(tripType, carId, distance, hours);
    const car = RATE_CARD[carId];
    
    return {
      id: car.id,
      name: car.name,
      img: car.img,
      subtitle: `or equivalent | ${car.id === 'traveller' || car.id === 'urbania' ? '12+' : '4'} seater AC Cab`,
      price: fareData.total,
      baseFare: fareData.baseFare,
      taxes: fareData.taxes,
      distance: distance,
      duration: distanceData.duration,
      driverAllowance: fareData.driverAllowance,
      perKmRate: car.outstationPerKm,
      breakdown: fareData,
      distanceText: distanceData.distanceText || `${distance} km`,
      durationText: distanceData.durationText || `${Math.round(distanceData.duration / 60)} hours`,
      perks: [
        { icon: "👨‍✈️", text: `Driver allowance: ₹${fareData.driverAllowance}` },
        { icon: "🧭", text: `${distance} km | ₹${car.outstationPerKm}/km` },
      ]
    };
  });

  return {
    cars: carsWithPricing,
    distance: distance,
    duration: distanceData.duration,
    estimated: distanceData.estimated || false,
    source: distanceData.source,
    warning: distanceData.warning
  };
}

export { RATE_CARD };