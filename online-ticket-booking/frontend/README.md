# BLW Ticket Booking frontend

## Local development

1. Start MongoDB and the backend from `backend` with `npm run dev` (the API listens on port 5000).
2. Start the frontend from `frontend` with `npm run dev`.
3. Vite proxies `/api` requests to `http://localhost:5000`. Set `VITE_API_URL` when the API is hosted elsewhere.

Users can register and sign in, search trains by route and journey date, and confirm a sandbox booking. Confirmed bookings are stored by the backend and seat availability is recalculated for the selected date.

The current payment flow is explicitly sandboxed because no Razorpay credentials are configured. A production payment provider should create and verify payment signatures server-side before changing a booking to `confirmed`.
