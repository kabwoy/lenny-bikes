import '../css/app.css'

import Alpine from 'alpinejs'
 
window.Alpine = Alpine
 
Alpine.store('toastState', {
    isAdded: false,
    isDeleted: false,
    name:"Hello",

    toogleAdd(){

        this.isAdded = !this.isAdded

    }
})

Alpine.start()

