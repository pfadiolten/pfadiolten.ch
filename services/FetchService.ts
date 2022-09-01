import { run } from '@/utils/control-flow'
import * as superjson from 'superjson'

class FetchService {
  get<T>(path: string, options: Options = {}): Promise<FetchResponse<T>> {
    return this.fetch(path, {
      ...options,
      method: 'get',
    })
  }

  post<T>(path: string, body: unknown, options: Options = {}): Promise<FetchResponse<T>> {
    return this.fetch(path, {
      ...options,
      body,
      method: 'post',
    })
  }

  put<T>(path: string, body: unknown, options: Options = {}): Promise<FetchResponse<T>> {
    return this.fetch(path, {
      ...options,
      body,
      method: 'put',
    })
  }

  async delete(path: string, options: Options = {}): Promise<FetchError | null> {
    const [_data, error] = await this.fetch(path, {
      ...options,
      method: 'delete',
    })
    return error
  }

  private async fetch<T>(path: string, options: Options & { method: string }): Promise<FetchResponse<T>> {
    if (options.params) {
      const params = new URLSearchParams()
      for (const [key, value] of Object.entries(params)) {
        if (value === true) {
          params.set(key, '')
        } else {
          params.set(key, `${value}`)
        }
      }
    }

    const host = 'http://localhost:3000/api'
    const url = path.startsWith('/') ? `${host}${path}` : `${host}/${path}`
    const res = await fetch(url, {
      method: options.method,
      body: isFormData(options.body) ? options.body : superjson.stringify(options.body),
      mode: 'same-origin',
      headers: run(() => {
        const headers: Record<string, string> = {}
        if (isFormData(options.body)) {
          headers['Accept'] = '*/*'
        } else {
          headers['Content-Type'] = 'application/json'
        }
        return headers
      }),
    })
    const { status } = res
    if (status < 200 || 299 < status) {
      if (status === 404) {
        return [null as unknown as T, new FetchError(404, 'Not Found')]
      }
      const data: { error: string } = await res.json()
      const error = new FetchError(status, data.error)
      return [null as unknown as T, error]
    }
    if (res.headers.get('content-type')?.startsWith('application/json')) {
      const value = superjson.deserialize<T>(await res.json())
      return [value, null]
    }
    return [null as unknown as T, null]
  }
}
export default new FetchService()

export type FetchResponse<T> = [T, FetchError | null]

export class FetchError extends Error {
  constructor(public status: number, public error: string) {
    super(`[${status}] ${error}`)
  }
}

interface Options {
  body?: unknown
  params?: Record<string, string | number | true>
}

const isFormData = (value: unknown): value is FormData => {
  if (typeof window === 'undefined') {
    return false
  }
  return value instanceof FormData
}
