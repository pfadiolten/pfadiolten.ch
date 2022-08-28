import { ReactComponentLike } from 'prop-types'
import React, { Children, CSSProperties, ReactElement, ReactNode } from 'react'

export interface StyleProps {
  style?: CSSProperties
  className?: string
}

export type ElementProps<E extends Element> = React.DetailedHTMLProps<React.HTMLAttributes<E>, E>


export interface LabelledProps {
  label: string | { by: string }
}

export const labelFrom = (label: LabelledProps['label']): { ariaLabel: string } | { ariaLabelledby: string } => {
  if (typeof label === 'string') {
    return { ariaLabel: label }
  }
  return { ariaLabelledby: label.by }
}

export const findChildren = (children: ReactNode, component: ReactComponentLike): ReactNode => (
  Children.toArray(children).find((child) => (child as ReactElement).type === component)
)
