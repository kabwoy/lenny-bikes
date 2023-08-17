import {schema} from '@ioc:Adonis/Core/Validator'
export function useRentalValidator(){
    const rentalCreateSchema = schema.create({
        rental_start:schema.date(),
        rental_end:schema.date(),
        status:schema.string.optional()
    })

    const rentalUpdateSchema = schema.create({
        rental_start:schema.date.optional(),
        rental_end:schema.date.optional(),
        
    })

    const rentalAdminCreateSchema = schema.create({
        rental_start:schema.date(),
        user_id:schema.number(),
        bike_id:schema.number(),
        rental_end:schema.date(),
        payment_status:schema.string.optional()
    })

    const rentalAdminUpdateSchema = schema.create({
        rental_start:schema.date.optional(),
        user_id:schema.number.optional(),
        bike_id:schema.number.optional(),
        rental_end:schema.date.optional(),
        payment_status:schema.string.optional()
    })

    return {rentalCreateSchema ,rentalUpdateSchema , rentalAdminCreateSchema , rentalAdminUpdateSchema}
}