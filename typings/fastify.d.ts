/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifyInstance } from 'fastify'

declare module 'fastify' {
    interface FastifyRequest {
        user: any;
        jwtVerify: any;
        file: any;
        files: any[];
    }
    
    interface FastifyInstance {
        jwt: any;
        authenticate: any;
        guard: any;
    }

    interface FastifySchema {
        tags?: unknown;
        security?: unknown;
        description?: unknown;
        body?: unknown;
        querystring?: unknown;
        params?: unknown;
        headers?: unknown;
        response?: unknown;
        validate?: any;
    }
}