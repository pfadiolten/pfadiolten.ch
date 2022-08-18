export interface InMemoryCache<T> {
  resolve(run: () => Promise<T>): Promise<T>
}

export const createInMemoryCache = <T>(cacheMs: number): InMemoryCache<T> => {
  let data: [Date, T] | null = null
  return {
    async resolve(run): Promise<T> {
      if (data !== null) {
        const [cacheDate, cacheData] = data
        if (cacheDate.getTime() >= Date.now() - cacheMs) {
          return cacheData
        }
      }
      const result = await run()
      data = [new Date(), result]
      return result
    },
  }
}
