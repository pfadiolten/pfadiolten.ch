type Id<_T> = string
export default Id

export const isId = <T>(value: unknown): value is Id<T> => (
  typeof value === 'string'
)
