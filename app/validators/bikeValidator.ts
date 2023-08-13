import {schema} from '@ioc:Adonis/Core/Validator'

export function useBikeValidator(){
    const bikeCreateSchema = schema.create({
        name:schema.string(),
        type:schema.string(),
        description:schema.string(),
        image_url:schema.string(),
        status:schema.enum(['BOOKED' , 'FREE'])
    })

    const bikeUpdateSchema = schema.create({
        name:schema.string.optional(),
        type:schema.string.optional(),
        description:schema.string.optional(),
        image_url:schema.string.optional(),
        status:schema.enum(['BOOKED' , 'FREE'])
    })

    return {bikeCreateSchema , bikeUpdateSchema}
}
