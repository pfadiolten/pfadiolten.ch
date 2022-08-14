import { StyleProps } from '@/utils/props'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faBars,
  faBold,
  faCheck,
  faClock,
  faEdit,
  faFan,
  faItalic,
  faListOl,
  faListUl,
  faLocationDot,
  faPlus,
  faRedoAlt,
  faSignInAlt,
  faSignOutAlt,
  faTimes,
  faTrashAlt,
  faUndoAlt,
} from '@fortawesome/free-solid-svg-icons'
import React, { useMemo } from 'react'
import styled, { css, keyframes } from 'styled-components'

interface Props extends StyleProps {
  name: UiIconName
  size?: number
  isSpinner?: boolean
}

const UiIcon: React.VFC<Props> = ({
  name,
  size = 1,
  isSpinner = false,
  style,
  className,
}) => {
  const icon = icons[name]
  const [width, height, _ligatures, _unicode, svgPathData] = icon.icon
  const pixelSize = `${16 * size}px`

  const path = useMemo(() => (
    Array.isArray(svgPathData)
      ? svgPathData.join(' ')
      : svgPathData
  ), [svgPathData])

  return (
    <Container
      isSpinner={isSpinner}
      style={{ ...style, width: pixelSize, height: pixelSize }}
      className={className}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
        height={pixelSize} // 1rem * 1.2 * size
        width={pixelSize}
      >
        <path d={path} fill="currentColor" />
      </svg>
    </Container>
  )
}
export default styled(UiIcon)``

const icons = {
  menu: faBars,
  confirm: faCheck,
  cancel: faTimes,
  recordAdd: faPlus,
  recordEdit: faEdit,
  recordDelete: faTrashAlt,
  clock: faClock,
  editorBold: faBold,
  editorItalic: faItalic,
  editorListOl: faListOl,
  editorListUl: faListUl,
  editorUndo: faUndoAlt,
  editorRedo: faRedoAlt,
  sessionLogin: faSignInAlt,
  sessionLogout: faSignOutAlt,
  logoGithub: faGithub,
  spinner: faFan,
  location: faLocationDot,
}

export type UiIconName = keyof typeof icons


const SpinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`
export const Container = styled.span<{ isSpinner: boolean }>`
  position: relative;
  display: inline-block;

  svg {
    position: absolute;
    left: 0;
    bottom: -1px;
  }

  ${({ isSpinner }) => isSpinner && css`
    svg {
      animation: 2.5s linear infinite ${SpinAnimation};
      animation-play-state: inherit;
      will-change: transform;
    }
  `}
`
