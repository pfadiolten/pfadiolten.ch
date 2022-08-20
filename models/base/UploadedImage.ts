import Dimensions from '@/models/base/Dimensions'

export default interface UploadedImage {
  path: string
  mimeType: string
  dimensions: Dimensions
}

export const allowedImageTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
]
