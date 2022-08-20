import UiButton from '@/components/Ui/Button/UiButton'
import UiIcon from '@/components/Ui/UiIcon'
import { useFormState } from '@daniel-va/react-form'
import React from 'react'
import UiGrid from './UiGrid'

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
    <UiGrid gap={1} style={{ paddingTop: '1rem' }}>
      <UiGrid.Col>
        <UiButton color="success" isFull onClick={pushSubmit} isDisabled={!isValid}>
          {isSubmitting ? (
            <UiIcon name="spinner" isSpinner />
          ) : (
            <UiIcon name="confirm" />
          )}
        </UiButton>
      </UiGrid.Col>
      <UiGrid.Col size={4}>
        <UiButton color="error" isFull onClick={pushCancel}>
          {isCancelling ? (
            <UiIcon name="spinner" isSpinner />
          ) : (
            <UiIcon name="cancel" />
          )}
        </UiButton>
      </UiGrid.Col>
    </UiGrid>
  )
}

export default Object.assign(UiSubmit, {
  Custom: UiSubmitCustom,
})
