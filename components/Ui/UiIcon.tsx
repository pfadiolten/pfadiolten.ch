import { StyleProps } from '@/utils/props'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faAt,
  faBars,
  faBold,
  faCalendarAlt,
  faCampground,
  faCheck,
  faChevronLeft,
  faChevronRight,
  faClock,
  faCloudRain,
  faCompass,
  faEdit,
  faExternalLinkAlt,
  faFan,
  faItalic,
  faListOl,
  faListUl,
  faLongArrowAltLeft,
  faLongArrowAltRight,
  faMapMarker, faPhone,
  faPlus,
  faRedoAlt,
  faSignInAlt,
  faSignOutAlt,
  faTimes,
  faTrashAlt,
  faUnderline,
  faUndoAlt,
  faUpload,
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
  toNext: faChevronRight,
  toPrevious: faChevronLeft,
  linkNext: faLongArrowAltRight,
  linkPrevious: faLongArrowAltLeft,
  linkExternal: faExternalLinkAlt,
  menu: faBars,
  fontBold: faBold,
  fontItalic: faItalic,
  fontUnderline: faUnderline,
  fontListUnordered: faListUl,
  fontListOrdered: faListOl,
  undo: faUndoAlt,
  redo: faRedoAlt,
  calendar: faCalendarAlt,
  calendarEvent_Activity: faCompass,
  calendarEvent_Camp: faCampground,
  calendarEvent_Cancellation: faCloudRain,
  confirm: faCheck,
  cancel: faTimes,
  recordAdd: faPlus,
  recordEdit: faEdit,
  recordDelete: faTrashAlt,
  clock: faClock,
  location: faMapMarker,
  sessionLogin: faSignInAlt,
  sessionLogout: faSignOutAlt,
  logoGithub: faGithub,
  spinner: faFan,
  upload: faUpload,
  email: faAt,
  phone: faPhone,
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