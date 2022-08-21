import { run } from '@/utils/control-flow'

export interface InMemoryCache<T> {
  resolve(run: () => Promise<T>): Promise<T>
  insert(value: T): void
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
      this.insert(result)
      return result
    },
    insert(value) {
      data = [new Date(), value]
    },
  }
}


export interface KeyedInMemoryCache<K, T> {
  resolve(key: K, run: (key: K) => Promise<T>): Promise<T>
  insert(key: K, value: T): void
  delete(key: K): boolean
}

export const createKeyedInMemoryCache = <K, T>(cacheMs: number): KeyedInMemoryCache<K, T> => {
  const caches = new Map<K, InMemoryCache<T>>()
  const getCacheForKey = (key: K): InMemoryCache<T> => caches.get(key) ?? run(() => {
    const cache = createInMemoryCache<T>(cacheMs)
    caches.set(key, cache)
    return cache
  })
  return {
    async resolve(key, runResolver): Promise<T> {
      return getCacheForKey(key).resolve(() => runResolver(key))
    },
    insert(key, value) {
      getCacheForKey(key).insert(value)
    },
    delete(key: K): boolean {
      return caches.delete(key)
    },
  }
}
