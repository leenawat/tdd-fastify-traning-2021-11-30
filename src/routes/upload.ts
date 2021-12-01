import { FastifyPluginAsync } from 'fastify'
import multer from 'fastify-multer'

// const mime = require('mime-type')
// import * as fse from 'fs-extra'
// import * as fs from 'fs'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'

const upload: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const uploadPath = './upload'

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadPath)
        },
        filename: (req, file, cb) => {
            const _ext = path.extname(file.originalname)
            const filename = uuidv4() + _ext
            cb(null, filename)
        }
    })
    // const upload = multer({dest: uploadPath})
    const upload = multer({
        storage,
        limits: {
            fileSize: 5 * 1024 * 1024
        },
        fileFilter: (req, file, cb) => {
            // กำหนด type
            if (!(file.mimetype == 'image/png' || file.mimetype == 'image/jpeg')) {
                return cb(new Error('Invalid mimetype!'), false)
            }
            cb(null, true)
        }
    })
    const fileAmountLimit = 3
    fastify.post('/api/upload', {
        preHandler: upload.single('file')
    }, async function (request, reply) {
        const file = request.file
        reply.send(file)
    })

    fastify.post('/api/uploads', {
        preHandler: upload.array('file', fileAmountLimit)
    }, async function (request, reply) {
        const files = request.files
        reply.send(files)
    })
}

export default upload
