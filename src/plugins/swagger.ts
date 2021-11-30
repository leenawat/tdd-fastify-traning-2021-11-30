/* eslint-disable @typescript-eslint/no-var-requires */
import fp from 'fastify-plugin'
import FastifySwagger from 'fastify-swagger'
const convert = require('joi-to-json')

export default fp(async (fastify: any, opts: any, done: any) => {
    fastify.register(FastifySwagger, {
        routePrefix: '/swagger',
        openapi: {
            info: {
                title: 'Test swagger',
                description: 'Testing the Fastify swagger API',
                version: '0.1.0'
            },
            // externalDocs: {
            //     url: 'https://swagger.io',
            //     description: 'Find more info here'
            // },
            consumes: ['application/json'],
            produces: ['application/json'],
            tags: [
                { name: 'auth', description: 'Auth related end-points' },
                { name: 'user', description: 'User related end-points' }
            ],
            components: {
                securitySchemes: {
                    bearer: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    }
                }
            },
        },
        exposeRoute: true,
        transform: (schema: any = {}) => {
            
            const {
                params,
                body,
                querystring,
                ...others
            } = schema
            const transformed = { ...others }
            if (params) transformed.params = convert(params)
            if (body) transformed.body = convert(body)
            if (querystring) transformed.querystring = convert(querystring)
            return transformed
        }
    })
    done()
})
