import Id from '@/models/base/Id'
import Model, { ModelData } from '@/models/base/Model'
import { CreateRepo, DeleteRepo, ListOptions, ReadRepo, UpdateRepo } from '@/repos/Repo'
import {
  Collection,
  Db,
  Filter,
  FindOptions,
  MongoClient,
  ObjectId,
  OptionalUnlessRequiredId,
} from 'mongodb'

export default abstract class MongoRepo<T extends Model> implements ReadRepo<T>, CreateRepo<T>, UpdateRepo<T>, DeleteRepo<T>
{
  abstract get collection(): string

  list(options: ListOptions<T> = {}): Promise<T[]> {
    return this.listWhere({}, {
      limit: options?.limit ?? undefined,
    })
  }

  protected async listWhere(filter: Filter<Doc<T>>, options?: FindOptions<Doc<T>>): Promise<T[]> {
    const collection = await this.useCollection()
    return collection.find<Doc<T>>(filter, options).map(this.parseDoc.bind(this)).toArray()
  }

  async find(id: Id<T>): Promise<T | null> {
    const collection = await this.useCollection()
    const record = await collection.findOne<Doc<T>>({ _id: this.toId(id) } as Filter<Doc<T>>)
    if (record == null) {
      return null
    }
    return this.parseDoc(record)
  }

  async create(data: ModelData<T> | T): Promise<T> {
    const collection = await this.useCollection()
    const result = await collection.insertOne(this.makeDoc(data))
    return {
      ...data,
      id: this.parseId(result.insertedId),
    } as T
  }

  async update(id: Id<T>, data: ModelData<T>): Promise<T | null> {
    const collection = await this.useCollection()
    const result = await collection.replaceOne({ _id: this.toId(id) } as Filter<Doc<T>>, this.makeDoc({ ...data, id } as T))
    if (result.matchedCount < 1) {
      return null
    }
    return this.find(id)
  }

  async delete(id: Id<T>): Promise<boolean> {
    const collection = await this.useCollection()
    const result = await collection.deleteOne({ _id: this.toId(id) } as Filter<Doc<T>>)
    return result.deletedCount > 0
  }

  protected async useCollection(): Promise<Collection<Doc<T>>> {
    return loadCollection(this.collection)
  }

  protected toId(id: Id<T>): unknown {
    return new ObjectId(id)
  }

  protected parseId(id: unknown): Id<T> {
    if (id instanceof ObjectId) {
      return id.toHexString()
    }
    return id as Id<T>
  }

  private parseDoc(doc: Doc<T>): T {
    const record: T = {
      ...(doc as unknown as T),
      id: this.parseId(doc._id),
    }
    delete (record as unknown as Partial<Doc<T>>)._id
    return record
  }

  private makeDoc(record: T): Doc<T>
  private makeDoc(record: ModelData<T>): OptionalUnlessRequiredId<Doc<T>>
  private makeDoc(data: Partial<T>): Partial<Doc<T>>
  private makeDoc(record: Partial<T> | ModelData<T>): Partial<Doc<T>> | OptionalUnlessRequiredId<Doc<T>> {
    if (!('id' in record)) {
      return record as Partial<Doc<T>>
    }
    const doc = {
      ...record,
      _id: this.toId(record.id as Id<T>),
    } as Partial<Doc<T>>
    delete (doc as unknown as Partial<T>).id
    return doc
  }
}

let mongo: null | {
  client: MongoClient
  db: Db
} = null

const loadCollection = async <T>(name: string): Promise<Collection<T>> => {
  if (mongo === null) {
    const client = new MongoClient('mongodb://root:root@mongo:27017/?authMechanism=DEFAULT')
    await client.connect()
    const db = client.db('pfadiolten')
    mongo = { client, db }
  }
  return mongo.db.collection<T>(name)
}

export type Doc<M extends Model> = Omit<M, 'id'> & {
  _id: ObjectId
}
