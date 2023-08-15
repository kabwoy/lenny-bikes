import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Rental from './Rental'
import Payment from './Payment'

enum Roles{
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN" 
}
export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public first_name: string

  @column()
  public last_name: string

  @column()
  public contact: string

  @hasMany(()=> Rental)
  public rental:HasMany<typeof Rental>

  @hasMany(()=>Payment)
  public payment:HasMany<typeof Payment>
  
  @column({})
  public role: Roles
  
  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
