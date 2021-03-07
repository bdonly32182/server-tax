const passport = require('passport')
module.exports = app => {
    const auth = passport.authenticate("jwt",{session:false})
    const build = require('../Controller/Build.controller');
    app.route('/api/build/:b_id')
        .put(auth,build.updateBuild)
        .delete(auth,build.deleteBuild);
    app.post('/api/create/build',auth,build.createBuild);
    app.post('/api/acrossland',auth,build.build_across_land);
    app.get('/api/buildings',auth,build.fetchs_building);
    app.get('/api/building/:bid',auth,build.fetch_building);
    app.get('/api/rate/build',auth,build.rate_building);
    app.param('b_id',build.BuildById);
}