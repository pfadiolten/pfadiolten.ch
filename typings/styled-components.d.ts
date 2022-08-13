import Theme from '@/theme'
import 'styled-components'

declare module 'styled-components' {
  export function useTheme(): Theme

  export interface DefaultTheme extends Theme {}
}
