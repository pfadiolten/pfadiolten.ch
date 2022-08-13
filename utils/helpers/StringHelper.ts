class StringHelper {
  isEmpty(value: string | null | undefined): boolean {
    return value == null || value.length === 0
  }

  nullable(value: string | null | undefined): string | null {
    if (value == null) {
      return null
    }
    if (value.length === 0) {
      return null
    }
    return value
  }

  capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  padLeft(value: unknown, minLength: number, padding: string): string{
    let result = `${value}`
    while (result.length < minLength) {
      result = padding + result
    }
    return result
  }

  pad2Zero(value: unknown): string {
    return this.padLeft(value, 2, '0')
  }

  encode64(value: string): string {
    return Buffer.from(value).toString('base64')
  }

  decode64(value: string): string {
    return Buffer.from(value, 'base64').toString('utf-8')
  }
}
export default new StringHelper()
