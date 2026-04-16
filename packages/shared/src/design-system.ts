/* IntelCore Design System - Design Tokens */

export const designTokens = {
  colors: {
    /* Brand - Deep Navy */
    brand: {
      950: '#020617',  /* Deepest background */
      900: '#0A1628',  /* Main background */
      800: '#0F1E34',  /* Card background */
      700: '#162B44',  /* Elevated surfaces */
      600: '#1E3A5F',  /* Borders */
    },
    
    /* Accent - Electric Blue */
    accent: {
      500: '#3B82F6',  /* Primary */
      400: '#60A5FA',  /* Hover */
      300: '#93C5FD',  /* Active */
      600: '#2563EB',  /* Pressed */
    },
    
    /* Semantic */
    success: {
      500: '#10B981',
      400: '#34D399',
    },
    warning: {
      500: '#F59E0B',
      400: '#FCD34D',
    },
    danger: {
      500: '#EF4444',
      400: '#F87171',
    },
    
    /* Neutrals */
    neutral: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
    
    /* Text */
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
      muted: '#64748B',
      inverse: '#020617',
    },
    
    /* Gradients */
    gradients: {
      primary: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
      surface: 'linear-gradient(180deg, #0F1E34 0%, #0A1628 100%)',
      hero: 'radial-gradient(ellipse at top, #1E3A5F 0%, #0A1628 50%, #020617 100%)',
    },
    
    /* Glows */
    glows: {
      blue: '0 0 40px rgba(59, 130, 246, 0.3)',
      purple: '0 0 40px rgba(139, 92, 246, 0.3)',
      green: '0 0 40px rgba(16, 185, 129, 0.3)',
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
    '4xl': 96,
  },
  
  radius: {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
    '2xl': 32,
    full: 9999,
  },
  
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
    glow: '0 0 30px rgba(59, 130, 246, 0.2)',
    'glow-lg': '0 0 60px rgba(59, 130, 246, 0.3)',
  },
  
  typography: {
    fontFamily: {
      sans: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace",
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  transitions: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '350ms ease',
    spring: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  zIndex: {
    base: 0,
    dropdown: 100,
    sticky: 200,
    modal: 300,
    popover: 400,
    tooltip: 500,
  },
};

/* CSS Variables for Web */
export const cssVariables = `
  :root {
    /* Colors */
    --color-brand-950: ${designTokens.colors.brand[950]};
    --color-brand-900: ${designTokens.colors.brand[900]};
    --color-brand-800: ${designTokens.colors.brand[800]};
    --color-brand-700: ${designTokens.colors.brand[700]};
    --color-brand-600: ${designTokens.colors.brand[600]};
    
    --color-accent-500: ${designTokens.colors.accent[500]};
    --color-accent-400: ${designTokens.colors.accent[400]};
    --color-accent-300: ${designTokens.colors.accent[300]};
    
    --color-text-primary: ${designTokens.colors.text.primary};
    --color-text-secondary: ${designTokens.colors.text.secondary};
    --color-text-muted: ${designTokens.colors.text.muted};
    
    /* Spacing */
    --spacing-xs: ${designTokens.spacing.xs}px;
    --spacing-sm: ${designTokens.spacing.sm}px;
    --spacing-md: ${designTokens.spacing.md}px;
    --spacing-lg: ${designTokens.spacing.lg}px;
    --spacing-xl: ${designTokens.spacing.xl}px;
    
    /* Radius */
    --radius-sm: ${designTokens.radius.sm}px;
    --radius-md: ${designTokens.radius.md}px;
    --radius-lg: ${designTokens.radius.lg}px;
    --radius-xl: ${designTokens.radius.xl}px;
    
    /* Shadows */
    --shadow-sm: ${designTokens.shadows.sm};
    --shadow-md: ${designTokens.shadows.md};
    --shadow-lg: ${designTokens.shadows.lg};
    --shadow-glow: ${designTokens.shadows.glow};
    
    /* Transitions */
    --transition-fast: ${designTokens.transitions.fast};
    --transition-normal: ${designTokens.transitions.normal};
    --transition-slow: ${designTokens.transitions.slow};
  }
`;