# 🏙️ ChrisUrbanrealty - Immersive Real Estate Platform

Welcome to **ChrisUrbanrealty**, a high-end, immersive real estate platform designed for the modern era. Inspired by the dynamic engagement of short-form video content, this platform transforms the traditional property search into a visually stunning, "TikTok-style" experience.

---

## ✨ Project Highlights

- **Immersive Video Feed**: A full-screen, scrollable video feed that allows users to experience properties as if they were there.
- **Premium Aesthetics**: A dark-mode, glassmorphic design system using deep blacks, vibrant primaries, and smooth animations.
- **Persistent Collections**: A cloud-synced saving system where clients can "Heart" properties and view them later in their personal collection.
- **Admin Control Center**: A secure, hidden management dashboard for property listings and media handling.
- **Cloud-Powered Media**: Direct integration with Cloudinary for fast, optimized property videos and images.
- **Smart Search**: Filter by location, price, and property type (Sale/Rent) with real-time results.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Media Hosting** | [Cloudinary](https://cloudinary.com/) |
| **Database** | Lightweight JSON File Database (Scalable to PostgreSQL/Prisma) |
| **Auth** | Custom JWT-style session management with Mock Google integration |

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js 18+** installed on your system.

### 2. Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add your credentials:
```env
# Cloudinary Keys (For Media Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Security
ADMIN_SECRET=admin123
NEXT_PUBLIC_ADMIN_SECRET=admin123
```

### 4. Direct Entry
Run the development server:
```bash
npm run dev
```
Access the site at `http://localhost:3000`.

---

## 🔐 Security & Access Control

### Admin Access (The "Ritual")
The Admin portal is hidden for maximum security. To access it:
1.  Navigate to any page on the website.
2.  Find the **"ChrisUrbanrealty" logo** in the top navbar.
3.  **Click the logo 5 times** rapidly.
4.  You will be redirected to the **Admin Authentication** page.
5.  Enter your `ADMIN_SECRET` to unlock the dashboard.

### User Authentication
Clients can sign up or log in using:
- **Email/Password**: Persistent accounts stored in the local JSON database.
- **Google Auth (Mock)**: A seamless demo of third-party authentication.

---

## 📁 File Structure

```text
src/
├── app/                  # Next.js App Router (Pages & API Routes)
│   ├── admin/            # Protected Dashboard
│   ├── auth/             # Login/Register Pages
│   ├── properties/       # Property Detail Pages
│   └── api/              # Backend Endpoints (Auth, Properties, Saved)
├── components/           # Reusable UI Architecture
│   ├── video-feed.tsx    # Core Reel Engine
│   ├── navbar.tsx        # Dynamic Global Navigation
│   └── contact-modal.tsx # Inquiry Handling
├── lib/                  # Utilities & Database Models
│   ├── json-db.ts        # File-based DB Logic
│   └── cloudinary.ts     # Media Service Config
└── types/                # TypeScript Definitions
```

---

## 📈 Roadmap & Future Scope
- **Interactive Maps**: Full MapBox integration for location exploring.
- **AI Chatbot**: Intelligent virtual assistant for instant property inquiries.
- **360° Tours**: Native support for VR/360 panoramic views within the feed.
- **Real-time Notifications**: Webhooks for new listing alerts and agent messages.

---

## 👨‍💼 Representative
All properties are managed exclusively by our lead agent: **Alain Christian**.

---

© 2026 ChrisUrbanrealty. Built for the future of Real Estate.
