const passport = require('passport')
module.exports =(app)=>{
    let auth = passport.authenticate('jwt',{session:false})
    let nextland = require('../Controller/NextToLand.controller')
    app.get('/api/nexttoland/:tax_id',auth,nextland.ListNextLand)
    app.post('/api/nextland',auth,nextland.save_next_land)
    app.get('/api/nextland/:nid',auth,nextland.fetchs_next_land)
    app.post('/api/remove/nextland',auth,nextland.remove_next_land)
}