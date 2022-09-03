/* eslint-disable array-bracket-spacing */

export interface Theme {
  colors: {
    [K in ColorName]: Color
  }
  fonts: {
    [K in FontName]: string
  }
  breakpoints: {
    [K in BreakpointName]: Breakpoint
  }
  spacing: number,

  transitions: {
    [K in TransitionName]: Transition
  }
}

export type ColorName =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'info'
  | 'warn'
  | 'error'

export type FontName =
  | 'heading'
  | 'sans'
  | 'serif'

export type BreakpointName =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'

export interface Breakpoint {
  readonly min: number | null
  readonly max: number | null
}

export type RGB = [number, number, number]
export interface Color {
  value: RGB
  contrast: RGB
}

export type TransitionName =
  | 'fade'
  | 'slideIn'
  | 'slideOut'

export interface Transition {
  duration: number
  timing: string | { in: string, out: string }
}

export const defaultTheme: Theme = {
  colors: {
    primary: {
      value:    [  4, 120,  87],
      contrast: [220, 215, 209],
    },
    secondary: {
      value:    [194, 186, 173],
      contrast: [ 56,  54,  89],
    },
    tertiary: {
      value:    [220, 215, 209],
      contrast: [ 56,  54,  89],
    },
    success: {
      value:    [ 40, 167,  69],
      contrast: [220, 215, 209],
    },
    info: {
      value:    [  0, 123, 255],
      contrast: [220, 215, 209],
    },
    warn: {
      value:    [255, 193,   7],
      contrast: [ 56,  54,  89],
    },
    error: {
      value:    [230,  57,  70],
      contrast: [220, 215, 209],
    },
  },
  fonts: {
    sans: 'Encode Sans Expanded, sans-serif',
    serif: 'Scope One, serif',
    heading: 'Eczar, serif',
  },
  breakpoints: {
    xs: { min: null, max:  639.99 },
    sm: { min:  640, max:  767.99 },
    md: { min:  768, max: 1023.99 },
    lg: { min: 1024, max: 1535.99 },
    xl: { min: 1536, max:    null },
  },
  spacing: 8,
  transitions: {
    fade: {
      duration: 150,
      timing: 'ease-out',
    },
    slideIn: {
      duration: 300,
      timing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    },
    slideOut: {
      duration: 300,
      timing: 'cubic-bezier(calc(1 - 0.32), 0, calc(1 - 0.23), 0)',
    },
  },
}
