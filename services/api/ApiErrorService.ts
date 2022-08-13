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
        } else {
          console.error('[Internal Server Error]', e)
        }
        return res.status(500).json({ error: `Internal Server Error: ${e}` })
      }
    }
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
