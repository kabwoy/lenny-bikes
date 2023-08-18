import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Bike from "App/Models/Bike";
import { useRentalValidator } from "App/validators/rentalValidator";
import moment from "moment";
import axios from "axios";
import User from "App/Models/User";
import Env from "@ioc:Adonis/Core/Env"
import Rental from "App/Models/Rental";
import fs from 'node:fs/promises'
import View from '@ioc:Adonis/Core/View'

export default class RentalsController {
  public async checkout({ view, request }: HttpContextContract) {
    const bikeId = request.params().bikeid;
    try {
      const bike = await Bike.find(+bikeId);
      return view.render("clients/checkout", { bike: bike });
    } catch (e) {
      console.error(e);
    }
  }
  public async rent({ auth, request, response, session }: HttpContextContract) {
    console.log(request.body());
    const contact = `${auth.user?.contact}`;

    console.log(contact);
    const bikeId = request.params().bikeid;
    const userId = auth.user?.id;
    const passcode =
      "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    const shortCode = "174379";
    const timeStamp = moment().format("YYYYMMDDHHmmss");
    const password = Buffer.from(shortCode + passcode + timeStamp).toString(
      "base64"
    );
    const reqBody = {
      BusinessShortCode: "174379",
      Password: password,
      Timestamp: timeStamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: "1",
      PartyA: `${auth.user?.contact}`,
      PartyB: "174379",
      PhoneNumber: `${auth.user?.contact}`,
      CallBackURL: "https://ficus.serveo.net/callback",
      AccountReference: "Test",
      TransactionDesc: "Test",
    };
    try {
      const token = await this.getToken();
      console.log(token);
      await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        reqBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { rentalCreateSchema } = useRentalValidator();
      const rentalPayload = await request.validate({
        schema: rentalCreateSchema,
      });
      const bike = await Bike.find(bikeId);
      if (bike?.status == "BOOKED") {
        session.flash("booked", "The bike is already booked");
        return response.redirect("back");
      }
      const rentalObj = await Database.insertQuery()
        .table("rentals")
        .insert({
          user_id: userId,
          bike_id: bikeId,
          rental_start: rentalPayload.rental_start.toJSDate(),
          rental_end: rentalPayload.rental_end.toJSDate(),
        });

        const bikeToUpdate = await Bike.find(+bikeId)
        await bikeToUpdate?.merge({status:"BOOKED"}).save();
      // await Rental.create({
      //     user_id:userId,
      //     bike_id:bikeId,
      //     rental_start:rentalPayload.rental_start,
      //     rental_end:rentalPayload.rental_end
      // })
      const paymentDetails = {
        rental_id:rentalObj[0].toString(),
        user_id:userId,
      }
      await fs.writeFile('rental.txt' ,JSON.stringify(paymentDetails))
      console.log(rentalObj[0]); 
      session.put('rental_id' , rentalObj[0])
      session.flash("completed", "Transaction Completed Successfully");
      return response.redirect("/client/bikes");
    } catch (e) {
      console.error(e.message);
    }
  }

  public async getToken() : Promise<string> {
  
    const consumerKey = Env.get('CONSUMER_KEY')
    const consumerSecret = Env.get('CONSUMER_SECRET')
    const basicKey = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")
    try{
      const res = await axios.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
          {
           headers:{
            Authorization:`Basic ${basicKey}`
           }
          }
        )
  
        return res.data.access_token
    }catch(e){
      return e.message.toString()
    }
  

  }
  //------------------------------------------- CRUD FOR RENTALS -----------------------------------------------------------------------------//
  public async index({view}:HttpContextContract){
    try{
      const rentals = await Rental.query().preload('user').preload('bike')
      return view.render("rentals/index",{rentals})
    }catch(e){
      console.error(e)
    }
    
  }
  public async create({view}:HttpContextContract){
    try{
        const bikes = await Bike.all()
        const users = await User.all()
        return view.render("rentals/new" , {bikes , users})
    }catch(e){

    }
    
  }
  public async store({request , session , response}:HttpContextContract){
    console.log(request.body());
    
    const {rentalAdminCreateSchema} = useRentalValidator()
    try{
      const rentalPayload = await request.validate({schema:rentalAdminCreateSchema})
      await Database.insertQuery()
      .table("rentals")
      .insert({
        user_id: rentalPayload.user_id,
        bike_id: rentalPayload.bike_id,
        rental_start: rentalPayload.rental_start.toJSDate(),
        rental_end: rentalPayload.rental_end.toJSDate(),
        payment_status:rentalPayload.payment_status
      });
      const bike = await Bike.find(+rentalPayload.bike_id)
      await bike?.merge({status:"BOOKED"}).save()
      session.flash('success_rent' , "Bike Rented Successfully")
      return response.redirect('back')
    }catch(e){
      console.log(e);
    }
  }
  public async show({request , response}:HttpContextContract){
    const rentalId = request.params().id
    console.log(rentalId);
    
    try{
      const rental = await Rental.find(rentalId)
      const user = await User.find(rental?.userId)
      // const user = await Rental.query().preload("user" , (userQuery)=>{
      //     userQuery.where('id' , rental!.userId)
      // })
      // console.log(user);
       View.global('globalRental' , rental)
       View.global('globalUser' , user)
       return response.json({msg:"global set"})
       
    }catch(e){
      return response.badRequest(e)
    }
  }
  public async edit({view , request}:HttpContextContract){
    const rentalId = request.params().id
    try{
      const bikes = await Bike.all()
      const users = await User.all()
      const updateRental = await Rental.find(+rentalId)
      const editedRental = {id:updateRental?.id, user_id:updateRental?.userId ,rental_start:moment(updateRental?.rental_start).format("yyyy-MM-DD") ,  bike_id:updateRental?.bikeId , rental_end:moment(updateRental?.rental_end).format("yyyy-MM-DD")}
      console.log(editedRental);
      
      return view.render("rentals/edit" , {bikes , users , editedRental})
    }catch(e){
      console.log(e);  
    }
    
   
  }
  public async update({ request, response }: HttpContextContract) {
    const rentalId = request.params().id
    const { rentalAdminUpdateSchema } = useRentalValidator()

    try {
      const rental = await Rental.find(+rentalId)

      if (!rental) {
        return response.status(404).send('Rental not found')
      }

      const rentalPayload = await request.validate({ schema: rentalAdminUpdateSchema })


     await Database.from("rentals").where('id' , rentalId).update({...rentalPayload , rental_start:rentalPayload.rental_start?.toJSDate() , rental_end:rentalPayload.rental_end?.toJSDate()})

      return response.redirect('/rentals')
    } catch (error) {
      console.error(error)
      return response.status(500).send('An error occurred')
    }
  }


  public async destroy({ request, response }: HttpContextContract){
    const rentalId = request.params().id
    try {
      const rental = await Rental.find(+rentalId)
      await rental?.delete()
      response.redirect('back')
    } catch (error) {
      response.badRequest(error)
    }
  }
}
