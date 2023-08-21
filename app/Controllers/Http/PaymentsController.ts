import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Payment from "App/Models/Payment";
import Rental from "App/Models/Rental";
import User from "App/Models/User";
import { Status } from "App/Models/enums/payment_status";
import { usePaymentValidator } from "App/validators/paymentValidator";
import moment from "moment";

export default class PaymentsController {
  public async index({ response, view }: HttpContextContract) {
    try {
      const payments = await Payment.query().preload("rental").preload("user");

      return view.render("payments/index", { payments });
    } catch (e) {
      return response.badRequest(e);
    }
  }
  public async store({ request, response }: HttpContextContract) {
    try {
      const { paymentCreateSchema } = usePaymentValidator();
      const paymentPayload = await request.validate({
        schema: paymentCreateSchema,
      });
      await Database.insertQuery().table("payments").insert({
        user_id: paymentPayload.user_id,
        rental_id: paymentPayload.rental_id,
        reciept_number: paymentPayload.reciept_number,
        amount: paymentPayload.amount,
        transaction_date: paymentPayload.transaction_date.toJSDate(),
      });

      const rental = await Rental.find(paymentPayload.rental_id);
      await rental?.merge({ payment_status: Status.PAID }).save();
      return response.redirect("/rentals");
    } catch (error) {
      return response.badRequest(error);
    }
  }
  public async edit({ request, response, view }: HttpContextContract) {
    const id = request.params().id;
    try {
      const payment = await Payment.find(+id);
      const user = await User.find(payment?.userId)
      console.log(payment?.transaction_date);
      return view.render("payments/edit", { payment , user });
    } catch (e) {
      return response.badRequest(e);
    }
  }

  public async update({ request, response }: HttpContextContract) {
    const id = request.params().id;
    try {
      const { paymentUpdateSchema } = usePaymentValidator();
      const payment = await Payment.find(+id);
      const paymentPayload = await request.validate({
        schema: paymentUpdateSchema,
      });
      await payment?.merge(paymentPayload).save();
      return response.redirect("/payments");
    } catch (e) {
      return response.badRequest(e);
    }
  }

  public async destroy({ request, response }: HttpContextContract) {
    const id = request.params().id;
    try {
      const payment = await Payment.find(+id);
      await payment?.delete();
      return response.redirect("back");
    } catch (error) {
      return response.badRequest(error);
    }
  }

  public async search({request , response}:HttpContextContract){
    const reciept = request.qs().reciept
    try {
      const payments = await Database.from("payments")
      .leftJoin('users' , 'payments.user_id' , 'users.id')
      .where('reciept_number' , 'LIKE' , `%${reciept}%`)
      .select('payments.*' , 'users.first_name' , 'users.email')
      console.log(payments);
  
      return response.json(payments)
    } catch (error) {
      return response.badRequest(error)
    }
  }
}


