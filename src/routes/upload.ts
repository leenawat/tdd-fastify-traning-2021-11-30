import { FastifyPluginAsync } from 'fastify'
import multer from 'fastify-multer'

// const mime = require('mime-type')
// import * as fse from 'fs-extra'
// import * as fs from 'fs'
import * as path from 'path'
import {v4 as uuidv4} from 'uuid'

const upload: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const uploadPath = './upload'

    const storage = multer.diskStorage({
        destination: (req, file, cb)=>{
            cb(null, uploadPath)
        },
        filename: (req, file, cb)=>{
            const _ext = path.extname(file.originalname)
            const filename = uuidv4() + _ext
            cb(null, filename)
        }
    })

    const upload = multer({ storage })
    fastify.post('/api/upload', {
        preHandler: upload.single('file')
    }, async function (request, reply) {
        const file = request.file
        reply.send(file)
    })
}

export default upload
