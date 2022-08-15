import { StyleProps } from '@/utils/props'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faBars,
  faBold,
  faCheck, faChevronDown,
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
  const pixelSize = 16 * size

  const path = useMemo(() => (
    Array.isArray(svgPathData)
      ? svgPathData.join(' ')
      : svgPathData
  ), [svgPathData])

  return (
    <Container
      isSpinner={isSpinner}
      style={style}
      className={className}
      pixelSize={pixelSize}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
      >
        <path d={path} fill="currentColor" />
      </svg>
    </Container>
  )
}
export default styled(UiIcon)``

const icons = {
  menu: faBars,
  dropdown: faChevronDown,
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
export const Container = styled.span<{ isSpinner: boolean, pixelSize: number }>`
  position: relative;
  display: inline-block;
  width: ${({ pixelSize }) => pixelSize}px;
  height: ${({ pixelSize }) => pixelSize}px;

  svg {
    position: absolute;
    left: 0;
  }

  ${({ isSpinner }) => isSpinner && css`
    svg {
      animation: 2.5s linear infinite ${SpinAnimation};
      animation-play-state: inherit;
      will-change: transform;
    }
  `}
`
