import { build } from '../helper'
import db from '../../src/config/database'
import bcrypt from 'bcryptjs'

const app = build()

const activeUser = { username: 'user1', password: 'P4ssword', first_name: 'User1', last_name: 'LastName1', active: true }

const credentials = { username: 'user1', password: 'P4ssword' }


const addUser = async (user = { ...activeUser }) => {
    const hash = await bcrypt.hash(user.password, 10)
    user.password = hash
    return await db('users').insert(user)
}

const postAuthentication = async (credentials: any, options = {}) => {
    return await app.inject({
        url: '/api/auth/sign-in',
        method: 'post',
        payload: credentials
    })
}


describe('Authentication', () => {

    beforeEach(async () => {
        await db('users').truncate()
    })


    it('returns 200 when credentials are correct', async () => {
        await addUser()
        const res = await postAuthentication(credentials)
        expect(res.statusCode).toBe(200)
    })

    it('returns token when credentials are correct', async () => {
        await addUser()
        const res = await postAuthentication(credentials)
        expect(res.json()).toHaveProperty('token')
    })

    it('returns 401 ถ้า password ไม่ถูกต้อง', async () => {
        await addUser()
        const res = await postAuthentication({ username: 'user1', password: 'Invalidpassword' })
        expect(res.statusCode).toBe(401)
    })

    it('return 200 when request /api/auth/me', async () => {
        await addUser()
        const resToken = await postAuthentication(credentials)
        const token = resToken.json().token

        const res = await app.inject({
            url: '/api/auth/me',
            method: 'get',
            headers: {
                Authorization: 'Bearer ' + token
            },
            payload: credentials
        })

        expect(res.statusCode).toBe(200)
    })

    it('return current user when request /api/auth/me', async () => {
        await addUser()
        const resToken = await postAuthentication(credentials)
        const token = resToken.json().token

        const res = await app.inject({
            url: '/api/auth/me',
            method: 'get',
            headers: {
                Authorization: 'Bearer ' + token
            },
            payload: credentials
        })

        expect(res.json()).toHaveProperty('username')
    })

    it('return 400 when request /api/auth/sign-up username is null', async () => {
        const user = { ...activeUser }
        user.username = ''
        const res = await app.inject({
            url: '/api/auth/sign-up',
            method: 'post',
            payload: user
        })
        expect(res.statusCode).toBe(400)
    })

    it('return "username" is not allowed to be empty when request /api/auth/sign-up username is empty', async () => {
        const user = { ...activeUser }
        user.username = ''
        const res = await app.inject({
            url: '/api/auth/sign-up',
            method: 'post',
            payload: user
        })
        console.log(res.json())
        expect(res.json().message).toEqual(expect.stringContaining('"username" is not allowed to be empty'))
    })

    it('return "username" length must be at least 4 characters long when request /api/auth/sign-up username is "abc"', async () => {
        const user = { ...activeUser }
        user.username = 'abc'
        const res = await app.inject({
            url: '/api/auth/sign-up',
            method: 'post',
            payload: user
        })
        console.log(res.json())
        expect(res.json().message).toEqual(expect.stringContaining('"username" length must be at least 4 characters long'))
    })


    it('return require field  when request /api/auth/sign-up body {}', async () => {
        const res = await app.inject({
            url: '/api/auth/sign-up',
            method: 'post',
            payload: {}
        })
        console.log(res.json())
        expect(res.json().message).toEqual(expect.stringContaining('\"username\" is required'))
        expect(res.json().message).toEqual(expect.stringContaining('\"password\" is required'))
        expect(res.json().message).toEqual(expect.stringContaining('\"first_name\" is required'))
        expect(res.json().message).toEqual(expect.stringContaining('\"last_name\" is required'))
    })

    it('returns 403 when logging in with an inactive account', async () => {
        await addUser({ ...activeUser, active: false })
        const response = await postAuthentication(credentials)
        expect(response.statusCode).toBe(403)
    })

})