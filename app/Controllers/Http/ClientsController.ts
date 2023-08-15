import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bike from 'App/Models/Bike'

export default class ClientsController {

    public async index({view}:HttpContextContract){
        try{
            const bikes = await Bike.all()
            return view.render("clients/bikes.edge" , {bikes:bikes})
        }catch(e){
            console.error(e);
        }
    }
}
