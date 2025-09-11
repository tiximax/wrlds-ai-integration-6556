# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a React-based company website for Global Shopping Assistant built with Vite, TypeScript, and shadcn/ui components. The project showcases international shopping services through a professional marketing site with blog functionality, service showcases, and company information pages.

## Development Commands

### Core Development
- `npm run dev` - Start the development server on port 8080
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

### Package Management
This project supports both npm and bun (lockfiles present for both). Use npm for consistency.

## Architecture Overview

### Tech Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Styling**: Tailwind CSS with custom WRLDS brand colors
- **Component Library**: shadcn/ui (Radix UI primitives)
- **Routing**: React Router DOM
- **State Management**: TanStack Query for server state
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form with Zod validation
- **Email**: EmailJS integration for contact forms

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components (accordion, button, etc.)
│   ├── Hero.tsx        # Landing page hero section
│   ├── Features.tsx    # Features showcase
│   ├── Projects.tsx    # Project portfolio display
│   └── ...             # Other page components
├── pages/              # Route components
│   ├── Index.tsx       # Homepage
│   ├── Blog.tsx        # Blog listing page
│   ├── BlogPostDetail.tsx  # Individual blog posts
│   └── ...             # Project detail pages
├── data/               # Static data and content
│   └── blogPosts.ts    # Blog post content and metadata
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── main.tsx           # Application entry point
```

### Key Architectural Patterns

**Component Organization**:
- Page components in `/pages/` handle routing and layout
- Reusable components in `/components/` for shared functionality
- UI primitives in `/components/ui/` following shadcn/ui patterns
- `PageLayout` component provides consistent header/footer structure

**Styling Architecture**:
- Tailwind CSS with custom WRLDS brand colors (`wrlds-teal`, `wrlds-dark`, etc.)
- CSS variables for theming support
- Custom animations defined in `tailwind.config.ts`
- Responsive-first design approach

**Data Management**:
- Static content managed in TypeScript files (`blogPosts.ts`)
- Type-safe interfaces for all data structures
- TanStack Query for any future API integration

**Routing Structure**:
- `/` - Homepage with hero, features, projects
- `/blog` - Blog post listing
- `/blog/:slug` - Individual blog posts
- `/projects/*` - Individual project showcase pages
- `/about`, `/careers`, `/privacy-policy` - Company pages

## shadcn/ui Integration

This project uses shadcn/ui components extensively. Key configuration:
- Components located in `@/components/ui/`
- Tailwind config includes shadcn/ui CSS variables
- Base color scheme: slate
- Path aliases configured for clean imports (`@/components`, `@/lib`, etc.)

To add new shadcn/ui components:
```bash
npx shadcn-ui@latest add [component-name]
```

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint configuration with React hooks rules
- Path aliases use `@/` prefix for clean imports
- Component files use PascalCase naming

### Brand Consistency
- Use GSA (Global Shopping Assistant) brand colors defined in `tailwind.config.ts`
- Custom animations follow the established design system  
- Space Grotesk font family for typography
- Maintain professional, service-focused tone with Vietnamese language support

### Content Management
- Blog posts about shopping guides and international commerce managed in `src/data/blogPosts.ts`
- Rich content structure supports various content types (paragraphs, tables, stats, charts)
- SEO metadata optimized for shopping and cross-border commerce keywords
- Multilingual support (Vietnamese and English)
- Images stored in `public/` directory

### Performance Considerations
- Vite with SWC for fast development builds
- React.lazy() for code splitting if needed
- Optimized images and assets
- Development server configured for host "::" on port 8080

## Specific Implementation Notes

### Contact Forms
- EmailJS integration for form submissions
- React Hook Form with Zod validation
- Floating contact button component for easy access

### Blog System
- Static blog posts with rich content structure
- SEO-optimized with meta descriptions and keywords
- Supports multiple content types (stats, charts, tables, etc.)
- Slug-based routing for individual posts

### Project Showcases
- Individual pages for each project (FireCat, SportRetail, Workwear, etc.)
- Consistent layout using `ProjectPageLayout` component
- Interactive elements with Framer Motion animations

### Lovable Integration
- This project was created with Lovable (lovable.dev)
- `lovable-tagger` plugin included for development mode
- Automatic tagging system for component identification

## Common Tasks

### Adding New Blog Posts
1. Add post object to `blogPosts` array in `src/data/blogPosts.ts`
2. Include proper SEO metadata and content structure
3. Test the blog detail page routing

### Adding New Project Pages
1. Create new component in `src/pages/`
2. Add route to `App.tsx`
3. Use `ProjectPageLayout` for consistency
4. Update navigation if needed

### Modifying Brand Colors
- Update color definitions in `tailwind.config.ts`
- Colors follow WRLDS brand guidelines (teal, dark, light, accent, muted)
- Test across all components for consistency

This project represents a professional international shopping service website with modern React practices, comprehensive TypeScript usage, multilingual support, and a focus on performance and maintainability. The site serves customers looking to purchase products from Japan, Korea, and the USA.
