import { ApiError } from '@/services/api/ApiErrorService'
import { NextApiRequest } from 'next'

class ApiParamService {
  getString(req: NextApiRequest, name: string): string | null {
    const value = req.query[name]
    if (value == null) {
      return null
    }
    if (Array.isArray(value)) {
      if (value.length === 1) {
        return decodeURIComponent(value[0])
      }
      throw new ApiError(422, `invalid parameter '${name}': not a string`)
    }
    return decodeURIComponent(value)
  }

  requireString(req: NextApiRequest, name: string): string {
    const value = this.getString(req, name)
    if (value === null) {
      throw new ApiError(422, `missing parameter '${name}'`)
    }
    return value
  }

  getInt(req: NextApiRequest, name: string): number | null {
    const stringValue = this.getString(req, name)
    if (stringValue === null) {
      return stringValue
    }
    const value = Number.parseInt(stringValue)
    if (isNaN(value)) {
      throw new ApiError(422, `invalid parameter '${name}': not an integer`)
    }
    return value
  }

  has(req: NextApiRequest, name: string): boolean {
    const stringValue = this.getString(req, name)?.toLowerCase()
    if (stringValue === null) {
      return false
    }
    return stringValue !== 'false' && stringValue !== '0'
  }
}
export default new ApiParamService()
