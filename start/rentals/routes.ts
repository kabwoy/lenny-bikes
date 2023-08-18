import Route from '@ioc:Adonis/Core/Route'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import fs from 'node:fs'
import Payment from 'App/Models/Payment'
import Rental from 'App/Models/Rental'
import { Status } from 'App/Models/enums/payment_status'

Route.get("/client/checkout/:bikeid" , "RentalsController.checkout").middleware('auth')

Route.post("/client/rent/:bikeid" , "RentalsController.rent").middleware(['auth'])

Route.resource("/rentals" , 'RentalsController')



Route.post("/callback" , async({request , response }:HttpContextContract)=>{
    let rentalDetails = fs.readFileSync('rental.txt').toString()
    const parsed = JSON.parse(rentalDetails)
    console.log(request.body().Body);
    console.log(+parsed.user_id);
    
    
    if(request.body().Body.stkCallback.ResultCode === 1032 ){
      
        return console.log("Transaction Failed Or Cancelled");
        
    }
    const Items = request.body().Body.stkCallback.CallbackMetadata.Item
    console.log(Items);
    
    await Payment.create({
        user_id:+parsed.user_id,
        rental_id:+parsed.rental_id,
        amount:Items[0].Value,
        reciept_number:Items[1].Value,
        transaction_date:Items[2].Value,
   
    })

    const rental = await Rental.find(+parsed.rental_id)
    await rental?.merge({payment_status:Status.PAID}).save()
    return response.redirect("/")



    /*{
  Item: [
    { Name: 'Amount', Value: 1 },
    { Name: 'MpesaReceiptNumber', Value: 'RHH1BTQPAF' },
    { Name: 'Balance' },
    { Name: 'TransactionDate', Value: 20230817103356 },
    { Name: 'PhoneNumber', Value: 254758262427 }
  ]
   // if kuna fuliza think so 
  [
  { Name: 'Amount', Value: 1 },
  { Name: 'MpesaReceiptNumber', Value: 'RHI0FBEO5Q' },
  { Name: 'TransactionDate', Value: 20230818133551 },
  { Name: 'PhoneNumber', Value: 254758262427 }
]

}*/
   
    
})

// Route.resource("/rentals" , 'RentalsController')
