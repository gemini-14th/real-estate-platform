# 🏙️ ChrisUrbanrealty - Immersive Real Estate Platform

Welcome to **ChrisUrbanrealty**, a high-end, immersive real estate platform designed for the modern era. Inspired by the dynamic engagement of short-form video content, this platform transforms the traditional property search into a visually stunning, "TikTok-style" experience.

---

## ✨ Project Highlights

- **Immersive Video Feed**: A full-screen, scrollable video feed that allows users to experience properties as if they were there.
- **Premium Aesthetics**: A dark-mode, glassmorphic design system using deep blacks, vibrant primaries, and smooth animations.
- **Smart Search**: Filter by location, price, and property type (Buy/Rent) with real-time results.
- **Simple Inquiry**: Direct contact options for every property listing.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Data** | Static Mock Data (Kenyan Real Estate) |

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

### 3. Running Locally
Run the development server:
```bash
npm run dev
```
Access the site at `http://localhost:3000`.

---

## 📁 File Structure

```text
src/
├── app/                  # Next.js App Router (Pages & API Routes)
│   ├── properties/       # Property Detail Pages
│   ├── search/           # Search and Discovery Page
│   └── api/              # Backend Endpoints
├── components/           # Reusable UI Architecture
│   ├── video-feed.tsx    # Core Reel Engine
│   ├── navbar.tsx        # Dynamic Global Navigation
│   └── contact-modal.tsx # Inquiry Handling
├── lib/                  # Utilities & Data
│   ├── data.ts           # Property List (Mock Data)
│   └── utils.ts          # Styling Utilities
└── types/                # TypeScript Definitions
```

---

## 📈 Roadmap & Future Scope
- **Interactive Maps**: Full MapBox integration for location exploring.
- **AI Chatbot**: Intelligent virtual assistant for instant property inquiries.
- **360° Tours**: Native support for VR/360 panoramic views within the feed.

---

## 👨‍💼 Representative
All properties are managed exclusively by our lead agent: **Alain Christian**.

---

© 2026 ChrisUrbanrealty. Built for the future of Real Estate.
