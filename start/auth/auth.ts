import Route from '@ioc:Adonis/Core/Route'

// ya ku display the authentication pages
Route.get("/auth/signup" , "AuthController.signUpPage")
Route.get("/auth/login" , "AuthController.loginPage")

// ya ku handle the authentication logic
Route.post("/signup" , "AuthController.signUp")
Route.post("/login" , "AuthController.login")

Route.post("/logout" , "AuthController.logout")