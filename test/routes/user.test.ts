import { build } from '../helper'
import db from '../../src/config/database'
const app = build()

const validUser = {
    'first_name': 'Leenawat',
    'last_name': 'Papahom',
    'username': 'leenawat',
    'password': 'P4ssword'
}

const postUser = async (user = { ...validUser }) => {
    return await app.inject({
        url: '/api/users',
        method: 'post',
        payload: user
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

    it('password ที่เก็บใน database ต้องไม่เป็น plaintext', async () => {
        await postUser()
        const user = await db('users').first()
        expect(user.password).not.toBe(validUser.password)
    })

    it('user 2 คนที่มี password เหมือนกัน จะต้องถูกเก็บโดยเข้ารหัสแล้วต้องไม่เหมือนกัน', async () => {
        await postUser()
        await postUser({
            'first_name': 'Leenawat',
            'last_name': 'Papahom',
            'username': 'leenawat2',
            'password': 'P4ssword'
        })
        const userList = await db('users').select()
        expect(userList[0].password).not.toBe(userList[1].password)
    })

})

