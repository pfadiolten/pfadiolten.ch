import { useMemo, useState } from 'react'

const useBool = (initialValue = false): [boolean, BoolDispatch] => {
  const [value, setValue] = useState(initialValue)
  const setBoolValue: BoolDispatch = useMemo(() => Object.assign(setValue, {
    toggle: () => setValue((it) => !it),
    on: () => setValue(true),
    off: () => setValue(false),
  }), [])
  return [value, setBoolValue]
}
export default useBool

type BoolDispatch = {
  (set: boolean | ((old: boolean) => boolean)): void
  toggle(): void
  on(): void
  off(): void
}

