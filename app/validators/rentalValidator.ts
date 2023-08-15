import {schema} from '@ioc:Adonis/Core/Validator'
export function useRentalValidator(){
    const rentalCreateSchema = schema.create({
        rental_start:schema.date(),
        rental_end:schema.date()
    })

    const rentalUpdateSchema = schema.create({
        rental_start:schema.date.optional(),
        rental_end:schema.date.optional(),
        
    })

    return {rentalCreateSchema ,rentalUpdateSchema}
}