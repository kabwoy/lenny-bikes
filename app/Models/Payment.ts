import { DateTime } from "luxon";
import { BaseModel, BelongsTo, afterFind, beforeFind, beforeUpdate, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";
import Rental from "./Rental";
import moment from "moment";

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public userId: number;

  @column()
  public rentalId: number;

  @column()
  reciept_number:string

  @column()
  transaction_date:DateTime

  @belongsTo(()=>User)
  public user:BelongsTo<typeof User>

  @belongsTo(()=>Rental)
  public rental:BelongsTo<typeof Rental>

  @column()
  public amount: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @afterFind()
  public static transformDate(payment:Payment){
    payment.transaction_date  = moment(payment.transaction_date).format("YYYY-MM-DDTHH:mm") as unknown as DateTime
  }

  @beforeUpdate()
  public static tranformUpdateDate(payment:Payment){
    payment.transaction_date = moment(payment.transaction_date).format("YYYY-MM-DD HH:mm:ss") as unknown as DateTime

  }
}
