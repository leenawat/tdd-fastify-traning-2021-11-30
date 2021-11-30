
import { Knex } from 'knex'

export default class UserRoleModel {

    db: Knex

    constructor(db: Knex) {
        this.db = db
    }

    async findByUserId(userId: any) {
        return this.db('user_roles').select('roles').where({ 'user_id': userId })
    }
}