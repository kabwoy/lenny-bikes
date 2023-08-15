import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Bike from "App/Models/Bike";
import { useRentalValidator } from "App/validators/rentalValidator";
import moment from "moment";
import axios from "axios";
import fs from "node:fs";
import User from "App/Models/User";

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
      CallBackURL: "https://2602-154-122-135-207.ngrok-free.app/callback",
      AccountReference: "Test",
      TransactionDesc: "Test",
    };
    try {
      const token = fs.readFileSync("token.txt").toString();
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
      await Database.insertQuery()
        .table("rentals")
        .insert({
          user_id: userId,
          bike_id: bikeId,
          rental_start: rentalPayload.rental_start.toJSDate(),
          rental_end: rentalPayload.rental_end.toJSDate(),
        });
      // await Rental.create({
      //     user_id:userId,
      //     bike_id:bikeId,
      //     rental_start:rentalPayload.rental_start,
      //     rental_end:rentalPayload.rental_end
      // })
      session.flash("completed", "Transaction Completed Successfully");
      return response.redirect("back");
    } catch (e) {
      console.error(e);
    }
  }
  //------------------------------------------- CRUD FOR RENTALS -----------------------------------------------------------------------------//
  public async index({view}:HttpContextContract){
    return view.render("rentals/index")
  }
  public async create({view}:HttpContextContract){
    try{
        const bikes = await Bike.all()
        const users = await User.all()
        return view.render("rentals/new" , {bikes , users})
    }catch(e){

    }
    
  }
  public async store(){
    
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
