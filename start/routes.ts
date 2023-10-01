/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import './bikes/routes'
import './auth/auth'
import './clients/routes'
import './dashboard/routes'
import './rentals/routes'
import './payments/routes'
import './users/routes'
import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'
import puppeteer from 'puppeteer'
import fs from "fs"
import Payment from 'App/Models/Payment'
import Rental from 'App/Models/Rental'
import Bike from 'App/Models/Bike'
Route.get('/', async ({ view }) => {
  const bikes = await Database.from('bikes').paginate(1,3)
  return view.render('home' , {bikes:bikes})
})

Route.get('/payments/:id/reciept', async ({ view , response  , request}) => {
  const id = request.params().id
  const payment = await Payment.find(+id)
  const rental = await Rental.find(payment?.rentalId)
  const bike = await Bike.find(rental?.bikeId)
  //console.log(payment)
  const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
    <style>
    table {
      border-collapse: collapse;
      width: 100%;
    }
    
    tr {
      border-bottom: 1px solid #ddd;
    }
    </style>
    </head>
    <body>
    
    <h2 style="text-align:center" >Lenny Bikes Reciept</h2>
    
    <table>
      <tr>
        <th>Bike Name</th>
        <th>Amount</th>
        <th>Receipt Number</th>
      <th>Total</th>
      </tr>
      <tr>
        <td>Ksh ${bike?.name}</td>
        <td>Ksh ${payment?.amount}</td>
        <td>${payment?.reciept_number}</td>
        <td>Ksh ${payment?.amount}</td>
      </tr>
    </table>
    
    </body>
    </html>
    
    `)
    
    const pdfBuffer = await page.pdf();
    await browser.close();

    response.type('application/pdf');

    response.header('Content-Disposition', `attachment; filename=reciept-${Date.now()}.pdf`);

    response.send(pdfBuffer);
 
  // return view.render('home')
})
Route.get('/unauthorized', async ({ view }) => {
  return view.render('errors/unauthorized')
})

