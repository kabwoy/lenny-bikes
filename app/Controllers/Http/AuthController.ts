import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import Hash from "@ioc:Adonis/Core/Hash";
import { useAuthValidator } from "App/validators/authValidator";

export default class AuthController {
  public async signUpPage({ view }: HttpContextContract) {
    return view.render("auth/signup");
  }

  public async signUp({ request, response }: HttpContextContract) {
    try {
      const { signupSchema } = useAuthValidator();
      const userPayload = await request.validate({ schema: signupSchema });
      await User.create(userPayload);
      response.redirect("/auth/login");
    } catch (e) {
      console.error(e);
    }
  }
  public async loginPage({ view }: HttpContextContract) {
    return view.render("auth/login");
  }

  public async login({
    request,
    view,
    session,
    response,
    auth,
  }: HttpContextContract) {
    const { loginSchema } = useAuthValidator();
    const userPayload = await request.validate({ schema: loginSchema });
    const user = await User.findBy("email", userPayload.email);
    if (!user) {
      session.flash("invalid_email", "Email is invalid please try again");
      return response.redirect("back");
    }
    const isPasswordMatch = await Hash.verify(
      user.password,
      userPayload.password
    );

    if (!isPasswordMatch) {
      session.flash("invalid_password", "Password is Incorrect");
      return response.redirect("back");
    }

    await auth.use("web").login(user);

    response.redirect("/client/bikes");
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use("web").logout();
    return response.redirect("/auth/login");
  }
}
