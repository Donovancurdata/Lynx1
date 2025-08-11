# Vite Setup for Lynx Frontend

This project now supports both Next.js and Vite build tools.

## Available Scripts

### Next.js (Original)
- `npm run dev` - Start Next.js development server (port 3000)
- `npm run build` - Build Next.js application
- `npm run start` - Start Next.js production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Vite (New)
- `npm run vite` or `npm run vite:dev` - Start Vite development server (port 3001)
- `npm run vite:build` - Build Vite application
- `npm run vite:preview` - Preview Vite production build

## Project Structure

```
frontend/
├── app/                    # Next.js App Router (original)
├── components/             # Shared components
├── services/              # API services
├── src/                   # Vite source files (new)
│   ├── main.tsx          # Vite entry point
│   ├── App.tsx           # Main App component
│   ├── App.css           # App styles
│   └── index.css         # Global styles
├── index.html            # Vite HTML entry point
├── vite.config.ts        # Vite configuration
├── tsconfig.vite.json    # Vite TypeScript config
└── tsconfig.node.json    # Node.js TypeScript config
```

## Development

You can run both development servers simultaneously:

1. **Next.js**: `npm run dev` (port 3000)
2. **Vite**: `npm run vite:dev` (port 3001)

## Migration Notes

- Vite uses a different file structure with `src/` directory
- Vite requires an `index.html` entry point
- Both setups can share components and services
- Vite offers faster hot module replacement and build times

## Benefits of Vite

- ⚡ Lightning fast hot module replacement
- 🚀 Instant server start
- 📦 Optimized builds with esbuild
- 🔧 Rich plugin ecosystem
- 🎯 Better development experience
