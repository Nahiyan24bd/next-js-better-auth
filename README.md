# 🔐 Next.js BetterAuth System

A modern, secure, and full-featured authentication & user management system built with **Next.js (App Router)**, **BetterAuth**, **HeroUI / Tailwind CSS**, and **MongoDB**.

---

## ✨ Features

- 🔑 **Complete Authentication**: Email/Password authentication powered by BetterAuth.
- 🌐 **OAuth Integration**: Social sign-in with **Google** and **GitHub**.
- ✉️ **Email Verification**: Instant account verification flow and resend verification link support.
- 🎨 **Dynamic Status UI**:
  - **Verified Users**: Clean green/emerald theme indicators.
  - **Unverified Users**: Warning amber/rose pulse indicators with action buttons.
- 👤 **Profile Management**:
  - Smooth toggle drawer for changing Display Name.
  - Secure Password Change with current password validation.
  - Update email address with verification workflow.
- 📊 **Dashboard Overview**: User metrics, role assignment (Member/Admin), account statistics, and custom user ID display.
- 🛠️ **Dedicated Services Page**: Clean bento grid showcase of application services.
- 💎 **Modern Light UI**: Built with accessible UI components, Tailwind CSS, and clean typography.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Authentication**: [BetterAuth](https://www.better-auth.com/)
- **Database**: MongoDB
- **Styling**: Tailwind CSS & [HeroUI](https://heroui.com/)
- **Icons**: Gravity UI Icons

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone [https://github.com/Nahiyan24bd/next-js-better-auth.git](https://github.com/Nahiyan24bd/next-js-better-auth.git)
cd next-js-better-auth


npm install
# or
yarn install
# or
pnpm install

# App URL
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# BetterAuth Secret (Generate via `openssl rand -base64 32`)
BETTER_AUTH_SECRET=your_better_auth_secret_key

# Database (MongoDB connection string)
MONGODB_URI=your_mongodb_connection_string

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Email Service (Resend / SMTP)
RESEND_API_KEY=your_resend_api_key


📁 Project Structure

├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/        # Sign In page
│   │   │   └── sign-up/        # Registration page
│   │   ├── api/
│   │   │   └── auth/           # BetterAuth API handler
│   │   ├── dashboard/          # Dynamic Dashboard with status cards
│   │   ├── profile/            # Profile settings & credentials update
│   │   ├── services/           # Services list page
│   │   ├── layout.jsx          # Root Layout & Global Navbar
│   │   └── page.jsx            # Landing / Home page
│   └── lib/
│       ├── auth.js             # Server-side BetterAuth configuration
│       └── auth-client.js      # Client-side BetterAuth instance
├── public/
└── README.md

🛡️ License
This project is open-source and available under the MIT License.