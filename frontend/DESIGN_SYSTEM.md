# LYNX Design System 🎨

A modern, professional design system for the LYNX blockchain analytics platform.

## Design Philosophy

- **Professional**: Clean, corporate-grade interface suitable for financial and blockchain applications
- **User-Friendly**: Intuitive navigation and clear information hierarchy
- **Structured**: Consistent spacing, typography, and component patterns
- **Modern**: Contemporary design trends with subtle animations and micro-interactions

## Color Palette

### Primary Colors
- **Blue**: `#3b82f6` - Primary brand color for buttons, links, and highlights
- **Purple**: `#8b5cf6` - Secondary accent for gradients and special elements
- **Slate**: `#64748b` - Neutral text and borders

### Semantic Colors
- **Success**: `#22c55e` - Positive actions and status
- **Warning**: `#f59e0b` - Caution and alerts
- **Error**: `#ef4444` - Errors and destructive actions
- **Info**: `#3b82f6` - Information and neutral status

### Background Colors
- **Primary**: `#f8fafc` - Main background
- **Secondary**: `#f1f5f9` - Card backgrounds
- **Tertiary**: `#e2e8f0` - Subtle backgrounds

## Typography

### Font Family
- **Primary**: Inter (300, 400, 500, 600, 700, 800)
- **Monospace**: JetBrains Mono (400, 500, 600)

### Font Sizes
- **Display**: `text-5xl md:text-7xl` - Hero titles
- **Heading 1**: `text-4xl` - Page titles
- **Heading 2**: `text-2xl` - Section titles
- **Heading 3**: `text-xl` - Subsection titles
- **Body**: `text-base` - Regular text
- **Small**: `text-sm` - Captions and metadata

## Component Library

### Buttons

#### Primary Button
```css
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md active:scale-95;
}
```

#### Secondary Button
```css
.btn-secondary {
  @apply bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 shadow-sm hover:shadow-md active:scale-95;
}
```

#### Outline Button
```css
.btn-outline {
  @apply border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}
```

### Cards

#### Standard Card
```css
.card {
  @apply bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-200;
}
```

#### Elevated Card
```css
.card-elevated {
  @apply bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-200;
}
```

#### Glass Card
```css
.card-glass {
  @apply backdrop-blur-sm bg-white/90 rounded-xl shadow-lg border border-white/20 p-6;
}
```

### Input Fields
```css
.input-field {
  @apply w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md;
}
```

### Navigation Tabs
```css
.nav-tab {
  @apply px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

.nav-tab-active {
  @apply bg-blue-600 text-white shadow-md;
}

.nav-tab-inactive {
  @apply bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900;
}
```

## Layout System

### Container
- **Max Width**: `max-w-7xl` (1280px)
- **Padding**: `px-4 py-8` (mobile), `px-8` (desktop)
- **Centered**: `mx-auto`

### Grid System
- **Responsive**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **Flexible**: Adapts to content and screen size

### Spacing Scale
- **XS**: `space-y-2` (8px)
- **SM**: `space-y-3` (12px)
- **MD**: `space-y-4` (16px)
- **LG**: `space-y-6` (24px)
- **XL**: `space-y-8` (32px)
- **2XL**: `space-y-12` (48px)

## Animations

### Transitions
- **Fast**: `duration-200` (200ms)
- **Medium**: `duration-300` (300ms)
- **Slow**: `duration-500` (500ms)

### Entrance Animations
- **Fade In**: `fade-in` - Opacity animation
- **Slide Up**: `slide-up` - Slide from bottom
- **Scale In**: `scale-in` - Zoom in effect

### Micro-interactions
- **Hover**: Scale and shadow changes
- **Active**: Scale down on click
- **Focus**: Ring outline for accessibility

## Status Indicators

### Success
```css
.status-success {
  @apply bg-green-50 border-green-200 text-green-800;
}
```

### Warning
```css
.status-warning {
  @apply bg-yellow-50 border-yellow-200 text-yellow-800;
}
```

### Error
```css
.status-error {
  @apply bg-red-50 border-red-200 text-red-800;
}
```

### Info
```css
.status-info {
  @apply bg-blue-50 border-blue-200 text-blue-800;
}
```

## Shadows

### Soft Shadow
```css
.shadow-soft {
  box-shadow: 0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04);
}
```

### Medium Shadow
```css
.shadow-medium {
  box-shadow: 0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
```

## Accessibility

### Focus States
- All interactive elements have visible focus rings
- High contrast colors for text and backgrounds
- Proper heading hierarchy

### Keyboard Navigation
- Tab order follows logical flow
- Skip links for main content
- Escape key closes modals and menus

### Screen Reader Support
- Proper ARIA labels
- Semantic HTML structure
- Alt text for images

## Responsive Design

### Breakpoints
- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`

### Mobile-First Approach
- Base styles for mobile
- Progressive enhancement for larger screens
- Touch-friendly button sizes (44px minimum)

## Best Practices

### Component Usage
1. Use semantic class names
2. Maintain consistent spacing
3. Follow the established color palette
4. Include proper hover and focus states

### Performance
1. Minimize CSS bundle size
2. Use efficient animations
3. Optimize images and assets
4. Implement lazy loading where appropriate

### Maintenance
1. Document component changes
2. Test across different browsers
3. Validate accessibility compliance
4. Update design tokens consistently

## Implementation Notes

This design system is built with:
- **Tailwind CSS** for utility-first styling
- **CSS Custom Properties** for theming
- **PostCSS** for processing
- **Vite** for fast development and building

The system is designed to be:
- **Scalable**: Easy to extend with new components
- **Maintainable**: Clear naming conventions and structure
- **Consistent**: Unified design language across the application
- **Accessible**: WCAG 2.1 AA compliant
