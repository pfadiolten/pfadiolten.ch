import { KitButton, KitGrid } from '@pfadiolten/react-kit'
import { KitIcon } from '@pfadiolten/react-kit'
import { useFormState } from '@daniel-va/react-form'
import React from 'react'

interface Props {
  isDisabled?: boolean
}

const UiSubmit: React.FC<Props> = ({ isDisabled }) => {
  const formState = useFormState()
  const isValid = !isDisabled && formState.isValid
  return (
    <UiSubmitCustom
      isValid={isValid}
      isSubmitting={formState.isSubmitting}
      isCancelling={formState.isCancelling}
      onSubmit={formState.submit}
      onCancel={formState.cancel}
    />
  )
}

interface UiSubmitCustomProps {
  isValid: boolean
  isSubmitting?: boolean
  isCancelling?: boolean
  onSubmit: () => void
  onCancel: () => void
}

const UiSubmitCustom: React.FC<UiSubmitCustomProps> = ({
  isValid,
  isSubmitting = false,
  isCancelling = false,
  onSubmit: pushSubmit,
  onCancel: pushCancel,
}) => {
  return (
    <KitGrid gap={1} style={{ paddingTop: '1rem' }}>
      <KitGrid.Col>
        <KitButton color="success" isFull onClick={pushSubmit} isDisabled={!isValid}>
          {isSubmitting ? (
            <KitIcon.Spinner isSpinner />
          ) : (
            <KitIcon.Confirm />
          )}
        </KitButton>
      </KitGrid.Col>
      <KitGrid.Col size={4}>
        <KitButton color="error" isFull onClick={pushCancel}>
          {isCancelling ? (
            <KitIcon.Spinner isSpinner />
          ) : (
            <KitIcon.Cancel />
          )}
        </KitButton>
      </KitGrid.Col>
    </KitGrid>
  )
}

export default Object.assign(UiSubmit, {
  Custom: UiSubmitCustom,
})
