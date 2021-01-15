const passport = require('passport')
module.exports = app =>{
    const auth = passport.authenticate("jwt",{session:false})
    const useful = require('../Controller/UsefulLand.controller');
    app.post('/api/create/useful',auth,useful.createUsefulland);
    app.get('/api/useful/:idLand',auth,useful.AllUseful);
    app.get('/api/read/usefuls/:u_id',auth,useful.fecthUseful);
    app.put('/api/edit/useful/:u_id',auth,useful.updateUseful);
    app.delete('/api/delete/useful/:u_id',auth,useful.deleteUseful);
    app.param('u_id',useful.UsefulById);
}