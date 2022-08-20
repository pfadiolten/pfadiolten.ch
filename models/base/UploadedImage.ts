
export default interface UploadedImage {
  path: string
  mimeType: string
  dimensions: {
    width: number
    height: number
  }
}

export const allowedImageTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
]
