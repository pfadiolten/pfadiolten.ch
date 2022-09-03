import Group from '@/models/Group'
import { ColorName } from '@/theme'
import theme from '@/theme-utils'
import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'

interface Props {
  group: Group | string
  color?: ColorName
}

const GroupLabel: React.FC<Props> = ({ group, color = 'primary' }) => {
  if (typeof group === 'string') {
    return (
      <li>
        <Box as="span" color={color}>
          {group}
        </Box>
      </li>
    )
  }
  return (
    <li>
      <Link href={`/stufen/${group.id}`} passHref>
        <Box color={color}>
          {group.shortName ?? group.name}
        </Box>
      </Link>
    </li>
  )
}
export default GroupLabel


const Box = styled.a<{ color: ColorName }>`
  padding: ${theme.spacing(0.25)} ${theme.spacing(0.5)};
  text-decoration: none;
  color: ${theme.color.contrast};
  background-color: ${theme.color};
  
  transition: ${theme.transitions.fade};
  transition-property: filter;
  &a:hover {
    filter: brightness(0.75);
  }
`
