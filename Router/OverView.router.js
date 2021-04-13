const passport = require('passport')
module.exports = (app) => {
    const auth = passport.authenticate('jwt',{session:false});
    const controller = require('../Controller/OverView.controller');
    app.get('/api/statistic',auth,controller.Statistic);
    app.get('/api/statisticyear',auth,controller.YearStatistic);
}