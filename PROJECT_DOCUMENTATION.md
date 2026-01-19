# BookFarm - Complete Project Documentation

## 📋 Project Overview

**BookFarm** is a comprehensive farmhouse and event venue booking platform built with modern web technologies. The platform connects customers with property owners and service vendors, enabling seamless booking of venues and event services for celebrations, corporate events, and gatherings.

---

## 🎯 Core Features

### 1. User Management & Authentication

#### User Types
The platform supports **four distinct user roles** with role-based access control:

| Role | Description | Capabilities |
|------|-------------|--------------|
| **Customer** | End users browsing and booking | Browse properties/services, make bookings, manage favorites, track reservations |
| **Property Owner** | Farmhouse/venue owners | List properties, manage bookings, verify payments, view analytics |
| **Vendor/Service Provider** | Event service providers | Offer services (catering, photography, etc.), manage service bookings |
| **Admin** | Platform administrators | Full access to manage all platform data and users |

#### Authentication Features
- Email/password registration with auto-confirmation
- Secure login with session persistence
- Role-based dashboard redirection
- Multi-step registration flow with user type selection
- Profile management with avatar support

---

### 2. Property Management

#### For Customers
- **Property Browsing**: View all available farmhouses and venues
- **Advanced Search**: Filter by location, date, price range, and amenities
- **Property Details**: High-quality image galleries, amenities list, location maps, reviews
- **Favorites System**: Save properties for later viewing

#### For Property Owners
- **Property Listing**: Create new property listings with:
  - Multiple image uploads (stored in Supabase Storage)
  - Detailed descriptions and amenities
  - Pricing configuration
  - Location with address
  - Guest capacity and room details
- **Property Management**: Edit, activate/deactivate listings
- **Booking Management**: View and manage incoming booking requests
- **Payment Verification**: Verify manual bank transfer payments using transaction IDs
- **Analytics Dashboard**: Track revenue, bookings, and property performance

---

### 3. Service Marketplace

The platform features a **complete service marketplace** with specialized categories:

| Category | Description |
|----------|-------------|
| 🍽️ **Catering** | Food and beverage services for events |
| 📸 **Photography** | Professional photography and videography |
| 🎨 **Decoration** | Event decoration and styling services |
| 🎵 **Music & DJ** | Entertainment and music services |
| 📋 **Event Planning** | Full event coordination and planning |

Each category includes:
- Dedicated listing pages with vendor profiles
- Detailed service pages with portfolio galleries
- Vendor ratings and reviews
- Direct booking integration with property reservations

---

### 4. Booking System

#### Multi-Step Booking Flow
1. **Date Selection**: Choose event date with calendar picker
2. **Guest Count**: Specify number of attendees
3. **Service Add-ons**: Optionally add vendor services (catering, photography, etc.)
4. **Review & Confirm**: Summary of booking with total cost calculation

#### Payment Options
- **Bank Transfer**: Manual payment with transaction ID submission
- **Payment Verification**: Owner-side verification system
- **Payment Status Tracking**: Pending → Verified → Confirmed

#### Booking Management
- View booking history with status indicators
- Download text receipts for completed bookings
- Real-time booking status updates
- Event date countdown

---

### 5. Messaging System

**Real-time communication** between customers and providers:
- Integrated messaging within booking details
- Secure message storage with RLS policies
- Read/unread status tracking
- Direct communication for event coordination
- Message history preserved for reference

---

### 6. Reviews & Ratings

- **Property Reviews**: Customers can rate and review venues after booking
- **Vendor Reviews**: Rate service providers after using their services
- **Automated Aggregation**: Average ratings and review counts auto-updated via database triggers
- **Public Display**: Reviews visible on property and vendor detail pages

---

### 7. Email Notifications

Automated email system powered by **Resend** and **Supabase Edge Functions**:

| Notification Type | Trigger |
|-------------------|---------|
| Booking Confirmed | When booking is created |
| Payment Received | When payment details submitted |
| Payment Verified | When owner verifies payment |
| Event Reminder | 24 hours before event (automated cron job) |
| Newsletter Verification | When subscribing to newsletter |

---

### 8. Newsletter System

- **Subscription Form**: Located in footer across all pages
- **Email Verification**: Confirmation link sent via email
- **Verified Subscriptions**: Only verified emails receive newsletters
- **Duplicate Prevention**: Existing subscribers notified appropriately

---

## 📱 User Interfaces

### Public Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero search, featured properties, service categories, testimonials |
| Properties | `/properties` | Property listings with filters and search |
| Property Detail | `/properties/:id` | Full property information, gallery, map, reviews |
| Services | `/services` | Service category overview |
| Service Detail | `/services/:id` | Individual vendor/service details |
| Catering | `/services/catering` | Catering services listings |
| Photography | `/services/photography` | Photography services listings |
| Decoration | `/services/decoration` | Decoration services listings |
| Music & DJ | `/services/music-dj` | Music and DJ services listings |
| Event Planning | `/services/event-planning` | Event planning services listings |

### Authentication Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | User login with email/password |
| Register | `/register` | Multi-step registration with role selection |

