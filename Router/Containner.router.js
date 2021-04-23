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
    app.post('/api/savewarnigndoc',auth,containnerDoc.onSaveWarning);
    app.post('/api/savepaymentdoc',auth,containnerDoc.onSavePayment);
    app.put('/api/updatepayment/:PaymentID',auth,containnerDoc.onUpdatePayment);
    app.delete('/api/deletepayment/:PaymentID',auth,containnerDoc.onDeletePayment);
    app.put('/api/updatewarning/:IdWarning',auth,containnerDoc.onUpdateWarning);
    app.delete('/api/deletewarning/:IdWarning',auth,containnerDoc.onDeleteWarning);
}