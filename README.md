# Swappio-FE

A modern, responsive OLX-style marketplace frontend built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Core Functionality
- 🏠 **Home Page** - Product listings with grid layout, search, and filters
- 🔍 **Advanced Search & Filters** - Category, price range, condition, location filters
- 📝 **Post Ad** - Create listings with image uploads (Cloudinary integration ready)
- 📱 **Product Details** - Comprehensive product view with image gallery
- 💬 **Chat System** - Real-time messaging interface (Socket.io ready)
- ❤️ **Favourites** - Save and manage favorite listings
- 📊 **User Dashboard** - Manage your listings and account
- 👑 **Admin Panel** - User and product management
- 🔐 **Authentication** - Sign in/Sign up pages (NextAuth integration ready)

### Technical Features
- ⚡ **Next.js 16** with App Router and Server Components
- 🎨 **Tailwind CSS v4** for styling
- 📦 **Zustand** for state management
- 🎭 **shadcn/ui** components
- 🖼️ **Lazy Loading** - Optimized image loading with Next.js Image
- 📱 **Responsive Design** - Mobile-first approach
- 🔎 **SEO Optimized** - Meta tags, sitemap, robots.txt
- ♿ **Accessible** - ARIA labels and keyboard navigation

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/nmanikumar5/Swappio-FE.git
cd Swappio-FE
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel
│   ├── auth/              # Authentication pages
│   ├── chat/              # Chat interface
│   ├── dashboard/         # User dashboard
│   ├── favourites/        # Saved items
│   ├── post-ad/           # Create listing
│   ├── product/[id]/      # Product details
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── sitemap.ts         # SEO sitemap
│   └── robots.ts          # SEO robots
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── CategoryFilter.tsx
│   ├── FilterSidebar.tsx
│   ├── Header.tsx
│   └── ProductCard.tsx
├── lib/                   # Utility functions
│   └── utils.ts
├── store/                 # Zustand store
│   └── index.ts
└── types/                 # TypeScript types
    └── index.ts
```

## Key Technologies

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Image Optimization**: Next.js Image
- **Authentication**: NextAuth (ready to integrate)
- **Real-time Chat**: Socket.io-client (ready to integrate)
- **Image Upload**: Cloudinary (ready to integrate)

## Features in Detail

### Home Page
- Product grid with responsive layout
- Category-based navigation
- Advanced filtering sidebar
- Search functionality
- Sort options (newest, price, popularity)

### Product Listing
- Multi-image upload support
- Category selection
- Condition specification
- Price and location input
- Rich text description

### Product Details
- Image gallery with thumbnails
- Seller information
- Contact options (chat, phone)
- Favorite/bookmark functionality
- Share functionality

### User Dashboard
- View active and sold listings
- Performance statistics
- Account settings
- Quick actions

### Admin Panel
- User management
- Product moderation
- Report handling
- Analytics dashboard

## Environment Variables

Create a `.env.local` file for environment-specific configuration:

```env
# Authentication (NextAuth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Cloudinary (Image Upload)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# Socket.io (Real-time Chat)
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Image lazy loading with Next.js Image
- Code splitting and dynamic imports
- Optimized package imports
- Server components for static content
- Client components only where needed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspiration from OLX
- UI components from shadcn/ui
- Icons from Lucide React
