# PhytoNova AI

AI-powered agriculture platform for plant disease detection, analytics, marketplace, and community-driven farming insights.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| 3D Graphics | Three.js + React Three Fiber |
| Backend | Supabase (Auth, Database, Storage) |
| AI Inference | Hugging Face Inference API |
| Charts | Recharts |
| Icons | React Icons |

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#22c55e` | CTAs, links, accents |
| `secondary` | `#06b6d4` | Secondary accents |
| `background` | `#0f172a` | Page background |
| `text-primary` | `#f8fafc` | Headings, body text |
| `text-secondary` | `#94a3b8` | Muted text, labels |
| Surface | `rgba(255,255,255,0.08)` | Glass cards |

## Folder Structure

```
PhytoNova-AI/
├── public/
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── 3d/              # React Three Fiber scenes
│   │   ├── layout/          # Navbar, Footer, Layout, ProtectedRoute
│   │   └── ui/              # Avatar, Badge, GlassCard, SectionWrapper, SkipLink
│   ├── context/
│   │   ├── AuthContext.jsx  # Supabase auth state
│   │   ├── CartContext.jsx  # Cart state with localStorage persistence
│   │   └── ThemeContext.jsx # Dark mode context + tw() utility
│   ├── data/
│   │   └── products.js      # Static marketplace product catalogue
│   ├── hooks/
│   │   └── useAuth.js       # useAuth hook alias
│   ├── pages/
│   │   ├── Auth/            # AuthPage, LoginForm, RegisterForm
│   │   ├── Community/       # CommunityPage, PostCard, CreatePost
│   │   ├── Dashboard/       # DashboardPage, StatsCards, RecentScans, ActivityTimeline, DiseaseChart
│   │   ├── Detection/       # DetectionPage, UploadZone, ResultPanel, HistoryPanel
│   │   ├── Home/            # HomePage, HeroSection, FeaturesSection, StatsSection, TestimonialsSection
│   │   ├── Marketplace/     # MarketplacePage, ProductCard, ProductDetail, SearchFilter, CartDrawer
│   │   └── Profile/         # ProfilePage
│   ├── routes/
│   │   └── index.jsx        # Route definitions with lazy loading
│   ├── services/
│   │   ├── aiService.js     # Hugging Face inference wrapper
│   │   ├── api.js           # Axios instance with base config
│   │   └── supabase.js      # Supabase client + auth helpers
│   ├── utils/
│   │   ├── a11y.js          # Focus trap, focus ring, announce helpers
│   │   └── treatments.js    # Disease → treatment mapping
│   ├── App.jsx
│   └── main.jsx
├── supabase/
│   └── migrations/
│       └── 001_initial.sql  # Auth, profiles, detections, posts, comments, likes
├── .env.example
├── vercel.json
├── package.json
└── tailwind.config.js
```

## Setup

### Prerequisites

- Node.js 18+
- npm or pnpm
- A [Supabase](https://supabase.com) project
- A [Hugging Face](https://huggingface.co) account with an inference token

### 1. Clone and install

```bash
git clone https://github.com/your-org/PhytoNova-AI.git
cd PhytoNova-AI
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and fill in:

| Variable | Where to find it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → anon public key |
| `VITE_HF_API_TOKEN` | huggingface.co/settings/tokens (Needs `inference` scope) |
| `VITE_APP_URL` | Your deployment URL (e.g. `https://my-app.vercel.app`) |

### 3. Initialize the Supabase database

Run the migration in the Supabase SQL editor:

1. Open your Supabase project dashboard.
2. Go to **SQL Editor**.
3. Open `supabase/migrations/001_initial.sql` and paste the contents.
4. Click **Run**.

This creates the following tables:

- `profiles` — extends `auth.users` with full name and avatar
- `detections` — stores each disease scan (image URL, disease label, confidence, treatment)
- `posts` — community posts (title, content, image, author)
- `comments` — replies to posts
- `likes` — post reactions

Row Level Security (RLS) policies restrict all writes to the owning user.

### 4. Start development server

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

## Build

```bash
npm run build
```

Output is written to `dist/`. Preview the production build locally:

```bash
npm run preview
```

## Deploy to Vercel

### Option A — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

Set the environment variables in the Vercel dashboard under **Settings → Environment Variables** (match the keys from `.env.example`).

### Option B — Vercel Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/PhytoNova-AI)

After deployment, add the environment variables in the Vercel project settings.

### Post-deploy checklist

1. Update `public/robots.txt` with your production domain.
2. Update `public/sitemap.xml` with your production domain and correct `<lastmod>` dates.
3. In Supabase, add your production URL to **Authentication → URL Configuration → Site URL** and **Redirect URLs**.
4. Set `VITE_APP_URL` to your production domain in Vercel environment variables.

## License

MIT — free to use and modify.