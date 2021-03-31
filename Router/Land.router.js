const Passport = require('passport')
module.exports=(app)=>{
    const auth = Passport.authenticate("jwt",{session:false})
    const land = require('../Controller/Land.controller')
    app.post('/api/codeland',auth,land.createLand);
    app.put('/api/editLand/:id',auth,land.editLand);
    app.delete('/api/delete/land/:id',auth,land.deleteLand);
    app.get('/api/lands',auth,land.getAllLand);
    app.get('/api/land/:L_id',auth,land.fetch_land);
    app.get('/search/:parcel',auth,land.search_parcel);
    app.get('/api/filter/land',auth,land.search_filter_land);
    app.param('id',land.LandById);
}