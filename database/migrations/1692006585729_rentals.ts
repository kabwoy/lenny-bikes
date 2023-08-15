import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'rentals'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('bike_id').unsigned().references('id').inTable('bikes').onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
      table.date('rental_start')
      table.date('rental_end')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }
  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
