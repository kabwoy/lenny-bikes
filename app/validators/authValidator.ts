import { schema, rules } from "@ioc:Adonis/Core/Validator";

export function useAuthValidator() {
  const signupSchema = schema.create({
    first_name: schema.string(),
    last_name: schema.string(),
    email: schema.string([rules.email()]),
    password: schema.string(),
    contact: schema.string(),
  });

  const userUpdateSchema = schema.create({
    first_name: schema.string.optional(),
    last_name: schema.string.optional(),
    email: schema.string.optional(([rules.email()])),
    password: schema.string.optional(),
    contact: schema.string.optional(),
  });

  const loginSchema = schema.create({
    email: schema.string([rules.email()]),
    password: schema.string(),
  });

  return { signupSchema, loginSchema , userUpdateSchema };
}
