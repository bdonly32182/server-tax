const passport = require('passport')
module.exports=app=>{
    const auth = passport.authenticate('jwt',{session:false});
    const tax = require('../Controller/Tax.controller');

    app.post('/api/generate',auth,tax.generate_tax);
    app.post('/api/build/tax',auth,tax.build_generate_tax);
    app.get('/api/tax/:tax',auth,tax.fetch_tax_id);
    app.get('/api/taxs',auth,tax.list_tax_id);
    app.get('/api/pds3/:id_tax',auth,tax.fetch_pds3_byIdTax);
    app.get('/api/pds7/:id_tax',auth,tax.fetch_pds7_byIdTax);
    app.get('/test/pds7/:id_tax',tax.test);
    app.post('/api/exceptEmegency',auth,tax.exceptEmegency)

}