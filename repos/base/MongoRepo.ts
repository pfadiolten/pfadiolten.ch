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
    return collection.find<Doc<T>>(filter, options).map(parseDoc).toArray()
  }

  async find(id: Id<T>): Promise<T | null> {
    const collection = await this.useCollection()
    const record = await collection.findOne<Doc<T>>({ _id: new ObjectId(id) } as Filter<Doc<T>>)
    if (record == null) {
      return null
    }
    return parseDoc(record)
  }

  async create(data: ModelData<T>): Promise<T> {
    const collection = await this.useCollection()
    const result = await collection.insertOne(makeDoc(data))
    return {
      ...data,
      id: (result.insertedId as ObjectId).toHexString(),
    } as T
  }

  async update(id: Id<T>, data: ModelData<T>): Promise<T | null> {
    const collection = await this.useCollection()
    const result = await collection.replaceOne({ _id: new ObjectId(id) } as Filter<Doc<T>>, makeDoc({ ...data, id } as T))
    if (result.matchedCount < 1) {
      return null
    }
    return this.find(id)
  }

  async delete(id: Id<T>): Promise<boolean> {
    const collection = await this.useCollection()
    const result = await collection.deleteOne({ _id: new ObjectId(id) } as Filter<Doc<T>>)
    return result.deletedCount > 0
  }

  protected async useCollection(): Promise<Collection<Doc<T>>> {
    return loadCollection(this.collection)
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

const parseDoc = <T extends Model>(doc: Doc<T>): T => {
  const record: T = {
    ...(doc as unknown as T),
    id: doc._id.toHexString(),
  }
  delete (record as unknown as Partial<Doc<T>>)._id
  return record
}

function makeDoc<T extends Model>(record: T): Doc<T>
function makeDoc<T extends Model>(record: ModelData<T>): OptionalUnlessRequiredId<Doc<T>>
function makeDoc<T extends Model>(data: Partial<T>): Partial<Doc<T>>
function makeDoc<T extends Model>(record: Partial<T>): Partial<Doc<T>> {
  if (!('id' in record)) {
    return record as Partial<Doc<T>>
  }
  const doc = {
    ...record,
    _id: new ObjectId(record.id),
  } as Partial<Doc<T>>
  delete (doc as unknown as Partial<T>).id
  return doc
}
