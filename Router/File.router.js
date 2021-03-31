const Passport = require('passport');
module.exports = app => {
    const auth = Passport.authenticate('jwt',{session:false})
    const upload = require('../Middleware/Upload')
    const fileController = require('../Controller/Upload.Controller');
    app.post('/api/excel/upload/land',auth,upload.single('file'),fileController.uploadLand);
    app.post('/api/excel/district',auth,upload.single('file'),fileController.uploadDistrict);
    app.post('/api/excel/upload/landpricezero',auth,upload.single('file'),fileController.uploadLandPriceZero);
    app.post('/api/excel/upload/relationland',auth,upload.single('file'),fileController.uploadRelationLand);
    app.post('/api/excel/upload/customer',auth,upload.single('file'),fileController.uploadCustomers);
    app.post('/api/excel/upload/room',auth,upload.single('file'),fileController.uploadRoom);
    app.post('/api/excel/upload/condo',auth,upload.single('file'),fileController.uploadCondo);
    app.post('/api/excel/upload/rate',auth,upload.single('file'),fileController.uploadRateBuilding);  
}