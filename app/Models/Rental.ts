import { DateTime } from "luxon";
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";
import Bike from "./Bike";
import Payment from "./Payment";
import { Status } from "./enums/payment_status";

export default class Rental extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  userId: number;

  @column()
  bikeId: number;
  
  @column()
  payment_status:Status

  @column()
  rental_start: DateTime;

  @column()
  rental_end: DateTime;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @belongsTo(() => Bike)
  public bike: BelongsTo<typeof Bike>;

  @hasMany(()=>Payment)
  public payment:HasMany<typeof Payment>

  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
