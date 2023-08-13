import Route from '@ioc:Adonis/Core/Route'

Route.get("/auth/signup" , "AuthController.signUpPage")
Route.get("/auth/login" , "AuthController.loginPage")