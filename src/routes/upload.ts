import { FastifyPluginAsync } from 'fastify'
import multer from 'fastify-multer'

const mime = require('mime-types')
// import * as fse from 'fs-extra'
import * as fs from 'fs'
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

    fastify.get('/api/file/:filename',
        async function (request, reply) {
            const params: any = request.params

            const filename = params.filename

            const filePath = path.join(uploadPath, filename)

            try {
                 if(fs.existsSync(filePath)){
                    const _mimetype = mime.lookup(filename)
                    const fileData = fs.readFileSync(filePath)
                    reply.type(_mimetype)
                    reply.send(fileData)
                 }   else{
                    reply.code(500).send({ ok: false, error: filename + ' not found!' }) 
                 }    
            } catch (error: any) {
                reply.code(500).send({ ok: false, error: error.message })
            }
        })
}

export default upload
