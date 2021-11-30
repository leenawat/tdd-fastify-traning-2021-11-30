import { FastifyPluginAsync } from 'fastify'
import UserModel from '../models/user'
import bcrypt from 'bcryptjs'

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const userModel = new UserModel(fastify.db)

    fastify.post('/api/auth/sign-in', async function (request, reply) {
        const data: any = request.body
        const userDb: any = await userModel.findByUsername(data.username)
        console.log({ userDb })
        if (!userDb) {
            reply.code(401).send({ message: 'Incorrect credentials' })
        } else {
            const result = bcrypt.compareSync(data.password, userDb.password)
            if (!result) {
                reply.code(401).send({ message: 'Incorrect credentials' })
            } else {
                const token = fastify.jwt.sign({
                    username: userDb.username,
                    firstName: userDb.first_name,
                    lastName: userDb.last_name,
                    roles: ['admin']
                }, {
                    expiresIn: '10h'
                })
                reply.send({ token })
            }
        }
    })

    fastify.get('/api/auth/me', {
        preValidation: [fastify.authenticate]
    }, async function (request, reply) {
        return request.user
    })

}

export default auth
