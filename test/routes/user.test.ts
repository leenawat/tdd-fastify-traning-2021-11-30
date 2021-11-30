import { build } from '../helper'
import db from '../../src/config/database'
const app = build()

const validUser = {
    'first_name': 'Leenawat',
    'last_name': 'Papahom',
    'username': 'leenawat',
    'password': 'P4ssword'
}

const postUser = async (user = validUser) => {
    return await app.inject({
        url: '/api/users',
        method: 'post',
        payload: validUser
    })
}

describe('user tests', () => {

    beforeEach(async () => {
        await db('users').truncate()
    })

    it('returns 200 ok when signup request is valid', async () => {
        const res = await postUser()
        expect(res.statusCode).toBe(201)
    })

    it('returns success message when signup request is valid', async () => {
        const res = await postUser()
        expect(JSON.parse(res.payload)).toEqual({ message: 'User created' })
    })

    it('save the user to database', async () => {
        await postUser()
        const userList = await db('users').select()
        expect(userList.length).toBe(1)
    })

})

