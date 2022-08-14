import RichText from '@/models/base/RichText'
import { generateHTML } from '@tiptap/core'
import { Link } from '@tiptap/extension-link'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

interface Props {
  value: RichText
}

const UiRichText: React.FC<Props> = ({ value }) => {
  const [html, setHtml] = useState('')
  useEffect(() => {
    setHtml(generateHTML(value, extensions))
  }, [value])
  return (
    <Text dangerouslySetInnerHTML={{ __html: html }} />
  )
}

const RichTextStyle = css`
  > * + * {
    margin-top: 0.75em;
  }

  strong {
    font-weight: 600;
  }
  
  em {
    font-style: italic;
  }
  
  ul,
  ol {
    padding: 0 1rem;
  }
  
  ul {
    list-style: disc;
  }
  
  ol {
    list-style: decimal;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }
`
const Text = styled.span`
  ${RichTextStyle};
`

const extensions = [
  StarterKit,
  Link,
]

export default Object.assign(UiRichText, {
  extensions,
  style: RichTextStyle,
})
