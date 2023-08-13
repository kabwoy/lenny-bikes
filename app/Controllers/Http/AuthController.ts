import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {

     public async signUpPage({view}:HttpContextContract){
        return view.render("auth/signup")
     } 

     public async signUp({request}:HttpContextContract){
        
     }
     public async loginPage({view}:HttpContextContract){
        return view.render("auth/login")
        
     }  

     public async login({request}:HttpContextContract){
        
     }

}
