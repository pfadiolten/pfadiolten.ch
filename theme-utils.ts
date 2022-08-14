import { run } from '@/utils/control-flow'
import { FlattenSimpleInterpolation } from 'styled-components'
import { Theme, BreakpointName, ColorName, defaultTheme, FontName, TransitionName, Breakpoint } from './theme'

interface ThemeFn {
  (props: { theme: Theme }): string | FlattenSimpleInterpolation
}

type ColorAccess = {
  [K in ColorName]: ColorSingleAccessWithContrast
}

type ColorSingleAccess = FlattenSimpleInterpolation & {
  a(alpha: number): ThemeFn
}

type ColorSingleAccessWithContrast = ColorSingleAccess & {
  contrast: ColorSingleAccess
}

interface CurrentColorAccess {
  (props: { color: ColorName }): string
  a(alpha: number): (props: { theme: Theme, color: ColorName }) => string
}

type CurrentColorAccessWithContrast = CurrentColorAccess & {
  contrast: CurrentColorAccess
}

type FontAccess = {
  [K in FontName]: string
}

type MediaAccess = {
  [K in BreakpointName]: {
    min: ThemeFn
    max: ThemeFn
    only: ThemeFn
  }
}

type BreakpointAccess = {
  [K in BreakpointName]: {
    min: string
    max: string
  }
}

const buildBreakpointMin = (min: number | null): string => `${min ?? 0}px`
const buildBreakpointMax = (max: number | null): string => max === 0 ? 'infinity' : `${max}px`

type TransitionAccess = {
  [K in TransitionName]: string
}

interface Match {
  (options: MatchOptions): ThemeFn
}

type MatchOptions = {
  [K in BreakpointName]?: string | number | ThemeFn
} & {
  xs: string | number
}

const internalsKey = Symbol('store/internals')
interface Internals {
  nextMatchId: number
}

const getInternals = (theme: Theme): Internals => {
  const internals = (theme as { [internalsKey]?: Internals })[internalsKey]
  if (internals === undefined) {
    throw new Error('theme has not been initialized correctly')
  }
  return internals
}

class ThemeAccess {
  public init(theme: Theme): Theme {
    const initTheme = { ...theme } as Theme & { [internalsKey]?: Internals }
    initTheme[internalsKey] = {
      nextMatchId: 0,
    }
    return initTheme
  }

  public readonly root: ThemeFn = ({ theme }) => {
    const fontVariables = Object.entries(theme.fonts)
      .map(([fontName, fontFamily]) => (
        `--theme-font-${fontName}: ${fontFamily};`
      ))
      .join(';')

    const colorVariables = Object.entries(theme.colors)
      .map(([colorName, color]) => (
        `--theme-color-${colorName}: rgb(${color.value.join(', ')});`
      + `--theme-color-${colorName}--contrast: rgb(${color.contrast.join(', ')});`
      ))
      .join(';')

    const breakpointVariables = Object.entries(theme.breakpoints)
      .map(([breakpointName, breakpoint]) => (
        `--theme-breakpoint-${breakpointName}--min: ${buildBreakpointMin(breakpoint.min)};`
      + `--theme-breakpoint-${breakpointName}--max: ${buildBreakpointMin(breakpoint.max)};`
      ))
      .join(';')

    const spacingVariable = `--theme-spacing: ${theme.spacing}px;`

    const transitionVariables = Object.entries(theme.transitions)
      .map(([transitionName, transition]) => (
        `--theme-transition-${transitionName}-duration: ${transition.duration}ms;`
      + `--theme-transition-${transitionName}-timing: ${transition.timing};`
      ))
      .join(';')

    return `
        ${fontVariables}
        ${colorVariables}
        ${breakpointVariables}
        ${spacingVariable}
        ${transitionVariables}
    `
  }

