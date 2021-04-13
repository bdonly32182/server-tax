const passport = require('passport')
module.exports=(app)=>{
    const auth = passport.authenticate('jwt',{session:false})
    const condo = require('../Controller/Condo.controller')
    app.post('/api/create/cond',auth,condo.create_condo);
    app.get('/api/condos',auth,condo.fetchs_all_condo);
    app.get('/api/search/condo',auth,condo.SearchCondo);
    app.get('/api/selectfloor/:condoId',auth,condo.SelectFloor)
    app.route('/api/condo/:con_id')
        .get(auth,condo.fetch_condo)
        .put(auth,condo.edit_condo)
        .delete(auth,condo.delete_condo)
}