const passport = require('passport')
module.exports=(app)=>{
    const emp = require('../Controller/Employee.controller');
    const auth = passport.authenticate('jwt',{session:false})
    app.post('/api/confirm',auth,emp.ConfirmMember);
    app.post('/api/login',emp.Login);
    app.post('/api/change',auth,emp.change_profile);
    app.get('/api/employee',auth,emp.list_employee);
    app.get('/api/numberCheck/:PersNo',auth,emp.NumberCheckDocList);
    app.post('/api/confirmAdmin',emp.ConfirmAdmin);
};