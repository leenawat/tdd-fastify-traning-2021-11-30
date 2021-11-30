import { FastifyPluginAsync } from 'fastify'
import UserModel from '../models/user'
import bcrypt from 'bcryptjs'
import Joi from 'joi'
import UserRoleModel from '../models/user-roles'

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const userModel = new UserModel(fastify.db)
    const userRoleModel = new UserRoleModel(fastify.db)

    fastify.post('/api/auth/sign-in', async function (request, reply) {
        const data: any = request.body
        const userDb: any = await userModel.findByUsername(data.username)
        if (!userDb) {
            reply.code(401).send({ message: 'Incorrect credentials' })
        } else {
            if (userDb.active === 0) {
                reply.code(403).send({ message: 'User is not active' })

            }
            const result = bcrypt.compareSync(data.password, userDb.password)
            if (!result) {
                reply.code(401).send({ message: 'Incorrect credentials' })
            } else {
                const roles = await userRoleModel.findByUserId(userDb.user_id)
                const token = fastify.jwt.sign({
                    username: userDb.username,
                    firstName: userDb.first_name,
                    lastName: userDb.last_name,
                    roles: roles.map(role => role.roles)
                }, {
                    expiresIn: '10h'
                })
                reply.send({ token })
            }
        }
    })

    // this route can only be called by users who has 'cto' and 'admin' roles
    fastify.get(
        '/api/auth/admin', {
        preValidation: [fastify.authenticate],
        preHandler: [fastify.guard.role(['admin'])]
    }, (req, reply) => {
        reply.send({ message: 'only admin role can see' })
    })

    fastify.get('/api/auth/me', {
        schema: {
            security: [{ bearer: [] }]
        },
        preValidation: [fastify.authenticate]
    }, async function (request, reply) {
        return request.user
    })

    fastify.post('/api/auth/sign-up', {
        schema: {
            body: Joi.object({
                username: Joi.string().alphanum().min(4).max(20).required(),
                password: Joi.string().alphanum().min(6).max(20).required(),
                first_name: Joi.string().required(),
                last_name: Joi.string().required()
            }).required(),
        }
    }, async function (request, reply) {
        reply.code(200).send()
    })

}

export default auth
