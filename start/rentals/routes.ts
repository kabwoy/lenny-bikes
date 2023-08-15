import Route from '@ioc:Adonis/Core/Route'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
Route.get("/client/checkout/:bikeid" , "RentalsController.checkout").middleware('auth')

Route.post("/client/rent/:bikeid" , "RentalsController.rent").middleware(['auth' , 'getToken'])

Route.post("/callback" , ({request , response}:HttpContextContract)=>{

    console.log(request.body().Body.stkCallback.MerchantRequestID);
    
})

Route.resource("/rentals" , 'RentalsController')