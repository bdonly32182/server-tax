module.exports= app => {
    let Puppet = require('../Controller/Puppetteer.controller')
    app.get('/test/puppet',Puppet.Puppetteer);
}