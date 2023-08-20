import {schema} from '@ioc:Adonis/Core/Validator'
export function usePaymentValidator(){

    const paymentCreateSchema = schema.create(
        {
            rental_id:schema.number(),
            user_id:schema.number(),
            amount:schema.number(),
            reciept_number:schema.string(),
            transaction_date:schema.date()
        }
    )

    const paymentUpdateSchema = schema.create(
        {
            rental_id:schema.number.optional(),
            user_id:schema.number.optional(),
            amount:schema.number.optional(),
            reciept_number:schema.string.optional(),
            transaction_date:schema.date.optional()
        }
    )

    return {paymentCreateSchema , paymentUpdateSchema}
}