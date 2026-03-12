# Platform Workflow — BookFarm (Farmhouse Finder)

This document describes the complete system workflow of the BookFarm platform — a farmhouse and event venue booking application that connects property owners and service vendors with customers.

---

## 1. Platform Overview

**BookFarm** is an online marketplace that allows customers to discover, browse, and book farmhouses and event venues. Property owners can list their venues, manage reservations, and verify payments. Service vendors (caterers, photographers, decorators, etc.) can offer add-on services that customers can attach to a booking.

**Core goals:**
- Simplify the process of finding and booking farmhouses and event venues.
- Provide property owners and vendors with self-service tools to list and manage their offerings.
- Enable transparent communication between all parties through integrated messaging.
- Automate payment tracking, email notifications, and booking reminders.

---

## 2. User Roles

The platform supports four distinct roles with role-based access control (RBAC):

| Role | Description |
|------|-------------|
| **Visitor** | An unauthenticated user who can browse public property and service listings, view property details, and use the search functionality. A Visitor cannot make bookings or contact vendors until they register. |
| **Registered User (Customer)** | An authenticated user who can search properties, make bookings, add services to a booking, submit payment details, communicate with owners via messaging, save favourites, and view booking history in their personal dashboard. |
| **Vendor (Farmhouse Owner / Service Provider)** | An authenticated user who lists properties or event services on the platform. A Vendor manages their own listings, reviews incoming booking requests, verifies payments from customers, and monitors analytics through their dedicated dashboard. |
| **Admin** | A platform super-user with full access to manage all users, properties, services, bookings, and platform settings. The Admin can view and modify any record in the system. |

---

## 3. Vendor Workflow

The following steps describe the end-to-end journey of a Vendor (Farmhouse Owner) from registration to publishing a live listing.

1. **Vendor registers** — The vendor visits `/register` and completes the multi-step registration form, selecting *Property Owner* (or *Vendor/Service Provider*) as their user type. An account is created in the `profiles` and `user_roles` tables.

2. **Vendor logs in** — The vendor signs in at `/login` using their email and password. The platform reads the user's role and redirects them to the appropriate owner/vendor dashboard.

3. **Vendor creates a listing** — The vendor navigates to `/properties/new` and fills in the property details: name, description, amenities, guest capacity, and room information.

4. **Vendor uploads photos** — During listing creation the vendor uploads one or more images. Files are stored in the `property-images` Supabase Storage bucket and their URLs are saved to the `properties` table.

5. **Vendor sets price** — The vendor configures the nightly or per-event price for the property.

6. **Vendor adds location** — The vendor provides the property address. The address is displayed on an interactive Leaflet map on the public listing page.

7. **Vendor publishes listing** — The vendor submits the form. The property record is saved to the `properties` table with an active status, making it immediately visible to all visitors and registered users.

---

## 4. User Workflow

The following steps describe the typical journey of a Registered User (Customer) on the platform.

1. **User visits the website** — The user lands on the home page (`/`) which features a hero search bar, featured properties, service categories, and testimonials.

2. **User searches for farmhouses** — The user enters a location, date, or price range in the search bar or uses the filters on the `/properties` page to narrow results.

3. **User views listings** — The user browses the paginated list of properties. Each card displays a thumbnail, title, location, and price per night/event.

4. **User checks location on map** — On a property detail page (`/properties/:id`) the user views the property's location on an embedded interactive map powered by Leaflet.

5. **User contacts vendor or books** — The user either sends a message to the property owner via the integrated messaging system or proceeds to create a booking at `/booking/:propertyId`.

---

## 5. Booking Workflow

The following steps describe how a booking is created and confirmed.

1. **User selects a date** — On the booking page the user picks their desired event date using the calendar date picker.

2. **User confirms the booking** — The user reviews the booking summary (property, date, guest count, optional add-on services, and total cost) and confirms the reservation.

3. **Payment is processed** — The platform currently supports manual bank transfer. The user submits their bank transaction ID via the payment form (`/payment`). The booking status is set to *Payment Pending*.

4. **Booking stored in database** — A record is inserted into the `bookings` table (and `booking_services` for any add-ons), storing all booking details, payment info, and the current status.

5. **Vendor is notified** — A Supabase Edge Function (`send-booking-notification`) triggers an automated email to the property owner informing them of the new booking and payment submission.

---

## 6. Dashboard System

### Vendor / Owner Dashboard (`/owner/admin`)

The vendor dashboard gives property owners full visibility and control over their business:

