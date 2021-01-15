const passport = require('passport')
module.exports=(app)=>{
    const auth = passport.authenticate('jwt',{session:false})
    const ownbuild = require('../Controller/OwnerBuilding.controller')
    app.post('/api/selectowner',auth,ownbuild.create_owner_build)
    app.delete('/api/cancleowner/:id',auth,ownbuild.cancel_owner_build)
}