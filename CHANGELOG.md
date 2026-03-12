# Changelog

All notable changes to the BookFarm project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.6.0] - 2026-03-12

### Added
- Complete legal and information pages (Privacy Policy, Terms of Service, Cookie Policy, Cancellation Policy)
- About Us, How It Works, Help Center, Contact, Safety, Careers, Press, Resources, and Community pages
- Cookie consent banner

---

## [1.5.0] - 2026-03-10

### Added
- Newsletter subscription system with email verification
- `send-newsletter-verification` backend function
- Newsletter verification page at `/verify-newsletter`
- Duplicate subscription detection and re-verification support

---

## [1.4.0] - 2026-03-08

### Added
- Automated booking reminder emails sent 24 hours before events
- `send-booking-reminders` backend function with daily cron schedule

---

## [1.3.0] - 2026-03-06

### Added
- Email notification system powered by Resend
- `send-booking-notification` backend function
- Notifications for booking confirmation, payment received, and payment verified

---

## [1.2.0] - 2026-03-04

### Added
- Real-time messaging system between customers and property owners
- Message read/unread status tracking
- Messaging integrated into booking details page

---

## [1.1.0] - 2026-03-02

### Added
- Service marketplace with five categories: Catering, Photography, Decoration, Music & DJ, Event Planning
- Vendor registration and dashboard
- Vendor profiles with portfolio galleries
- Service booking integration with property reservations
- Vendor reviews and ratings

---

## [1.0.0] - 2026-02-28

### Added
- Initial release of BookFarm platform
- User authentication with email/password (auto-confirm enabled)
- Four user roles: Customer, Owner, Vendor, Admin
- Property listing and management for owners
- Property browsing with search and filters
- Multi-step booking flow with date selection, guest count, and service add-ons
- Bank transfer payment with transaction ID verification
- Owner admin dashboard with booking management and analytics
- Customer dashboard with booking history and status tracking
- Favorites system for saving properties and services
- Reviews and ratings with automated aggregation
- Interactive maps with Leaflet
- Light and dark theme support
- Responsive design across all devices
- Image upload and storage for properties and vendors
