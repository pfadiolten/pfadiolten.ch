import { LookAndFeelProps } from '@/components/Ui/Input/UiInputField'
import UiButton from '@/components/Ui/UiButton'
import UiIcon from '@/components/Ui/UiIcon'
import UiRichText from '@/components/Ui/UiRichText'
import RichText from '@/models/base/RichText'
import theme from '@/theme-utils'
import { noop } from '@/utils/fns'
import { InputProps } from '@daniel-va/react-form'
import { Placeholder } from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import React, { useRef, useState } from 'react'
import { useUpdateEffect } from 'react-use'
import styled, { css } from 'styled-components'
import { Error, Label, Wrapper } from './UiInputField'

interface Props<T extends RichText | null> extends InputProps<T>, LookAndFeelProps {

}

const UiRichTextInput = <T extends RichText | null>({
  value,
  onChange: pushChange = noop,
  errors,
  label,
  placeholder,
  isDisabled,
  hasAutoFocus,
}: Props<T>): JSX.Element | null => {
  const pushChangeRef = useRef(pushChange)
  pushChangeRef.current = pushChange

  const editor = useEditor({
    extensions: [
      ...UiRichText.extensions,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      pushChangeRef.current(editor.getJSON() as T)
    },
    autofocus: hasAutoFocus ?? false,
    editable: !isDisabled,
  })

  useUpdateEffect(() => {
    if (editor !== null && value !== editor.getJSON()) {
      editor.commands.setContent(value)
    }
  }, [value])

  useUpdateEffect(() => {
    editor?.setEditable(!isDisabled)
  }, [isDisabled])

  const countRef = useRef(0)
  countRef.current++

  const [isActive, setActive] = useState(false)
  const activeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  useUpdateEffect(() => {
    const isFocused = editor?.isFocused
    if (isFocused === undefined) {
      return
    }
    clearTimeout(activeTimeoutRef.current)
    activeTimeoutRef.current = setTimeout(() => {
      setActive(isFocused)
    }, 100)
  }, [editor?.isFocused])

  if (editor === null) {
    return null
  }

  // The tag for the element wrapping all the components elements.
  const wrapperTag = label === null ? 'div' : 'label'

  return (
    <Wrapper as={wrapperTag} onClick={() => editor.chain().focus().run()}>
      {label && (
        <Label>{label}</Label>
      )}
      <Box isActive={isActive} isInvalid={errors !== undefined && errors.length !== 0}>
        <Controls>
          <CommandButtonGroup>
            <CommandButton
              onClick={() => editor.chain().focus().undo().run()}
            >
              <UiIcon name="editorUndo" />
            </CommandButton>
            <CommandButton
              onClick={() => editor.chain().focus().redo().run()}
            >
              <UiIcon name="editorRedo" />
            </CommandButton>
          </CommandButtonGroup>
          <CommandButtonGroup>
            <CommandButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
            >
              <UiIcon name="editorBold" />
            </CommandButton>
            <CommandButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
            >
              <UiIcon name="editorItalic" />
            </CommandButton>
          </CommandButtonGroup>
          <CommandButtonGroup>
            <CommandButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
            >
              <UiIcon name="editorListUl" />
            </CommandButton>
            <CommandButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
            >
              <UiIcon name="editorListOl" />
            </CommandButton>
          </CommandButtonGroup>
        </Controls>
        <EditorContent editor={editor} />
      </Box>
      {errors !== undefined && (
        <Error>
          &nbsp;
          {errors[0]}
        </Error>
      )}
    </Wrapper>
  )
}
export default UiRichTextInput

const Controls = styled.div`
  display: flex;
  gap: ${theme.spacing(1)};
  position: absolute;
  bottom: 0;
  padding: ${theme.spacing(1)};
  z-index: 10;
`
const Box = styled.div<{ isActive: boolean, isInvalid: boolean }>`
  position: relative;
  .ProseMirror {
    ${UiRichText.style};
    position: relative;
    font-family: ${theme.fonts.sans};
    font-size: 1rem;
    outline: none !important;
    
    padding: ${theme.spacing(1)} ${theme.spacing(1.25)};
    color: ${theme.colors.tertiary.contrast};
    background-color: ${theme.colors.tertiary};
    border: 1px solid ${theme.colors.tertiary.contrast};
  
    transition: ${theme.transitions.fade};
    transition-property: border-color, padding-bottom;
    
    ${({ isActive }) => isActive && css`
      border-color: ${theme.colors.primary};
      padding-bottom: ${theme.spacing(6.5)};
    `}
  
    ${({ isInvalid }) => isInvalid && css`
      border-color: ${theme.colors.error};
    `}
  }

  ${Controls} {
    transition: ${theme.transitions.fade};
    transition-property: transform, opacity;
    transform-origin: bottom center;
    
    ${({ isActive }) => !isActive && css`
      transform: scaleY(0);
      opacity: 0;
    `}
  }
`
const CommandButtonGroup = styled.div`
  
`
const CommandButton = styled(UiButton)<{ isActive?: boolean }>`
  padding: ${theme.spacing(0.5)} ${theme.spacing(1)};
  color: ${theme.colors.secondary.contrast};
  background-color: transparent;
  border: 2px solid ${theme.colors.secondary.contrast};
  
  :not(:first-child) {
    border-left: none;
  }
  
  :hover {
    background-color: ${theme.colors.secondary.contrast.a(0.25)};
  }
  
  ${({ isActive }) => isActive && css`
    background-color: ${theme.colors.secondary.contrast};
    color: ${theme.colors.secondary};

    :hover {
      background-color: ${theme.colors.secondary.contrast.a(0.5)};
      border-color: ${theme.colors.secondary.contrast.a(0.5)};
      color: ${theme.colors.secondary.contrast};
    }
  `}
`