### Customer Dashboard

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/dashboard` | Overview of bookings, upcoming events |
| Booking | `/booking/:propertyId` | Create new booking for a property |
| Booking Details | `/booking/details/:bookingId` | View booking info, messaging, receipt |
| Payment | `/payment` | Payment submission form |
| Favorites | `/favorites` | Saved properties and services |

### Owner Dashboard

| Page | Route | Description |
|------|-------|-------------|
| Owner Admin | `/owner/admin` | Booking management, payment verification, analytics |
| New Property | `/properties/new` | Create new property listing |
| Manage Properties | `/properties/manage` | View and manage all owned properties |
| Edit Property | `/properties/edit/:id` | Edit existing property details |

### Vendor Dashboard

| Page | Route | Description |
|------|-------|-------------|
| Vendor Register | `/vendor/register` | Service provider registration |
| Vendor Dashboard | `/vendor/dashboard` | Manage services, view bookings, analytics |

### Legal & Information Pages

| Page | Route | Description |
|------|-------|-------------|
| About Us | `/about` | Company information and team |
| How It Works | `/how-it-works` | Step-by-step platform guide |
| Help Center | `/help` | FAQs and support information |
| Contact | `/contact` | Contact form and information |
| Safety | `/safety` | Safety guidelines and policies |
| Careers | `/careers` | Job opportunities |
| Press | `/press` | Press releases and media kit |
| Resources | `/resources` | Guides and educational content |
| Community | `/community` | Community features and forums |
| Privacy Policy | `/privacy` | Data privacy information |
| Terms of Service | `/terms` | Terms and conditions |
| Cookie Policy | `/cookies` | Cookie usage information |
| Cancellation Policy | `/cancellation` | Booking cancellation terms |
| Newsletter Verification | `/verify-newsletter` | Email verification for newsletter |

---

## 🗄️ Database Schema

### Core Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profile information (name, email, phone, avatar) |
| `user_roles` | Role assignments (admin, customer, owner, vendor) |
| `properties` | Property listings with details, images, pricing |
| `vendors` | Service provider profiles and business information |
| `bookings` | Booking records with status, payment info, dates |
| `booking_services` | Services linked to bookings |
| `messages` | Communication messages between users |
| `reviews` | User reviews for properties and vendors |
| `favorites` | User-saved properties and services |
| `newsletter_subscriptions` | Newsletter subscriber management |

### Public Views (Read-Only, Secure)
- `properties_public` - Public property data without owner details
- `vendors_public` - Public vendor data without sensitive info
- `reviews_public` - Public review data without user PII

### Database Features
- **Row Level Security (RLS)**: All tables protected with appropriate policies
- **Automated Triggers**: 
  - Profile creation on user signup
  - Rating/review count updates
  - Timestamp updates
- **Stored Functions**: Role checking, rating calculations

---

## ⚙️ Backend Functions (Edge Functions)

| Function | Purpose |
|----------|---------|
| `send-booking-notification` | Send email notifications for booking events |
| `send-booking-reminders` | Automated daily cron job for event reminders (24h before) |
| `send-newsletter-verification` | Send verification emails for newsletter subscriptions |

---

## 🎨 Design System

### Theme Support
- **Light Mode**: Clean, professional appearance
- **Dark Mode**: Full dark theme support
- **Automatic Toggle**: Theme switcher in navigation

### Color Palette
- Primary colors with semantic tokens
- Accent colors for CTAs and highlights
- Consistent color application via CSS variables
- HSL-based color system for flexibility

### Typography
- Heading font: Playfair Display (elegant, editorial)
- Body font: Inter (clean, readable)
- Consistent type scale across components

### Components
Built on **shadcn/ui** component library:
- Buttons, Cards, Dialogs, Forms
- Navigation, Tabs, Accordions
- Toast notifications, Alerts
- Data tables, Calendars
- And many more...

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18+ | UI framework |
| TypeScript | Type safety |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations |
| React Router | Client-side routing |
| TanStack Query | Data fetching and caching |
| Zod | Form validation |
| React Hook Form | Form management |

### Backend (Lovable Cloud / Supabase)
| Technology | Purpose |
|------------|---------|
| PostgreSQL | Database |
| Row Level Security | Data access control |
| Edge Functions | Serverless backend logic |
| Storage Buckets | Image and file storage |
| Realtime | Live data subscriptions |

### Integrations
| Service | Purpose |
|---------|---------|
| Resend | Email delivery |
| Leaflet | Interactive maps |
| Cron Jobs | Scheduled tasks |

---

## 📦 Storage Buckets

| Bucket | Public | Purpose |
|--------|--------|---------|
| `property-images` | Yes | Property listing photos |
| `vendor-images` | Yes | Vendor portfolio images |

---

## 🔐 Security Features

### Authentication
- Secure session management
- Auto-refresh tokens
- Password-based authentication
- Email auto-confirmation enabled

### Data Protection
- Row Level Security on all tables
- Role-based access control
- Secure views for public data access
- No sensitive data exposed in public APIs

### Form Security
- Client-side validation with Zod
- Email format validation
- Input sanitization
- CSRF protection via Supabase

---

## 📧 Contact Information (Demo)

- **Email**: hello@bookfarm.com
- **Phone**: +1 (555) 123-4567
- **Location**: San Francisco, CA

---

## 🔗 Social Links

- Facebook
- Twitter
- Instagram
- LinkedIn

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Initial | Core platform with properties and booking |
| 1.1.0 | Update | Added service marketplace |
| 1.2.0 | Update | Integrated messaging system |
| 1.3.0 | Update | Email notifications with Resend |
| 1.4.0 | Update | Automated booking reminders |
| 1.5.0 | Update | Newsletter with email verification |
| 1.6.0 | Update | Complete legal and information pages |

---

## 🚀 Deployment

The application is deployed on **Lovable Cloud** with:
- Automatic frontend deployments
- Edge function auto-deployment
- Managed database hosting
- SSL/HTTPS enabled
- CDN distribution

---

## 📖 Additional Resources

- [Lovable Documentation](https://docs.lovable.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

*This documentation was auto-generated to provide a comprehensive overview of the BookFarm platform.*
