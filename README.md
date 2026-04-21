# 🗺️ SPI Member Tracker

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.2-black.svg?logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC.svg?logo=tailwind-css)
![SQLite](https://img.shields.io/badge/SQLite-LibSQL-003B57.svg?logo=sqlite)

A premium, role-based spatial visualizer and tracker designed for field operations. SPI Member Tracker brings enterprise-level mapping capabilities with a sleek, dark-themed ""Antigravity"" aesthetic.

## ✨ Features

- 🔐 **Role-Based Authentication**: Secure login system with distinct user (Deliman) and Admin experiences, powered by Better Auth.
- 🗺️ **Interactive Maps**: High-performance interactive mapping using Leaflet and React-Leaflet.
- 🔥 **Heatmap Visualization**: Visual density tracking for operational insights.
- 📱 **Mobile-First Design**: Fully responsive interface tailored for field use on any device.
- 🌙 **Premium Dark Mode**: Sophisticated ""Antigravity"" dark theme for reduced eye strain and modern appeal.
- ⚡ **Lightning Fast**: Built on Next.js 16 App Router for optimal performance.
- 🗄️ **Local-First Database**: Uses LibSQL/SQLite via Drizzle ORM for robust data management.

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4, Lucide Icons, Shadcn UI
- **Database**: SQLite (LibSQL)
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth
- **Mapping**: Leaflet, Leaflet-heat

## 💻 Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tetsuyaid72/spi-tracker-member.git
   cd spi-tracker-member
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add:
   ```env
   BETTER_AUTH_SECRET=your-super-secret-key
   BETTER_AUTH_URL=http://localhost:3000
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
   ```

4. Push the database schema:
   ```bash
   npx drizzle-kit push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment

This application is ready to be deployed to any VPS (Ubuntu/Debian) using PM2 and Nginx, or modern platforms like Vercel.

## 📄 License

Proprietary - All Rights Reserved.
