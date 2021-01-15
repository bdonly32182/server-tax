const passport = require('passport')
module.exports = app => {
    const auth = passport.authenticate('jwt',{session:false})

}