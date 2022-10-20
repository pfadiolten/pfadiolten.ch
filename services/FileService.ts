import { Id } from '@pfadiolten/react-kit'
import { ReadStream } from 'fs'
import * as fs from 'fs'

const BASE_PATH = 'files'

export default class FileService {
  constructor(name: string) {
    this.directory = `${BASE_PATH}/${name}`
  }

  private readonly directory: string

  read(id: Id<unknown>): ReadStream {
    const path = `${this.directory}/${id}`
    return fs.createReadStream(path)
  }

  async save(id: Id<unknown>, data: string | Buffer): Promise<string> {
    const path = `${this.directory}/${id}`
    await new Promise((resolve, reject) => {
      fs.mkdir(this.directory, { recursive: true }, (error) => {
        if (error !== null) {
          reject(error)
          return
        }
        resolve(undefined)
      })
    })
    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, (error) => {
        if (error !== null) {
          reject(error)
          return
        }
        resolve(path)
      })
    })
  }

  async delete(id: Id<unknown>): Promise<void> {
    const path = `${this.directory}/${id}`
    return new Promise((resolve, reject) => {
      fs.rm(path, (error) => {
        if (error !== null) {
          reject(error)
          return
        }
        resolve(undefined)
      })
    })
  }
}
