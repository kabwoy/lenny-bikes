import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'
import Env from "@ioc:Adonis/Core/Env"
import fs from 'node:fs'
export default class Gettoken {
  public async handle({response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const consumerKey = Env.get('CONSUMER_KEY')
    const consumerSecret = Env.get('CONSUMER_SECRET')
    const basicKey = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")
    axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {
         headers:{
          Authorization:`Basic ${basicKey}`
         }
        }
      ).then((res)=>{
        response.cookie('token' ,res.data.access_token)
        fs.writeFileSync('token.txt' , res.data.access_token)
      }).catch((e)=>{
        console.error(e);  
      })

    await next()
  }
}
