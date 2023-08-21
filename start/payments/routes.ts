import Route from '@ioc:Adonis/Core/Route'
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Rental from 'App/Models/Rental';
import User from 'App/Models/User';

Route.resource("/payments" , 'PaymentsController')

Route.get("/payments/form/:id" , async({request, response , view}:HttpContextContract)=>{

    const id = request.params().id
    try {
        
        const rental = await Rental.find(id)
        const user = await User.find(rental?.userId)
        return view.render('payments/makepay' , {rental , user})

    } catch (error) {
        response.badRequest(error)
    }

})

Route.get("/payments-search" , 'PaymentsController.search')