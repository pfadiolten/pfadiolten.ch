import { parseGroup } from '@/models/Group'
import GroupRepo from '@/repos/GroupRepo'
import ApiService from '@/services/ApiService'

export default ApiService.handleResource(GroupRepo, {
  parse: parseGroup,
})

// export default ApiService.handleREST({
//   async get(req, res) {
//     const response = await fetch('https://db.scout.ch/de/groups/6.json?token=')
//     let data: any = await response.json()
//     console.log(data.linked.groups)
//
//     res.status(200).end()
//   },
// })
