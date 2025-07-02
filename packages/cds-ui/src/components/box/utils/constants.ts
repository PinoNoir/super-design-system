// Define mappings from prop names to CSS custom properties
export const DESIGN_TOKEN_MAPPINGS = {
  // Colors
  color: {
    transparent: 'var(--color-transparent)',
    white: 'var(--color-white)',
    'light-gray': 'var(--color-light-gray)',
    black: 'var(--color-black)',
    orange: 'var(--color-orange)',
    slate: 'var(--color-slate)',
    // Neutral colors
    'neutral-5': 'var(--color-neutral-5)',
    'neutral-10': 'var(--color-neutral-10)',
    'neutral-20': 'var(--color-neutral-20)',
    'neutral-30': 'var(--color-neutral-30)',
    'neutral-40': 'var(--color-neutral-40)',
    'neutral-50': 'var(--color-neutral-50)',
    'neutral-60': 'var(--color-neutral-60)',
    'neutral-70': 'var(--color-neutral-70)',
    'neutral-80': 'var(--color-neutral-80)',
    'neutral-90': 'var(--color-neutral-90)',
    'neutral-100': 'var(--color-neutral-100)',
    'neutral-120': 'var(--color-neutral-120)',
    // Teal colors
    'teal-10': 'var(--color-teal-10)',
    'teal-20': 'var(--color-teal-20)',
    'teal-30': 'var(--color-teal-30)',
    'teal-40': 'var(--color-teal-40)',
    'teal-50': 'var(--color-teal-50)',
    'teal-60': 'var(--color-teal-60)',
    'teal-70': 'var(--color-teal-70)',
    'teal-80': 'var(--color-teal-80)',
    'teal-90': 'var(--color-teal-90)',
    'teal-100': 'var(--color-teal-100)',
    // Add other color scales as needed...
    'blue-10': 'var(--color-blue-10)',
    'blue-50': 'var(--color-blue-50)',
    'green-10': 'var(--color-green-10)',
    'green-50': 'var(--color-green-50)',
    'yellow-10': 'var(--color-yellow-10)',
    'yellow-50': 'var(--color-yellow-50)',
    'red-10': 'var(--color-red-10)',
    'red-50': 'var(--color-red-50)',
  },

  // Spacing (works for padding, margin, gap, etc.)
  space: {
    '0': 'var(--space-0)',
    '2': 'var(--space-2)',
    '4': 'var(--space-4)',
    '8': 'var(--space-8)',
    '12': 'var(--space-12)',
    '16': 'var(--space-16)',
    '24': 'var(--space-24)',
    '32': 'var(--space-32)',
    '40': 'var(--space-40)',
    '48': 'var(--space-48)',
  },

  // Sizes
  size: {
    '12': 'var(--size-12)',
    '14': 'var(--size-14)',
    '16': 'var(--size-16)',
    '20': 'var(--size-20)',
    '24': 'var(--size-24)',
    '28': 'var(--size-28)',
    '32': 'var(--size-32)',
    '36': 'var(--size-36)',
    '40': 'var(--size-40)',
    '48': 'var(--size-48)',
    '64': 'var(--size-64)',
  },

  // Border radius
  borderRadius: {
    '0': 'var(--border-radius-0)',
    '1': 'var(--border-radius-1)',
    '2': 'var(--border-radius-2)',
    '3': 'var(--border-radius-3)',
    '4': 'var(--border-radius-4)',
    '5': 'var(--border-radius-5)',
    '8': 'var(--border-radius-8)',
    round: 'var(--border-radius-round)',
  },

  // Shadows
  shadow: {
    'bottom-2': 'var(--shadow-bottom-2)',
    'bottom-4': 'var(--shadow-bottom-4)',
    'bottom-8': 'var(--shadow-bottom-8)',
    'bottom-12': 'var(--shadow-bottom-12)',
    'bottom-24': 'var(--shadow-bottom-24)',
    'right-2': 'var(--shadow-right-2)',
    'right-4': 'var(--shadow-right-4)',
    'left-2': 'var(--shadow-left-2)',
    'left-4': 'var(--shadow-left-4)',
  },

  // Font sizes
  fontSize: {
    h1: 'var(--font-size-h1)',
    h2: 'var(--font-size-h2)',
    h3: 'var(--font-size-h3)',
    h4: 'var(--font-size-h4)',
    h5: 'var(--font-size-h5)',
    h6: 'var(--font-size-h6)',
    body: 'var(--font-size-body)',
    label: 'var(--font-size-label)',
    sm: 'var(--font-size-sm)',
    xs: 'var(--font-size-xs)',
  },

  // Z-index
  zIndex: {
    toast: 'var(--z-index-toast)',
    modal: 'var(--z-index-modal)',
    mask: 'var(--z-index-mask)',
    navbar: 'var(--z-index-navbar)',
    popover: 'var(--z-index-popover)',
    menu: 'var(--z-index-menu)',
    header: 'var(--z-index-header)',
    content: 'var(--z-index-content)',
    negative: 'var(--z-index-negative)',
  },
} as const;
