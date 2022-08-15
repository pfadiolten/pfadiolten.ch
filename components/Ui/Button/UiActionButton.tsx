import UiButton from '@/components/Ui/Button/UiButton'
import UiIcon from '@/components/Ui/UiIcon'
import styled from 'styled-components'


const UiActionButton = styled(UiButton)`
  position: relative;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  
  ${UiIcon} {
    width: 12px;
    height: 12px;
  }
`
export default UiActionButton
