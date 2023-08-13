import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bike from 'App/Models/Bike'
import { useBikeValidator } from 'App/validators/bikeValidator'

export default class BikesController {

    public async index({ view }: HttpContextContract) {
        try {
            const bikes = await Bike.all()
            return view.render("bikes/index", { bikes: bikes })
        } catch (e) {
            return view.render("errors/err", e);
        }

    }

    public async store({ view, request, response }: HttpContextContract) {

        try {
            const { bikeCreateSchema } = useBikeValidator()
            const bikePayload = await request.validate({ schema: bikeCreateSchema })
            await Bike.create(bikePayload)
            return response.redirect('/bikes')
        } catch (e) {
            console.log(e);

        }

    }

    public async create({ view }: HttpContextContract) {
        return view.render("bikes/new")
    }

    public async show() {

    }

    public async edit({ view, request }: HttpContextContract) {
        const id = request.params().id
        try {
            const bike = await Bike.find(+id)
            return view.render('bikes/edit', { bike: bike })
        } catch (e) {
            console.error(e);
        }

    }

    public async update({ request, response }: HttpContextContract) {
        const id = request.params().id
        try {
            const bike = await Bike.findOrFail(+id)
            const { bikeUpdateSchema } = useBikeValidator()
            const bikePayload = await request.validate({ schema: bikeUpdateSchema })

            await bike.merge(bikePayload).save()

            return response.redirect("/bikes");


        } catch (e) {

            console.error(e)

        }
    }

    public async destroy({ view ,request ,response }: HttpContextContract) {
        const id = request.params().id
        try{
            const bike = await Bike.findOrFail(+id)
            await bike.delete()
            return response.redirect().toRoute("/bikes")
        }catch(e){
            console.error(e)
        }
    }
}
