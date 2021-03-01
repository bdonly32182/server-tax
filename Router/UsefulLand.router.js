const { use } = require('passport');
const passport = require('passport')
module.exports = app =>{
    const auth = passport.authenticate("jwt",{session:false})
    const useful = require('../Controller/UsefulLand.controller');
    app.post('/api/create/useful',auth,useful.createUsefulland);
    app.get('/api/useful/:idLand',auth,useful.UsefulInLand);
    app.get('/api/read/usefuls',auth,useful.fecthUseful);
    app.put('/api/edit/useful/:u_id',auth,useful.updateUseful);
    app.delete('/api/delete/useful/:u_id',auth,useful.deleteUseful);
    app.get('/api/search',auth,useful.SearchName);
    app.get('/nexto/:taxID',auth,useful.UsefulSameTax);
    app.post('/api/selectNexto',auth,useful.selectNexto);
    app.get('/test/useful/:id_useful',useful.testUseful);
    app.delete('/api/deleteNexto/:id',auth,useful.onDeleteNexto)
}