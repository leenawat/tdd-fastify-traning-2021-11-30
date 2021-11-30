import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    // fatal, error, warn, info, debug, trace
    /**
     * fatal -> fatal
     * error -> fatal, error, 
     * warn  -> fatal, error, warn
     * info  -> fatal, error, warn, info
     * debug -> fatal, error, warn, info, debug 
     * trace -> fatal, error, warn, info, debug, trace
     */
     fastify.log.fatal('1 `fatal`')
     fastify.log.error('2 `error`')
     fastify.log.warn('3 `warn`')
     fastify.log.info('4 `info`')
     fastify.log.debug('5 `debug`')
     fastify.log.trace('6 `trace`')
    return { root: true }
  })
}

export default root;
