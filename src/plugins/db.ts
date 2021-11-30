import fp from 'fastify-plugin'
import { Knex } from 'knex'
import db from '../config/database'

export default fp(async (fastify:any, opts:any, done:any) => {
    fastify.decorate('db', await db)
    done()
})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
    export interface FastifyInstance {
        db: Knex;
    }
}
