import { build } from '../helper'
import db from '../../src/config/database'
const app = build()


describe('user tests', () => {

    beforeEach(async () => {
        await db('users').truncate()
    })

    it('returns 200 ok when signup request is valid', async () => {
        const res = await app.inject({
            url: '/api/users',
            method: 'post',
            payload: {
                'first_name': 'Leenawat',
                'last_name': 'Papahom',
                'username': 'leenawat',
                'password': 'P4ssword'
            }
        })
        expect(res.statusCode).toBe(201)
    })

    it('returns success message when signup request is valid', async () => {
        const res = await app.inject({
            url: '/api/users',
            method: 'post',
            payload: {
                'first_name': 'Leenawat',
                'last_name': 'Papahom',
                'username': 'leenawat',
                'password': 'P4ssword'
            }
        })
        expect(JSON.parse(res.payload)).toEqual({ message: 'User created' })
    })

})