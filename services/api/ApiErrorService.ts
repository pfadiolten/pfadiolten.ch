import { NextApiHandler } from 'next'

class ApiErrorService {
  around(handle: NextApiHandler): NextApiHandler {
    return async (req, res) => {
      try {
        return await handle(req, res)
      } catch (e) {
        if (e instanceof ApiError) {
          return res.status(e.status).json({ error: e.text })
        }
        if (e instanceof Error) {
          console.error('[Internal Server Error]', e.stack ?? e)
          return res.status(500).json({ error: `Internal Server ${e}` })
        }
        console.error('[Internal Server Error]', e)
        return res.status(500).json({ error: `Internal Server Error: ${e}` })
      }
    }
  }

  notFound(): never {
    throw new ApiError(404, 'Not Found')
  }
}
export default new ApiErrorService()


export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly text: string,
  ) {
    super(`[${status}] ${text}`)
  }
}
