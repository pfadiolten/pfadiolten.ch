import Model from '@/models/base/Model'
import User from '@/models/User'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import {
  CreateRepo,
  DeleteRepo,
  FindRepo,
  isCreateRepo,
  isDeleteRepo,
  isFindRepo,
  isListRepo,
  isUpdateRepo,
  ListRepo,
  Repo,
  UpdateRepo,
} from '@/repos/Repo'
import ApiErrorService, { ApiError } from '@/services/api/ApiErrorService'
import ApiParamService from '@/services/api/ApiParamService'
import { run } from '@/utils/control-flow'
import { identity, noop } from '@/utils/fns'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'

class ApiService {
  get Params() {
    return ApiParamService
  }

  handle<I, O>(parse: Parser<I>, handle: Handle<I, O>): NextApiHandler
  handle<I, O>(handle: Handle<I, O>): NextApiHandler
  handle<I, O>(parseOrHandle: Parser<I> | Handle<I, O>, handleOrUndefined?: Handle<I, O>): NextApiHandler {
    const [parse, handle] = handleOrUndefined === undefined ? (
      [identity as Parser<I>, parseOrHandle as Handle<I, O>]
    ) : (
      [parseOrHandle as Parser<I>, handleOrUndefined]
    )
    return ApiErrorService.around(async (req, res) => {
      // console.log(req)
      const session = await unstable_getServerSession(req, res, authOptions)
      const serviceReq: ApiRequest = Object.assign(req, {
        user: (session?.user ?? null) as User | null,
      })
      const data = req.body == null ? null : run(() => {
        if (typeof req.body === 'object' && Object.keys(req.body).length === 0) {
          return null
        }
        if (typeof req.body === 'string' && req.body.length === 0) {
          return null
        }
        return parse(req.body)
      })
      return handle(serviceReq, res, data as I)
    })
  }

  handleResource<T extends Model>(repo: Repo<T>, options: ResourceOptions<T>): NextApiHandler {
    const listRepo:   ListRepo<T>   | null = isListRepo(repo)   ? repo : null
    const findRepo:   FindRepo<T>   | null = isFindRepo(repo)   ? repo : null
    const createRepo: CreateRepo<T> | null = isCreateRepo(repo) ? repo : null
    const updateRepo: UpdateRepo<T> | null = isUpdateRepo(repo) ? repo : null
    const deleteRepo: DeleteRepo<T> | null = isDeleteRepo(repo) ? repo : null

    const {
      parse,
      allowAnonymousMutations = false,
    } = options

    const allowedPluralMethods = run(() => {
      const methods = [] as string[]
      if (listRepo !== null) {
        methods.push('GET')
      }
      if (createRepo !== null) {
        methods.push('POST')
      }
      return methods
    })
    const allowedSingularMethods = run(() => {
      const methods = [] as string[]
      if (findRepo !== null) {
        methods.push('GET')
      }
      if (updateRepo !== null) {
        methods.push('PUT')
      }
      if (deleteRepo !== null) {
        methods.push('DELETE')
      }
      return methods
    })

    const performSessionCheck: (req: ApiRequest) => void = allowAnonymousMutations ? noop : async (req) => {
      if (req.user === null) {
        throw new ApiError(401, 'not authenticated')
      }
    }

    return this.handle(parse, async (req, res, data: T | null) => {
      const id = this.Params.getString(req, 'id')
      if (id === null) {
        switch (req.method) {
        case 'GET':
          // endpoint: GET '/'
          if (listRepo !== null) {
            let limit = this.Params.getInt(req, 'limit')
            if (limit !== null) {
              limit = Math.max(0, limit)
            }
            const records = await (options.list ? options.list(req, { limit }) : (
              listRepo.list({ limit: limit ?? undefined })
            ))
            res.status(200).json(records)
            return
          }
          break
        case 'POST':
          // endpoint: POST '/'
          if (createRepo) {
            performSessionCheck(req)
            if (data === null) {
              throw new ApiError(400, 'create data missing')
            }
            const record = await createRepo.create(data)
            res.status(201).json(record)
            return
          }
          break
        }
        res.setHeader('Allow', allowedPluralMethods)
      } else {
        switch (req.method) {
        case 'GET':
          // endpoint: GET '/{id}'
          if (findRepo !== null) {
            const record = await findRepo.find(id)
            if (record === null) {
              throw new ApiError(404, 'not found')
            }
            res.status(200).json(record)
            return
          }
          break
        case 'PUT':
          // endpoint: PUT '/{id}'
          if (updateRepo) {
            performSessionCheck(req)
            if (data === null) {
              throw new ApiError(400, 'update data missing')
            }
            const record = await updateRepo.update(id, data)
            if (record === null) {
              throw new ApiError(404, 'not found')
            }
            res.status(200).json(record)
            return
          }
          break
        case 'DELETE':
          // endpoint: DELETE '/{id}'
          if (deleteRepo) {
            performSessionCheck(req)
            const ok = await deleteRepo.delete(id)
            if (!ok) {
              throw new ApiError(404, 'not found')
            }
            res.status(204).end()
            return
          }
        }
        res.setHeader('Allow', allowedSingularMethods)
      }
      throw new ApiError(405, `${req.method} not allowed`)
    })
  }

  handleREST(handlers: RESTHandlers<never>): NextApiHandler
  handleREST<T>(parse: Parser<T>, handlers: RESTHandlers<T>): NextApiHandler
  handleREST<T>(
    parseOrHandlers: Parser<T> | RESTHandlers<never>,
    handlersOrUndefined?: RESTHandlers<T>,
  ): NextApiHandler {
    const [parse, handlers] = handlersOrUndefined === undefined ? (
      [identity as Parser<T>, parseOrHandlers as RESTHandlers<T>]
    ) : (
      [parseOrHandlers as Parser<T>, handlersOrUndefined]
    )

    const allowedMethods: string[] = Object.keys(handlers).map((method) => method.toUpperCase())
    return this.handle(parse, async (req, res, data) => {
      const method = req.method?.toLowerCase() as keyof RESTHandlers<T> | undefined
      if (method === undefined) {
        throw new Error('method is not specified')
      }
      const handle = handlers[method]
      if (handle === undefined) {
        res.setHeader('Allow', allowedMethods)
        throw new ApiError(405, `${req.method} not allowed`)
      }
      return handle(req, res, data)
    })
  }
}
export default new ApiService()

export type ApiRequest = NextApiRequest & {
  user: User | null
}

export type ApiResponse<T> = NextApiResponse<T>

export interface ListParams {
  limit: number | null
}

interface ResourceOptions<T> {
  parse: Parser<T>
  allowAnonymousMutations?: boolean
  list?: (req: ApiRequest, params: ListParams) => Promise<T[]>
}

interface RESTHandlers<T> {
  get?: Handle<T, unknown>
  post?: Handle<T, unknown>
  put?: Handle<T, unknown>
  patch?: Handle<T, unknown>
  delete?: Handle<T, unknown>
}

interface Handle<I, O> {
  (req: ApiRequest, res: ApiResponse<O>, data: I): void | Promise<void>
}

interface Parser<T> {
  (data: T): T
}
