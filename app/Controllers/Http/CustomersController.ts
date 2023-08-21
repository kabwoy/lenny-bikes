import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import { useAuthValidator } from "App/validators/authValidator";

export default class CustomersController {
  public async index({ view, response }: HttpContextContract) {
    try {
      const users = await User.all();
      return view.render("users/index", { users });
    } catch (e) {
      return response.badRequest(e);
    }
  }

  public async create({ response, request , view }: HttpContextContract) {
    try { 
     return view.render("users/new");
    } catch (e) {
      return response.badRequest(e);
    }
  }

  public async store ({ response, request }: HttpContextContract){
    try {
      const { signupSchema } = useAuthValidator();
      const customerPayload = await request.validate({ schema: signupSchema });
      await User.create({ ...customerPayload });
      return response.redirect("/users");
    } catch (e) {
      return response.badRequest(e);
    }
  }

  public async show({ view, response, request }: HttpContextContract) {
    const userId = request.params().id;
    try {
      const user = await User.find(+userId);
      return view.render("users/show", { user });
    } catch (e) {
      return response.badRequest(e);
    }
  }

  public async edit({ view, response, request }: HttpContextContract) {
    const userId = request.params().id;
    try {
      const user = await User.find(+userId);
      return view.render("users/edit", { user });
    } catch (e) {
      return response.badRequest(e);
    }
  }

  public async destroy({ response, request }: HttpContextContract) {
    const userId = request.params().id;
    try {
      const user = await User.find(+userId);
      await user?.delete();
      return response.redirect("/users");
    } catch (e) {
      return response.badRequest(e);
    }
  }

  public async update({ response, request }: HttpContextContract) {
    const userId = request.params().id;
    try {
      const { userUpdateSchema } = useAuthValidator();
      const customerPayload = await request.validate({
        schema: userUpdateSchema,
      });
      const user = await User.find(+userId);
      await user?.merge({ ...customerPayload }).save();
      return response.redirect("/users");
    } catch (e) {
      return response.badRequest(e);
    }
  }
}
