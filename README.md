# Swappio Frontend

A modern, responsive marketplace platform built with Next.js 14, TypeScript, and Tailwind CSS. This is an OLX-style online marketplace where users can buy, sell, or exchange pre-owned items.

## Features

### ✨ Core Features
- **Authentication**: Login/Signup with NextAuth (Email + Google OAuth)
- **Home Page**: Browse all listings with search, filters, and infinite scroll
- **Post Ad**: Create listings with multiple image uploads (Cloudinary integration)
- **Listing Details**: View full ad details with image carousel and seller info
- **Chat**: Real-time messaging UI (Socket.io ready)
- **Dashboard**: Manage listings, favorites, and messages
- **Admin Panel**: Manage users, listings, and reports
- **Favorites**: Save items for later viewing

### 🎨 UI/UX
- Clean, minimal design inspired by OLX
- Fully responsive for mobile, tablet, and desktop
- shadcn/ui components for consistent theming
- Skeleton loaders for better UX
- Toast notifications
- Accessible and SEO optimized

### ⚡ Performance
- Server-side rendering (SSR) with Next.js App Router
- Lazy loading for images
- Optimized bundle size
- Fast page transitions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: Zustand
- **Authentication**: NextAuth (ready for integration)
- **Image Upload**: Cloudinary (ready for integration)
- **Real-time Chat**: Socket.io (UI ready)
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel
│   ├── auth/              # Authentication pages
│   ├── chat/              # Chat interface
│   ├── dashboard/         # User dashboard
│   ├── favorites/         # Saved listings
│   ├── listing/[id]/      # Listing details
│   ├── post-ad/           # Create new listing
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── layout/            # Layout components (Navbar, Sidebar)
│   ├── listing/           # Listing-related components
│   ├── ui/                # shadcn/ui components
│   └── ...
├── lib/                   # Utility functions
│   ├── mockData.ts        # Mock data for development
│   └── utils.ts           # Helper functions
├── services/              # API services
│   └── api.ts             # API client and services
├── stores/                # Zustand stores
│   ├── authStore.ts       # Authentication state
│   ├── listingStore.ts    # Listings state
│   └── chatStore.ts       # Chat state
├── types/                 # TypeScript types
│   └── index.ts           # Type definitions
└── hooks/                 # Custom React hooks
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nmanikumar5/Swappio-FE.git
cd Swappio-FE
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your configuration values.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Mock Data

The application currently uses mock data for development. Mock data is available in:
- `src/lib/mockData.ts` - Sample listings, users, and categories
- `src/services/api.ts` - Simulated API calls with delays

## Backend Integration
Local backend integration
-------------------------

To use the real Swappio backend locally instead of mock data:

1. Ensure the backend is running on port 5001 (or set `NEXT_PUBLIC_API_URL`).
2. Update `Swappio-FE/.env.local` with:

```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
```

3. Seed backend with sample listings (on the backend project):

```
# from Swappio-BE
# install dev deps: npm install --save-dev faker minimist ts-node
npm run seed -- --count=10000
```

4. Start backend (`npm run dev`) and frontend (`yarn dev`), open http://localhost:3000


The frontend is ready to integrate with a backend API. Update the following:

1. Configure `NEXT_PUBLIC_API_URL` in `.env.local`
2. Update service functions in `src/services/api.ts` to make real API calls
3. Set up NextAuth providers in `src/app/api/auth/[...nextauth]/route.ts`
4. Configure Socket.io client to connect to your server

## Component Library

This project uses shadcn/ui components. To add more components:

```bash
npx shadcn@latest add [component-name]
```

Available components: button, input, card, badge, dialog, dropdown-menu, select, textarea, skeleton, toast, tabs, avatar, label

## State Management

Using Zustand for global state:

- **authStore**: User authentication state
- **listingStore**: Listings, filters, and favorites
- **chatStore**: Chat conversations and messages

## Styling

Tailwind CSS with custom theme configuration. Color palette uses neutral tones for a clean, modern look.

Custom CSS variables are defined in `src/app/globals.css` for easy theming.

## Authentication Flow

1. User visits `/auth/signin` or `/auth/signup`
2. Can sign in with email/password or Google OAuth
3. NextAuth handles session management
4. Protected routes check authentication status
5. User profile accessible at `/dashboard`

## Image Upload

Configured for Cloudinary:
1. User selects images in Post Ad form
2. Images are uploaded to Cloudinary
3. URLs are stored with the listing
4. Lazy loading for optimal performance

## Real-time Chat

Socket.io integration ready:
1. UI components in `/chat` page
2. Chat store for state management
3. Connect to Socket.io server when backend is ready
4. Real-time message updates

## Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly UI elements
- Optimized images for different screen sizes

## SEO Optimization

- Metadata configuration in each page
- Semantic HTML
- Server-side rendering
- Optimized images with Next.js Image component
- Proper heading hierarchy

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design inspired by OLX
- UI components from shadcn/ui
- Icons from Lucide React
- Built with Next.js and Tailwind CSS