  public readonly color: CurrentColorAccessWithContrast = run(() => {
    const color: CurrentColorAccessWithContrast = ({ color }) => `var(--theme-color-${color})`
    color.a = (alpha) => ({ theme, color }) => `rgba(${theme.colors[color].value.join(', ')}, ${alpha});`

    const contrast: CurrentColorAccess = ({ color }) => `var(--theme-color-${color}--contrast)`
    contrast.a = (alpha) => ({ theme, color }) => `rgba(${theme.colors[color].contrast.join(', ')}, ${alpha});`

    color.contrast = contrast
    return color
  })

  public readonly colors: ColorAccess = Object.keys(defaultTheme.colors).reduce((access, colorName) => {
    const colorVar = `var(--theme-color-${colorName})`
    const contrastVar = `var(--theme-color-${colorName}--contrast)`
    const color = { toString: () => colorVar } as unknown as ColorSingleAccessWithContrast
    color.a = (alpha) => ({ theme }) => `rgba(${theme.colors[colorName].value.join(', ')}, ${alpha});`
    color.contrast = { toString: () => contrastVar } as unknown as ColorSingleAccess
    color.contrast.a = (alpha) => ({ theme }) => `rgba(${theme.colors[colorName].contrast.join(', ')}, ${alpha});`
    access[colorName] = color
    return access
  }, {} as ColorAccess)

  public readonly fonts: FontAccess = {
    heading: 'var(--theme-font-heading)',
    sans:    'var(--theme-font-sans)',
    serif:   'var(--theme-font-serif)',
  }

  public readonly media: MediaAccess = Object.keys(defaultTheme.breakpoints).reduce((access, breakpointName) => {
    access[breakpointName] = {
      min: ({ theme }) => {
        const min = buildBreakpointMin(theme.breakpoints[breakpointName].min)
        return `@media(min-width: ${min})`
      },
      max: ({ theme }) => {
        const max = buildBreakpointMax(theme.breakpoints[breakpointName].max)
        return `@media(max-width: ${max})`
      },
      only: ({ theme }) => {
        const min = buildBreakpointMin(theme.breakpoints[breakpointName].min)
        const max = buildBreakpointMax(theme.breakpoints[breakpointName].max)
        return `@media(min-width: ${min}) and (max-width: ${max})`
      },
    }
    return access
  }, {} as MediaAccess)

  public readonly breakpoints: BreakpointAccess = Object.keys(defaultTheme.breakpoints).reduce((access, breakpointName) => {
    access[breakpointName] = {
      min: `var(--theme-breakpoint-${breakpointName}--min)`,
      max: `var(--theme-breakpoint-${breakpointName}--min)`,
    }
    return access
  }, {} as BreakpointAccess)

  public readonly spacing = (factor: number): string => `calc(var(--theme-spacing) * ${factor})`

  public readonly transitions: TransitionAccess = Object.keys(defaultTheme.transitions).reduce((access, transitionName) => {
    access[transitionName] = `var(--theme-transition-${transitionName}-duration) var(--theme-transition-${transitionName}-timing)`
    return access
  }, {} as TransitionAccess)

  public readonly match: Match = (options) => {
    let cachedResult: string | null = null
    return ({ theme }) => {
      if (cachedResult !== null) {
        return cachedResult
      }

      const internals = getInternals(theme)
      const resultVar = `--theme_match-${internals.nextMatchId++}`

      const optionsStyle = Object.entries(options).reduce((styles, [breakpoint, value]) => {
        const resolvedValue = typeof value === 'function'
          ? (value as ThemeFn)({ theme })
          : value
        styles.push(`${this.media[breakpoint as BreakpointName].min({ theme })} {
            :root {
              ${resultVar}: ${resolvedValue};
            }
          }`)
        return styles
      }, [] as string[])
      const styling = `
        ${optionsStyle.join('\n')}
      `

      if (typeof document !== 'undefined') {
        const tag = document.createElement('style')
        tag.textContent = styling
        document.head.appendChild(tag)
      }

      cachedResult = `var(${resultVar})`
      return cachedResult
    }
  }
}

const theme = new ThemeAccess()
export default theme
