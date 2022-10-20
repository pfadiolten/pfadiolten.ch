import { Id } from '@pfadiolten/react-kit'
import { allowedImageTypes } from '@/models/base/UploadedImage'
import User from '@/models/User'
import UserPolicy from '@/policies/UserPolicy'
import UserDataRepo from '@/repos/UserDataRepo'
import UserRepo from '@/repos/UserRepo'
import { ApiError } from '@/services/api/ApiErrorService'
import ApiService, { ApiRequest } from '@/services/ApiService'
import FileService from '@/services/FileService'
import { File, IncomingForm } from 'formidable'
import { createReadStream, promises as fs } from 'fs'
import mime from 'mime-types'
import probe from 'probe-image-size'
import { v4 as uuid } from 'uuid'


export default ApiService.handleREST({
  async get(req, res) {
    const id = req.query.id as Id<User>

    const user = await UserRepo.find(id)
    if (user === null || user.avatar === null) {
      return ApiService.Error.notFound()
    }

    const policy = ApiService.policy(req, UserPolicy)
    ApiService.allowIf(policy.canRead(user))

    const fileStream = await AvatarFileService.read(id)
    const fileExt = mime.extension(user.avatar.mimeType)
    res.writeHead(200, {
      'Content-Type': user.avatar.mimeType,
      'Content-Disposition': `inline; filename="${user.name}.${fileExt}"`,
    })
    fileStream.pipe(res)
  },

  async post(req: ApiRequest, res) {
    const reqContentType = req.headers['content-type']
    if (reqContentType === undefined || !reqContentType.startsWith('multipart/form-data')) {
      throw new ApiError(415, 'expected \'multipart/form-data\' content')
    }

    const id = req.query.id as Id<User>
    const file = await parseFile(req)

    const user = await UserRepo.find(id)
    if (user === null) {
      await fs.rm(file.filepath)
      return ApiService.Error.notFound()
    }

    const policy = ApiService.policy(req, UserPolicy)
    ApiService.allowIf(policy.canEdit(user))

    const fileProbe = await probe(createReadStream(file.filepath))
    if (!allowedImageTypes.includes(fileProbe.mime)) {
      await fs.rm(file.filepath)
      throw new ApiError(400, `expected an image, got ${fileProbe.mime}`)
    }

    const fileExt = mime.extension(fileProbe.mime)
    if (fileExt === false) {
      await fs.rm(file.filepath)
      throw new ApiError(500, 'failed to retrieve extension of uploaded file')
    }

    const fileData = await fs.readFile(file.filepath)
    await AvatarFileService.save(id, fileData)
    const updatedUserData = await UserDataRepo.update(id, {
      avatar: {
        path: `/api/users/${id}/avatar?c=${uuid()}`,
        mimeType: fileProbe.mime,
        dimensions: {
          width: fileProbe.width,
          height: fileProbe.height,
        },
      },
    })
    await fs.rm(file.filepath)
    if (updatedUserData === null) {
      throw new Error(`failed to update UserData for ${id}`)
    }
    res.status(200).json(updatedUserData.avatar)
  },


  async delete(req, res) {
    const id = req.query.id as Id<User>

    const user = await UserRepo.find(id)
    if (user === null) {
      return ApiService.Error.notFound()
    }

    const policy = ApiService.policy(req, UserPolicy)
    ApiService.allowIf(policy.canEdit(user))

    await AvatarFileService.delete(id)
    await UserDataRepo.update(id, {
      avatar: null,
    })
    res.status(201).end()
  },
})

const AvatarFileService = new FileService('users/avatars')

const parseFile = (req: ApiRequest): Promise<File> => new Promise((resolve) => {
  const form = new IncomingForm()
  form.parse(req, (err, fields, { file }) => {
    if (err != null) {
      throw new ApiError(422, `failed to parse form data: ${err}`)
    }
    if (file == null || Array.isArray(file)) {
      throw new ApiError(422, 'form data has unexpected format')
    }
    resolve(file)
  })
})

export const config = {
  api: {
    responseLimit: false,
    bodyParser: false,
  },
}


