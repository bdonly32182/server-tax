const passport = require('passport')
module.exports= app =>{
    let auth = passport.authenticate('jwt',{session:false})
    const land = require('../Controller/OwnerLand.controller')
    app.post('/api/ownerland',auth,land.relationLandAndCus)
    app.post('/api/delete/owner',auth,land.cancle_owner)

}