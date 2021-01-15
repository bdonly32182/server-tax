const passport = require('passport')
module.exports = app => {
    const auth = passport.authenticate('jwt',{session:false})
    const doc = require('../Controller/PDS3.controller');
    // app.get('/api/pds3/:id_tax',doc.fetch_pds3_byIdTax)
}