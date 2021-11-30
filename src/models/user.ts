
import { Knex } from 'knex'

export default class UserModel {

    db: Knex

    constructor(db: Knex) {
        this.db = db
    }

    async save(data: any) {
        return await this.db('users').insert(data)
    }
    async findByUsername(username: any): Promise<any> {
        return await this.db('users').select().where({ username }).first()
    }
}
