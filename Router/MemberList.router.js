const Passport = require('passport')
module.exports=(app)=>{
    const auth = Passport.authenticate("jwt",{session:false});
    let member = require('../Controller/MemberList.Controller');
    let uploadPicture = require('../Middleware/UploadPicture')
    app.post('/api/registmember',uploadPicture.single('file'),member.registMember)
    app.get('/api/emplist',auth,member.employee_list)
    app.get('/api/leaderlist',auth,member.leaderList)
    app.delete('/api/deletemember/:id',auth,member.deleteMember)
}