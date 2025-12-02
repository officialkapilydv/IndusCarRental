// src/lib/googleSheets.js

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

/**
 * Save booking data to Google Sheets using fetch with redirect follow
 */
export async function saveBookingToSheet(bookingData) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'addBooking',
        data: bookingData
      })
    });
    
    const data = await response.json();
    console.log('Response from Google Sheets:', data);
    return data;
    
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    throw error;
  }
}

/**
 * Get all bookings from Google Sheets
 */
export async function getBookingsFromSheet() {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'getBookings'
      })
    });
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    throw error;
  }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(bookingId, newStatus) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'updateStatus',
        bookingId: bookingId,
        status: newStatus
      })
    });
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error updating Google Sheets:', error);
    throw error;
  }
}

/**
 * Delete booking
 */
export async function deleteBookingFromSheet(bookingId) {
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'deleteBooking',
        bookingId: bookingId
      })
    });
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error deleting from Google Sheets:', error);
    throw error;
  }
}