# WanderLust

Discover, book, and host unique stays around the world.

---

## 🌍 About WanderLust

**WanderLust** is a full-stack web application inspired by Airbnb, designed to connect travelers with amazing places to stay and empower hosts to share their unique properties. The platform features robust authentication, secure payments, interactive maps, and a modern, responsive UI.

---

## 🚀 Features

- **User Authentication:** Secure signup, login, and session management with Passport.js.
- **Host & Book Listings:** Users can host new properties or book existing ones.
- **Image Uploads:** Seamless image uploads and management via Cloudinary.
- **Interactive Maps:** Mapbox integration for geolocation and map display.
- **Reviews & Ratings:** Users can leave reviews and ratings for listings.
- **Secure Payments:** Razorpay integration for booking payments (test mode).
- **Responsive Design:** Mobile-first UI using Bootstrap 5 and custom styles.
- **Flash Messaging:** User feedback for actions and errors.
- **Pagination & Filtering:** Easily browse and filter listings by category.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** EJS, Bootstrap 5, vanilla CSS, Js, HTML
- **Authentication:** Passport.js, Passport-Local-Mongoose
- **File Uploads:** Multer, Cloudinary, multer-storage-cloudinary
- **Payments:** Razorpay (test mode)
- **Maps:** Mapbox SDK
- **Session Store:** connect-mongo
- **Validation:** Joi

---

## 💡 Usage

- **Sign up** as a new user.
- **Host** a property by adding a new listing with images and details.
- **Browse** listings, filter by category, and use the map to explore locations.
- **Book** a stay and pay securely via Razorpay (test mode).
- **Leave reviews** and ratings for properties you’ve stayed at.
- **Manage** your bookings and hosted listings from your profile.


---

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Aniketdey2004/Wanderlust.git
   cd Wanderlust
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add:

   ```
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret

   MAP_TOKEN=your_mapbox_token

   RAZORPAY_KEY=your_razorpay_key
   RAZORPAY_SECRET_CODE=your_razorpay_secret

   SECRET=your_session_secret
   ```

4. **Start MongoDB** (locally or use MongoDB Atlas).

5. **Run the app:**
   ```bash
   npm start
   ```
   The app will run on [http://localhost:8080](http://localhost:8080).

---

## 👤 Author

**Aniket Dey**

- [GitHub](https://github.com/Aniketdey2004/Wanderlust)
- [LinkedIn](https://www.linkedin.com/in/aniket-dey-297953278)

---

## 🙏 Acknowledgements

- [Font Awesome](https://fontawesome.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Cloudinary](https://cloudinary.com/)
- [Mapbox](https://www.mapbox.com/)
- [Razorpay](https://razorpay.com/)

---

**Happy Wandering!**