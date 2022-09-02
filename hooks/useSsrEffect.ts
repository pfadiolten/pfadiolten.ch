import { EffectCallback } from 'react'

let isClientDone = false

const useSsrEffect = (effect: EffectCallback) => {
  if (typeof window === 'undefined') {
    effect()
    return
  }
  if (isClientDone) {
    return
  }
  isClientDone = true
  // eslint-disable-next-line react-hooks/rules-of-hooks
  effect()
}
export default useSsrEffect
