import { run } from '@/utils/control-flow'

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


export interface KeyedInMemoryCache<K, T> {
  resolve(key: K, run: (key: K) => Promise<T>): Promise<T>
  delete(key: K): boolean
}

export const createKeyedInMemoryCache = <K, T>(cacheMs: number): KeyedInMemoryCache<K, T> => {
  const caches = new Map<K, InMemoryCache<T>>()
  return {
    async resolve(key, runResolver): Promise<T> {
      const keyCache = caches.get(key) ?? run(() => {
        const cache = createInMemoryCache<T>(cacheMs)
        caches.set(key, cache)
        return cache
      })
      return keyCache.resolve(() => runResolver(key))
    },
    delete(key: K): boolean {
      return caches.delete(key)
    },
  }
}
