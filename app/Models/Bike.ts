import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Rental from './Rental'

export default class Bike extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public image_url: string

  @column()
  public status: String

  @column()
  public type: String

  @hasMany(()=>Rental)

  public rental:HasMany<typeof Rental>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
