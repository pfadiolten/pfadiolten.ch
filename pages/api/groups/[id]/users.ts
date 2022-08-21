import { GroupId } from '@/models/Group'
import User from '@/models/User'
import UserPolicy from '@/policies/UserPolicy'
import UserRepo from '@/repos/UserRepo'
import ApiService, { ApiResponse } from '@/services/ApiService'


export default ApiService.handleREST({
  async get(req, res: ApiResponse<User[]>) {
    const id = req.query.id as GroupId

    const policy = ApiService.policy(req, UserPolicy)
    ApiService.allowIf(policy.canList())

    const users = await UserRepo.listGroup(id)
    if (users === null) {
      return ApiService.Error.notFound()
    }

    res.status(200).json(users)
  },
})
