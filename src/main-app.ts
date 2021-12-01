import { join } from 'path'
import * as fastify from 'fastify'
import { FastifyInstance } from 'fastify'
import AutoLoad from 'fastify-autoload'

const app: FastifyInstance = fastify.fastify({
    logger: { level: 'info' }
})

app.register(require('fastify-multer').contentParser)

app.setValidatorCompiler(({ schema, method, url, httpPart }) => {
    return data => schema.validate(data, { abortEarly: false })
})

app.register(AutoLoad, {
    dir: join(__dirname, 'plugins')
})

app.register(AutoLoad, {
    dir: join(__dirname, 'routes')
})

export default app

