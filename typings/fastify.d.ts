/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyInstance } from 'fastify'

declare module 'fastify' {
    interface FastifyRequest {
        user: any;
        jwtVerify: any;
    }
    
    interface FastifyInstance {
        jwt: any
        authenticate: any
    }
}