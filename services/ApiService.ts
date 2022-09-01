import Model from '@/models/base/Model'
import SessionUser from '@/models/SessionUser'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import {
  BasePolicy,
  InferPolicy,
  isCreatePolicy,
  isDeletePolicy,
  isEditPolicy,
  isListPolicy,
  isReadPolicy,
  ListPolicy,
  PolicyConstructor,
  ReadPolicy,
  WritePolicy,
} from '@/policies/Policy'
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
import { identity } from '@/utils/fns'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import * as superjson from 'superjson'

class ApiService {
  get Params() {
    return ApiParamService
  }

  get Error() {
    return ApiErrorService
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
      const session = await unstable_getServerSession(req, res, authOptions)
      const serviceReq: ApiRequest = Object.assign(req, {
        user: (session?.user ?? null) as SessionUser | null,
        isAuthorized: false,
      })
      const data = req.body == null ? null : run(() => {
        if (typeof req.body === 'object') {
          if (Object.keys(req.body).length === 0) {
            return null
          }
          return superjson.deserialize(req.body)
        }
        if (typeof req.body === 'string' && req.body.length === 0) {
          return null
        }
        return parse(req.body)
      })
      req.body = data

      if (process.env.NODE_ENV === 'development') {
        const base = res.end
        res.end = function <A extends unknown[]>(...args: A) {
          if (!serviceReq.isAuthorized) {
            res.end = base
            throw new Error(`request for ${req.method} ${req.url} has not been authorized`)
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return base.apply(this, args as any)
        }
      }
      const jsonBase = res.json
      res.json = (data, ...args) => {
        return jsonBase(superjson.serialize(data), ...args)
      }
      return handle(serviceReq, res, data as I)
    })
  }

  handleResource<T extends Model, R extends Repo<T>>(repo: R, options: ResourceOptions<T, R>): NextApiHandler {
    const listRepo:   ListRepo<T>   | null = isListRepo(repo)   ? repo : null
    const findRepo:   FindRepo<T>   | null = isFindRepo(repo)   ? repo : null
    const createRepo: CreateRepo<T> | null = isCreateRepo(repo) ? repo : null
    const updateRepo: UpdateRepo<T> | null = isUpdateRepo(repo) ? repo : null
    const deleteRepo: DeleteRepo<T> | null = isDeleteRepo(repo) ? repo : null

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

    return this.handle(async (req, res, data: T | null) => {
      const policy = this.policy(req, options.policy as PolicyConstructor<BasePolicy<T>>) as unknown as ListPolicy<T> & ReadPolicy<T> & WritePolicy<T>
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
            this.allowIf(policy.canList())
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
            if (data === null) {
              throw new ApiError(400, 'create data missing')
            }
            this.allowIf(policy.canCreate())
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
              return this.Error.notFound()
            }
            this.allowIf(policy.canRead(record))
            res.status(200).json(record)
            return
          }
          break
        case 'PUT':
          // endpoint: PUT '/{id}'
          if (findRepo && updateRepo) {
            if (data === null) {
              throw new ApiError(400, 'update data missing')
            }
            const existingRecord = await findRepo.find(id)
            if (existingRecord === null) {
              return this.Error.notFound()
            }
            this.allowIf(policy.canEdit(existingRecord))
            const record = await updateRepo.update(id, data)
            if (record === null) {
              return this.Error.notFound()
            }
            res.status(200).json(record)
            return
          }
          break
        case 'DELETE':
          // endpoint: DELETE '/{id}'
          if (findRepo && deleteRepo) {
            const existingRecord = await findRepo.find(id)
            if (existingRecord === null) {
              throw new ApiError(404, 'not found')
            }
            this.allowIf(policy.canDelete(existingRecord))
            const ok = await deleteRepo.delete(id)
            if (!ok) {
              return this.Error.notFound()
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

  policy<T, P extends BasePolicy<T>>(req: ApiRequest, policyClass: PolicyConstructor<P>): P {
    const policy = new policyClass(req.user)
    if (process.env.NODE_ENV === 'development') {
      const markAuthorized = <B, A extends unknown[]>(base: (this: B, ...args: A) => boolean) => function (this: B, ...args: A): boolean {
        req.isAuthorized = true
        return base.apply(this, args)
      }
      if (isListPolicy(policy)) {
        policy.canList = markAuthorized(policy.canList)
      }
      if (isReadPolicy(policy)) {
        policy.canRead = markAuthorized(policy.canRead)
      }
      if (isCreatePolicy(policy)) {
        policy.canCreate = markAuthorized(policy.canCreate)
      }
      if (isEditPolicy(policy)) {
        policy.canEdit = markAuthorized(policy.canEdit)
      }
      if (isDeletePolicy(policy)) {
        policy.canDelete = markAuthorized(policy.canDelete)
      }
    }
    return policy
  }

  allowIf(isPermitted: boolean) {
    if (!isPermitted) {
      throw new ApiError(403, 'Forbidden')
    }
  }

  skipAuthorization(req: ApiRequest) {
    req.isAuthorized = true
  }
}
export default new ApiService()

export type ApiRequest = NextApiRequest & {
  user: SessionUser | null

  /**
   * Shows whether the current API handler has performed authorization.
   *
   * This is mainly used in development to ensure that the handler does not forget to authorize its response data.
   * In other environments, this field is not guaranteed to be correctly updated.
   */
  isAuthorized: boolean
}

export type ApiResponse<T> = NextApiResponse<T>

export interface ListParams {
  limit: number | null
}

interface ResourceOptions<T, R> {
  policy: PolicyConstructor<InferPolicy<R>>
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
