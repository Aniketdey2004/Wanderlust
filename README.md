# 🌍 WanderLust — Property Rental & Booking Platform

WanderLust is a full-stack web application inspired by Airbnb, designed to connect travelers with amazing places to stay and empower hosts to share their unique properties. The platform features robust authentication, secure payments, interactive maps, and a modern, responsive UI.

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Routes](#-api-routes)
- [Database Models](#-database-models)
- [Security](#-security)
- [Project Structure](#-project-structure)

## 🧠 Overview

WanderLust enables users to:

- Discover unique stays around the world
- Host their own properties and earn income
- Book accommodations with secure payments
- Explore locations with interactive maps
- Leave and read reviews for properties
- Manage bookings and listings from their profile

## ✨ Features

### Authentication & Authorization
- **Secure Signup & Login** with Passport.js Local Strategy
- **Session Management** with MongoDB session store
- **Password Hashing** via passport-local-mongoose
- **Role-based Authorization** — Owner-only edit/delete for listings and reviews

### Listings Management
- **Create Listings** with title, description, price, location, and images
- **Category Filtering** — 10 categories (Beach, Mountains, Castles, Farms, etc.)
- **Pagination** — 9 listings per page with navigation
- **Status Toggle** — Hosts can suspend/activate bookings
- **Image Uploads** — Cloudinary integration with automatic thumbnails

### Booking System
- **Date Selection** — Choose check-in and check-out dates
- **Secure Payments** — Razorpay integration with signature verification
- **Booking History** — View all your bookings
- **Auto-Expiration** — Bookings auto-delete after checkout (MongoDB TTL)
- **Customer Management** — Hosts can view their property's visitors

### Maps & Geolocation
- **Forward Geocoding** — Converts addresses to coordinates via Mapbox
- **Interactive Maps** — Display property location on map
- **GeoJSON Storage** — Coordinates stored for spatial queries

### Reviews & Ratings
- **Star Ratings** — 1-5 star rating system
- **Comments** — Written reviews for properties
- **Author Attribution** — Reviews linked to user profiles
- **Cascade Delete** — Reviews deleted when listing is removed

### User Experience
- **Responsive Design** — Mobile-first with Bootstrap 5
- **Flash Messages** — Success/error feedback for all actions
- **EJS Templating** — Server-side rendering with layouts
- **Custom Styling** — Vanilla CSS enhancements

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js 5 | Web framework |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| Passport.js | Authentication |
| passport-local-mongoose | User model plugin |
| Joi | Schema validation |
| Multer | File upload handling |
| Cloudinary | Image CDN & storage |
| Mapbox SDK | Geocoding service |
| Razorpay | Payment gateway |
| connect-mongo | Session store |
| connect-flash | Flash messages |
| method-override | HTTP method support |

### Frontend
| Technology | Purpose |
|------------|---------|
| EJS | Templating engine |
| ejs-mate | Layout support |
| Bootstrap 5 | CSS framework |
| Vanilla CSS | Custom styles |
| JavaScript | Client-side interactivity |
| Mapbox GL JS | Map rendering |

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Client (Browser)                             │
│  ┌───────────────┐  ┌─────────────────┐  ┌──────────────────┐   │
│  │  EJS Views    │  │  Bootstrap 5    │  │   Mapbox GL JS   │   │
│  │  (Templates)  │  │  (Styling)      │  │   (Maps)         │   │
│  └───────────────┘  └─────────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Backend (Node.js + Express)                     │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     Routes                               │    │
│  │  /listings      → Property CRUD & browsing               │    │
│  │  /listings/:id/reviews → Review management               │    │
│  │  /listings/:id/book    → Booking flow                    │    │
│  │  /payment       → Razorpay order creation                │    │
│  │  /user          → Profile, bookings, listings mgmt       │    │
│  │  / (auth)       → Login, signup, logout                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  Middleware Layer                        │    │
│  │  • isLoggedIn — Authentication check                     │    │
│  │  • isOwner — Listing ownership verification              │    │
│  │  • isReviewAuthor — Review ownership verification        │    │
│  │  • validateListing — Joi schema validation               │    │
│  │  • validateReview — Joi schema validation                │    │
│  │  • verifyPayment — Razorpay signature verification       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  Controllers                             │    │
│  │  • listing.js — Listing CRUD operations                  │    │
│  │  • review.js — Review management                         │    │
│  │  • user.js — User profile & auth                         │    │
│  │  • book.js — Booking operations                          │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      External Services                           │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌─────────────┐  │
│  │  MongoDB  │  │ Cloudinary│  │  Mapbox   │  │  Razorpay   │  │
│  │  Atlas    │  │ Image CDN │  │ Geocoding │  │  Payments   │  │
│  └───────────┘  └───────────┘  └───────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Payment Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  User    │    │ WanderLust│   │ Razorpay │    │  MongoDB │
│          │    │  Server   │    │   API    │    │          │
└────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
     │               │               │               │
     │ Select Dates  │               │               │
     │──────────────>│               │               │
     │               │               │               │
     │               │ Create Order  │               │
     │               │──────────────>│               │
     │               │               │               │
     │               │<──────────────│               │
     │               │   Order ID    │               │
     │               │               │               │
     │<──────────────│               │               │
     │  Payment Modal│               │               │
     │               │               │               │
     │ Complete Payment              │               │
     │──────────────────────────────>│               │
     │               │               │               │
     │<──────────────────────────────│               │
     │    Payment ID + Signature     │               │
     │               │               │               │
     │ Verify & Book │               │               │
     │──────────────>│               │               │
     │               │ HMAC-SHA256   │               │
     │               │ Verification  │               │
     │               │               │               │
     │               │ Save Booking  │               │
     │               │──────────────────────────────>│
     │               │               │               │
     │<──────────────│               │               │
     │ Booking Confirmed             │               │
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account
- Mapbox account
- Razorpay account (test mode)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aniketdey2004/Wanderlust.git
   cd Wanderlust
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (see [Environment Variables](#-environment-variables))

4. **Seed the database (optional)**
   ```bash
   node init/index.js
   ```

5. **Run the development server**
   ```bash
   node app.js
   ```

6. **Open the app** at `http://localhost:8080`

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB
ATLAS_DB=mongodb+srv://username:password@cluster.mongodb.net/wanderlust

# Session
SECRET=your_super_secret_session_key

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Mapbox
MAP_TOKEN=your_mapbox_access_token

# Razorpay
RAZORPAY_KEY=your_razorpay_key_id
RAZORPAY_SECRET_CODE=your_razorpay_secret
```

## 📡 API Routes

### Listings (`/listings`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all listings (paginated) | No |
| GET | `/new` | Render new listing form | Yes |
| POST | `/` | Create new listing | Yes |
| GET | `/:id` | Get single listing | No |
| GET | `/:id/edit` | Render edit form | Owner |
| PUT | `/:id` | Update listing | Owner |
| DELETE | `/:id` | Delete listing | Owner |
| POST | `/:id/status` | Toggle booking status | Owner |

### Reviews (`/listings/:id/reviews`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create review | Yes |
| DELETE | `/:reviewId` | Delete review | Author |

### Bookings (`/listings/:id/book`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Render booking form | Yes |
| POST | `/` | Create booking (after payment) | Yes |
| DELETE | `/:bookingId` | Cancel booking | Yes |

### Payments (`/payment`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/createBooking` | Create Razorpay order | Yes |

### User (`/user`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/listings` | My hosted listings | Yes |
| GET | `/bookings` | My bookings | Yes |
| GET | `/reviews` | My reviews | Yes |
| GET | `/customers` | My property visitors | Yes |
| GET | `/profile` | Profile page | Yes |
| PUT | `/profile` | Update profile | Yes |

### Auth (`/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/signup` | Signup page |
| POST | `/signup` | Register user |
| GET | `/login` | Login page |
| POST | `/login` | Authenticate user |
| GET | `/logout` | Logout user |

## 📊 Database Models

### User
```javascript
{
  email: String,           // Required, unique
  username: String,        // From passport-local-mongoose
  password: String,        // Hashed automatically
  picture: {
    url: String,           // Default avatar
    filename: String
  },
  Phone: Number,
  About: String
}
```

### Listing
```javascript
{
  title: String,           // Required
  description: String,
  image: { url, filename },
  price: Number,
  location: String,
  country: String,
  reviews: [ObjectId],     // Ref: Review
  owner: ObjectId,         // Ref: User
  category: [String],      // Enum: Room, Beach, Mountains, etc.
  bookings: [ObjectId],    // Ref: Book
  geometry: {              // GeoJSON Point
    type: "Point",
    coordinates: [lng, lat]
  },
  status: Boolean          // Booking enabled/disabled
}
```

### Review
```javascript
{
  comment: String,
  rating: Number,          // 1-5
  author: ObjectId         // Ref: User
}
```

### Book (Booking)
```javascript
{
  listing: ObjectId,       // Ref: Listing
  from: Date,
  to: Date,
  paymentId: String,       // Razorpay payment ID
  orderId: String,         // Razorpay order ID
  customer: ObjectId,      // Ref: User
  expiresAt: Date          // TTL index for auto-deletion
}
```

## 🛡 Security

### Authentication
- **Passport.js Local Strategy** — Username/password authentication
- **passport-local-mongoose** — Automatic password hashing with salt
- **Express Sessions** — Secure session management
- **connect-mongo** — MongoDB session storage with encryption

### Authorization Middleware
- **isLoggedIn** — Protects routes requiring authentication
- **isOwner** — Ensures only listing owners can edit/delete
- **isReviewAuthor** — Ensures only review authors can delete

### Payment Security
- **HMAC-SHA256 Verification** — Validates Razorpay payment signatures
- **Server-side Order Creation** — Orders created on backend only
- **Signature Comparison** — Prevents payment tampering

### Data Validation
- **Joi Schemas** — Server-side validation for all inputs
- **Mongoose Validation** — Schema-level constraints
- **Error Handling** — Custom ExpressError class with status codes

### Session Security
- **HTTP-only Cookies** — Prevents XSS access to session
- **Encrypted Session Store** — MongoDB sessions with crypto
- **Session Expiry** — 7-day maximum age

## 📁 Project Structure

```
wanderlust/
├── controllers/
│   ├── listing.js         # Listing CRUD operations
│   ├── review.js          # Review management
│   ├── user.js            # User profile & auth
│   └── book.js            # Booking operations
│
├── models/
│   ├── listing.js         # Listing schema
│   ├── review.js          # Review schema
│   ├── user.js            # User schema
│   └── book.js            # Booking schema
│
├── routes/
│   ├── listings.js        # Listing routes
│   ├── reviews.js         # Review routes
│   ├── user.js            # User routes
│   ├── book.js            # Booking routes
│   └── payment.js         # Payment routes
│
├── views/
│   ├── layouts/
│   │   └── boilerplate.ejs
│   ├── includes/
│   │   ├── navbar.ejs
│   │   ├── footer.ejs
│   │   └── flash.ejs
│   ├── listings/
│   │   ├── index.ejs      # All listings
│   │   ├── show.ejs       # Single listing
│   │   ├── new.ejs        # Create form
│   │   ├── edit.ejs       # Edit form
│   │   └── book.ejs       # Booking form
│   └── users/
│       ├── login.ejs
│       ├── signup.ejs
│       └── profile.ejs
│
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── map.js
│   └── photos/
│
├── utils/
│   ├── ExpressError.js    # Custom error class
│   └── wrapAsync.js       # Async error wrapper
│
├── init/
│   ├── index.js           # Database seeder
│   └── data.js            # Sample data
│
├── middleware.js          # Auth & validation middleware
├── schema.js              # Joi validation schemas
├── cloudConfig.js         # Cloudinary configuration
├── razorpayConfig.js      # Razorpay configuration
├── app.js                 # Main application entry
├── package.json
└── .env
```

## 💡 Usage

1. **Sign up** for a new account
2. **Browse listings** — filter by category, use pagination
3. **View details** — see photos, location on map, reviews
4. **Host a property** — create listing with images and details
5. **Book a stay** — select dates, pay via Razorpay
6. **Leave reviews** — rate and comment on properties
7. **Manage profile** — view your listings, bookings, and reviews
8. **Toggle status** — suspend/activate bookings for your properties

## 🧪 Test Credentials (Razorpay)

For testing payments in development:

| Field | Value |
|-------|-------|
| Card Number | 4111 1111 1111 1111 |
| Expiry | Any future date |
| CVV | Any 3 digits |
| OTP | 1234 |

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Aniket Dey**

- GitHub: [@Aniketdey2004](https://github.com/Aniketdey2004)
- LinkedIn: [Aniket Dey](https://www.linkedin.com/in/aniket-dey-297953278)

## 🙏 Acknowledgements

- [Bootstrap](https://getbootstrap.com/)
- [Cloudinary](https://cloudinary.com/)
- [Mapbox](https://www.mapbox.com/)
- [Razorpay](https://razorpay.com/)
- [Font Awesome](https://fontawesome.com/)

---

**Happy Wandering! 🌴✈️**
