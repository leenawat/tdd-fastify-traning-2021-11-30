
import { Knex } from 'knex'

export default class FileModel {

    db: Knex

    constructor(db: Knex) {
        this.db = db
    }

    async save(file: any) {
        return await this.db('files').insert(file, 'file_id')
    }

    async getInfo(fileId: any) {
        return await this.db('files').select().where({ file_id: fileId })
    }
}
