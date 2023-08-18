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
import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'

Route.get('/', async ({ view }) => {
  const bikes = await Database.from('bikes').paginate(1,3)
  return view.render('home' , {bikes:bikes})
})

Route.get('/unauthorized', async ({ view }) => {
  return view.render('errors/unauthorized')
})

