export const run = <T>(action: () => T): T => action()

export const also = <T>(value: T, action: (value: T) => void): T => {
  action(value)
  return value
}

export const then = <T, R>(value: T, action: (value: T) => R): R => {
  return action(value)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const markAsUsed = (..._value: unknown[]) => {}

export const raise = (error: Error | string): never => {
  if (typeof error === 'string') {
    throw new Error(error)
  }
  throw error
}

export const isNotNull = <T>(value: T | null): value is T => value !== null

export const repeat = <T>(n: number, action: (i: number) => T): T[] => {
  const result = Array(n)
  for (let i = 0; i < n; i++) {
    result[i] = action(i)
  }
  return result
}

export const range = <T>(start: number, end: number, create: (i: number) => T): T[] => {
  const result = Array(end - start)
  for (let i = start; i <= end; i++) {
    result[i - start] = create(i)
  }
  return result
}

export const sleep = (durationMs: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), durationMs)
  })
}
