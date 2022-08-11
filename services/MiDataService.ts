import { User } from 'next-auth'

export default class MiDataService {
  constructor(token: string) {
    this.token = token
  }

  private readonly token: string

  async readUser(): Promise<User> {
    let response = await fetch(`${process.env.PFADIOLTEN_MIDATA_URL!!}/oauth/profile`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'X-Scope': 'name',
      },
    })
    if (!response.ok) {
      throw new Error(`failed to read user: [${response.status}] ${response.statusText}`)
    }
    let data = await response.json()
    return {
      id: data.id,
      email: data.email,
      name: data.nickname ?? `${data.first_name} ${data.last_name}`,
    }
  }
}
