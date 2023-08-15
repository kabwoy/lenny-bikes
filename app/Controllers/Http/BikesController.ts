import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Bike from "App/Models/Bike";
import { useBikeValidator } from "App/validators/bikeValidator";

export default class BikesController {
  public async index({ view, auth, bouncer, response }: HttpContextContract) {
    // await auth.use("web").authenticate()
    try {
      await bouncer.authorize("viewDashBoard");
    } catch (e) {
      return response.redirect("/unauthorized");
    }

    try {
      const bikes = await Bike.all();
      return view.render("bikes/index", { bikes: bikes });
    } catch (e) {
      return view.render("errors/err", e);
    }
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    try {
      await bouncer.authorize("viewDashBoard");
    } catch (e) {
      return response.redirect("/unauthorized");
    }
    try {
      const { bikeCreateSchema } = useBikeValidator();
      const bikePayload = await request.validate({ schema: bikeCreateSchema });
      await Bike.create(bikePayload);
      return response.redirect("/bikes");
    } catch (e) {
      console.log(e);
    }
  }

  public async create({ view, response, bouncer }: HttpContextContract) {
    try {
      await bouncer.authorize("viewDashBoard");
    } catch (e) {
      return response.redirect("/unauthorized");
    }
    return view.render("bikes/new");
  }

  public async show({ view, request }: HttpContextContract) {
    const id = request.params().id;
    const bike = await Bike.find(+id);
    return view.render("bikes/show", { bike: bike });
  }

  public async edit({ view, request, bouncer, response }: HttpContextContract) {
    const id = request.params().id;
    try {
      await bouncer.authorize("viewDashBoard");
    } catch (e) {
      return response.redirect("/unauthorized");
    }
    try {
      const bike = await Bike.find(+id);
      return view.render("bikes/edit", { bike: bike });
    } catch (e) {
      console.error(e);
    }
  }

  public async update({ request, response, bouncer }: HttpContextContract) {
    const id = request.params().id;
    try {
      await bouncer.authorize("viewDashBoard");
    } catch (e) {
      return response.redirect("/unauthorized");
    }
    try {
      const bike = await Bike.findOrFail(+id);
      const { bikeUpdateSchema } = useBikeValidator();
      const bikePayload = await request.validate({ schema: bikeUpdateSchema });

      await bike.merge(bikePayload).save();

      return response.redirect("/bikes");
    } catch (e) {
      console.error(e);
    }
  }

  public async destroy({ request, response, bouncer }: HttpContextContract) {
    try {
      await bouncer.authorize("viewDashBoard");
    } catch (e) {
      return response.redirect("/unauthorized");
    }
    const id = request.params().id;
    try {
      const bike = await Bike.findOrFail(+id);
      await bike.delete();
      return response.redirect().toRoute("/bikes");
    } catch (e) {
      console.error(e);
    }
  }
}
