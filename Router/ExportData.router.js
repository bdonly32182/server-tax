const passport = require('passport');
module.exports = app => {
    const auth = passport.authenticate('jwt',{session:false});
    const exportData = require('../Controller/ExportData.controller');
    app.get('/api/download/land',auth,exportData.downloadLand);
    app.get('/api/download/rateland',auth,exportData.downloadRateLand);
    app.get('/api/download/district',auth,exportData.downloadDistrict);
    app.get('/api/download/employee',auth,exportData.downloadEmployee);
    app.get('/api/download/usefulland',auth,exportData.downloadUsefulLand);
    app.get('/api/download/building',auth,exportData.downloadBuilding);
    app.get('/api/download/ratebuilding',auth,exportData.downloadRateBuilding);
    app.get('/api/download/other',auth,exportData.downloadOtherType);
    app.get('/api/download/live',auth,exportData.downloadLiveType);
    app.get('/api/download/empty',auth,exportData.downloadEmptyType);
    app.get('/api/download/farm',auth,exportData.downloadFarmType);
    app.get('/api/download/taxgroup',auth,exportData.downloadTaxGroup);
    app.get('/api/download/customerhastax',auth,exportData.downloadCustomerHasTax);
    app.get('/api/download/customer',auth,exportData.downloadCustomer);
    app.get('/api/download/builduseful',auth,exportData.downloadBuildOnUseful);
    app.get('/api/download/condo',auth,exportData.downloadCondo);
    app.get('/api/download/room',auth,exportData.downloadRoom);
    app.get('/api/download/usefulroom',auth,exportData.downloadUsefulRoom);

}