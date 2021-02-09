const passport = require('passport');

module.exports=(app)=>{
    const auth = passport.authenticate('jwt',{session:false});
    const type = require('../Controller/Type.controller');

    app.route('/api/farm/:f_id')
        .put(auth,type.edit_farm)
        .delete(auth,type.delete_farm)
    app.route('/api/live/:l_id')
        .put(auth,type.edit_live)
        .delete(auth,type.delete_live)
    app.route('/api/empty/:e_id')
        .put(auth,type.edit_empty)
        .delete(auth,type.delete_empty)
    app.route('/api/other/:o_id')
        .put(auth,type.edit_other)
        .delete(auth,type.delete_other)
}