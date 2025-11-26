// src/lib/query.js
// Utility functions for handling URL query parameters

/**
 * Build a query string from an object
 * @param {Object} params - Object with key-value pairs
 * @returns {string} - URL query string (without leading ?)
 */
export function buildQuery(params) {
  const filtered = {};
  
  // Filter out empty/null/undefined values
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== '') {
      filtered[key] = value;
    }
  }
  
  return new URLSearchParams(filtered).toString();
}

/**
 * Read query parameters from URL search string
 * @param {string} search - URL search string (e.g., "?from=Delhi&to=Jaipur")
 * @returns {Object} - Object with query parameters
 */
export function readQuery(search) {
  const params = new URLSearchParams(search);
  const result = {};
  
  for (const [key, value] of params) {
    result[key] = value;
  }
  
  return result;
}

/**
 * Update current URL with new query parameters
 * @param {Object} newParams - New parameters to merge with existing
 * @param {Object} currentParams - Current query parameters
 * @returns {string} - Updated query string
 */
export function updateQuery(newParams, currentParams = {}) {
  const merged = { ...currentParams, ...newParams };
  return buildQuery(merged);
}

/**
 * Example usage:
 * 
 * // Building a query string
 * const params = {
 *   from: "Gurugram",
 *   to: "Jaipur",
 *   date: "2025-01-15",
 *   time: "10:00"
 * };
 * const queryString = buildQuery(params);
 * // Result: "from=Gurugram&to=Jaipur&date=2025-01-15&time=10:00"
 * 
 * // Reading query parameters
 * const search = "?from=Gurugram&to=Jaipur&date=2025-01-15";
 * const queryParams = readQuery(search);
 * // Result: { from: "Gurugram", to: "Jaipur", date: "2025-01-15" }
 * 
 * // Using in React Router
 * import { useNavigate, useLocation } from "react-router-dom";
 * 
 * function MyComponent() {
 *   const navigate = useNavigate();
 *   const { search } = useLocation();
 *   
 *   const currentParams = readQuery(search);
 *   
 *   const goToNextPage = () => {
 *     const newParams = { ...currentParams, carId: "crysta" };
 *     navigate(`/booking?${buildQuery(newParams)}`);
 *   };
 * }
 */