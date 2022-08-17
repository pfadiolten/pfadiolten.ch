import { Dispatch, SetStateAction, useState } from 'react'

const useSsrState = <S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] => {
  return typeof window === 'undefined'
    ? [typeof initialState === 'function' ? (initialState as () => S)() : initialState, setSsrState]
    // eslint-disable-next-line react-hooks/rules-of-hooks
    : useState(initialState)
}
export default useSsrState

const setSsrState: Dispatch<SetStateAction<unknown>> = () => {
  throw new Error('setState can\'t be used on the server side')
}
