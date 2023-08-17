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
import { Request } from "@adonisjs/core/build/standalone";

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
      CallBackURL: "https://84f9-102-167-107-74.ngrok-free.app/callback",
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
  public async show(){
    
  }
  public async edit(){
    
  }

  public async update(){
    
  }

  public async destroy(){
    
  }
}
