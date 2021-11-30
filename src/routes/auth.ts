import { FastifyPluginAsync } from 'fastify'
import UserModel from '../models/user'
import bcrypt from 'bcryptjs'

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const userModel = new UserModel(fastify.db)

    fastify.post('/api/auth/sign-in', async function (request, reply) {
        const data: any = request.body
        const userDb: any = await userModel.findByUsername(data.username)
        if (!userDb) {
            reply.code(401).send({ message: 'Incorrect credentials' })
        } else {
            const result = bcrypt.compareSync(data.password, userDb.password)
            if (!result) {
                reply.code(401).send({ message: 'Incorrect credentials' })
            } else {
                reply.code(200).send()
            }
        }
    })
}

export default auth
