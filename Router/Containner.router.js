const passport = require('passport');
const uploadPdf = require('../Middleware/UploadPdf');
module.exports= app =>{
    const auth = passport.authenticate('jwt',{session:false});
    const containnerDoc = require('../Controller/ContainnerDoc.controller');
    app.post('/api/generatePdf',auth,uploadPdf.single('file'),containnerDoc.generatePdfCostDoc);
    app.post('/api/generateCheckDoc',auth,uploadPdf.single('file'),containnerDoc.generateCheckDoc);
    app.get('/api/costbooks/district',auth,containnerDoc.listCostBookOfDistrict);
    app.get('/api/costbooks/employee',auth,containnerDoc.listCostBookOfEmployee);
    app.get('/api/checkbooks/district',auth,containnerDoc.listCheckbookOfDistrict);
    app.get('/api/checkbooks/employee',auth,containnerDoc.listCheckBookOfEmployee);
    app.get('/api/checkbook/:checkbookID',auth,containnerDoc.FetchCheckBook);
    app.get('/api/costbook/:costbookID',auth,containnerDoc.FetchCostBook);
    app.get('/api/openpdf',auth,containnerDoc.OpenPDF);
}