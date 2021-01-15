const Passport = require('passport')
module.exports=(app)=>{
    const auth = Passport.authenticate("jwt",{session:false});
    const distict = require('../Controller/Distict.controller')
    app.get('/api/allDistrict',auth,distict.getAll)
    app.get('/api/readbyid/:id',auth,distict.getById)
    app.post('/api/createDistict',auth,distict.createDistict)
    app.put('/api/update/:id',auth,distict.editDistic)
    app.delete('/api/deleteDistrict/:id',auth,distict.deleteDisctrict)
    app.param('id',distict.findById)
}