| Feature | Description |
|---------|-------------|
| **Booking Management** | View all incoming bookings with status indicators (Pending, Confirmed, Cancelled). |
| **Payment Verification** | Verify a customer's bank transfer by cross-checking the submitted transaction ID and updating the booking status to *Verified*. |
| **Property Management** | Navigate to `/properties/manage` to view, edit (`/properties/edit/:id`), activate, or deactivate listings. |
| **Analytics** | Track total revenue, number of bookings, and per-property performance metrics. |

### Registered User Dashboard (`/dashboard`)

The customer dashboard gives users an overview of their activity:

| Feature | Description |
|---------|-------------|
| **Upcoming Events** | A summary of confirmed upcoming bookings with a countdown to the event date. |
| **Booking History** | Full list of past and current bookings with status badges and links to booking details. |
| **Messaging** | Access messages exchanged with property owners from within a booking detail page (`/booking/details/:bookingId`). |
| **Favourites** | View properties and services saved to the user's favourites list (`/favorites`). |
| **Receipt Download** | Download a text receipt for any completed booking. |

---

## 7. Payment Flow

1. **Customer submits payment details** — After confirming a booking the customer completes a bank transfer and submits their transaction ID through the `/payment` form. The `bookings` table is updated with the transaction ID and the status is set to *Payment Pending*.

2. **Payment gateway process** — BookFarm uses a manual bank transfer model. The platform does not currently integrate a card payment gateway; instead, the owner manually verifies the offline transfer using the transaction ID provided by the customer.

3. **Booking confirmation** — The property owner reviews the payment details in their dashboard (`/owner/admin`) and marks the payment as verified. The booking status transitions to *Confirmed* and an automated email (`send-booking-notification`) is dispatched to the customer.

4. **Payment record storage** — All payment details (transaction ID, amount, verification timestamp, and status) are persisted in the `bookings` table in the PostgreSQL database. No raw card data is ever stored on the platform.

---

## 8. Platform Architecture

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 18+** | Component-based UI framework |
| **TypeScript** | Static typing and improved developer experience |
| **Vite** | Fast development server and production build tool |
| **Tailwind CSS** | Utility-first CSS framework for styling |
| **shadcn/ui** | Accessible, pre-built UI component library |
| **React Router** | Client-side routing and navigation |
| **TanStack Query** | Asynchronous data fetching, caching, and synchronisation |
| **React Hook Form + Zod** | Form management and validation |
| **Framer Motion** | Declarative animation library |
| **Leaflet** | Interactive maps for property locations |

The frontend is a Single Page Application (SPA). All routing is handled client-side. Protected routes verify the user's authentication state and role before rendering dashboard pages.

### Backend

| Technology | Purpose |
|------------|---------|
| **Supabase (PostgreSQL)** | Managed relational database with Row Level Security (RLS) |
| **Supabase Auth** | Session management, email/password authentication, auto-confirm |
| **Supabase Edge Functions** | Serverless TypeScript functions for email notifications and scheduled jobs |
| **Supabase Storage** | Object storage buckets for property and vendor images |
| **Supabase Realtime** | Live subscriptions for instant UI updates (e.g., new messages) |

### Database

Core tables:

| Table | Purpose |
|-------|---------|
| `profiles` | Stores user display names, emails, phone numbers, and avatar URLs |
| `user_roles` | Maps users to roles: `admin`, `customer`, `owner`, `vendor` |
| `properties` | Property listings including images, description, pricing, and location |
| `vendors` | Service provider profiles and business details |
| `bookings` | Booking records with dates, guest count, payment info, and status |
| `booking_services` | Add-on services attached to a specific booking |
| `messages` | Messages exchanged between customers and owners within a booking |
| `reviews` | Customer ratings and reviews for properties and vendors |
| `favorites` | User-saved properties and vendor services |
| `newsletter_subscriptions` | Email addresses and verification status for newsletter subscribers |

Security: Every table is protected by **Row Level Security (RLS)** policies ensuring users can only access data they are authorised to see or modify.

### APIs

All data operations are performed through the **Supabase JavaScript client** (`@supabase/supabase-js`), which wraps the PostgREST auto-generated REST API and Supabase Realtime WebSocket API.

Key API interactions:

| Operation | Mechanism |
|-----------|-----------|
| User registration / login | Supabase Auth API |
| Fetch property listings | PostgREST query via Supabase client |
| Create / update bookings | PostgREST insert/update via Supabase client |
| Upload images | Supabase Storage API |
| Send email notifications | Supabase Edge Function HTTP invocation |
| Real-time messaging | Supabase Realtime channel subscription |
| Scheduled reminders | Supabase cron job invoking `send-booking-reminders` Edge Function |

---

*For a deeper look at individual features, database schema details, and the full list of pages and routes, refer to [PROJECT_DOCUMENTATION.md](../PROJECT_DOCUMENTATION.md).*
