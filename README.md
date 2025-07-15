# Blog Summariser & Translator

Live Demo: [https://nexium-ammar-assign2-redoo.vercel.app/](https://nexium-ammar-assign2-redoo.vercel.app/)

## Introduction

The **Blog Summariser & Translator** is a web application that allows users to:

- Input a blog URL
- Extract its core text content
- Generate a concise summary
- Translate that summary into Urdu

This full-stack project demonstrates modern development practices including web scraping, API routing, frontend/backend communication, and integration with Supabase for data persistence.

---

## Features

- **🔍 Web Scraping**

  - Fetches text from a blog URL using a Node.js API proxy to bypass CORS.

- **🧠 Intelligent Text Extraction**

  - Uses `jsdom` to parse HTML and clean unwanted content like scripts, styles, and common nav/meta sections.

- **✨ Simulated AI Summary**

  - Extracts initial sentences of the blog text to simulate a summary.

- **🌍 English to Urdu Translation**

  - Provides a basic dictionary-based word-by-word translation.

- **🕛 Data Persistence**

  - Saves blog URL and summary in Supabase.
  - Simulates saving full text in MongoDB (console log only).

- **📈 Modern UI**

  - React + Tailwind CSS for a responsive, clean interface (ShadCN-like aesthetics).

- **🌐 Vercel Deployment**

  - Optimized for deployment using serverless functions.

---

## 🔧 Technical Stack

| Tech                | Purpose                           |
| ------------------- | --------------------------------- |
| React               | Frontend UI                       |
| Parcel              | Bundler                           |
| Tailwind CSS        | Styling                           |
| Node.js             | Backend runtime                   |
| Express.js          | Local server                      |
| jsdom               | HTML parsing                      |
| node-fetch          | HTTP requests                     |
| Supabase            | PostgreSQL-based DB for summaries |
| MongoDB (simulated) | Placeholder for full text storage |
| Vercel              | Deployment (frontend + backend)   |

---

## 📂 Project Structure

```
Nexium_Ammar_Assign2/
├── public/                 # HTML entry
├── src/                   # React frontend
│   └── App.jsx
├── api/                   # Vercel serverless API
│   └── scrape.js
├── server.js              # Local Express server (for dev)
├── .env                   # Supabase credentials (local only)
├── package.json           # Project config & dependencies
├── vercel.json            # Vercel config
└── README.md              # You're reading it!
```

---

## 💡 Getting Started (Local Development)

### Prerequisites

- Node.js (v18+)
- pnpm (`npm install -g pnpm`)
- Git
- Supabase account

### Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/blackmangoo/Nexium_Ammar_Assign2.git
cd Nexium_Ammar_Assign2
```

#### 2. Install Dependencies

```bash
pnpm install
```

#### 3. Configure Supabase

- Create a Supabase project.
- Go to **Table Editor** > Create table `summaries` with:
  - `id` (uuid, PK, default: `gen_random_uuid()`)
  - `url` (text)
  - `summary_text` (text)
  - `full_text` (text)
  - `created_at` (timestamp, default: `now()`)
- Go to **Project Settings** > **API**:
  - Copy Project URL & Anon Public Key

#### 4. Create `.env` File (Local Only)

Create a `.env` file in the project root:

```
PARCEL_SUPABASE_URL=https://your-project-ref.supabase.co
PARCEL_SUPABASE_ANON_KEY=your_actual_anon_public_key_here
```

Note: On Vercel, use `SUPABASE_URL` and `SUPABASE_ANON_KEY` (without `PARCEL_` prefix).

#### 5. Run the App

```bash
pnpm run dev
```

- Frontend: `http://localhost:1234`
- API Server: `http://localhost:3001`

---

## 📆 How It Works

1. User enters a blog URL
2. Frontend sends POST to `/api/scrape`
3. Backend fetches and cleans article content
4. Summary is generated (first few sentences)
5. Urdu translation (if selected)
6. URL + summary saved to Supabase
7. UI displays result

---

## 🌐 Deployment (Vercel)

### 1. Link GitHub Repository

- Log in to Vercel
- Click **New Project** > Import your repo

### 2. Add Environment Variables

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

### 3. Deploy

Click **Deploy** — Vercel builds and hosts your app.

---

## ⚠️ Known Limitations

- Summary logic is static (no real AI)
- Urdu translation is dictionary-based
- MongoDB integration is simulated
- Web scraping limited to basic pages
- No user login/history features

---

## ✨ Future Enhancements

- Real summarization (Gemini or OpenAI)
- Real translation API (Google Translate, DeepL)
- Integrate MongoDB Atlas
- Add authentication and summary history
- Improve scraping for complex websites

---

## 📅 License

This project is **not open-source**.

---

Made with ❤️ by Ammar Akbar

