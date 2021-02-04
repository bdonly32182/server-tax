const passport = require('passport')
module.exports=app=>{
    const auth = passport.authenticate('jwt',{session:false});
    const cus = require('../Controller/Customer.controller');
    app.post('/api/createCus',auth,cus.createCustomer);
    app.get('/api/customer',auth,cus.fetchAll);
    app.route('/api/customer/:c_id')
        .get(auth,cus.fetchCustomer)
        .put(auth,cus.editCus)
        .delete(auth,cus.deleteCus);
    app.post('/api/search',auth,cus.SearchName);
    app.post('/api/pull_customer',auth,cus.pullCustomer);
}