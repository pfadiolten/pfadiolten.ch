import UiButton from '@/components/Ui/UiButton'
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
    <UiGrid gap={1} style={{ paddingTop: '1rem' }}>
      <UiGrid.Col>
        <UiButton color="success" isFull onClick={formState.submit} isDisabled={!isValid}>
          {formState.isSubmitting ? (
            <UiIcon name="spinner" isSpinner />
          ) : (
            <UiIcon name="confirm" />
          )}
        </UiButton>
      </UiGrid.Col>
      <UiGrid.Col size={4}>
        <UiButton color="error" isFull onClick={formState.cancel}>
          {formState.isCancelling ? (
            <UiIcon name="spinner" isSpinner />
          ) : (
            <UiIcon name="cancel" />
          )}
        </UiButton>
      </UiGrid.Col>
    </UiGrid>
  )
}
export default UiSubmit
