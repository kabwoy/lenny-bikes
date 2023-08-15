import Route from '@ioc:Adonis/Core/Route'
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

Route.get("/admin/dashboard" , ({view}:HttpContextContract)=>{
    return view.render("dashboard/splash")
})

Route.get("/admin/bikes" , ({view}:HttpContextContract)=>{
    return view.render("bikes/index")
})