import { diskStorage } from 'multer'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'
import * as fs from 'fs'

const uploadsDir = path.join(process.cwd(), 'uploads', 'avatars')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

export const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4()
    const extension = path.extname(file.originalname)
    cb(null, `${uniqueName}${extension}`)
  },
})

export const multerOptions = {
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}
