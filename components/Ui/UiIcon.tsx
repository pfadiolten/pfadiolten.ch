import theme from '@/theme-utils'
import { StyleProps } from '@/utils/props'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faAt,
  faBars,
  faBold,
  faCheck,
  faChevronDown, faChevronLeft, faChevronRight,
  faClock,
  faEdit, faEllipsis,
  faFan,
  faItalic,
  faListOl,
  faListUl,
  faLocationDot, faPhone,
  faPlus,
  faRedoAlt,
  faSignInAlt,
  faSignOutAlt,
  faTimes,
  faTrashAlt,
  faUndoAlt, faUpload,
} from '@fortawesome/free-solid-svg-icons'
import React, { useMemo } from 'react'
import styled, { css, keyframes } from 'styled-components'

interface Props extends StyleProps {
  name: UiIconName
  size?: number
  isSpinner?: boolean
}

const UiIcon: React.FC<Props> = ({
  name,
  size = 1,
  isSpinner = false,
  style,
  className,
}) => {
  const icon = icons[name]
  const [width, height, _ligatures, _unicode, svgPathData] = icon.icon

  const path = useMemo(() => (
    Array.isArray(svgPathData)
      ? svgPathData.join(' ')
      : svgPathData
  ), [svgPathData])

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      style={{
        ...style,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        '--size': size,
      }}
      className={className}
      isSpinner={isSpinner}
    >
      <path d={path} fill="currentColor" />
    </Svg>
  )
}
export default styled(UiIcon)``

const icons = {
  menu: faBars,
  dropdown: faChevronDown,
  confirm: faCheck,
  cancel: faTimes,
  upload: faUpload,
  reset: faRedoAlt,
  clock: faClock,
  phone: faPhone,
  email: faAt,
  recordAdd: faPlus,
  recordEdit: faEdit,
  recordDelete: faTrashAlt,
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
  slideLeft: faChevronLeft,
  slideRight: faChevronRight,
  more: faEllipsis,
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

const Svg = styled.svg<{ isSpinner: boolean }>`
  display: table-cell;
  vertical-align: -0.125em;
  width: calc(${theme.spacing(2)} * var(--size));
  height: calc(${theme.spacing(2)} * var(--size));
  
  ${({ isSpinner }) => isSpinner && css`
    animation: 2.5s linear infinite ${SpinAnimation};
    animation-play-state: inherit;
    will-change: transform;
  `}
`
