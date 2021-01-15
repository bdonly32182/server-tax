const passport = require('passport')
module.exports=(app)=>{
    const emp = require('../Controller/Employee.controller');
    const auth = passport.authenticate('jwt',{session:false})
    app.post('/api/confirm',emp.ConfirmMember);
    app.post('/api/login',emp.Login)
    app.post('/api/change',auth,emp.change_profile)
};