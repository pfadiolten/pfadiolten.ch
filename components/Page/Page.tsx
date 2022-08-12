import PageContext from '@/components/Page/Context/PageContext'
import React, { ReactNode, useContext, useEffect } from 'react'

interface Props {
  title: string
  children?: ReactNode
  noBackground?: boolean
}

const Page: React.FC<Props> = ({
  title,
  noBackground = false,
  children,
}) => {
  const pageContext = useContext(PageContext)
  useEffect(() => {
    pageContext.update({ title, noBackground })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, noBackground])
  return (
    <>
      {children && children}
    </>
  )
}
export default Page
