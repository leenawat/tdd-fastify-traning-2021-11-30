import { FastifyPluginAsync } from 'fastify'
import multer from 'fastify-multer'
import { File } from 'fastify-multer/lib/interfaces'

// const mime = require('mime-types')
// import * as fse from 'fs-extra'
import * as fs from 'fs'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'
import FileModel from '../models/files'

const upload: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const fileModel = new FileModel(fastify.db)
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
        const file: File = request.file
        const fileInfo = {
            originalname: file.originalname,
            mimetype: file.mimetype,
            filesize: file.size,
            filename: file.filename
        }
        const rs: any = await fileModel.save(fileInfo)
        const fileId = rs[0]
        reply.send({ fileId })
    })

    fastify.post('/api/uploads', {
        preHandler: upload.array('file', fileAmountLimit)
    }, async function (request, reply) {
        const files: File[] = request.files
        for (const file of files) {
            const fileInfo = {
                originalname: file.originalname,
                mimetype: file.mimetype,
                filesize: file.size,
                filename: file.filename
            }
            await fileModel.save(fileInfo)
        }
        reply.send({ ok: true })
    })

    fastify.get('/api/file/:fileId',
        async function (request, reply) {
            const params: any = request.params
            const fileId = params.fileId
            const rs: any = await fileModel.getInfo(fileId)
            console.log({ rs , foo: 'bar'})
            if (rs.length > 0) {
                const file = rs[0]
                const filename = file.filename
                const mimetype = file.mimetype
                const filePath = path.join(uploadPath, filename)
                try {
                    if (fs.existsSync(filePath)) {
                        const fileData = fs.readFileSync(filePath)
                        reply.type(mimetype)
                        reply.send(fileData)
                    } else {
                        reply.code(500).send({ ok: false, error: filename + ' not found!' })
                    }
                } catch (error: any) {
                    reply.code(500).send({ ok: false, error: error.message })
                }
            } else {
                reply.code(500).send({ ok: false, error: 'File id not found in database' })
            }
        })
}

export default upload
