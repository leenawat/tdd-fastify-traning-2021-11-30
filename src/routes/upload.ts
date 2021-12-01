import { FastifyPluginAsync } from 'fastify'
import multer from 'fastify-multer'

// const mime = require('mime-type')
// import * as fse from 'fs-extra'
// import * as path from 'path'
// import * as fs from 'fs'

const upload: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const uploadPath = './upload'
    const upload = multer({ dest: uploadPath })
    fastify.post('/api/upload', {
        preHandler: upload.single('file')
    }, async function (request, reply) {
        const file = request.file
        reply.send(file)
    })
}

export default upload
